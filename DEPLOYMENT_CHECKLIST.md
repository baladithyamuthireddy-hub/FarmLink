# FarmLink – Production Deployment & Operations Checklist
**Target Firebase Production Project:** `farmlink-production-bf431`  
**Application:** FarmLink Direct Farmer & Wholesaler Marketplace  
**Date:** November 3, 2026  
**Status:** Pre-Deployment Verification & Data Integrity Audit Complete (116 Tests Passed) — **Awaiting Operator Approval**

---

## 1. Phase 1: Pre-Deployment Verification (Completed & Validated)

Every pre-deployment safety, data integrity, and compatibility check has been validated locally:

- [x] **1.1 Pre-Upgrade Snapshot Created**: Full workspace archived in [`backups/pre_upgrade_backup_20261103/`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/backups/pre_upgrade_backup_20261103/) and [`backups/pre_sanitize_fix_20261103/`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/backups/pre_sanitize_fix_20261103/).
- [x] **1.2 Project Targeting Pinned**: Verified that [`.firebaserc`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/.firebaserc), [`firebase.json`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/firebase.json), and [`js/firebase-config.js`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/js/firebase-config.js) target `farmlink-production-bf431`.
- [x] **1.3 Crop Creation Error (`farmerName: undefined`) Resolved**: Root-cause diagnosed and fixed. Added `resolveFarmerName` (6-tier hierarchy) and pre-flight form checks in `farmer/add-crop.html`.
- [x] **1.4 Universal Firestore Data Sanitizer Implemented**: Implemented `validateAndSanitizeFirestoreDoc` in `js/storage.js` to strip `undefined` properties recursively and enforce numeric constraints.
- [x] **1.5 Complete Write Point Audit**: Audited and fortified all 14 Firestore write points across all 9 collections (`users`, `crops`, `offers`, `transactions`, `notifications`, `conversations`, `messages`, `reviews`, `market_prices`).
- [x] **1.6 Rules Delimiter & Lexical Balance**: `firestore.rules` and `storage.rules` passed delimiter balancing (39 braces, 300 parens, 15 brackets).
- [x] **1.7 Real Firestore Emulator Verification**: 58 live tests passed using `@firebase/rules-unit-testing` against Google's Cloud Firestore Emulator on `127.0.0.1:8089` (10 test suites, 100% pass rate).
- [x] **1.8 Static Rules & Asset Verification**: 58 automated tests passed covering 14 JS files and 36 HTML pages with 0 broken references (Suite 2).
- [x] **1.9 Transaction Status UI Remediation**: Replaced misleading `"Completed"` badges with dynamic status indicators (`"Deal Locked (Pending Payment & Delivery)"`), gated reviews behind fulfillment, and added status breakdowns to invoices.
- [x] **1.10 Legacy Data Compatibility**: Verified using synthetic legacy documents that existing users, crops, offers, and transactions are not blocked by the new rules.
- [x] **1.11 Query Index Safety**: Confirmed that all Firestore queries are single-field equality or ordering queries; zero composite indexes are required.
- [x] **1.12 Secret Exposure Audit**: Confirmed that zero private service account keys or secret credentials exist in frontend code.

---

## 2. Phase 2: Firebase Security Rules Deployment (Immediate, Zero Downtime)

These rules are fully compatible with both the Firebase Spark (Free) plan and the Blaze plan.

### Method A: Deploy via Firebase CLI
```powershell
# From the project root:
firebase deploy --only firestore:rules,storage --project farmlink-production-bf431
```

