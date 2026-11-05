/**
 * FarmLink - Offer & Negotiation Engine
 * Facilitates multi-round transparent negotiations between farmers and dealers.
 */

class OfferService {
  constructor() {
    this._pendingOperations = new Set();
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[m]);
  }

  async submitNewOffer(cropId, offerPrice, requestedQuantity, note) {
    const crop = window.Storage.getCropById(cropId);
    const currentUser = window.Auth.getCurrentUser();

    if (!crop) return { success: false, message: "Crop listing not found." };
    if (!currentUser) return { success: false, message: "Please log in to submit an offer." };

    if (currentUser.role !== "dealer") {
      return { success: false, message: "Only registered wholesale dealers can submit procurement offers." };
    }

    if (currentUser.id === crop.farmerId || (currentUser.uid && (currentUser.uid === crop.farmerId || currentUser.uid === crop.farmerUid))) {
      return { success: false, message: "You cannot submit an offer on your own crop listing." };
    }

    const cropStatusLower = String(crop.status || "").toLowerCase().trim();
    if (cropStatusLower === "sold" || cropStatusLower === "removed" || cropStatusLower === "inactive") {
      return { success: false, message: "This crop listing is no longer available for offers." };
    }

    const price = Number(offerPrice);
    const availableQty = Number(crop.quantity || 0);
    const reqQty = (requestedQuantity !== undefined && requestedQuantity !== null && requestedQuantity !== "") 
      ? Number(requestedQuantity) 
      : availableQty;

    if (isNaN(price) || price <= 0) {
      return { success: false, message: "Please enter a valid positive offer price." };
    }
    if (isNaN(reqQty) || reqQty <= 0) {
      return { success: false, message: "Requested quantity must be greater than 0." };
    }
    if (reqQty > availableQty) {
      return { success: false, message: `Requested quantity (${reqQty}) cannot exceed available crop quantity (${availableQty} ${crop.unit || 'kg'}).` };
    }

    const totalAmount = price * reqQty;
    const cropTitle = crop.cropName || crop.title || "Agricultural Produce";
    const benchmark = window.Market ? window.Market.getBenchmarkForCrop(cropTitle) : null;

    try {
      const newOffer = await window.Storage.addOffer({
        cropId: crop.id || crop.cropId,
        cropName: cropTitle,
        cropTitle: cropTitle,
        cropImage: crop.image || "",
        farmerId: crop.farmerId || crop.farmerUid,
        farmerUid: crop.farmerUid || crop.farmerId,
        farmerName: crop.farmerName || "Farmer",
        farmerPhone: crop.farmerPhone || "",
        dealerId: currentUser.uid || currentUser.id,
        dealerUid: currentUser.uid || currentUser.id,
        dealerName: currentUser.name || "Dealer",
        dealerBusiness: currentUser.businessName || "Wholesale Procurement Dealer",
        dealerPhone: currentUser.phone || "",
        offeredPrice: price,
        dealerOfferPrice: price,
        currentOfferPrice: price,
        farmerCounterPrice: null,
        requestedQuantity: reqQty,
        quantity: reqQty,
        unit: crop.unit || "kg",
        totalAmount: totalAmount,
        farmerExpectedPrice: Number(crop.expectedPrice),
        marketPrice: benchmark ? benchmark.marketPrice : null,
        fairMin: benchmark ? benchmark.minFairPrice : null,
        fairMax: benchmark ? benchmark.maxFairPrice : null,
        message: note ? note.trim() : "Initial procurement offer submitted.",
        status: "Pending",
        lastSender: "dealer",
        history: [
          {
            sender: "dealer",
            price: price,
            quantity: reqQty,
            note: note ? note.trim() : "Initial procurement offer submitted.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      });

      // Update crop status to Under Negotiation locally if not sold
      if (crop.status !== "Under Negotiation" && crop.status !== "Sold") {
        window.Storage.updateCrop(crop.id, { status: "Under Negotiation" });
      }

      // Generate Notification for Farmer
      if (window.Storage.addNotification) {
        const farmerUid = crop.farmerId || crop.farmerUid;
        const offerDocId = newOffer.id || newOffer.offerId;
        window.Storage.addNotification({
          id: `notif_offer_${offerDocId}_${farmerUid}`,
          notificationId: `notif_offer_${offerDocId}_${farmerUid}`,
          recipientUserId: farmerUid,
          userId: farmerUid,
          senderUserId: currentUser.uid || currentUser.id,
          role: "farmer",
          type: "offer",
          relatedId: offerDocId,
          title: "New Bid Received",
          titleTe: "కొత్త ఆఫర్ వచ్చింది",
          message: `${currentUser.name} offered ₹${price}/${crop.unit || 'kg'} for ${reqQty} ${crop.unit || 'kg'} of ${cropTitle}. Total: ₹${totalAmount.toLocaleString()}.`,
          messageTe: `${currentUser.name} గారు మీ ${cropTitle} కోసం ₹${price}/${crop.unit || 'kg'} ఆఫర్ చేశారు. మొత్తం: ₹${totalAmount.toLocaleString()}.`,
          link: "offers.html"
        });
      }

      // Add activity
      if (window.Storage.addActivity) {
        window.Storage.addActivity({
          targetRole: "farmer",
          type: "offer",
          icon: "tag",
          title: "New Dealer Bid",
          titleTe: "కొత్త వ్యాపారి ఆఫర్",
          desc: `${currentUser.name} placed a bid of ₹${price}/${crop.unit || 'kg'} on ${cropTitle}.`,
          descTe: `${currentUser.name} గారు ${cropTitle} పై ₹${price}/${crop.unit || 'kg'} బిడ్ సమర్పించారు.`
        });
        window.Storage.addActivity({
          targetRole: "dealer",
          type: "bid",
          icon: "send",
          title: "Offer Placed",
          titleTe: "ఆఫర్ సమర్పించబడింది",
          desc: `Submitted bid of ₹${price}/${crop.unit || 'kg'} for ${cropTitle} to ${crop.farmerName}.`,
          descTe: `${crop.farmerName} గారికి ${cropTitle} కోసం ₹${price}/${crop.unit || 'kg'} ఆఫర్ పంపారు.`
        });
      }

      return { success: true, offer: newOffer };
    } catch (err) {
      console.error("[FarmLink Offers] Error submitting offer:", err);
      return { success: false, message: err.message || "Failed to submit offer to cloud database." };
    }
  }

  async counterOffer(offerId, counterPrice, note, senderRole = "farmer") {
    if (this._pendingOperations && this._pendingOperations.has(offerId)) {
      return { success: false, message: "Negotiation update in progress. Please wait..." };
    }
    if (this._pendingOperations) this._pendingOperations.add(offerId);

    try {
      const offer = window.Storage.getOfferById(offerId);
    if (!offer) return { success: false, message: "Offer not found." };

    const price = Number(counterPrice);
    if (isNaN(price) || price <= 0) {
      return { success: false, message: "Please enter a valid positive counter price." };
    }

    const currentUser = window.Auth && typeof window.Auth.getCurrentUser === "function" ? window.Auth.getCurrentUser() : null;
    const isRealFirebase = window.Storage.isRealFirebaseUser(currentUser) && !offer.isDemo;

    if (isRealFirebase) {
      try {
        const updated = await window.Storage.counterOfferInFirestore(offerId, price, note, senderRole);

        // Counter notification for counterpart in real Firebase mode
        if (window.Storage.addNotification) {
          const roundNumber = (updated && updated.history) ? updated.history.length : ((offer.history ? offer.history.length : 0) + 1);
          if (senderRole === "farmer") {
            const recipientUid = updated.dealerId || updated.dealerUid || offer.dealerId || offer.dealerUid;
            window.Storage.addNotification({
              id: `notif_counter_${offerId}_${roundNumber}_${recipientUid}`,
              notificationId: `notif_counter_${offerId}_${roundNumber}_${recipientUid}`,
              recipientUserId: recipientUid,
              userId: recipientUid,
              senderUserId: currentUser.uid || currentUser.id,
              role: "dealer",
              type: "counter",
              relatedId: offerId,
              title: "Counter-Offer Received",
              titleTe: "కౌంటర్ ఆఫర్ వచ్చింది",
              message: `${offer.farmerName || 'Farmer'} countered with ₹${price}/${offer.unit || 'kg'} for ${offer.cropTitle || offer.cropName}.`,
              messageTe: `${offer.farmerName || 'Farmer'} గారు ${offer.cropTitle || offer.cropName} కోసం ₹${price}/${offer.unit || 'kg'} కౌంటర్ ఇచ్చారు.`,
              link: "offers.html"
            });
          } else {
            const recipientUid = updated.farmerId || updated.farmerUid || offer.farmerId || offer.farmerUid;
            window.Storage.addNotification({
              id: `notif_counter_${offerId}_${roundNumber}_${recipientUid}`,
              notificationId: `notif_counter_${offerId}_${roundNumber}_${recipientUid}`,
              recipientUserId: recipientUid,
              userId: recipientUid,
              senderUserId: currentUser.uid || currentUser.id,
              role: "farmer",
              type: "counter",
              relatedId: offerId,
              title: "Revised Offer from Dealer",
              titleTe: "వ్యాపారి నుండి సవరించిన ఆఫర్",
              message: `${offer.dealerName || 'Dealer'} revised their offer to ₹${price}/${offer.unit || 'kg'} for ${offer.cropTitle || offer.cropName}.`,
              messageTe: `${offer.dealerName || 'Dealer'} గారు ${offer.cropTitle || offer.cropName} కోసం ₹${price}/${offer.unit || 'kg'} సవరించిన ఆఫర్ ఇచ్చారు.`,
              link: "offers.html"
            });
          }
        }

        return { success: true, offer: updated };
      } catch (err) {
        console.error("[FarmLink Offers] Error countering in Firestore:", err);
        return { success: false, message: err.message || "Failed to submit counter offer." };
      }
    }

    // Demo or local workflow
    const history = offer.history || [];
    const newStep = {
      sender: senderRole,
      action: "counter",
      price: price,
      quantity: offer.quantity,
      note: note ? note.trim() : (senderRole === "farmer" ? "Farmer counter-offered." : "Dealer adjusted offer."),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    history.push(newStep);

    const totalAmount = price * offer.quantity;
    const updatePayload = {
      currentOfferPrice: price,
      totalAmount: totalAmount,
      status: "Countered",
      lastSender: senderRole,
      history: history
    };

    if (senderRole === "farmer") {
      updatePayload.farmerCounterPrice = price;
    }

    const updated = window.Storage.updateOffer(offerId, updatePayload);

    // Notifications for local demo
    if (window.Storage.addNotification) {
      const roundNumber = history.length;
      if (senderRole === "farmer") {
        window.Storage.addNotification({
          id: `notif_counter_${offerId}_${roundNumber}_${offer.dealerId}`,
          notificationId: `notif_counter_${offerId}_${roundNumber}_${offer.dealerId}`,
          recipientUserId: offer.dealerId,
          userId: offer.dealerId,
          senderUserId: offer.farmerId,
          role: "dealer",
          type: "counter",
          relatedId: offerId,
          title: "Counter-Offer Received",
          titleTe: "కౌంటర్ ఆఫర్ వచ్చింది",
          message: `${offer.farmerName} countered with ₹${price}/${offer.unit} for ${offer.cropTitle || offer.cropName}.`,
          messageTe: `${offer.farmerName} గారు ${offer.cropTitle || offer.cropName} కోసం ₹${price}/${offer.unit} కౌంటర్ ఇచ్చారు.`,
          link: "offers.html",
          isDemo: true
        });
      } else {
        window.Storage.addNotification({
          id: `notif_counter_${offerId}_${roundNumber}_${offer.farmerId}`,
          notificationId: `notif_counter_${offerId}_${roundNumber}_${offer.farmerId}`,
          recipientUserId: offer.farmerId,
          userId: offer.farmerId,
          senderUserId: offer.dealerId,
          role: "farmer",
          type: "counter",
          title: "Revised Offer from Dealer",
          titleTe: "వ్యాపారి నుండి సవరించిన ఆఫర్",
          message: `${offer.dealerName} revised their offer to ₹${price}/${offer.unit} for ${offer.cropTitle || offer.cropName}.`,
          messageTe: `${offer.dealerName} గారు ${offer.cropTitle || offer.cropName} కోసం ₹${price}/${offer.unit} సవరించిన ఆఫర్ ఇచ్చారు.`,
          link: "offers.html",
          isDemo: true
        });
      }
    }

    return { success: true, offer: updated };
    } finally {
      if (this._pendingOperations) this._pendingOperations.delete(offerId);
    }
  }

  async acceptOffer(offerId, role = "farmer") {
    if (this._pendingOperations && this._pendingOperations.has(offerId)) {
      return { success: false, message: "Deal acceptance in progress. Please wait..." };
    }
    if (this._pendingOperations) this._pendingOperations.add(offerId);

    try {
      let offer = window.Storage ? window.Storage.getOfferById(offerId) : null;
      if (!offer && window.Storage && typeof window.Storage.fetchOfferByIdFromFirestore === "function") {
        try {
          offer = await window.Storage.fetchOfferByIdFromFirestore(offerId);
        } catch (e) {}
      }

      const currentUser = window.Auth && typeof window.Auth.getCurrentUser === "function" ? window.Auth.getCurrentUser() : null;
      const isRealUser = currentUser && (
        (window.Storage && typeof window.Storage.isRealFirebaseUser === "function" && window.Storage.isRealFirebaseUser(currentUser)) ||
        (currentUser.isFirebaseAuth && currentUser.uid && !currentUser.isDemo)
      );
      const isRealOffer = offer ? (!offer.isDemo && offer.userCreated !== false) : true;
      const isRealFirebase = !!(isRealUser && isRealOffer);

      if (isRealFirebase) {
        try {
          const res = await window.Storage.acceptOfferInFirestore(offerId, role);
          const updatedOffer = (res && res.offer) ? res.offer : res;
          const newTx = (res && res.transaction) ? res.transaction : null;

          const finalPrice = Number(updatedOffer.currentOfferPrice || updatedOffer.offeredPrice || 0);
          const qty = Number(updatedOffer.quantity || updatedOffer.requestedQuantity || 1);
          const totalAmount = finalPrice * qty;

          // Preserve cloud crop without mutation during offer accept
          const crop = window.Storage.getCropById(updatedOffer.cropId);
          if (crop && crop.isDemo) {
            try {
              window.Storage.updateCrop(crop.id, { status: "Sold" });
            } catch (e) {}
          }

        // Deal-closed notifications for Phase 3D
        if (window.Storage.addNotification) {
          const isFarmerAccepting = (role === "farmer" || (currentUser && currentUser.uid === (updatedOffer.farmerId || updatedOffer.farmerUid)));
          const farmerUid = updatedOffer.farmerId || updatedOffer.farmerUid;
          const dealerUid = updatedOffer.dealerId || updatedOffer.dealerUid;

          if (isFarmerAccepting) {
            // Counterpart is dealer -> real Firestore notification
            window.Storage.addNotification({
              id: `notif_deal_${updatedOffer.id}_${dealerUid}`,
              notificationId: `notif_deal_${updatedOffer.id}_${dealerUid}`,
              recipientUserId: dealerUid,
              userId: dealerUid,
              senderUserId: currentUser.uid || currentUser.id,
              role: "dealer",
              type: "deal",
              relatedId: updatedOffer.id,
              title: "Procurement Contract Finalized!",
              titleTe: "కొనుగోలు ఒప్పందం ఖరారైంది!",
              message: `${updatedOffer.farmerName || 'Farmer'} agreed to ₹${finalPrice}/${updatedOffer.unit || 'kg'} for ${updatedOffer.cropTitle || updatedOffer.cropName}. Total: ₹${totalAmount.toLocaleString()}.`,
              messageTe: `${updatedOffer.farmerName || 'Farmer'} గారితో ${updatedOffer.cropTitle || updatedOffer.cropName} ఒప్పందం ఖరారైంది. మొత్తం: ₹${totalAmount.toLocaleString()}.`,
              link: "purchases.html"
            });
            // Farmer themselves -> local only
            window.Storage.addNotification({
              id: `notif_deal_${updatedOffer.id}_${farmerUid}`,
              notificationId: `notif_deal_${updatedOffer.id}_${farmerUid}`,
              recipientUserId: farmerUid,
              userId: farmerUid,
              senderUserId: currentUser.uid || currentUser.id,
              role: "farmer",
              type: "deal",
              relatedId: updatedOffer.id,
              title: "Deal Closed & Transaction Recorded!",
              titleTe: "డీల్ ఖరారైంది & లావాదేవీ నమోదైంది!",
              message: `Accepted offer of ₹${finalPrice}/${updatedOffer.unit || 'kg'} from ${updatedOffer.dealerName || 'Dealer'}. Total: ₹${totalAmount.toLocaleString()}.`,
              messageTe: `${updatedOffer.dealerName || 'Dealer'} ఇచ్చిన ₹${finalPrice}/${updatedOffer.unit || 'kg'} ఆఫర్ అంగీకరించబడింది. మొత్తం: ₹${totalAmount.toLocaleString()}.`,
              link: "transactions.html",
              isDemo: true
            });
          } else {
            // Counterpart is farmer -> real Firestore notification
            window.Storage.addNotification({
              id: `notif_deal_${updatedOffer.id}_${farmerUid}`,
              notificationId: `notif_deal_${updatedOffer.id}_${farmerUid}`,
              recipientUserId: farmerUid,
              userId: farmerUid,
              senderUserId: currentUser.uid || currentUser.id,
              role: "farmer",
              type: "deal",
              relatedId: updatedOffer.id,
              title: "Deal Closed & Transaction Recorded!",
              titleTe: "డీల్ ఖరారైంది & లావాదేవీ నమోదైంది!",
              message: `Accepted offer of ₹${finalPrice}/${updatedOffer.unit || 'kg'} from ${updatedOffer.dealerName || 'Dealer'}. Total: ₹${totalAmount.toLocaleString()}.`,
              messageTe: `${updatedOffer.dealerName || 'Dealer'} ఇచ్చిన ₹${finalPrice}/${updatedOffer.unit || 'kg'} ఆఫర్ అంగీకరించబడింది. మొత్తం: ₹${totalAmount.toLocaleString()}.`,
              link: "transactions.html"
            });
            // Dealer themselves -> local only
            window.Storage.addNotification({
              id: `notif_deal_${updatedOffer.id}_${dealerUid}`,
              notificationId: `notif_deal_${updatedOffer.id}_${dealerUid}`,
              recipientUserId: dealerUid,
              userId: dealerUid,
              senderUserId: currentUser.uid || currentUser.id,
              role: "dealer",
              type: "deal",
              relatedId: updatedOffer.id,
              title: "Procurement Contract Finalized!",
              titleTe: "కొనుగోలు ఒప్పందం ఖరారైంది!",
              message: `${updatedOffer.farmerName || 'Farmer'} agreed to ₹${finalPrice}/${updatedOffer.unit || 'kg'} for ${updatedOffer.cropTitle || updatedOffer.cropName}. Total: ₹${totalAmount.toLocaleString()}.`,
              messageTe: `${updatedOffer.farmerName || 'Farmer'} గారితో ${updatedOffer.cropTitle || updatedOffer.cropName} ఒప్పందం ఖరారైంది. మొత్తం: ₹${totalAmount.toLocaleString()}.`,
              link: "purchases.html",
              isDemo: true
            });
          }
        }

        return { success: true, offer: updatedOffer, transaction: newTx };
      } catch (err) {
        console.error("[FarmLink Offers] Error accepting in Firestore:", err);
        return { success: false, message: err.message || "Failed to accept offer." };
      }
    }

    // Demo workflow only (creates local transaction and marks local crop sold)
    if (!offer) return { success: false, message: "Offer not found." };
    const updatedOffer = window.Storage.updateOffer(offerId, { status: "Accepted" }) || { ...offer, status: "Accepted" };

    const totalAmount = Number(offer.currentOfferPrice) * Number(offer.quantity);
    const txId = "tx_" + offer.id;
    const newTx = window.Storage.addTransaction({
      id: txId,
      txId: txId,
      transactionId: txId,
      cropId: offer.cropId,
      offerId: offer.id,
      cropTitle: offer.cropTitle || offer.cropName,
      cropName: offer.cropName || offer.cropTitle,
      quantity: offer.quantity,
      unit: offer.unit,
      finalPrice: offer.currentOfferPrice,
      totalAmount: totalAmount,
      farmerId: offer.farmerId,
      farmerName: offer.farmerName,
      dealerId: offer.dealerId,
      dealerName: offer.dealerName,
      dealStatus: "Accepted",
      paymentStatus: "Pending_Payment",
      deliveryStatus: "Pending_Delivery",
      status: "Completed",
      date: new Date().toISOString().split("T")[0],
      farmerRated: false,
      dealerRated: false
    });

    const crop = window.Storage.getCropById(offer.cropId);
    if (crop) {
      window.Storage.updateCrop(crop.id, { status: "Sold" });
    }

    if (window.Storage.addNotification) {
      window.Storage.addNotification({
        userId: offer.farmerId,
        role: "farmer",
        type: "deal",
        title: "Deal Closed & Transaction Recorded!",
        titleTe: "డీల్ ఖరారైంది & లావాదేవీ నమోదైంది!",
        message: `Accepted offer of ₹${offer.currentOfferPrice}/${offer.unit} from ${offer.dealerName}. Total: ₹${totalAmount.toLocaleString()}.`,
        messageTe: `${offer.dealerName} ఇచ్చిన ₹${offer.currentOfferPrice}/${offer.unit} ఆఫర్ అంగీకరించబడింది. మొత్తం: ₹${totalAmount.toLocaleString()}.`,
        link: "transactions.html"
      });
      window.Storage.addNotification({
        userId: offer.dealerId,
        role: "dealer",
        type: "deal",
        title: "Procurement Contract Finalized!",
        titleTe: "కొనుగోలు ఒప్పందం ఖరారైంది!",
        message: `${offer.farmerName} agreed to ₹${offer.currentOfferPrice}/${offer.unit} for ${offer.cropTitle || offer.cropName}. Total: ₹${totalAmount.toLocaleString()}.`,
        messageTe: `${offer.farmerName} గారితో ${offer.cropTitle || offer.cropName} ఒప్పందం ఖరారైంది. మొత్తం: ₹${totalAmount.toLocaleString()}.`,
        link: "purchases.html"
      });
    }

    return { success: true, offer: updatedOffer, transaction: newTx };
    } finally {
      if (this._pendingOperations) this._pendingOperations.delete(offerId);
    }
  }

  async rejectOffer(offerId, role = "farmer") {
    const offer = window.Storage.getOfferById(offerId);
    if (!offer) return { success: false, message: "Offer not found." };

    const currentUser = window.Auth && typeof window.Auth.getCurrentUser === "function" ? window.Auth.getCurrentUser() : null;
    const isRealFirebase = window.Storage.isRealFirebaseUser(currentUser) && !offer.isDemo;

    if (isRealFirebase) {
      try {
        const updated = await window.Storage.rejectOfferInFirestore(offerId, role);

        if (window.Storage.addNotification) {
          const isFarmerRejecting = (role === "farmer" || (currentUser && currentUser.uid === (offer.farmerId || offer.farmerUid)));
          if (isFarmerRejecting) {
            const recipientUid = offer.dealerId || offer.dealerUid;
            window.Storage.addNotification({
              id: `notif_rejected_${offerId}_${recipientUid}`,
              notificationId: `notif_rejected_${offerId}_${recipientUid}`,
              recipientUserId: recipientUid,
              userId: recipientUid,
              senderUserId: currentUser.uid || currentUser.id,
              role: "dealer",
              type: "rejected",
              relatedId: offerId,
              title: "Offer Rejected",
              titleTe: "ఆఫర్ తిరస్కరించబడింది",
              message: `${offer.farmerName || 'Farmer'} declined the offer for ${offer.cropTitle || offer.cropName}.`,
              messageTe: `${offer.farmerName || 'Farmer'} గారు ${offer.cropTitle || offer.cropName} ఆఫర్‌ను తిరస్కరించారు.`,
              link: "offers.html"
            });
          } else {
            const recipientUid = offer.farmerId || offer.farmerUid;
            window.Storage.addNotification({
              id: `notif_rejected_${offerId}_${recipientUid}`,
              notificationId: `notif_rejected_${offerId}_${recipientUid}`,
              recipientUserId: recipientUid,
              userId: recipientUid,
              senderUserId: currentUser.uid || currentUser.id,
              role: "farmer",
              type: "rejected",
              relatedId: offerId,
              title: "Counter-Offer Declined",
              titleTe: "కౌంటర్ ఆఫర్ తిరస్కరించబడింది",
              message: `${offer.dealerName || 'Dealer'} declined the counter-offer for ${offer.cropTitle || offer.cropName}.`,
              messageTe: `${offer.dealerName || 'Dealer'} గారు ${offer.cropTitle || offer.cropName} కౌంటర్ ఆఫర్‌ను తిరస్కరించారు.`,
              link: "offers.html"
            });
          }
        }

        return { success: true, offer: updated };
      } catch (err) {
        console.error("[FarmLink Offers] Error rejecting in Firestore:", err);
        return { success: false, message: err.message || "Failed to reject offer." };
      }
    }

    // Demo workflow
    window.Storage.updateOffer(offerId, { status: "Rejected" });

    const otherOffers = window.Storage.getOffers().filter(o => o.cropId === offer.cropId && o.id !== offer.id && (o.status === "Pending" || o.status === "Countered"));
    if (otherOffers.length === 0) {
      const crop = window.Storage.getCropById(offer.cropId);
      if (crop && crop.status === "Under Negotiation") {
        window.Storage.updateCrop(crop.id, { status: "Available" });
      }
    }

    return { success: true };
  }

  async cancelOffer(offerId) {
    const offer = window.Storage.getOfferById(offerId);
    if (!offer) return { success: false, message: "Offer not found." };

    const currentUser = window.Auth && typeof window.Auth.getCurrentUser === "function" ? window.Auth.getCurrentUser() : null;
    const isRealFirebase = window.Storage.isRealFirebaseUser(currentUser) && !offer.isDemo;

    if (isRealFirebase) {
      try {
        const updated = await window.Storage.cancelOfferInFirestore(offerId);

        if (window.Storage.addNotification) {
          const recipientUid = offer.farmerId || offer.farmerUid;
          window.Storage.addNotification({
            id: `notif_cancelled_${offerId}_${recipientUid}`,
            notificationId: `notif_cancelled_${offerId}_${recipientUid}`,
            recipientUserId: recipientUid,
            userId: recipientUid,
            senderUserId: currentUser.uid || currentUser.id,
            role: "farmer",
            type: "cancelled",
            relatedId: offerId,
            title: "Offer Withdrawn",
            titleTe: "ఆఫర్ ఉపసంహరించబడింది",
            message: `${offer.dealerName || 'Dealer'} withdrew their offer for ${offer.cropTitle || offer.cropName}.`,
            messageTe: `${offer.dealerName || 'Dealer'} గారు ${offer.cropTitle || offer.cropName} కోసం ఆఫర్‌ను ఉపసంహరించుకున్నారు.`,
            link: "offers.html"
          });
        }

        return { success: true, offer: updated };
      } catch (err) {
        console.error("[FarmLink Offers] Error cancelling in Firestore:", err);
        return { success: false, message: err.message || "Failed to cancel offer." };
      }
    }

    // Demo workflow
    window.Storage.updateOffer(offerId, { status: "Rejected" });

    const otherOffers = window.Storage.getOffers().filter(o => o.cropId === offer.cropId && o.id !== offer.id && (o.status === "Pending" || o.status === "Countered"));
    if (otherOffers.length === 0) {
      const crop = window.Storage.getCropById(offer.cropId);
      if (crop && crop.status === "Under Negotiation") {
        window.Storage.updateCrop(crop.id, { status: "Available" });
      }
    }

    return { success: true };
  }

  renderOfferCard(offer, viewRole = "farmer") {
    const isFarmerView = viewRole === "farmer";
    const cropTitle = this.escapeHtml(offer.cropTitle || offer.cropName || "Agricultural Produce");
    const farmerName = this.escapeHtml(offer.farmerName || "Farmer");
    const dealerName = this.escapeHtml(offer.dealerName || "Dealer");
    const dealerBusiness = this.escapeHtml(offer.dealerBusiness || "Wholesale Trader");
    const unit = this.escapeHtml(offer.unit || "kg");
    const qty = Number(offer.requestedQuantity || offer.quantity || 0);

    // Exact Farmer Expected Price (persisted from crop listing, never overwritten)
    let askingPrice = Number(offer.farmerExpectedPrice);
    if ((isNaN(askingPrice) || askingPrice <= 0) && offer.cropId && window.Storage) {
      const crop = window.Storage.getCropById(offer.cropId);
      if (crop && crop.expectedPrice) {
        askingPrice = Number(crop.expectedPrice);
      }
    }
    if (isNaN(askingPrice) || askingPrice <= 0) {
      askingPrice = 0;
    }

    const historyList = offer.history || [];

    // Exact Dealer's Offer (persisted from dealer bids, never overwritten)
    const dealerSteps = historyList.filter(h => h.sender === "dealer");
    let dealerOffer = dealerSteps.length > 0
      ? Number(dealerSteps[dealerSteps.length - 1].price)
      : Number(offer.dealerOfferPrice || (offer.lastSender === "dealer" ? offer.currentOfferPrice : (offer.offeredPrice || 0)));
    if (isNaN(dealerOffer) || dealerOffer <= 0) {
      dealerOffer = Number(offer.offeredPrice || offer.currentOfferPrice || 0);
    }

    // Exact Farmer's Counter-Offer (persisted from farmer counter, never overwritten)
    const farmerSteps = historyList.filter(h => h.sender === "farmer");
    let farmerCounter = farmerSteps.length > 0
      ? Number(farmerSteps[farmerSteps.length - 1].price)
      : (offer.farmerCounterPrice !== undefined && offer.farmerCounterPrice !== null ? Number(offer.farmerCounterPrice) : null);
    if (farmerCounter !== null && (isNaN(farmerCounter) || farmerCounter <= 0)) {
      farmerCounter = null;
    }

    // Active negotiated price
    const currentPrice = Number(offer.currentOfferPrice !== undefined ? offer.currentOfferPrice : (offer.offeredPrice || dealerOffer || 0));
    const totalAmount = Number(offer.totalAmount || (currentPrice * qty));
    const status = offer.status || "Pending";
    const lastSender = offer.lastSender || "dealer";

    // Separate Informational Mandi Benchmark Meter (never overwrites negotiated prices)
    const fairHtml = window.Market ? window.Market.renderPriceBenchmarkBadge(cropTitle, currentPrice) : "";

    // Status badge style
    let statusBadge = `<span class="badge badge-warning">${status}</span>`;
    if (status === "Accepted") statusBadge = `<span class="badge badge-success">Accepted & Deal Closed</span>`;
    if (status === "Rejected") statusBadge = `<span class="badge badge-danger">Rejected</span>`;

    // History log
    const historyHtml = historyList.map((h) => {
      const isHFarmer = h.sender === "farmer";
      const senderLabel = isHFarmer ? "👨‍🌾 " + farmerName : "💼 " + dealerName;
      const note = h.note ? this.escapeHtml(h.note) : "";
      return `
        <div class="offer-step" style="display: flex; justify-content: space-between; align-items: flex-start; padding: 0.5rem 0; border-bottom: 1px dashed var(--border-color);">
          <div>
            <strong>${senderLabel}:</strong>
            <span style="font-weight: 700; color: var(--primary-700); margin-left: 0.35rem;">₹${h.price}/${unit}</span>
            ${note ? `<div class="text-xs text-muted" style="margin-top: 2px;">"${note}"</div>` : ""}
          </div>
          <span class="text-xs text-muted">${h.timestamp || ""}</span>
        </div>
      `;
    }).join("");

    // Turn evaluation
    const isFarmerTurn = isFarmerView && (status === "Pending" || (status === "Countered" && lastSender === "dealer"));
    const isDealerTurn = !isFarmerView && (status === "Countered" && lastSender === "farmer");

    return `
      <div class="offer-card" id="offer-${offer.id}" style="border: 1px solid var(--border-color); background: var(--bg-card); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
        <div class="offer-card-top" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <span class="text-xs text-muted font-semibold" style="text-transform: uppercase;">Agricultural Produce Negotiation</span>
            <h3 style="font-size: 1.3rem; margin: 0.2rem 0;">${cropTitle} (${qty.toLocaleString()} ${unit})</h3>
            <p class="text-sm text-muted">
              ${isFarmerView ? `Dealer: <strong>${dealerName}</strong> (${dealerBusiness})` : `Farmer: <strong>${farmerName}</strong>`}
            </p>
          </div>
          <div>${statusBadge}</div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin: 1rem 0;">
          <div style="background: var(--bg-surface-secondary); padding: 0.75rem; border-radius: var(--radius-md);">
            <div class="text-xs text-muted font-semibold" data-i18n="expectedPrice">Farmer Expected Price</div>
            <div style="font-size: 1.2rem; font-weight: 700;">₹${askingPrice} <small class="text-xs">/${unit}</small></div>
          </div>
          <div style="background: var(--bg-surface-secondary); padding: 0.75rem; border-radius: var(--radius-md);">
            <div class="text-xs text-muted font-semibold" data-i18n="dealerOffer">Dealer's Offer</div>
            <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-700);">₹${dealerOffer} <small class="text-xs">/${unit}</small></div>
          </div>
          ${farmerCounter !== null ? `
            <div style="background: var(--bg-surface-secondary); padding: 0.75rem; border-radius: var(--radius-md);">
              <div class="text-xs text-muted font-semibold" data-i18n="farmerCounterOffer">Farmer's Counter-Offer</div>
              <div style="font-size: 1.2rem; font-weight: 700; color: #b45309;">₹${farmerCounter} <small class="text-xs">/${unit}</small></div>
            </div>
          ` : ""}
          <div style="background: var(--bg-surface-secondary); padding: 0.75rem; border-radius: var(--radius-md);">
            <div class="text-xs text-muted font-semibold" data-i18n="estimatedTotalDeal">Estimated Total Deal</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--emerald);">₹${totalAmount.toLocaleString()}</div>
          </div>
        </div>

        ${fairHtml}

        <div class="offer-steps-log" style="background: var(--bg-surface-secondary); padding: 1rem; border-radius: var(--radius-md); margin: 1rem 0;">
          <div class="text-xs text-muted font-semibold" style="margin-bottom: 0.5rem; text-transform: uppercase;">Negotiation History</div>
          ${historyHtml}
        </div>

        <!-- Action Bars -->
        ${status === "Pending" || status === "Countered" ? `
          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; align-items: center; flex-wrap: wrap; margin-top: 1.25rem;">
            ${isFarmerView ? (
              isFarmerTurn ? `
                <a href="messages.html?partner=${offer.dealerId || offer.dealerUid || ''}&cropId=${offer.cropId || ''}" class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:0.25rem;">💬 Chat</a>
                <button class="btn btn-outline btn-sm" onclick="openCounterModal('${offer.id}', ${currentPrice})">Counter Offer</button>
                <button class="btn btn-danger btn-sm" onclick="handleRejectOffer('${offer.id}')">Reject</button>
                <button class="btn btn-primary btn-sm" onclick="handleAcceptOffer('${offer.id}')">Accept ₹${currentPrice}/${unit}</button>
              ` : `
                <span class="text-xs text-muted">⏳ Waiting for dealer response to your counter-offer (₹${currentPrice}/${unit}).</span>
                <a href="messages.html?partner=${offer.dealerId || offer.dealerUid || ''}&cropId=${offer.cropId || ''}" class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:0.25rem;">💬 Chat</a>
              `
            ) : (
              isDealerTurn ? `
                <div style="flex: 1; min-width: 240px; background: var(--amber-50); border: 1px solid var(--amber-300); padding: 0.5rem 0.75rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--amber-800);">
                  🔔 <strong>Counter-offer received:</strong> Farmer asked ₹${currentPrice}/${unit}.
                </div>
                <a href="messages.html?partner=${offer.farmerId || offer.farmerUid || ''}&cropId=${offer.cropId || ''}" class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:0.25rem;">💬 Chat</a>
                <button class="btn btn-outline btn-sm" onclick="openDealerRaiseModal('${offer.id}', ${currentPrice})">Counter (Revise)</button>
                <button class="btn btn-danger btn-sm" onclick="handleCancelOffer('${offer.id}')">Reject</button>
                <button class="btn btn-primary btn-sm" onclick="handleDealerAcceptOffer('${offer.id}')">Accept ₹${currentPrice}/${unit}</button>
              ` : `
                <span class="text-xs text-muted">⏳ Waiting for farmer response on your bid of ₹${currentPrice}/${unit}.</span>
                <a href="messages.html?partner=${offer.farmerId || offer.farmerUid || ''}&cropId=${offer.cropId || ''}" class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:0.25rem;">💬 Chat</a>
                <button class="btn btn-danger btn-sm" onclick="handleCancelOffer('${offer.id}')">Cancel Bid</button>
              `
            )}
          </div>
        ` : `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; flex-wrap: wrap; gap: 0.5rem; font-size: 0.85rem;">
            <div>
              <a href="messages.html?partner=${isFarmerView ? (offer.dealerId || offer.dealerUid || '') : (offer.farmerId || offer.farmerUid || '')}&cropId=${offer.cropId || ''}" class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:0.25rem;">💬 Chat</a>
            </div>
            <div>
              ${status === "Accepted" ? `
                <span class="text-emerald font-semibold">✓ Deal Closed. Check ${isFarmerView ? '<a href="transactions.html" style="text-decoration:underline;">Sales History</a>' : '<a href="purchases.html" style="text-decoration:underline;">Purchases</a>'}.</span>
              ` : `
                <span class="text-danger font-semibold">✕ Negotiation closed (${status}).</span>
              `}
            </div>
          </div>
        `}
      </div>
    `;
  }
}

// Global instance
window.Offers = new OfferService();
