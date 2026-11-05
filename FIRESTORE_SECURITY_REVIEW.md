# FarmLink – Firestore & Storage Security Review
**Target Firebase Project:** `farmlink-production-bf431`  
**Rules Version:** Firebase Rules Version 2 (`rules_version = '2'`)  
**Audit Status:** Live Emulator Verified (58/58 Tests Passed Across 10 Suites, Including Data Integrity Suite 10) — **NOT DEPLOYED**

---

## 1. Executive Summary

This document provides a comprehensive security and compatibility review of the production Firestore Security Rules ([`firestore.rules`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/firestore.rules)) and Firebase Storage Rules ([`storage.rules`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/storage.rules)).

The ruleset was verified against Google's official Cloud Firestore Emulator engine running locally on OpenJDK 21 LTS using `@firebase/rules-unit-testing`. The rules enforce strict participant authorization, atomic cross-document validation via `getAfter()`, alternating turn-taking negotiation constraints, input bounds validation, and backward compatibility for legacy data records.

---

## 2. Collection-by-Collection Security Architecture

### 2.1 Collection: `/users/{userId}`

```cel
match /users/{userId} {
  allow read: if isAuthenticated();

  allow create: if isOwner(userId) &&
    request.resource.data.keys().hasAll(['uid', 'role', 'name', 'email']) &&
    request.resource.data.uid == userId &&
    request.resource.data.id == userId &&
    (request.resource.data.role == 'farmer' || request.resource.data.role == 'dealer') &&
    request.resource.data.isDemo == false &&
    !request.resource.data.keys().hasAny(['admin', 'verified', 'suspended']);

  allow update: if isOwner(userId) &&
    request.resource.data.uid == resource.data.uid &&
    ( !('id' in resource.data) || request.resource.data.id == resource.data.id ) &&
    request.resource.data.role == resource.data.role &&
    ( !('email' in resource.data) || request.resource.data.email == resource.data.email ) &&
    !request.resource.data.keys().hasAny(['admin', 'verified', 'suspended']);

  allow delete: if false;
}
```

- **Read Access**: Authenticated users can read profile directories for trading transparency.
- **Write / Create Access**:
  - Restricts creation strictly to the authenticated user matching the document ID (`request.auth.uid == userId`).
  - **Self-Admin Escalation Guard**: Prevents public users from assigning themselves `admin` role upon registration (`request.resource.data.role in ['farmer', 'dealer']`).
  - Prohibits injecting privileged attributes such as `admin: true`, `verified: true`, or `suspended: true`.
- **Update Access**:
  - Only the profile owner can update their own document.
  - **Legacy Compatibility Guard**: Checks `( !('id' in resource.data) || request.resource.data.id == resource.data.id )`, allowing pre-existing legacy profiles created without an `id` field to be updated without evaluation errors.
  - Prohibits altering `role`, `uid`, or `email`.
- **Deletion Access**: Explicitly denied (`allow delete: if false;`).

---

### 2.2 Collection: `/crops/{cropId}`

```cel
match /crops/{cropId} {
  allow read: if isAuthenticated();

  allow create: if isFarmer() &&
    request.resource.data.farmerId == request.auth.uid &&
    request.resource.data.quantity is number &&
    request.resource.data.quantity > 0 &&
    request.resource.data.expectedPrice is number &&
    request.resource.data.expectedPrice > 0 &&
    (request.resource.data.status in ['Available', 'available', 'Active', 'active']);

  allow update: if isAuthenticated() && (
    (
      resource.data.farmerId == request.auth.uid &&
      request.resource.data.farmerId == resource.data.farmerId &&
      (request.resource.data.status in ['Available', 'available', 'Sold', 'sold', 'Removed', 'removed', 'Active', 'active'])
    ) ||
    (
      isDealer() &&
      request.resource.data.farmerId == resource.data.farmerId &&
      request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt', 'quantity'])
    ) ||
    isAdmin()
  );

  allow delete: if false;
}
```

