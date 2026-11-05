/**
 * FarmLink - Messaging & Real-Time Chat Service (Phase 3E)
 * Seamlessly handles real Firebase multi-user conversations & messages,
 * with deterministic IDs, realtime Cloud Firestore sync, and full demo isolation.
 */

class ChatService {
  constructor() {
    this.activeConversationId = "conv_farmer_1_dealer_1";
    this.activePartner = null;
  }

  getConversations(currentUser) {
    if (!currentUser) return [];
    if (window.Storage && typeof window.Storage.getConversations === "function") {
      return window.Storage.getConversations(currentUser);
    }
    const isFarmer = currentUser.role === "farmer";
    return [
      {
        id: "conv_farmer_1_dealer_1",
        otherUserId: isFarmer ? "dealer_1" : "farmer_1",
        name: isFarmer ? "Venkat Rao (Sri Lakshmi Traders)" : "Ramesh Naidu (Guntur Farmer)",
        avatar: isFarmer ? "VR" : "RN",
        cropContext: "Hybrid Fresh Red Tomatoes (1800 kg)",
        lastMessage: "Great. I have placed an offer on the portal for ₹31/kg.",
        time: "02:00 PM",
        unread: false,
        isDemo: true
      }
    ];
  }

  getPartnerFromConversation(conv, currentUserId) {
    if (!conv) return null;
    const isCurrentFarmer = (conv.farmerId === currentUserId);
    const partnerId = isCurrentFarmer ? conv.dealerId : conv.farmerId;
    const partnerRole = isCurrentFarmer ? "dealer" : "farmer";
    const partnerName = isCurrentFarmer ? (conv.dealerName || "Wholesale Dealer") : (conv.farmerName || "Verified Farmer");
    const partnerBusiness = isCurrentFarmer ? (conv.dealerBusiness || "") : "";
    const avatar = partnerName.split(" ").map(p => p[0]).join("").substring(0, 2).toUpperCase() || (isCurrentFarmer ? "DL" : "FR");

    return {
      id: partnerId,
      name: partnerName,
      role: partnerRole,
      business: partnerBusiness,
      avatar: avatar,
      cropContext: conv.cropContext || ""
    };
  }

  async setActiveConversation(conversationId, partnerInfo, onMessagesUpdated) {
    this.activeConversationId = conversationId;
    if (partnerInfo) {
      this.activePartner = partnerInfo;
    }
    if (window.Storage && typeof window.Storage.initActiveChatSync === "function") {
      window.Storage.initActiveChatSync(conversationId, onMessagesUpdated);
    }
  }

  async initConversationWithPartner(partnerId, cropId = "", cropContext = "", currentUser = null) {
    const user = currentUser || (window.Auth ? window.Auth.getCurrentUser() : null);
    if (!user || !partnerId) return null;

    const isFarmer = user.role === "farmer";
    const isDemo = window.Storage && window.Storage.isDemoUser(user);

    if (isDemo) {
      this.activeConversationId = "conv_farmer_1_dealer_1";
      this.activePartner = {
        id: isFarmer ? "dealer_1" : "farmer_1",
        name: isFarmer ? "Venkat Rao" : "Ramesh Naidu",
        role: isFarmer ? "dealer" : "farmer",
        business: isFarmer ? "Sri Lakshmi Traders" : "",
        avatar: isFarmer ? "VR" : "RN"
      };
      return { id: "conv_farmer_1_dealer_1", isDemo: true };
    }

    // Resolve partner profile from cache or storage
    let partnerUser = null;
    if (window.Storage && typeof window.Storage.getUserById === "function") {
      partnerUser = window.Storage.getUserById(partnerId);
    }

    // Fallback: Resolve partner name & business from recent transactions or offers
    let fallbackPartnerName = "";
    let fallbackBusiness = "";
    if (window.Storage) {
      const txs = typeof window.Storage.getTransactions === "function" ? window.Storage.getTransactions() : [];
      const matchTx = txs.find(t => t.farmerId === partnerId || t.dealerId === partnerId || t.farmerUid === partnerId || t.dealerUid === partnerId);
      if (matchTx) {
        fallbackPartnerName = isFarmer ? (matchTx.dealerName || "") : (matchTx.farmerName || "");
        fallbackBusiness = isFarmer ? (matchTx.dealerBusiness || "") : "";
        if (!cropContext && matchTx.cropTitle) cropContext = matchTx.cropTitle;
        if (!cropId && matchTx.cropId) cropId = matchTx.cropId;
      }
      if (!fallbackPartnerName) {
        const offers = typeof window.Storage.getOffers === "function" ? window.Storage.getOffers() : [];
        const matchOffer = offers.find(o => o.farmerId === partnerId || o.dealerId === partnerId);
        if (matchOffer) {
          fallbackPartnerName = isFarmer ? (matchOffer.dealerName || "") : (matchOffer.farmerName || "");
          fallbackBusiness = isFarmer ? (matchOffer.dealerBusiness || "") : "";
          if (!cropContext && matchOffer.cropTitle) cropContext = matchOffer.cropTitle;
          if (!cropId && matchOffer.cropId) cropId = matchOffer.cropId;
        }
      }
    }

    // If still missing and Firebase available, fetch authoritative name from users collection
    if (!partnerUser && !fallbackPartnerName && window.FarmLinkFirebase && window.FarmLinkFirebase.db) {
      try {
        const userDoc = await window.FarmLinkFirebase.db.collection("users").doc(partnerId).get();
        if (userDoc && userDoc.exists) {
          partnerUser = userDoc.data();
        }
      } catch (e) {}
    }

    const myUid = user.uid || user.id;
    const farmerId = isFarmer ? myUid : partnerId;
    const farmerName = isFarmer
      ? (user.name || "Farmer")
      : (partnerUser ? partnerUser.name : (fallbackPartnerName || "Verified Farmer"));
    const dealerId = isFarmer ? partnerId : myUid;
    const dealerName = isFarmer
      ? (partnerUser ? partnerUser.name : (fallbackPartnerName || "Wholesale Dealer"))
      : (user.name || "Dealer");
    const dealerBusiness = isFarmer
      ? (partnerUser ? (partnerUser.businessName || partnerUser.business || "") : (fallbackBusiness || ""))
      : (user.businessName || user.business || "");

    const conv = await window.Storage.getOrCreateConversationInFirestore({
      farmerId: farmerId,
      farmerName: farmerName,
      dealerId: dealerId,
      dealerName: dealerName,
      dealerBusiness: dealerBusiness,
      cropId: cropId,
      cropContext: cropContext,
      currentUser: user,
      isDemo: false
    });

    if (conv && conv.id) {
      this.activeConversationId = conv.id;
      this.activePartner = this.getPartnerFromConversation(conv, myUid);
    }

    return conv;
  }

