# FarmLink Cloud Functions — Staged Backend Architecture

**Target Firebase Project**: `farmlink-production-bf431`  
**Status**: **STAGED LOCALLY — NOT DEPLOYED**

---

### Overview & Security Mandate

In the original FarmLink client-side architecture, negotiation deal acceptance and transaction receipt generation were performed within browser JavaScript via `fb.db.runTransaction()`.

While Firestore Security Rules enforce document matching via `getAfter()`, browser-side transactions have inherent limitations:
1. **Inventory Deductions**: A client cannot safely read another farmer's crop inventory and decrement it without broad write access to `/crops/{cropId}`.
2. **Payment Verification**: A client setting `status: 'Completed'` does not verify that currency was transferred or escrow was funded.
3. **Double Acceptance**: Network latency can result in simultaneous acceptance attempts.

To provide true **production-grade enterprise security**, these Cloud Functions provide server-side, trusted business operations.

---

### Functions Inventory

| Function Name | Trigger | Authorization | Business Logic |
| :--- | :--- | :--- | :--- |
| `acceptOfferAndDeductInventory` | `https.onCall` | Authenticated Counterpart | Server-side transaction: checks turn authority, deducts crop inventory atomically, marks offer `Accepted`, creates transaction receipt with `dealStatus: 'Accepted'`, dispatches notifications. |
| `declarePayment` | `https.onCall` | Purchasing Dealer | Records payment reference/UTR and transitions `paymentStatus` to `Payment_Declared`. |
| `confirmDelivery` | `https.onCall` | Transaction Counterparties | Updates `deliveryStatus` to `Delivered`. |

---

### Firebase Blaze Plan & Deployment Requirements

> [!IMPORTANT]
> Google Cloud Functions for Firebase requires the project to be upgraded to the **Firebase Blaze (Pay-as-you-go) Plan** to execute Node.js Cloud Functions.
> **DO NOT DEPLOY WITHOUT EXPLICIT USER APPROVAL AND BLAZE UPGRADE.**

To deploy when authorized:
```bash
firebase deploy --only functions
```