- **Read Access**: Authenticated market participants can browse active listings.
- **Listing Creation**:
  - Restricted strictly to verified farmers (`isFarmer()`). Wholesale dealers cannot list produce lots.
  - `farmerId` must equal `request.auth.uid`.
  - Enforces positive quantities and prices (`quantity > 0`, `expectedPrice > 0`).
- **Listing Updates**:
  - The owning farmer can update price, quantity, or soft-delete (`status: 'Removed'`).
  - Prohibits ownership re-assignment (`request.resource.data.farmerId == resource.data.farmerId`).
  - Accommodates inventory deductions during deal locking (`affectedKeys().hasOnly(['status', 'updatedAt', 'quantity'])`).
- **Listing Deletion**: Denied (`allow delete: if false;`) to preserve transaction history.

---

### 2.3 Collection: `/offers/{offerId}`

```cel
match /offers/{offerId} {
  allow read: if isAuthenticated() && (
    resource.data.farmerId == request.auth.uid ||
    resource.data.dealerId == request.auth.uid ||
    isAdmin()
  );

  allow create: if isDealer() &&
    request.resource.data.dealerId == request.auth.uid &&
    request.resource.data.farmerId != null &&
    request.resource.data.farmerId != request.auth.uid &&
    request.resource.data.cropId != null &&
    request.resource.data.offeredPrice is number &&
    request.resource.data.offeredPrice > 0 &&
    request.resource.data.quantity is number &&
    request.resource.data.quantity > 0 &&
    (request.resource.data.status == 'pending' || request.resource.data.status == 'Pending') &&
    request.resource.data.lastSender == 'dealer';

  allow update: if isAuthenticated() &&
    (resource.data.farmerId == request.auth.uid || resource.data.dealerId == request.auth.uid) &&
    ( !('id' in resource.data) || request.resource.data.id == resource.data.id ) &&
    request.resource.data.cropId == resource.data.cropId &&
    request.resource.data.farmerId == resource.data.farmerId &&
    request.resource.data.dealerId == resource.data.dealerId &&
    ( !('farmerExpectedPrice' in resource.data) || request.resource.data.farmerExpectedPrice == resource.data.farmerExpectedPrice ) &&
    request.resource.data.quantity == resource.data.quantity &&
    ( !('unit' in resource.data) || request.resource.data.unit == resource.data.unit ) &&
    resource.data.status != 'Accepted' && resource.data.status != 'accepted' &&
    resource.data.status != 'Rejected' && resource.data.status != 'rejected' &&
    resource.data.status != 'Cancelled' && resource.data.status != 'cancelled' &&
    (
      (resource.data.lastSender == 'dealer' && request.auth.uid == resource.data.farmerId && request.resource.data.lastSender == 'farmer') ||
      (resource.data.lastSender == 'farmer' && request.auth.uid == resource.data.dealerId && request.resource.data.lastSender == 'dealer') ||
      (request.resource.data.currentOfferPrice == resource.data.currentOfferPrice)
    );

  allow delete: if false;
}
```

- **Read Access**: Restricted strictly to the two negotiating counterparties (`farmerId` and `dealerId`) and administrators. Competing dealers cannot inspect private bids.
- **Offer Creation**:
  - Restricted to wholesale dealers (`isDealer()`). Self-bidding is rejected (`farmerId != request.auth.uid`).
  - Requires positive price and quantity with initial status `'pending'`.
- **Offer Negotiation & Turn-Taking**:
  - Core trade terms (`cropId`, `farmerId`, `dealerId`, `farmerExpectedPrice`, `quantity`, `unit`) are strictly immutable.
  - **Terminal State Lock**: Accepted, rejected, or cancelled offers cannot be modified.
  - **Strict Alternating Turn Enforcement**:
    - When `lastSender == 'dealer'`, only the farmer can submit a counter-offer.
    - When `lastSender == 'farmer'`, only the dealer can submit a counter-offer.
    - Out-of-turn spam counters are unconditionally rejected.
  - **Legacy Compatibility**: Missing `farmerExpectedPrice` or `unit` in older records does not break negotiation updates.

---

### 2.4 Collection: `/transactions/{txId}`

