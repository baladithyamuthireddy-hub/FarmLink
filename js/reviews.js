/**
 * FarmLink - Verified Ratings & Reviews Service
 * Handles 1-5 star ratings and reviews strictly for completed transactions.
 * Enforces duplicate review guards and syncs ratings with user profiles.
 */

class ReviewsService {
  constructor() {}

  getReviews(receiverId = null) {
    if (!window.Storage) return [];
    return window.Storage.getReviews(receiverId);
  }

  getReviewByTransactionAndReviewer(txId, reviewerId) {
    if (!window.Storage) return null;
    return window.Storage.getReviewByTransactionAndReviewer(txId, reviewerId);
  }

  canReviewTransaction(tx, currentUserId, currentUserRole) {
    if (!tx) {
      return { allowed: false, reason: "Transaction record not found." };
    }

    const isLegacy = (tx.status === "Completed" || tx.status === "completed") && !tx.paymentStatus && !tx.deliveryStatus;
    const hasValidDelivery = (tx.deliveryStatus === "Delivered" || tx.deliveryStatus === "completed" || tx.deliveryStatus === "delivered") &&
      (isLegacy || Boolean(tx.dealerReceipt && tx.dealerReceipt.dealerConfirmed));
    const hasValidPayment = (tx.paymentStatus === "Paid" || tx.paymentStatus === "Settled" || tx.paymentStatus === "completed" || tx.paymentStatus === "paid") &&
      (isLegacy || Boolean(tx.farmerPayment && tx.farmerPayment.farmerConfirmed));

    const statusInfo = window.Storage && typeof window.Storage.getTransactionStatusDisplay === "function"
      ? window.Storage.getTransactionStatusDisplay(tx)
      : { isFullyCompleted: isLegacy || (hasValidDelivery && hasValidPayment) };

    if (!statusInfo.isFullyCompleted || (!isLegacy && (!hasValidDelivery || !hasValidPayment))) {
      return { allowed: false, reason: "Reviews can only be submitted after payment settlement and delivery confirmation are fully completed." };
    }

    const uid = currentUserId;
    let role = currentUserRole;
    if (!role && uid) {
      if (tx.farmerId === uid || tx.farmerUid === uid) role = "farmer";
      else if (tx.dealerId === uid || tx.dealerUid === uid) role = "dealer";
    }

    if (role === "farmer") {
      if (tx.farmerId !== uid && tx.farmerUid !== uid) {
        return { allowed: false, reason: "You can only review transactions where you are the farmer." };
      }
      const existing = this.getReviewByTransactionAndReviewer(tx.id, uid);
      if (existing || tx.farmerRated) {
        return { allowed: false, alreadyReviewed: true, review: existing, reason: "Review already submitted." };
      }
      return { allowed: true, counterpartId: tx.dealerId, counterpartName: tx.dealerName, counterpartRole: "dealer" };
    } else if (role === "dealer") {
      if (tx.dealerId !== uid && tx.dealerUid !== uid) {
        return { allowed: false, reason: "You can only review transactions where you are the dealer." };
      }
      const existing = this.getReviewByTransactionAndReviewer(tx.id, uid);
      if (existing || tx.dealerRated) {
        return { allowed: false, alreadyReviewed: true, review: existing, reason: "Review already submitted." };
      }
      return { allowed: true, counterpartId: tx.farmerId, counterpartName: tx.farmerName, counterpartRole: "farmer" };
    }

    return { allowed: false, reason: "Unauthorized role for review." };
  }

