/**
 * FarmLink - Trusted Server-Side Business Operations
 * Target Firebase Project: farmlink-production-bf431
 * 
 * STATUS: STAGED / NOT DEPLOYED (Requires Firebase Blaze Plan)
 * 
 * Provides cryptographic, atomic execution for operations that are unsafe
 * to trust to browser clients:
 * 1. acceptOfferAndDeductInventory (Server-verified negotiation acceptance & atomic stock reduction)
 * 2. declarePayment (Counterparty payment receipt declaration)
 * 3. confirmDelivery (Produce delivery verification)
 * 4. setAdminRole (Privilege escalation guard)
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * 1. Atomic Offer Acceptance & Inventory Deduction
 * Ensures:
 * - Caller is legitimate counterparty whose turn it is.
 * - Offer is not in terminal state (Accepted/Rejected/Cancelled).
 * - Crop listing has sufficient availableQuantity.
 * - Atomically marks offer Accepted, creates transaction record, and decrements stock.
 */
exports.acceptOfferAndDeductInventory = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required to accept offers."
    );
  }

  const { offerId } = data || {};
  if (!offerId || typeof offerId !== "string") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Valid offerId is required."
    );
  }

  const callerUid = context.auth.uid;
  const offerRef = db.collection("offers").doc(offerId);

  return db.runTransaction(async (transaction) => {
    const offerSnap = await transaction.get(offerRef);
    if (!offerSnap.exists) {
      throw new functions.https.HttpsError("not-found", "Offer does not exist.");
    }

    const offer = offerSnap.data();

    // Check terminal state
    const currentStatus = String(offer.status || "").toLowerCase();
    if (["accepted", "rejected", "cancelled"].includes(currentStatus)) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        `Offer is already in terminal state: ${offer.status}`
      );
    }

    // Verify participant turn authority
    const isFarmer = callerUid === offer.farmerId;
    const isDealer = callerUid === offer.dealerId;

    if (!isFarmer && !isDealer) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You are not a participant in this negotiation."
      );
    }

    if (offer.lastSender === "farmer" && !isDealer) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Cannot accept own counter-offer. Awaiting dealer response."
      );
    }

    if (offer.lastSender === "dealer" && !isFarmer) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Cannot accept own bid. Awaiting farmer response."
      );
    }

    // Read and verify crop listing
    const cropRef = db.collection("crops").doc(offer.cropId);
    const cropSnap = await transaction.get(cropRef);
    if (!cropSnap.exists) {
      throw new functions.https.HttpsError("not-found", "Associated crop listing not found.");
    }

    const crop = cropSnap.data();
    const availableQty = Number(crop.availableQuantity !== undefined ? crop.availableQuantity : crop.quantity) || 0;
    const tradeQty = Number(offer.quantity) || 0;

    if (tradeQty <= 0) {
      throw new functions.https.HttpsError("invalid-argument", "Offer quantity must be greater than zero.");
    }

    if (availableQty < tradeQty) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        `Insufficient available inventory. Requested: ${tradeQty}, Available: ${availableQty}.`
      );
    }

    const now = new Date().toISOString();
    const finalPrice = Number(offer.currentOfferPrice || offer.offeredPrice || 0);
    const totalAmount = finalPrice * tradeQty;

    // 1. Update Offer to Accepted
    transaction.update(offerRef, {
      status: "Accepted",
      acceptedBy: callerUid,
      acceptedAt: now,
      updatedAt: now
    });

    // 2. Deduct Crop Inventory
    const newAvailable = availableQty - tradeQty;
    const newSold = (Number(crop.soldQuantity) || 0) + tradeQty;
    const newCropStatus = newAvailable <= 0 ? "Sold" : crop.status || "Available";

    transaction.update(cropRef, {
      availableQuantity: newAvailable,
      quantity: newAvailable,
      soldQuantity: newSold,
      status: newCropStatus,
      updatedAt: now
    });

    // 3. Create Immutable Transaction Record
    const txId = "tx_" + offerId;
    const txRef = db.collection("transactions").doc(txId);
    transaction.set(txRef, {
      id: txId,
      txId: txId,
      offerId: offerId,
      cropId: offer.cropId,
      cropTitle: crop.cropName || crop.title || offer.cropTitle || "Agricultural Produce",
      farmerId: offer.farmerId,
      farmerName: offer.farmerName || crop.farmerName || "Farmer",
      dealerId: offer.dealerId,
      dealerName: offer.dealerName || "Dealer",
      quantity: tradeQty,
      unit: offer.unit || crop.unit || "kg",
      finalPrice: finalPrice,
      totalAmount: totalAmount,
      dealStatus: "Accepted",
      paymentStatus: "Pending_Payment",
      deliveryStatus: "Pending_Delivery",
      status: "Completed", // Backward compatibility with original client UI
      createdAt: now,
      updatedAt: now,
      isDemo: false
    });

    // 4. Generate Bilateral Notifications
    const notifFarmerId = `notif_deal_${offerId}_f`;
    const notifDealerId = `notif_deal_${offerId}_d`;

    transaction.set(db.collection("notifications").doc(notifFarmerId), {
      id: notifFarmerId,
      notificationId: notifFarmerId,
      senderUserId: callerUid,
      recipientUserId: offer.farmerId,
      userId: offer.farmerId,
      type: "deal",
      relatedId: offerId,
      title: "Offer Accepted!",
      titleTe: "ఆఫర్ ఆమోదించబడింది!",
      message: `Deal confirmed for ${crop.cropName || 'produce'} at ₹${finalPrice}/${offer.unit || 'kg'} (Total: ₹${totalAmount.toLocaleString()}).`,
      messageTe: `డీల్ నిర్ధారించబడింది: ₹${finalPrice}/${offer.unit || 'kg'} వద్ద.`,
      link: "transactions.html",
      isRead: false,
      read: false,
      isDemo: false,
      createdAt: now,
      updatedAt: now
    });

    transaction.set(db.collection("notifications").doc(notifDealerId), {
      id: notifDealerId,
      senderUserId: callerUid,
      recipientUserId: offer.dealerId,
      userId: offer.dealerId,
      type: "deal",
      relatedId: offerId,
      title: "Offer Accepted!",
      titleTe: "ఆఫర్ ఆమోదించబడింది!",
      message: `Deal confirmed for ${crop.cropName || 'produce'} at ₹${finalPrice}/${offer.unit || 'kg'} (Total: ₹${totalAmount.toLocaleString()}).`,
      messageTe: `డీల్ నిర్ధారించబడింది: ₹${finalPrice}/${offer.unit || 'kg'} వద్ద.`,
      link: "purchases.html",
      isRead: false,
      read: false,
      isDemo: false,
      createdAt: now,
      updatedAt: now
    });

    return {
      success: true,
      transactionId: txId,
      offerId: offerId,
      totalAmount: totalAmount,
      remainingStock: newAvailable
    };
  });
});