### Method B: Deploy via Firebase Console (Manual Alternative)
1. Open the [Firebase Console](https://console.firebase.google.com/) and select **`farmlink-production-bf431`**.
2. In the left navigation menu, expand **Build** > **Firestore Database** > **Rules** tab.
3. Copy the entire contents of [`firestore.rules`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/firestore.rules).
4. Paste into the Firestore rules editor and click **Publish**. (Global rollout takes ~10–30 seconds).
5. In the left navigation menu, expand **Build** > **Storage** > **Rules** tab.
6. Copy the entire contents of [`storage.rules`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/storage.rules).
7. Paste into the Storage rules editor and click **Publish**.

---

## 3. Phase 3: Frontend Web Deployment (Hosting)

### Option A: Deploy via Firebase Hosting
```powershell
firebase deploy --only hosting --project farmlink-production-bf431
```
*Note*: `firebase.json` is already configured to deploy the root directory while safely ignoring `.git`, `node_modules`, `functions/`, `backups/`, and `scratch/`.

### Option B: Deploy via Vercel
The workspace contains a production [`vercel.json`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/vercel.json) configuration:
```powershell
vercel --prod
```

---

## 4. Phase 4: Server-Side Cloud Functions Deployment (Requires Blaze Plan)

> [!IMPORTANT]
> The frontend currently executes transactions client-side. The Cloud Functions staged in `functions/` are an optional server-side upgrade that requires the **Firebase Blaze (Pay-as-you-go)** billing plan.

### 4.1 Upgrade to Blaze Plan & Set Budget Alert
1. In the [Firebase Console](https://console.firebase.google.com/), click **Upgrade** in the lower left corner and select **Blaze**.
2. In the [Google Cloud Billing Console](https://console.cloud.google.com/billing), set a monthly safety budget alert (e.g., ₹500 or \$5.00/month).

### 4.2 Deploy Backend Functions
```powershell
cd functions
npm install
cd ..
firebase deploy --only functions --project farmlink-production-bf431
```

### 4.3 Verify Active Function Triggers
Confirm the following three callable triggers appear in the Firebase Console under **Build** > **Functions**:
- `acceptOfferAndDeductInventory`
- `declarePayment`
- `confirmDelivery`

---

## 5. Phase 5: Post-Deployment Sanity Checks

Execute these post-deployment sanity checks in a production browser session:

1. **User Authentication Flow**:
   - Register a new farmer account.
   - Confirm the document is written to Firestore under `/users/{uid}` with `role: "farmer"`.
2. **Produce Marketplace Flow**:
   - In the Farmer portal, create a new produce listing.
   - In the Dealer portal, verify the listing appears in the marketplace.
3. **Negotiation & Turn-Taking Flow**:
   - Submit an initial bid as a wholesale dealer.
   - Submit a counter-offer as the farmer. Verify that out-of-turn counters cannot be submitted.
4. **Deal Acceptance & Status Verification**:
   - Accept the offer. Verify that the transaction is created under `/transactions/tx_{offerId}`.
   - Verify that the trade table displays the amber badge `"Deal Locked (Pending Payment & Delivery)"`.
   - Verify that the `"Rate & Review"` button displays `"Fulfillment Pending"`.
   - Open the receipt and verify the itemized status breakdown.
5. **Localization & Theme**:
   - Switch language to Telugu (తెలుగు) and verify all labels update.
   - Toggle Dark/Light mode and confirm state persistence across page refreshes.

---

## 6. Phase 6: Emergency Rollback Procedures

### 6.1 Instant Rules Rollback (Zero Downtime)
1. In the [Firebase Console](https://console.firebase.google.com/), go to **Firestore Database** > **Rules**.
2. Click **Rules History** in the upper right corner.
3. Select the prior version timestamp and click **Restore**. (Rollback propagates within 15 seconds).

### 6.2 Codebase Rollback
All pre-upgrade source files are preserved verbatim in [`backups/pre_upgrade_backup_20261103/`](file:///c:/Users/DELL/OneDrive/Documents/Antigravity%20Projects/FarmLink/backups/pre_upgrade_backup_20261103/).
To restore:
```powershell
Copy-Item -Path "backups\pre_upgrade_backup_20261103\*" -Destination "." -Recurse -Force
```