  async sendMessage(text, currentUser) {
    if (!text || !text.trim() || !currentUser) return null;

    const isFarmer = currentUser.role === "farmer";
    const isDemo = window.Storage ? window.Storage.isDemoUser(currentUser) : true;
    let convId = this.activeConversationId;

    if (isDemo) {
      convId = convId || "conv_farmer_1_dealer_1";
      // Retain existing demo simulation
      const receiverId = isFarmer ? "dealer_1" : "farmer_1";
      const newMsg = window.Storage.addMessage({
        conversationId: convId,
        senderId: currentUser.id || "farmer_1",
        senderName: currentUser.name || "Demo User",
        receiverId: receiverId,
        recipientId: receiverId,
        text: text.trim(),
        isDemo: true
      });

      // Simulate smart partner response in demo ONLY
      setTimeout(() => {
        let replyText = "";
        if (isFarmer) {
          replyText = `Thank you for the update ${currentUser.name || "Farmer"} garu! Our logistics team will inspect the produce directly at the farm.`;
        } else {
          replyText = `Understood ${currentUser.name || "Dealer"} garu. The crop is ready for loading whenever your vehicle arrives.`;
        }

        window.Storage.addMessage({
          conversationId: convId,
          senderId: receiverId,
          senderName: isFarmer ? "Venkat Rao" : "Ramesh Naidu",
          receiverId: currentUser.id || "farmer_1",
          recipientId: currentUser.id || "farmer_1",
          text: replyText,
          isDemo: true
        });

        // Notify UI
        if (typeof renderChatMessages === "function") {
          renderChatMessages();
        }
        if (window.App && window.App.showToast) {
          window.App.showToast("New message received from " + (isFarmer ? "Venkat Rao" : "Ramesh Naidu"), "info");
        }
      }, 1800);

      return newMsg;
    }

    // REAL Firebase user: ensure we have a valid non-demo conversation ID
    if (!convId || convId === "conv_farmer_1_dealer_1") {
      const cached = window.Storage ? (window.Storage.get("farmlink_conversations_cache") || []) : [];
      const uid = currentUser.uid || currentUser.id;
      const validConv = cached.find(c => !c.isDemo && (c.farmerId === uid || c.dealerId === uid));
      if (validConv && validConv.id) {
        convId = validConv.id;
        this.activeConversationId = convId;
      } else {
        console.error("[FarmLink Chat] No active conversation selected for real account.");
        if (window.App && window.App.showToast) {
          window.App.showToast("Please select a conversation first.", "warning");
        }
        return null;
      }
    }

    let recipientId = "";
    const myUid = currentUser.uid || currentUser.id;
    if (this.activePartner && this.activePartner.id) {
      recipientId = this.activePartner.id;
    } else {
      // Find conversation in cache
      const cached = window.Storage.get("farmlink_conversations_cache") || [];
      const conv = cached.find(c => c.id === convId || c.conversationId === convId);
      if (conv) {
        recipientId = (conv.farmerId === myUid) ? conv.dealerId : conv.farmerId;
      } else if (convId.startsWith("conv_")) {
        const parts = convId.replace("conv_", "").split("_");
        recipientId = (parts[0] === myUid) ? parts[1] : parts[0];
      }
    }

    if (!recipientId) {
      console.error("[FarmLink Chat] Cannot determine recipientId for conversation:", convId);
      if (window.App && window.App.showToast) {
        window.App.showToast("Could not determine message recipient.", "error");
      }
      return null;
    }

    const newMsg = await window.Storage.addMessage({
      conversationId: convId,
      senderId: myUid,
      senderName: currentUser.name || (isFarmer ? "Farmer" : "Dealer"),
      senderRole: currentUser.role || (isFarmer ? "farmer" : "dealer"),
      recipientId: recipientId,
      text: text.trim(),
      isDemo: false
    });

    return newMsg;
  }
}

// Global instance
window.Chat = new ChatService();