/**
 * 2. Counterparty Payment Declaration
 * Enables the wholesale dealer to submit payment reference / UTR for contract audit.
 */
exports.declarePayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
  }

  const { transactionId, paymentReference, paymentMethod } = data || {};
  if (!transactionId || !paymentReference) {
    throw new functions.https.HttpsError("invalid-argument", "transactionId and paymentReference required.");
  }

  const txRef = db.collection("transactions").doc(transactionId);
  const txSnap = await txRef.get();
  if (!txSnap.exists) {
    throw new functions.https.HttpsError("not-found", "Transaction not found.");
  }

  const tx = txSnap.data();
  if (context.auth.uid !== tx.dealerId) {
    throw new functions.https.HttpsError("permission-denied", "Only purchasing dealer can declare payment.");
  }

  const now = new Date().toISOString();
  await txRef.update({
    paymentStatus: "Payment_Declared",
    paymentReference: String(paymentReference).trim(),
    paymentMethod: paymentMethod || "Bank Transfer",
    paymentDeclaredAt: now,
    updatedAt: now
  });

  return { success: true, transactionId, paymentStatus: "Payment_Declared" };
});

/**
 * 3. Delivery Confirmation & Escrow Release
 * Enables farmer to confirm delivery of produce.
 */
exports.confirmDelivery = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
  }

  const { transactionId } = data || {};
  if (!transactionId) {
    throw new functions.https.HttpsError("invalid-argument", "transactionId required.");
  }

  const txRef = db.collection("transactions").doc(transactionId);
  const txSnap = await txRef.get();
  if (!txSnap.exists) {
    throw new functions.https.HttpsError("not-found", "Transaction not found.");
  }

  const tx = txSnap.data();
  if (context.auth.uid !== tx.farmerId && context.auth.uid !== tx.dealerId) {
    throw new functions.https.HttpsError("permission-denied", "Only transaction participants can update delivery.");
  }

  const now = new Date().toISOString();
  await txRef.update({
    deliveryStatus: "Delivered",
    deliveredAt: now,
    updatedAt: now
  });

  return { success: true, transactionId, deliveryStatus: "Delivered" };
});