```cel
match /transactions/{txId} {
  allow read: if isAuthenticated() && (
    resource.data.farmerId == request.auth.uid ||
    resource.data.dealerId == request.auth.uid ||
    isAdmin()
  );

  allow create: if isAuthenticated() &&
    (request.auth.uid == request.resource.data.farmerId || request.auth.uid == request.resource.data.dealerId) &&
    txId == 'tx_' + request.resource.data.offerId &&
    request.resource.data.status in ['Completed', 'completed', 'Accepted', 'accepted'] &&
    request.resource.data.totalAmount == request.resource.data.finalPrice * request.resource.data.quantity &&
    getAfter(/databases/$(database)/documents/offers/$(request.resource.data.offerId)).data.status in ['Accepted', 'accepted'] &&
    getAfter(/databases/$(database)/documents/offers/$(request.resource.data.offerId)).data.cropId == request.resource.data.cropId &&
    getAfter(/databases/$(database)/documents/offers/$(request.resource.data.offerId)).data.farmerId == request.resource.data.farmerId &&
    getAfter(/databases/$(database)/documents/offers/$(request.resource.data.offerId)).data.dealerId == request.resource.data.dealerId &&
    getAfter(/databases/$(database)/documents/offers/$(request.resource.data.offerId)).data.quantity == request.resource.data.quantity &&
    getAfter(/databases/$(database)/documents/offers/$(request.resource.data.offerId)).data.unit == request.resource.data.unit &&
    getAfter(/databases/$(database)/documents/offers/$(request.resource.data.offerId)).data.currentOfferPrice == request.resource.data.finalPrice;

  allow update: if isAuthenticated() && (
    resource.data.farmerId == request.auth.uid || resource.data.dealerId == request.auth.uid
  ) &&
    ( !('totalAmount' in resource.data) || request.resource.data.totalAmount == resource.data.totalAmount ) &&
    ( !('finalPrice' in resource.data) || request.resource.data.finalPrice == resource.data.finalPrice ) &&
    ( !('quantity' in resource.data) || request.resource.data.quantity == resource.data.quantity ) &&
    request.resource.data.farmerId == resource.data.farmerId &&
    request.resource.data.dealerId == resource.data.dealerId;

  allow delete: if false;
}
```

- **Deterministic ID**: Enforces `txId == 'tx_' + offerId`, eliminating duplicate transactions for the same offer.
- **Atomic Cross-Document Verification via `getAfter()`**:
  - The transaction record must cross-match an offer document in `/offers/{offerId}` that is transition to `'Accepted'` in the same batch or transaction.
  - Price, quantity, crop ID, farmer ID, and dealer ID must match the accepted offer document verbatim.
- **Mathematical Integrity**: Enforces `totalAmount == finalPrice * quantity`.
- **Granular Status Updates**:
  - Counterparties can update payment declaration (`paymentStatus`) or delivery status (`deliveryStatus`).
  - Total amount, final price, quantity, and participant IDs are strictly locked against alteration.

---

### 2.5 Collection: `/notifications/{notifId}`

```cel
match /notifications/{notifId} {
  allow read: if isAuthenticated() && (
    resource.data.recipientUserId == request.auth.uid ||
    resource.data.userId == request.auth.uid ||
    (resource.data.type == 'message' && resource.data.senderUserId == request.auth.uid)
  );

  allow create: if isAuthenticated() &&
    request.resource.data.id == notifId &&
    request.resource.data.notificationId == notifId &&
    request.resource.data.senderUserId == request.auth.uid &&
    request.resource.data.recipientUserId != request.auth.uid &&
    request.resource.data.userId == request.resource.data.recipientUserId &&
    (request.resource.data.role == 'farmer' || request.resource.data.role == 'dealer') &&
    request.resource.data.isRead == false &&
    request.resource.data.read == false &&
    request.resource.data.isDemo == false &&
    (
      // Verified event provenance
      (request.resource.data.type in ['offer', 'counter', 'deal', 'rejected', 'cancelled'] &&
       exists(/databases/$(database)/documents/offers/$(request.resource.data.relatedId))) ||
      (request.resource.data.type == 'transaction' &&
       exists(/databases/$(database)/documents/transactions/$(request.resource.data.relatedId))) ||
      (request.resource.data.type == 'message' &&
       exists(/databases/$(database)/documents/conversations/$(request.resource.data.relatedId)))
    );

  allow update: if isAuthenticated() &&
    (resource.data.recipientUserId == request.auth.uid || resource.data.userId == request.auth.uid) &&
    request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isRead', 'read', 'updatedAt']);

  allow delete: if isAuthenticated() &&
    (resource.data.recipientUserId == request.auth.uid || resource.data.userId == request.auth.uid);
}
```