  async submitReview({ txId, reviewerId, reviewerName, reviewerRole, receiverId, receiverName, receiverRole, cropTitle, offerId, cropId, rating, feedback }) {
    if (!window.Storage) {
      return { success: false, error: "Storage service unavailable" };
    }

    const numericRating = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));
    const cleanFeedback = (feedback || "").trim().slice(0, 500);

    if (!txId || !reviewerId || !receiverId) {
      return { success: false, error: "Missing required transaction or user details." };
    }

    if (reviewerId === receiverId) {
      return { success: false, error: "Self-reviews are not permitted." };
    }

    const existing = this.getReviewByTransactionAndReviewer(txId, reviewerId);
    if (existing) {
      return { success: false, error: "You have already submitted a review for this transaction.", review: existing };
    }

    const deterministicId = `rev_${txId}_${reviewerId}`;
    const nowIso = new Date().toISOString();

    const reviewRecord = {
      id: deterministicId,
      reviewId: deterministicId,
      transactionId: txId,
      offerId: offerId || null,
      cropId: cropId || null,
      cropTitle: (cropTitle || "Agricultural Produce").slice(0, 100),
      reviewerId,
      reviewerName: (reviewerName || "User").slice(0, 100),
      reviewerRole,
      receiverId,
      receiverName: (receiverName || "Counterpart").slice(0, 100),
      receiverRole,
      rating: numericRating,
      feedback: cleanFeedback,
      createdAt: nowIso,
      updatedAt: nowIso,
      userCreated: true
    };

    const res = await window.Storage.addReview(reviewRecord);
    if (!res.success) {
      return res;
    }

    // Trigger notification to counterpart
    // IMPORTANT NOTIFICATION RESTRICTION:
    // Published Firestore notification rules do not support type 'rating'.
    // Keep rating notifications disabled for real accounts until a separate patch is published.
    // Preserve existing demo notification behavior.
    // Notification failure must never invalidate a successfully saved review.
    try {
      const currentUser = (window.Auth && typeof window.Auth.getCurrentUser === "function")
        ? window.Auth.getCurrentUser()
        : null;
      const isDemo = !currentUser || currentUser.isDemo;

      if (isDemo && window.Storage.addNotification) {
        const isTe = window.I18n && window.I18n.currentLang === "te";
        window.Storage.addNotification({
          userId: receiverId,
          role: receiverRole,
          type: "rating",
          title: isTe ? "కొత్త వ్యాపార సమీక్ష మరియు రేటింగ్" : "New Rating & Review Received",
          titleTe: "కొత్త వ్యాపార సమీక్ష మరియు రేటింగ్",
          message: `${reviewerName} gave you a ${numericRating}★ rating for transaction on "${cropTitle}".`,
          messageTe: `మీ "${cropTitle}" విక్రయ లావాదేవీకి ${reviewerName} గారు ${numericRating}★ రేటింగ్ ఇచ్చారు.`,
          link: "profile.html",
          isRead: false,
          isDemo: true
        });
      }
    } catch (notifErr) {
      console.warn("[FarmLink Reviews] Notification note:", notifErr);
    }

    // Log Activity
    try {
      if (window.Storage.addActivity) {
        window.Storage.addActivity({
          targetRole: receiverRole,
          type: "review",
          icon: "star",
          title: "New Review Received",
          titleTe: "కొత్త సమీక్ష నమోదు",
          desc: `${reviewerName} rated your completed transaction with ${numericRating} stars: "${cleanFeedback.slice(0, 40)}${cleanFeedback.length > 40 ? '...' : ''}"`,
          descTe: `${reviewerName} మీ లావాదేవీకి ${numericRating} నక్షత్రాల రేటింగ్ ఇచ్చారు.`
        });
      }
    } catch (actErr) {
      console.warn("[FarmLink Reviews] Activity log note:", actErr);
    }

    return { success: true, review: res.review };
  }

  renderStars(rating) {
    const r = Math.round(Number(rating) || 5);
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= r) {
        starsHtml += `<span style="color: #f59e0b; font-size: 1.15rem;">★</span>`;
      } else {
        starsHtml += `<span style="color: var(--border-color); font-size: 1.15rem;">★</span>`;
      }
    }
    return starsHtml;
  }

  escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[m]);
  }

  renderReviewCard(review) {
    if (!review) return "";
    const isTe = window.I18n && window.I18n.currentLang === "te";
    let dateStr = "";
    try {
      const d = new Date(review.createdAt);
      dateStr = isNaN(d.getTime()) ? "" : d.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      dateStr = "";
    }
    const roleBadge = review.reviewerRole === "dealer" ? "Wholesale Dealer" : "Farmer";
    const roleBadgeTe = review.reviewerRole === "dealer" ? "హోల్‌సేల్ డీలర్" : "రైతు";

    const safeReviewerName = this.escapeHtml(review.reviewerName || "User");
    const safeCropTitle = this.escapeHtml(review.cropTitle || (isTe ? "వ్యవసాయ పంట లావాదేవీ" : "Completed Produce Transaction"));
    const safeFeedback = review.feedback
      ? this.escapeHtml(review.feedback)
      : (isTe ? "లావాదేవీ సంతృప్తికరంగా పూర్తయింది." : "Transaction completed satisfactorily with fair terms.");

    return `
      <div class="card" style="padding: 1.25rem; margin-bottom: 1rem; border-left: 4px solid var(--amber-500); background: var(--bg-surface);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.65rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">${safeReviewerName}</span>
              <span class="badge badge-info" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;">${isTe ? roleBadgeTe : roleBadge}</span>
            </div>
            <div class="text-xs text-muted" style="margin-top: 0.2rem;">
              <span>📦 ${safeCropTitle}</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div>${this.renderStars(review.rating)}</div>
            <div class="text-xs text-muted" style="margin-top: 0.15rem;">${dateStr}</div>
          </div>
        </div>
        <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5; margin: 0; font-style: italic;">
          "${safeFeedback}"
        </p>
      </div>
    `;
  }
}

// Global instance
window.Reviews = new ReviewsService();