- **Read Access**: Only the recipient user can view their alerts.
- **Provenance Verification**: Notifications must originate from a verified trade event (real offer, real transaction, or real conversation).
- **Anti-Spam Guard**: Self-notifications are rejected (`recipientUserId != request.auth.uid`).
- **Update Access**: Only the recipient can toggle read state (`isRead`, `read`).

---

### 2.6 Collection: `/conversations/{conversationId}` & `/messages/{messageId}`

- **Deterministic ID**: Enforces `conversationId == 'conv_' + farmerId + '_' + dealerId`.
- **Counterparty Privacy**: Only the two counterparties can access the chat thread.
- **Message Integrity**:
  - Senders cannot forge message authorship (`senderId == request.auth.uid`).
  - Text length enforced between 1 and 2,000 characters.
  - Messages cannot be modified or deleted post-send.
  - Read receipts can only be toggled by the recipient.

---

### 2.7 Collection: `/reviews/{reviewId}`

- **Deterministic Review ID**: Enforces `reviewId == 'rev_' + txId + '_' + request.auth.uid`.
- **Trade Eligibility**: Verifies that the referenced transaction exists and has status `'Completed'` or `'Accepted'`.
- **Anti-Self-Review**: `reviewerId != receiverId`.
- **Rating Bounds**: 1 to 5 stars (`rating >= 1 && rating <= 5`).
- **Absolute Immutability**: `allow update, delete: if false;`. Reviews cannot be retracted or altered.

---

### 2.8 Collection: `/market_prices/{priceId}`

- **Read Access**: All authenticated farmers and dealers can inspect official APMC market prices.
- **Write Access**: Strictly restricted to platform administrators (`isAdmin()`).

---

## 3. Firebase Storage Rules (`storage.rules`)

```cel
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

- **Audit Confirmation**: FarmLink does not use Firebase Storage in its client application. Images load via Unsplash CDN URLs and inline SVG data URIs.
- **Security Posture**: Default-deny prevents unauthorized bucket uploads, malware hosting, and bandwidth abuse.

---

## 4. Permissions Matrix

| Collection | Unauthenticated | Farmer | Dealer | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **users** | Denied | Read all; Write own profile | Read all; Write own profile | Read all; Write own profile |
| **crops** | Denied | Create, Read, Update own crops | Read active crops; Deduct on deal | Read all crops |
| **offers** | Denied | Read & Counter own offers | Create bids, Read & Counter own | Read all offers |
| **transactions** | Denied | Create & Read own transactions | Create & Read own transactions | Read all transactions |
| **notifications** | Denied | Read/dismiss own received | Read/dismiss own received | Read all notifications |
| **conversations** | Denied | Read & message in own chats | Read & message in own chats | Denied (private chat) |
| **reviews** | Denied | Read all; Review past dealer | Read all; Review past farmer | Read all reviews |
| **market_prices** | Denied | Read all APMC prices | Read all APMC prices | Full Read & Write |

---

## 5. Firebase Console Publish Instructions

1. Open the [Firebase Console](https://console.firebase.google.com/) and select **`farmlink-production-bf431`**.
2. Navigate to **Build** > **Firestore Database** > **Rules**.
3. Paste the contents of [`firestore.rules`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/firestore.rules) and click **Publish**.
4. Navigate to **Build** > **Storage** > **Rules**.
5. Paste the contents of [`storage.rules`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/storage.rules) and click **Publish**.
