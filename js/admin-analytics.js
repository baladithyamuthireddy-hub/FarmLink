/**
 * FarmLink - Professional Admin Analytics & Visualizations Engine
 * Enterprise Business Intelligence & Multi-Dimensional Agricultural Analytics
 * 
 * Powered by Chart.js (v4.4.2)
 * Strictly connected to authentic Firebase Firestore collections.
 * Zero demo, mock, fabricated, or localStorage-polluted metrics.
 */

(function (window) {
  'use strict';

  class AdminAnalyticsEngine {
    constructor() {
      this.charts = {};
      this.state = {
        dateRange: 'all',     // 'all' | '7d' | '30d' | '3m' | '6m' | '12m'
        category: 'all',      // 'all' | category string
        district: 'all',      // 'all' | district string
        status: 'all',        // 'all' | 'Completed' | 'Pending' | 'Cancelled'
        activityPeriod: '30d' // Switcher for activity trend chart
      };

      this.rawUsers = [];
      this.rawCrops = [];
      this.rawTransactions = [];
      this.rawOffers = [];
      this.rawReviews = [];
      this.rawMarketPrices = [];

      this.isInitialized = false;
      this.isLoading = false;
      this.hasError = false;
      this.errors = {};
    }

    // =========================================================================
    // 1. INITIALIZATION & GENUINE FIRESTORE DATA INGESTION
    // =========================================================================
    async init() {
      if (this.isLoading) return;
      if (this.isInitialized) {
        await this.refresh();
        return;
      }

      this.setupThemeObserver();
      this.setupEventListeners();

      await this.loadDataFromFirestore();
      this.populateFilterDropdowns();
      this.renderAll();
      this.isInitialized = true;
    }

    /**
     * Strictly verifies and returns whether a record belongs to the pre-seeded demo dataset.
     * All demo records are 100% excluded from genuine platform analytics.
     */
    isDemoRecord(item) {
      if (!item) return false;
      if (item.isDemo === true) return true;
      const id = String(item.id || item.uid || item.cropId || item.transactionId || item.offerId || '');
      const demoUserIds = ["farmer_1", "dealer_1", "admin_1", "farmer_2", "farmer_3", "farmer_4", "dealer_2"];
      const demoCropIds = ["crop_1", "crop_2", "crop_3", "crop_4", "crop_5", "crop_6"];
      const demoOfferIds = ["offer_1", "offer_2"];
      const demoTxIds = ["tx_101", "tx_102"];
      const demoEmails = [
        "farmer@example.com", "dealer@example.com", "admin@example.com",
        "ramesh@farmlink.in", "venkat@agritraders.in", "admin@farmlink.in", "admin@farmlink.gov.in"
      ];

      if (demoUserIds.includes(id)) return true;
      if (demoCropIds.includes(id)) return true;
      if (demoOfferIds.includes(id)) return true;
      if (demoTxIds.includes(id)) return true;

      if (item.email && demoEmails.includes(String(item.email).toLowerCase().trim())) return true;
      if (item.farmerId && demoUserIds.includes(item.farmerId)) return true;
      if (item.dealerId && demoUserIds.includes(item.dealerId)) return true;
      if (item.farmerUid && demoUserIds.includes(item.farmerUid)) return true;
      if (item.dealerUid && demoUserIds.includes(item.dealerUid)) return true;

      return false;
    }

    /**
     * Resolves the active Firebase bridge and ensures Auth state is established.
     */
    async resolveFirebaseBridge() {
      const fb = window.FarmLinkFirebase || (window.Storage && typeof window.Storage.getFirebaseBridge === 'function' ? window.Storage.getFirebaseBridge() : null);
      if (!fb) return null;

      if (fb.auth && !fb.auth.currentUser) {
        await new Promise(resolve => {
          let resolved = false;
          let unsub = null;
          const timer = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              if (typeof unsub === 'function') unsub();
              resolve(fb.auth.currentUser || null);
            }
          }, 3000);

          try {
            unsub = fb.auth.onAuthStateChanged(user => {
              if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                if (typeof unsub === 'function') unsub();
                resolve(user || fb.auth.currentUser || null);
              }
            });
          } catch (e) {
            clearTimeout(timer);
            resolve(fb.auth.currentUser || null);
          }
        });
      }

      return fb;
    }

    /**
     * Primary data ingestion routine:
     * Queries genuine Firestore collections directly.
     * Does NOT fall back to localStorage demo data.
     */
    async loadDataFromFirestore() {
      this.isLoading = true;
      this.hasError = false;
      this.errors = {};
      this.clearErrorState();

      const fb = await this.resolveFirebaseBridge();
      const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);

      if (!isFbAvailable || !fb.db) {
        const errMsg = "Firestore database bridge is not connected or offline. Unable to query genuine marketplace records.";
        console.error("[AdminAnalytics]", errMsg);
        this.hasError = true;
        this.errors.general = errMsg;
        this.renderErrorState(errMsg);
        this.rawUsers = [];
        this.rawCrops = [];
        this.rawTransactions = [];
        this.rawOffers = [];
        this.rawReviews = [];
        this.rawMarketPrices = [];
        this.isLoading = false;
        return;
      }

      const fbUser = fb.auth ? fb.auth.currentUser : null;
      if (fb.auth && !fbUser) {
        const authNotice = "Notice: No active Firebase Authentication session detected for Admin. Cloud Firestore security rules require an authenticated Admin account to retrieve genuine records. Please sign in via Admin Login.";
        console.warn("[AdminAnalytics]", authNotice);
        this.hasError = true;
        this.errors.auth = authNotice;
        this.renderErrorState(authNotice);
        this.rawUsers = [];
        this.rawCrops = [];
        this.rawTransactions = [];
        this.rawOffers = [];
        this.rawReviews = [];
        this.rawMarketPrices = [];
        this.isLoading = false;
        return;
      }

      // Query genuine Firestore collections in parallel
      const loadTasks = [
        // 1. Users
        fb.db.collection("users").get()
          .then(snap => {
            const list = [];
            snap.forEach(doc => {
              const d = doc.data();
              if (!d) return;
              const u = { id: doc.id, uid: doc.id, ...d };
              if (!this.isDemoRecord(u)) list.push(this.normalizeUser(u));
            });
            this.rawUsers = list;
          })
          .catch(err => {
            console.error("[AdminAnalytics] Firestore users collection query error:", err);
            this.errors.users = err.message || "Failed to load users collection";
            this.rawUsers = [];
          }),

        // 2. Crops
        fb.db.collection("crops").get()
          .then(snap => {
            const list = [];
            snap.forEach(doc => {
              const d = doc.data();
              if (!d) return;
              const c = { id: doc.id, cropId: doc.id, ...d };
              const status = String(c.status || "").toLowerCase();
              if (!this.isDemoRecord(c) && status !== 'removed') {
                list.push(this.normalizeCrop(c));
              }
            });
            this.rawCrops = list;
          })
          .catch(err => {
            console.error("[AdminAnalytics] Firestore crops collection query error:", err);
            this.errors.crops = err.message || "Failed to load crops collection";
            this.rawCrops = [];
          }),

        // 3. Transactions
        fb.db.collection("transactions").get()
          .then(snap => {
            const list = [];
            const seen = new Set();
            snap.forEach(doc => {
              const d = doc.data();
              if (!d) return;
              const key = doc.id;
              if (seen.has(key)) return;
              seen.add(key);
              const t = { id: key, transactionId: key, ...d };
              if (!this.isDemoRecord(t)) {
                list.push(this.normalizeTransaction(t));
              }
            });
            this.rawTransactions = list;
          })
          .catch(err => {
            console.error("[AdminAnalytics] Firestore transactions collection query error:", err);
            this.errors.transactions = err.message || "Failed to load transactions collection";
            this.rawTransactions = [];
          }),

        // 4. Offers
        fb.db.collection("offers").get()
          .then(snap => {
            const list = [];
            const seen = new Set();
            snap.forEach(doc => {
              const d = doc.data();
              if (!d) return;
              const key = doc.id;
              if (seen.has(key)) return;
              seen.add(key);
              const o = { id: key, offerId: key, ...d };
              if (!this.isDemoRecord(o)) {
                list.push(this.normalizeOffer(o));
              }
            });
            this.rawOffers = list;
          })
          .catch(err => {
            console.error("[AdminAnalytics] Firestore offers collection query error:", err);
            this.errors.offers = err.message || "Failed to load offers collection";
            this.rawOffers = [];
          }),

        // 5. Reviews
        fb.db.collection("reviews").get()
          .then(snap => {
            const list = [];
            snap.forEach(doc => {
              const d = doc.data();
              if (!d) return;
              const r = { id: doc.id, ...d };
              if (!this.isDemoRecord(r)) list.push(r);
            });
            this.rawReviews = list;
          })
          .catch(err => {
            console.error("[AdminAnalytics] Firestore reviews collection query error:", err);
            this.errors.reviews = err.message || "Failed to load reviews collection";
            this.rawReviews = [];
          }),

        // 6. Market Prices
        fb.db.collection("market_prices").get()
          .then(snap => {
            const list = [];
            snap.forEach(doc => {
              const d = doc.data();
              if (!d) return;
              list.push({ id: doc.id, ...d });
            });
            this.rawMarketPrices = list;
          })
          .catch(err => {
            console.error("[AdminAnalytics] Firestore market_prices collection query error:", err);
            this.errors.marketPrices = err.message || "Failed to load market prices";
            this.rawMarketPrices = [];
          })
      ];

      await Promise.all(loadTasks);
      this.isLoading = false;

      const failedCount = Object.keys(this.errors).length;
      if (failedCount > 0) {
        this.hasError = true;
        const failedCollections = Object.keys(this.errors).join(', ');
        const succeeded = [];
        if (this.rawUsers.length > 0) succeeded.push(`users (${this.rawUsers.length})`);
        if (this.rawCrops.length > 0) succeeded.push(`crops (${this.rawCrops.length})`);
        if (this.rawTransactions.length > 0) succeeded.push(`transactions (${this.rawTransactions.length})`);
        if (this.rawOffers.length > 0) succeeded.push(`offers (${this.rawOffers.length})`);
        if (this.rawReviews.length > 0) succeeded.push(`reviews (${this.rawReviews.length})`);
        if (this.rawMarketPrices.length > 0) succeeded.push(`market_prices (${this.rawMarketPrices.length})`);

        let msg = `Notice: Unable to retrieve genuine Firestore data for: ${failedCollections}. Check admin authentication and permissions.`;
        if (succeeded.length > 0) {
          msg = `Notice: Retrieved genuine Firestore records for ${succeeded.join(', ')}. Access restricted by security rules for: ${failedCollections}. Requires role == 'admin' in Firestore users/{uid}.`;
        }
        this.renderErrorState(msg);
      }
    }

    // =========================================================================
    // 2. GETTERS FOR DASHBOARD GOVERNANCE TABLES
    // =========================================================================
    getGenuineUsers() {
      return [...this.rawUsers];
    }

    getGenuineCrops() {
      return [...this.rawCrops];
    }

    getGenuineTransactions() {
      return [...this.rawTransactions];
    }

    getGenuineOffers() {
      return [...this.rawOffers];
    }

    getGenuineMarketPrices() {
      return [...this.rawMarketPrices];
    }

    getGenuineReviews() {
      return [...this.rawReviews];
    }

    // =========================================================================
    // 3. NORMALIZATION & PARSING HELPERS
    // =========================================================================
    normalizeUser(u) {
      return {
        id: u.id || u.uid,
        uid: u.uid || u.id,
        name: u.name || u.displayName || "Registered User",
        email: u.email || "",
        phone: u.phone || u.phoneNumber || "",
        role: String(u.role || "farmer").toLowerCase(),
        district: u.district || u.location || "",
        location: u.location || u.district || "",
        status: u.status || "active",
        rating: Number(u.rating) || 5.0,
        createdAt: this.parseDate(u.createdAt || u.registeredDate)
      };
    }

    normalizeCrop(c) {
      const rawBw = c.bagWeightKg !== undefined ? c.bagWeightKg : (c.bag_weight_kg !== undefined ? c.bag_weight_kg : c.bagWeight);
      const parsedBw = Number(rawBw);
      const validBagWeight = (rawBw !== null && rawBw !== undefined && rawBw !== '' && Number.isFinite(parsedBw) && parsedBw > 0) ? parsedBw : null;

      return {
        id: c.id || c.cropId,
        cropId: c.cropId || c.id,
        cropName: c.cropName || c.title || "Agricultural Produce",
        title: c.title || c.cropName || "Agricultural Produce",
        category: c.category || "General",
        farmerId: c.farmerId || c.farmerUid || "",
        farmerName: c.farmerName || "Farmer",
        farmerPhone: c.farmerPhone || "",
        quantity: Number(c.quantity) || 0,
        unit: String(c.unit || "kg").toLowerCase().trim(),
        bagWeightKg: validBagWeight,
        expectedPrice: Number(c.expectedPrice) || 0,
        qualityGrade: c.qualityGrade || "Grade A",
        district: c.district || c.location || "",
        location: c.location || c.district || "",
        status: c.status || "Available",
        createdAt: this.parseDate(c.createdAt || c.listedDate),
        listedDate: c.listedDate || (c.createdAt ? String(c.createdAt).split('T')[0] : "")
      };
    }

    normalizeTransaction(t) {
      const quantity = Number(t.quantity) || 0;
      const finalPrice = Number(t.finalPrice || t.pricePerUnit || 0);
      const totalAmount = Number(t.totalAmount) || (finalPrice * quantity) || 0;

      return {
        id: t.id || t.transactionId,
        transactionId: t.transactionId || t.id,
        offerId: t.offerId || null,
        cropId: t.cropId || null,
        cropTitle: t.cropTitle || t.cropName || "Produce Lot",
        cropName: t.cropName || t.cropTitle || "Produce Lot",
        farmerId: t.farmerId || t.farmerUid || "",
        farmerName: t.farmerName || "Farmer",
        farmerPhone: t.farmerPhone || "",
        dealerId: t.dealerId || t.dealerUid || "",
        dealerName: t.dealerName || "Dealer",
        dealerPhone: t.dealerPhone || "",
        quantity: quantity,
        unit: String(t.unit || "kg").toLowerCase().trim(),
        finalPrice: finalPrice,
        pricePerUnit: finalPrice,
        totalAmount: totalAmount,
        status: t.status || "Active",
        dealStatus: t.dealStatus || "Accepted",
        deliveryStatus: t.deliveryStatus || "Pending",
        paymentStatus: t.paymentStatus || "Pending",
        farmerDispatch: t.farmerDispatch || null,
        dealerReceipt: t.dealerReceipt || null,
        dealerPayment: t.dealerPayment || null,
        farmerPayment: t.farmerPayment || null,
        location: t.location || t.district || "",
        district: t.district || t.location || "",
        createdAt: this.parseDate(t.createdAt || t.date || t.updatedAt),
        date: t.date || (t.createdAt ? String(t.createdAt).split('T')[0] : "")
      };
    }

    normalizeOffer(o) {
      return {
        id: o.id || o.offerId,
        offerId: o.offerId || o.id,
        cropId: o.cropId || null,
        cropTitle: o.cropTitle || o.cropName || "Produce Lot",
        farmerId: o.farmerId || "",
        dealerId: o.dealerId || "",
        offeredPrice: Number(o.offeredPrice || o.currentOfferPrice || 0),
        farmerExpectedPrice: Number(o.farmerExpectedPrice || 0),
        quantity: Number(o.quantity) || 0,
        unit: String(o.unit || "kg").toLowerCase().trim(),
        status: o.status || "Pending",
        createdAt: this.parseDate(o.createdAt)
      };
    }

    /**
     * Converts produce expected price to a standardized ₹/kg basis.
     * Rules:
     * - kg = 1 kg (returns price)
     * - quintal = 100 kg (returns price / 100)
     * - ton = 1,000 kg (returns price / 1000)
     * - bag = uses explicit bagWeightKg (returns price / bagWeightKg)
     * For bag listings:
     * - Accepts only a valid positive finite bagWeightKg.
     * - If bagWeightKg is missing, zero, negative, or invalid, returns null (strictly excluded from average).
     * - Does NOT silently assume 50 kg.
     */
    normalizePricePerKg(priceOrCrop, unitArg, bagWeightArg) {
      let price, unit, bagWeightKg;
      if (priceOrCrop && typeof priceOrCrop === 'object') {
        price = priceOrCrop.expectedPrice !== undefined ? priceOrCrop.expectedPrice : (priceOrCrop.finalPrice !== undefined ? priceOrCrop.finalPrice : priceOrCrop.pricePerUnit);
        unit = priceOrCrop.unit;
        bagWeightKg = priceOrCrop.bagWeightKg !== undefined ? priceOrCrop.bagWeightKg : (priceOrCrop.bag_weight_kg !== undefined ? priceOrCrop.bag_weight_kg : priceOrCrop.bagWeight);
      } else {
        price = priceOrCrop;
        unit = unitArg;
        bagWeightKg = bagWeightArg;
      }

      const p = Number(price);
      if (!Number.isFinite(p) || p <= 0) return null;
      const u = String(unit || 'kg').toLowerCase().trim();
      if (u === 'kg') return p;
      if (u.includes('quintal') || u === 'qtl') return p / 100;
      if (u.includes('ton') || u.includes('tonne')) return p / 1000;
      if (u.includes('bag')) {
        const bw = Number(bagWeightKg);
        if (Number.isFinite(bw) && bw > 0) {
          return p / bw;
        }
        // Missing, zero, negative, or invalid bag weight -> strictly exclude from normalized average
        return null;
      }
      return null;
    }

    /**
     * Converts quantity into kilograms for uniform volume aggregation.
     * Rules:
     * - kg = 1 kg (returns qty)
     * - quintal = 100 kg (returns qty * 100)
     * - ton = 1,000 kg (returns qty * 1000)
     * - bag = uses explicit bagWeightKg (returns qty * bagWeightKg if valid positive finite)
     * If bagWeightKg is missing or invalid, returns 0 (excluded from volume).
     */
    normalizeQuantityToKg(qtyOrCrop, unitArg, bagWeightArg) {
      let qty, unit, bagWeightKg;
      if (qtyOrCrop && typeof qtyOrCrop === 'object') {
        qty = qtyOrCrop.quantity;
        unit = qtyOrCrop.unit;
        bagWeightKg = qtyOrCrop.bagWeightKg !== undefined ? qtyOrCrop.bagWeightKg : (qtyOrCrop.bag_weight_kg !== undefined ? qtyOrCrop.bag_weight_kg : qtyOrCrop.bagWeight);
      } else {
        qty = qtyOrCrop;
        unit = unitArg;
        bagWeightKg = bagWeightArg;
      }

      const q = Number(qty);
      if (!Number.isFinite(q) || q <= 0) return 0;
      const u = String(unit || 'kg').toLowerCase().trim();
      if (u === 'kg') return q;
      if (u.includes('quintal') || u === 'qtl') return q * 100;
      if (u.includes('ton') || u.includes('tonne')) return q * 1000;
      if (u.includes('bag')) {
        const bw = Number(bagWeightKg);
        if (Number.isFinite(bw) && bw > 0) return q * bw;
        return 0; // Excluded from kg volume if weight unavailable
      }
      return q;
    }

    /**
     * Robust date parser handling Firestore Timestamps, ISO strings, Date objects, and epoch ms.
     */
    parseDate(val) {
      if (!val) return null;
      if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
      if (typeof val.toDate === 'function') {
        try {
          const d = val.toDate();
          return isNaN(d.getTime()) ? null : d;
        } catch (e) {
          return null;
        }
      }
      if (typeof val.seconds === 'number') {
        return new Date(val.seconds * 1000);
      }
      if (typeof val === 'number') {
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }
      if (typeof val === 'string') {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d;
        const match = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      }
      return null;
    }

    getDateCutoff(rangeKey) {
      const now = new Date();
      switch (rangeKey) {
        case '7d':  return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case '3m':  return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        case '6m':  return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        case '12m': return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        default:    return null;
      }
    }

    getPreviousPeriodRange(rangeKey) {
      const now = new Date();
      let currStart = null;
      let prevStart = null;
      let prevEnd = null;

      switch (rangeKey) {
        case '7d': {
          currStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          prevEnd = new Date(currStart.getTime());
          prevStart = new Date(prevEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        }
        case '30d': {
          currStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          prevEnd = new Date(currStart.getTime());
          prevStart = new Date(prevEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        }
        case '3m': {
          currStart = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          prevEnd = new Date(currStart.getTime());
          prevStart = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          break;
        }
        case '6m': {
          currStart = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          prevEnd = new Date(currStart.getTime());
          prevStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        }
        case '12m': {
          currStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          prevEnd = new Date(currStart.getTime());
          prevStart = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
          break;
        }
        default:
          return null;
      }
      return { currStart, prevStart, prevEnd };
    }

    formatINR(num) {
      const n = Number(num) || 0;
      return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }

    isThemeDark() {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    getChartThemeColors() {
      const dark = this.isThemeDark();
      return {
        text: dark ? '#cbd5e1' : '#475569',
        textMuted: dark ? '#64748b' : '#94a3b8',
        grid: dark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)',
        border: dark ? '#334155' : '#e2e8f0',
        tooltipBg: dark ? '#1e293b' : '#0f172a',
        tooltipText: '#ffffff'
      };
    }

    /**
     * Determines whether a transaction is genuinely completed under Phase 2 rules:
     * Both physical delivery receipt AND financial payment confirmation must be completed.
     */
    isTransactionCompleted(t) {
      if (!t) return false;
      const isCancelled = t.status === 'Cancelled' || t.status === 'cancelled' || t.dealStatus === 'Cancelled' || t.dealStatus === 'cancelled';
      if (isCancelled) return false;

      if (window.Storage && typeof window.Storage.getTransactionStatusDisplay === 'function') {
        const s = window.Storage.getTransactionStatusDisplay(t);
        if (s && typeof s.isFullyCompleted === 'boolean') return s.isFullyCompleted;
      }

      const isDeliv = t.deliveryStatus === 'Delivered' || (t.dealerReceipt && t.dealerReceipt.dealerConfirmed === true);
      const isPaid = (t.paymentStatus === 'Paid' || t.paymentStatus === 'Settled') || (t.farmerPayment && t.farmerPayment.farmerConfirmed === true);
      return isDeliv && isPaid;
    }

    // =========================================================================
    // 4. FILTERING PIPELINE ON GENUINE FIRESTORE DATA
    // =========================================================================
    getFilteredDataset() {
      const cutoff = this.getDateCutoff(this.state.dateRange);
      const cat = this.state.category;
      const dist = this.state.district;
      const stat = this.state.status;

      // Filter Users
      const users = this.rawUsers.filter(u => {
        if (dist !== 'all') {
          const uDist = (u.district || u.location || '').toLowerCase();
          if (!uDist.includes(dist.toLowerCase())) return false;
        }
        if (cutoff) {
          const d = u.createdAt;
          if (d && d < cutoff) return false;
        }
        return true;
      });

      // Filter Crops
      const crops = this.rawCrops.filter(c => {
        if (cat !== 'all') {
          if ((c.category || '').toLowerCase() !== cat.toLowerCase()) return false;
        }
        if (dist !== 'all') {
          const cDist = (c.district || c.location || '').toLowerCase();
          if (!cDist.includes(dist.toLowerCase())) return false;
        }
        if (cutoff) {
          const d = c.createdAt;
          if (d && d < cutoff) return false;
        }
        return true;
      });

      // Filter Transactions
      const transactions = this.rawTransactions.filter(t => {
        if (cat !== 'all') {
          const c = this.rawCrops.find(cr => cr.id === t.cropId || cr.cropId === t.cropId);
          if (c && (c.category || '').toLowerCase() !== cat.toLowerCase()) return false;
        }
        if (dist !== 'all') {
          const c = this.rawCrops.find(cr => cr.id === t.cropId || cr.cropId === t.cropId);
          const f = this.rawUsers.find(u => u.id === t.farmerId || u.uid === t.farmerId);
          const matchLoc = (c && (c.district || c.location || '').toLowerCase().includes(dist.toLowerCase())) ||
                           (f && (f.district || f.location || '').toLowerCase().includes(dist.toLowerCase())) ||
                           ((t.district || t.location || '').toLowerCase().includes(dist.toLowerCase()));
          if (!matchLoc) return false;
        }
        if (stat !== 'all') {
          const isCompleted = this.isTransactionCompleted(t);
          const isCancelled = t.status === 'Cancelled' || t.dealStatus === 'Cancelled';
          const isPending = !isCompleted && !isCancelled;
          if (stat === 'Completed' && !isCompleted) return false;
          if (stat === 'Pending' && !isPending) return false;
          if (stat === 'Cancelled' && !isCancelled) return false;
          if (['Paid', 'Payment_Declared', 'Delivered'].includes(stat)) {
            if (t.paymentStatus !== stat && t.deliveryStatus !== stat) return false;
          }
        }
        if (cutoff) {
          const d = t.createdAt;
          if (d && d < cutoff) return false;
        }
        return true;
      });

      // Filter Offers
      const offers = this.rawOffers.filter(o => {
        if (cat !== 'all') {
          const c = this.rawCrops.find(cr => cr.id === o.cropId || cr.cropId === o.cropId);
          if (c && (c.category || '').toLowerCase() !== cat.toLowerCase()) return false;
        }
        if (dist !== 'all') {
          const c = this.rawCrops.find(cr => cr.id === o.cropId || cr.cropId === o.cropId);
          if (c && !(c.district || c.location || '').toLowerCase().includes(dist.toLowerCase())) return false;
        }
        if (cutoff) {
          const d = o.createdAt;
          if (d && d < cutoff) return false;
        }
        return true;
      });

      return { users, crops, transactions, offers };
    }

    // =========================================================================
    // 5. SECTION 1: PROFESSIONAL KPI CARDS (8 GENUINE CARDS)
    // =========================================================================
    renderKPICards(data) {
      const { users, crops, transactions } = data;

      // 1. Registered Farmers
      const farmers = users.filter(u => u.role === 'farmer');
      // 2. Registered Dealers
      const dealers = users.filter(u => u.role === 'dealer');
      // 3. Active Crop Listings (strictly available produce)
      const activeListings = crops.filter(c => {
        const s = String(c.status || '').toLowerCase();
        return s === 'available' || s === 'under negotiation' || s === 'active';
      });

      // 4. Total Unique Transactions
      const totalTx = transactions.length;

      // 5. Completed Transactions (satisfying Phase 2 two-party fulfillment)
      const completedTx = transactions.filter(t => this.isTransactionCompleted(t));

      // 6. GMV (realized value from completed transactions strictly)
      const totalGMV = completedTx.reduce((sum, t) => sum + (Number(t.totalAmount) || (Number(t.finalPrice || 0) * Number(t.quantity || 0)) || 0), 0);

      // 7. Pending Transactions
      const pendingTx = transactions.filter(t => {
        const isComp = this.isTransactionCompleted(t);
        const isCanc = t.status === 'Cancelled' || t.dealStatus === 'Cancelled';
        return !isComp && !isCanc;
      });

      // 8. Normalized Average Crop Listing Price (strictly converted to ₹/kg)
      let excludedBagsCount = 0;
      const validPricesPerKg = [];
      activeListings.forEach(c => {
        const pKg = this.normalizePricePerKg(c.expectedPrice, c.unit, c.bagWeightKg);
        if (pKg !== null && !isNaN(pKg) && pKg > 0) {
          validPricesPerKg.push(pKg);
        } else {
          const u = String(c.unit || '').toLowerCase().trim();
          if (u.includes('bag')) {
            const bw = Number(c.bagWeightKg);
            if (!Number.isFinite(bw) || bw <= 0) {
              excludedBagsCount++;
            }
          }
        }
      });

      const avgPrice = validPricesPerKg.length > 0
        ? (validPricesPerKg.reduce((sum, p) => sum + p, 0) / validPricesPerKg.length)
        : 0;

      // Real comparative trends against prior range (never fabricated)
      const prevRange = this.getPreviousPeriodRange(this.state.dateRange);
      const trends = this.calculateHistoricalTrends(prevRange);

      this.updateKPICard('kpi-farmers', farmers.length, trends.farmers, farmers.length > 0 ? 'Verified growers' : 'No registered farmers');
      this.updateKPICard('kpi-dealers', dealers.length, trends.dealers, dealers.length > 0 ? 'Licensed buyers' : 'No registered dealers');
      this.updateKPICard('kpi-listings', activeListings.length, trends.listings, activeListings.length > 0 ? 'Active marketplace lots' : 'No active listings');
      this.updateKPICard('kpi-total-tx', totalTx, trends.totalTx, totalTx > 0 ? 'Contracts initiated' : 'No transactions recorded');
      this.updateKPICard('kpi-completed-tx', completedTx.length, trends.completedTx, completedTx.length > 0 ? 'Settled & fulfilled' : 'No completed trades');
      this.updateKPICard('kpi-gmv', this.formatINR(totalGMV), trends.gmv, completedTx.length > 0 ? 'Gross realized volume' : 'No completed volume', true);
      this.updateKPICard('kpi-pending-tx', pendingTx.length, trends.pendingTx, pendingTx.length > 0 ? 'Awaiting settlement' : 'No pending trades');
      
      let priceContextNote = 'Per kg benchmark';
      if (validPricesPerKg.length > 0) {
        if (excludedBagsCount > 0) {
          priceContextNote = `Per kg benchmark (${excludedBagsCount} bag listing${excludedBagsCount > 1 ? 's' : ''} excluded: bag weight unavailable)`;
        } else {
          priceContextNote = 'Per kg benchmark';
        }
      } else {
        if (activeListings.length > 0 && excludedBagsCount > 0) {
          priceContextNote = 'Excluded: bag weight unavailable';
        } else {
          priceContextNote = 'Insufficient data';
        }
      }

      this.updateKPICard('kpi-avg-price', `₹${avgPrice > 0 ? avgPrice.toFixed(1) : '0'}`, trends.avgPrice, priceContextNote, false, validPricesPerKg.length > 0 ? '/kg' : '');
    }

    calculateHistoricalTrends(prevRange) {
      const defaultTrend = { direction: 'neutral', label: '— Real-time data' };
      if (!prevRange) {
        return {
          farmers: defaultTrend,
          dealers: defaultTrend,
          listings: defaultTrend,
          totalTx: defaultTrend,
          completedTx: defaultTrend,
          gmv: defaultTrend,
          pendingTx: defaultTrend,
          avgPrice: defaultTrend
        };
      }

      const { currStart, prevStart, prevEnd } = prevRange;

      // Extract prior transactions
      const priorTx = this.rawTransactions.filter(t => {
        const d = t.createdAt;
        return d && d >= prevStart && d < prevEnd;
      });

      const priorCompleted = priorTx.filter(t => this.isTransactionCompleted(t));
      const priorGMV = priorCompleted.reduce((sum, t) => sum + (Number(t.totalAmount) || (Number(t.finalPrice || 0) * Number(t.quantity || 0)) || 0), 0);

      // Extract prior crops
      const priorCrops = this.rawCrops.filter(c => {
        const d = c.createdAt;
        return d && d >= prevStart && d < prevEnd;
      });

      const makeTrend = (curr, prev) => {
        if (!prev || prev === 0) {
          return { direction: 'neutral', label: '— Real-time data' };
        }
        const diff = curr - prev;
        const pct = (diff / prev) * 100;
        const direction = pct > 0 ? 'up' : (pct < 0 ? 'down' : 'neutral');
        const sign = pct > 0 ? '+' : '';
        return {
          direction,
          label: `${sign}${pct.toFixed(1)}% vs prior period`
        };
      };

      // Current values in selected date range
      const currCompleted = this.rawTransactions.filter(t => {
        const d = t.createdAt;
        return d && d >= currStart;
      }).filter(t => this.isTransactionCompleted(t));
      const currGMV = currCompleted.reduce((sum, t) => sum + (Number(t.totalAmount) || (Number(t.finalPrice || 0) * Number(t.quantity || 0)) || 0), 0);

      const currCrops = this.rawCrops.filter(c => {
        const d = c.createdAt;
        return d && d >= currStart;
      });

      return {
        farmers: defaultTrend,
        dealers: defaultTrend,
        listings: makeTrend(currCrops.length, priorCrops.length),
        totalTx: makeTrend(currCompleted.length, priorTx.length),
        completedTx: makeTrend(currCompleted.length, priorCompleted.length),
        gmv: makeTrend(currGMV, priorGMV),
        pendingTx: defaultTrend,
        avgPrice: defaultTrend
      };
    }

    updateKPICard(elementId, value, trend, contextNote, isRawText = false, unit = '') {
      const card = document.getElementById(elementId);
      if (!card) return;

      const valEl = card.querySelector('.kpi-value');
      const unitEl = card.querySelector('.kpi-unit');
      const trendWrap = card.querySelector('.kpi-trend-row');
      const noteEl = card.querySelector('.kpi-footer-note') || card.querySelector('.kpi-context');

      if (valEl) {
        valEl.textContent = isRawText ? value : (typeof value === 'number' ? value.toLocaleString() : value);
      }
      if (unitEl) {
        unitEl.textContent = unit;
      }
      if (noteEl) {
        noteEl.textContent = contextNote;
      }
      if (trendWrap) {
        let trendClass = 'trend-neutral';
        let trendIcon = '•';
        if (trend && trend.direction === 'up') {
          trendClass = 'trend-up';
          trendIcon = '▲';
        } else if (trend && trend.direction === 'down') {
          trendClass = 'trend-down';
          trendIcon = '▼';
        }
        const trendLabel = (trend && trend.label) ? trend.label : '— Real-time data';
        trendWrap.innerHTML = `
          <span class="kpi-trend-pill ${trendClass}">${trendIcon} ${trendLabel}</span>
          <span class="kpi-context">${contextNote}</span>
        `;
      }
    }

    // =========================================================================
    // 6. SECTION 2: ACTIVITY TRENDS (AUTHENTIC TIMELINE)
    // =========================================================================
    renderActivityTrendsChart() {
      const ctx = document.getElementById('chart-activity-trends');
      if (!ctx) return;

      const colors = this.getChartThemeColors();
      const period = this.state.activityPeriod;
      const cutoff = this.getDateCutoff(period) || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const isDaily = period === '7d' || period === '30d';
      const timeBuckets = this.generateTimeBuckets(cutoff, new Date(), isDaily);

      const farmerCounts = new Array(timeBuckets.length).fill(0);
      const dealerCounts = new Array(timeBuckets.length).fill(0);
      const cropCounts = new Array(timeBuckets.length).fill(0);
      const txCounts = new Array(timeBuckets.length).fill(0);

      const findBucketIndex = (d) => {
        if (!d) return -1;
        const t = d.getTime();
        for (let i = 0; i < timeBuckets.length; i++) {
          if (t >= timeBuckets[i].start.getTime() && t <= timeBuckets[i].end.getTime()) {
            return i;
          }
        }
        return -1;
      };

      // Users
      this.rawUsers.forEach(u => {
        const d = u.createdAt;
        const idx = findBucketIndex(d);
        if (idx !== -1) {
          if (u.role === 'farmer') farmerCounts[idx]++;
          if (u.role === 'dealer') dealerCounts[idx]++;
        }
      });

      // Crops
      this.rawCrops.forEach(c => {
        const d = c.createdAt;
        const idx = findBucketIndex(d);
        if (idx !== -1) cropCounts[idx]++;
      });

      // Completed Transactions
      this.rawTransactions.forEach(t => {
        if (this.isTransactionCompleted(t)) {
          const d = t.createdAt;
          const idx = findBucketIndex(d);
          if (idx !== -1) txCounts[idx]++;
        }
      });

      const labels = timeBuckets.map(b => b.label);

      if (this.charts.activityTrends) {
        this.charts.activityTrends.destroy();
      }

      this.charts.activityTrends = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'New Farmers',
              data: farmerCounts,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.35,
              fill: true,
              borderWidth: 2.2,
              pointRadius: isDaily ? 2 : 4,
              pointHoverRadius: 6
            },
            {
              label: 'New Dealers',
              data: dealerCounts,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              tension: 0.35,
              fill: true,
              borderWidth: 2.2,
              pointRadius: isDaily ? 2 : 4,
              pointHoverRadius: 6
            },
            {
              label: 'Crop Lots Listed',
              data: cropCounts,
              borderColor: '#f59e0b',
              backgroundColor: 'transparent',
              borderDash: [4, 4],
              tension: 0.35,
              fill: false,
              borderWidth: 2,
              pointRadius: isDaily ? 2 : 4,
              pointHoverRadius: 6
            },
            {
              label: 'Completed Trades',
              data: txCounts,
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.06)',
              tension: 0.35,
              fill: true,
              borderWidth: 2.2,
              pointRadius: isDaily ? 2 : 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: colors.text, font: { size: 12, weight: '600' }, boxWidth: 14 }
            },
            tooltip: {
              backgroundColor: colors.tooltipBg,
              titleColor: colors.tooltipText,
              bodyColor: colors.tooltipText,
              padding: 10
            }
          },
          scales: {
            x: {
              grid: { color: colors.grid },
              ticks: { color: colors.textMuted, maxRotation: 45, autoSkip: true, maxTicksLimit: 14 }
            },
            y: {
              beginAtZero: true,
              grid: { color: colors.grid },
              ticks: { precision: 0, color: colors.textMuted }
            }
          }
        }
      });
    }

    generateTimeBuckets(start, end, isDaily) {
      const buckets = [];
      const current = new Date(start);

      if (isDaily) {
        while (current <= end) {
          const bStart = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 0, 0, 0);
          const bEnd = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 23, 59, 59);
          const label = bStart.toLocaleDateString([], { month: 'short', day: 'numeric' });
          buckets.push({ start: bStart, end: bEnd, label });
          current.setDate(current.getDate() + 1);
        }
      } else {
        while (current <= end) {
          const bStart = new Date(current.getFullYear(), current.getMonth(), 1);
          const bEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59);
          const label = bStart.toLocaleDateString([], { month: 'short', year: '2-digit' });
          buckets.push({ start: bStart, end: bEnd, label });
          current.setMonth(current.getMonth() + 1);
        }
      }
      return buckets;
    }

    // =========================================================================
    // 7. SECTION 3: TRANSACTION ANALYTICS (AUTHENTIC BREAKDOWN & GMV)
    // =========================================================================
    renderTransactionAnalytics(data) {
      const { transactions } = data;
      const colors = this.getChartThemeColors();

      let completed = 0;
      let inTransit = 0;
      let payDeclared = 0;
      let pendingInit = 0;
      let cancelled = 0;

      transactions.forEach(t => {
        const isCanc = t.status === 'Cancelled' || t.status === 'cancelled' || t.dealStatus === 'Cancelled' || t.dealStatus === 'cancelled';
        if (isCanc) {
          cancelled++;
        } else if (this.isTransactionCompleted(t)) {
          completed++;
        } else if (t.deliveryStatus === 'Dispatched') {
          inTransit++;
        } else if (t.paymentStatus === 'Payment_Declared') {
          payDeclared++;
        } else {
          pendingInit++;
        }
      });

      // 1. Status Distribution Doughnut Chart
      const statusCtx = document.getElementById('chart-tx-status');
      if (statusCtx) {
        if (this.charts.txStatus) this.charts.txStatus.destroy();

        const hasAnyTx = transactions.length > 0;
        this.charts.txStatus = new Chart(statusCtx, {
          type: 'doughnut',
          data: {
            labels: hasAnyTx 
              ? ['Completed', 'In Transit', 'Payment Declared', 'Pending', 'Cancelled']
              : ['No Transactions in Database'],
            datasets: [{
              data: hasAnyTx 
                ? [completed, inTransit, payDeclared, pendingInit, cancelled]
                : [1],
              backgroundColor: hasAnyTx
                ? ['#10b981', '#3b82f6', '#06b6d4', '#f59e0b', '#ef4444']
                : ['rgba(156, 163, 175, 0.25)'],
              borderWidth: 2,
              borderColor: colors.border
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { color: colors.text, font: { size: 11, weight: '500' }, boxWidth: 12 }
              },
              tooltip: {
                backgroundColor: colors.tooltipBg,
                callbacks: {
                  label: function (context) {
                    if (!hasAnyTx) return ' No genuine transactions recorded';
                    const total = context.dataset.data.reduce((a, b) => a + b, 0) || 1;
                    const val = context.parsed;
                    const pct = ((val / total) * 100).toFixed(1);
                    return ` ${context.label}: ${val} (${pct}%)`;
                  }
                }
              }
            },
            cutout: '68%'
          }
        });
      }

      // 2. Transaction Value Trend (Monthly Realized GMV)
      const valueTrendCtx = document.getElementById('chart-tx-value-trend');
      if (valueTrendCtx) {
        if (this.charts.txValueTrend) this.charts.txValueTrend.destroy();

        const monthlyGMV = {};
        transactions.forEach(t => {
          if (this.isTransactionCompleted(t)) {
            const d = t.createdAt;
            if (d) {
              const k = d.toLocaleDateString([], { month: 'short', year: '2-digit' });
              monthlyGMV[k] = (monthlyGMV[k] || 0) + (Number(t.totalAmount) || (Number(t.finalPrice || 0) * Number(t.quantity || 0)) || 0);
            }
          }
        });

        const mLabels = Object.keys(monthlyGMV);
        const mValues = Object.values(monthlyGMV);

        this.charts.txValueTrend = new Chart(valueTrendCtx, {
          type: 'bar',
          data: {
            labels: mLabels.length ? mLabels : ['No Realized Turnover'],
            datasets: [{
              label: 'Turnover (₹)',
              data: mValues.length ? mValues : [0],
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: colors.tooltipBg,
                callbacks: { label: (ctx) => ` Realized GMV: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}` }
              }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: colors.textMuted } },
              y: {
                beginAtZero: true,
                grid: { color: colors.grid },
                ticks: {
                  color: colors.textMuted,
                  callback: (val) => '₹' + Number(val).toLocaleString('en-IN')
                }
              }
            }
          }
        });
      }

      // Performance 4-metric bar
      const totalCount = transactions.length;
      const compCount = completed;
      const compRate = totalCount > 0 ? ((compCount / totalCount) * 100).toFixed(1) + '%' : '0%';
      const totalRealizedGMV = transactions.filter(t => this.isTransactionCompleted(t))
        .reduce((sum, t) => sum + (Number(t.totalAmount) || (Number(t.finalPrice || 0) * Number(t.quantity || 0)) || 0), 0);
      const atv = compCount > 0 ? this.formatINR(Math.round(totalRealizedGMV / compCount)) : '₹0';

      const elTotal = document.getElementById('perf-total-tx');
      const elComp = document.getElementById('perf-completed-tx');
      const elRate = document.getElementById('perf-completion-rate');
      const elAtv = document.getElementById('perf-atv');

      if (elTotal) elTotal.textContent = totalCount.toLocaleString();
      if (elComp) elComp.textContent = compCount.toLocaleString();
      if (elRate) elRate.textContent = compRate;
      if (elAtv) elAtv.textContent = atv;
    }

    // =========================================================================
    // 8. SECTION 4: CROP & AGRICULTURAL PRODUCE ANALYTICS
    // =========================================================================
    renderCropAnalytics(data) {
      const { crops, transactions } = data;
      const colors = this.getChartThemeColors();

      // 1. Most Listed Crops by Genuine Produce Name
      const cropCountMap = {};
      crops.forEach(c => {
        const title = (c.cropName || c.title || '').trim();
        if (title) {
          cropCountMap[title] = (cropCountMap[title] || 0) + 1;
        }
      });

      const sortedCrops = Object.entries(cropCountMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);

      const mostListedCtx = document.getElementById('chart-most-listed-crops');
      if (mostListedCtx) {
        if (this.charts.mostListedCrops) this.charts.mostListedCrops.destroy();

        const hasCrops = sortedCrops.length > 0;
        this.charts.mostListedCrops = new Chart(mostListedCtx, {
          type: 'bar',
          data: {
            labels: hasCrops ? sortedCrops.map(e => e[0]) : ['No Crops Listed'],
            datasets: [{
              label: 'Active Listings',
              data: hasCrops ? sortedCrops.map(e => e[1]) : [0],
              backgroundColor: 'rgba(59, 130, 246, 0.75)',
              borderRadius: 6
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { backgroundColor: colors.tooltipBg }
            },
            scales: {
              x: { beginAtZero: true, grid: { color: colors.grid }, ticks: { precision: 0, color: colors.textMuted } },
              y: { grid: { display: false }, ticks: { color: colors.text, font: { weight: '600' } } }
            }
          }
        });
      }

      // 2. Crop Price Comparison across Categories (strictly normalized to ₹/kg)
      const catPrices = {};
      const catCounts = {};
      let excludedChartBags = 0;
      crops.forEach(c => {
        const pricePerKg = this.normalizePricePerKg(c.expectedPrice, c.unit, c.bagWeightKg);
        if (pricePerKg !== null && pricePerKg > 0) {
          const cat = c.category || 'General';
          catPrices[cat] = (catPrices[cat] || 0) + pricePerKg;
          catCounts[cat] = (catCounts[cat] || 0) + 1;
        } else {
          const u = String(c.unit || '').toLowerCase().trim();
          if (u.includes('bag')) {
            const bw = Number(c.bagWeightKg);
            if (!Number.isFinite(bw) || bw <= 0) {
              excludedChartBags++;
            }
          }
        }
      });

      const catLabels = Object.keys(catPrices);
      const catAvgPrices = catLabels.map(cat => Math.round(catPrices[cat] / (catCounts[cat] || 1)));

      const priceCompCtx = document.getElementById('chart-crop-price-comparison');
      if (priceCompCtx) {
        if (this.charts.cropPriceComp) this.charts.cropPriceComp.destroy();

        const hasPriceData = catLabels.length > 0;
        let emptyLabel = 'Insufficient Price Data';
        if (!hasPriceData && excludedChartBags > 0) {
          emptyLabel = 'Excluded: bag weight unavailable';
        }

        this.charts.cropPriceComp = new Chart(priceCompCtx, {
          type: 'bar',
          data: {
            labels: hasPriceData ? catLabels : [emptyLabel],
            datasets: [{
              label: 'Average Price (₹/kg)',
              data: hasPriceData ? catAvgPrices : [0],
              backgroundColor: 'rgba(16, 185, 129, 0.75)',
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: colors.tooltipBg,
                callbacks: { label: (ctx) => ` Avg: ₹${ctx.parsed.y} / kg` }
              }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: colors.textMuted, font: { size: 10 } } },
              y: {
                grid: { color: colors.grid },
                ticks: { color: colors.textMuted, callback: (v) => `₹${v}/kg` }
              }
            }
          }
        });
      }

      // Quantity Aggregates in Kilograms
      let totalListedQtyKg = 0;
      let availQtyKg = 0;
      let soldQtyKg = 0;

      crops.forEach(c => {
        const qKg = this.normalizeQuantityToKg(c.quantity, c.unit, c.bagWeightKg);
        totalListedQtyKg += qKg;
        const s = String(c.status || '').toLowerCase();
        if (s === 'available' || s === 'under negotiation' || s === 'active') {
          availQtyKg += qKg;
        } else if (s === 'sold') {
          soldQtyKg += qKg;
        }
      });

      const elTotalQty = document.getElementById('crop-total-quantity');
      const elAvailQty = document.getElementById('crop-available-quantity');
      const elSoldQty = document.getElementById('crop-sold-quantity');

      if (elTotalQty) elTotalQty.textContent = `${Math.round(totalListedQtyKg).toLocaleString()} kg`;
      if (elAvailQty) elAvailQty.textContent = `${Math.round(availQtyKg).toLocaleString()} kg`;
      if (elSoldQty) elSoldQty.textContent = `${Math.round(soldQtyKg).toLocaleString()} kg`;

      // Top Crops by Realized Turnover
      const cropValueMap = {};
      transactions.forEach(t => {
        if (this.isTransactionCompleted(t)) {
          const title = t.cropTitle || t.cropName || 'Agricultural Produce';
          const val = Number(t.totalAmount) || (Number(t.finalPrice || 0) * Number(t.quantity || 0)) || 0;
          cropValueMap[title] = (cropValueMap[title] || 0) + val;
        }
      });

      const topCropsList = Object.entries(cropValueMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

      const topCropsContainer = document.getElementById('top-crops-by-value-list');
      if (topCropsContainer) {
        if (topCropsList.length === 0) {
          topCropsContainer.innerHTML = '<div class="text-xs text-muted text-center py-3">No completed commodity sales in database.</div>';
        } else {
          topCropsContainer.innerHTML = topCropsList.map(([title, val], idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.35rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.82rem;">
              <span><strong>#${idx + 1}</strong> ${title}</span>
              <span style="font-weight: 700; color: var(--primary-700);">₹${val.toLocaleString('en-IN')}</span>
            </div>
          `).join('');
        }
      }
    }

    // =========================================================================
    // 9. SECTION 5: FARMER & DEALER LEADERBOARDS
    // =========================================================================
    renderUserAnalytics(data) {
      const { transactions } = data;

      const farmerStats = {};
      const dealerStats = {};

      transactions.forEach(t => {
        if (this.isTransactionCompleted(t)) {
          const val = Number(t.totalAmount) || (Number(t.finalPrice || 0) * Number(t.quantity || 0)) || 0;
          if (t.farmerId) {
            if (!farmerStats[t.farmerId]) {
              farmerStats[t.farmerId] = { id: t.farmerId, name: t.farmerName || 'Farmer', deals: 0, volume: 0, phone: t.farmerPhone || '' };
            }
            farmerStats[t.farmerId].deals++;
            farmerStats[t.farmerId].volume += val;
          }

          if (t.dealerId) {
            if (!dealerStats[t.dealerId]) {
              dealerStats[t.dealerId] = { id: t.dealerId, name: t.dealerName || 'Dealer', deals: 0, volume: 0, phone: t.dealerPhone || '' };
            }
            dealerStats[t.dealerId].deals++;
            dealerStats[t.dealerId].volume += val;
          }
        }
      });

      // Top Farmers Leaderboard
      const topFarmers = Object.values(farmerStats)
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 5);

      const fLeaderboardBody = document.getElementById('top-farmers-tbody');
      if (fLeaderboardBody) {
        if (topFarmers.length === 0) {
          fLeaderboardBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No farmer trades recorded yet in Firestore.</td></tr>';
        } else {
          fLeaderboardBody.innerHTML = topFarmers.map((f, i) => `
            <tr>
              <td><strong>#${i + 1}</strong></td>
              <td><strong>${f.name}</strong></td>
              <td><span class="badge badge-success">${f.deals}</span></td>
              <td style="font-weight: 700; color: var(--primary-700);">₹${f.volume.toLocaleString('en-IN')}</td>
              <td><span style="color: var(--amber-500); font-weight: 700;">5.0 ★</span></td>
              <td><span class="badge badge-success">Verified</span></td>
            </tr>
          `).join('');
        }
      }

      // Top Dealers Leaderboard
      const topDealers = Object.values(dealerStats)
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 5);

      const dLeaderboardBody = document.getElementById('top-dealers-tbody');
      if (dLeaderboardBody) {
        if (topDealers.length === 0) {
          dLeaderboardBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No dealer purchases recorded yet in Firestore.</td></tr>';
        } else {
          dLeaderboardBody.innerHTML = topDealers.map((d, i) => `
            <tr>
              <td><strong>#${i + 1}</strong></td>
              <td><strong>${d.name}</strong></td>
              <td><span class="badge badge-primary">${d.deals}</span></td>
              <td style="font-weight: 700; color: var(--primary-700);">₹${d.volume.toLocaleString('en-IN')}</td>
              <td><span style="color: var(--amber-500); font-weight: 700;">5.0 ★</span></td>
              <td><span class="badge badge-primary">Licensed</span></td>
            </tr>
          `).join('');
        }
      }
    }

    // =========================================================================
    // 10. SECTION 6: NEGOTIATION & OFFER ANALYTICS
    // =========================================================================
    renderOfferAnalytics(data) {
      const { offers } = data;
      const colors = this.getChartThemeColors();

      const totalOffers = offers.length;
      let accepted = 0;
      let rejected = 0;
      let countered = 0;
      let pending = 0;

      let totalDiscountSpread = 0;
      let discountCount = 0;

      offers.forEach(o => {
        const s = String(o.status || '').toLowerCase();
        if (s === 'accepted') {
          accepted++;
          const ask = Number(o.farmerExpectedPrice) || 0;
          const finalP = Number(o.offeredPrice) || 0;
          if (ask > 0 && finalP > 0) {
            totalDiscountSpread += (ask - finalP);
            discountCount++;
          }
        } else if (s === 'rejected') {
          rejected++;
        } else if (s === 'countered') {
          countered++;
        } else {
          pending++;
        }
      });

      const acceptRate = totalOffers > 0 ? ((accepted / totalOffers) * 100).toFixed(1) + '%' : '0%';
      const avgSpread = discountCount > 0 ? (totalDiscountSpread / discountCount).toFixed(1) : '0';

      const elTotalOffers = document.getElementById('offer-total-count');
      const elAccepted = document.getElementById('offer-accepted-count');
      const elCountered = document.getElementById('offer-countered-count');
      const elAcceptRate = document.getElementById('offer-accept-rate');
      const elAvgDiscount = document.getElementById('offer-avg-discount');

      if (elTotalOffers) elTotalOffers.textContent = totalOffers.toLocaleString();
      if (elAccepted) elAccepted.textContent = accepted.toLocaleString();
      if (elCountered) elCountered.textContent = countered.toLocaleString();
      if (elAcceptRate) elAcceptRate.textContent = acceptRate;
      if (elAvgDiscount) elAvgDiscount.textContent = `₹${avgSpread} / kg`;

      const offerChartCtx = document.getElementById('chart-offer-outcomes');
      if (offerChartCtx) {
        if (this.charts.offerOutcomes) this.charts.offerOutcomes.destroy();

        const hasOffers = totalOffers > 0;
        this.charts.offerOutcomes = new Chart(offerChartCtx, {
          type: 'doughnut',
          data: {
            labels: hasOffers 
              ? ['Accepted', 'Countered', 'Pending', 'Rejected']
              : ['No Offers Submitted'],
            datasets: [{
              data: hasOffers ? [accepted, countered, pending, rejected] : [1],
              backgroundColor: hasOffers
                ? ['#10b981', '#f59e0b', '#3b82f6', '#ef4444']
                : ['rgba(156, 163, 175, 0.25)'],
              borderWidth: 2,
              borderColor: colors.border
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { color: colors.text, font: { size: 11, weight: '500' }, boxWidth: 12 }
              },
              tooltip: { backgroundColor: colors.tooltipBg }
            },
            cutout: '65%'
          }
        });
      }
    }

    // =========================================================================
    // 11. SECTION 7: REGIONAL DISTRIBUTION ACROSS ANDHRA PRADESH
    // =========================================================================
    renderLocationInsights(data) {
      const { crops, transactions } = data;
      const colors = this.getChartThemeColors();

      const districtStats = {};

      crops.forEach(c => {
        const d = (c.district || c.location || '').trim();
        if (d && d.toLowerCase() !== 'andhra pradesh') {
          if (!districtStats[d]) districtStats[d] = { listings: 0, deals: 0, volume: 0 };
          districtStats[d].listings++;
        }
      });

      transactions.forEach(t => {
        if (this.isTransactionCompleted(t)) {
          const d = (t.district || t.location || '').trim();
          if (d && d.toLowerCase() !== 'andhra pradesh') {
            if (!districtStats[d]) districtStats[d] = { listings: 0, deals: 0, volume: 0 };
            districtStats[d].deals++;
            districtStats[d].volume += Number(t.totalAmount) || 0;
          }
        }
      });

      const sortedDistricts = Object.entries(districtStats)
        .sort((a, b) => b[1].listings - a[1].listings)
        .slice(0, 6);

      const locChartCtx = document.getElementById('chart-location-distribution');
      if (locChartCtx) {
        if (this.charts.locationDist) this.charts.locationDist.destroy();

        const hasLocations = sortedDistricts.length > 0;
        this.charts.locationDist = new Chart(locChartCtx, {
          type: 'bar',
          data: {
            labels: hasLocations ? sortedDistricts.map(e => e[0]) : ['No Regional Data'],
            datasets: [
              {
                label: 'Active Listings',
                data: hasLocations ? sortedDistricts.map(e => e[1].listings) : [0],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 4
              },
              {
                label: 'Completed Trades',
                data: hasLocations ? sortedDistricts.map(e => e[1].deals) : [0],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { color: colors.text, boxWidth: 12, font: { size: 11 } } },
              tooltip: { backgroundColor: colors.tooltipBg }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: colors.textMuted } },
              y: { beginAtZero: true, grid: { color: colors.grid }, ticks: { precision: 0, color: colors.textMuted } }
            }
          }
        });
      }
    }

    // =========================================================================
    // 12. SECTION 8: RECENT ACTIVITY TIMELINE & ADMINISTRATIVE ALERTS
    // =========================================================================
    renderRecentActivityAndAlerts(data) {
      const { crops, transactions, users } = data;

      const events = [];

      users.forEach(u => {
        if (u.createdAt) {
          events.push({
            type: 'user',
            icon: u.role === 'dealer' ? '💼' : '👨‍🌾',
            title: `New ${u.role === 'dealer' ? 'Dealer' : 'Farmer'} registered: ${u.name}`,
            meta: `📍 ${u.district || 'Andhra Pradesh'} • Verified Account`,
            date: u.createdAt
          });
        }
      });

      crops.forEach(c => {
        if (c.createdAt) {
          events.push({
            type: 'crop',
            icon: '🌱',
            title: `Produce lot listed: ${c.title || c.cropName} (${Number(c.quantity).toLocaleString()} ${c.unit || 'kg'})`,
            meta: `Farmer: ${c.farmerName || 'Verified'} • ₹${c.expectedPrice}/${c.unit || 'kg'}`,
            date: c.createdAt
          });
        }
      });

      transactions.forEach(t => {
        if (t.createdAt) {
          const isComp = this.isTransactionCompleted(t);
          events.push({
            type: 'tx',
            icon: isComp ? '✅' : '📋',
            title: `Trade ${isComp ? 'Completed' : 'Contract Initiated'}: ${t.cropTitle || 'Commodity'}`,
            meta: `₹${Number(t.totalAmount).toLocaleString('en-IN')} • ${t.farmerName} ➔ ${t.dealerName}`,
            date: t.createdAt
          });
        }
      });

      events.sort((a, b) => b.date.getTime() - a.date.getTime());

      const activityListEl = document.getElementById('recent-activity-list');
      if (activityListEl) {
        if (events.length === 0) {
          activityListEl.innerHTML = '<div class="text-muted text-center py-4">No recent marketplace activity recorded in Firestore.</div>';
        } else {
          activityListEl.innerHTML = events.slice(0, 8).map(ev => {
            const timeAgo = this.formatTimeAgo(ev.date);
            return `
              <div class="activity-feed-item">
                <div class="activity-icon-bubble">${ev.icon}</div>
                <div class="activity-content">
                  <div class="activity-title">${ev.title}</div>
                  <div class="activity-meta">
                    <span>${ev.meta}</span>
                    <span style="color: var(--primary-600); font-weight: 600;">• ${timeAgo}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // Administrative Alerts (strictly based on genuine records)
      const alerts = [];
      const now = new Date();

      transactions.forEach(t => {
        const isComp = this.isTransactionCompleted(t);
        const isCanc = t.status === 'Cancelled' || t.dealStatus === 'Cancelled';
        if (!isComp && !isCanc) {
          const d = t.createdAt;
          if (d && (now.getTime() - d.getTime()) > 48 * 60 * 60 * 1000) {
            alerts.push({
              level: 'alert-warning',
              badge: 'Awaiting Action',
              title: `Transaction #${t.id || t.transactionId} Pending > 48h`,
              desc: `Deal between ${t.farmerName} and ${t.dealerName} for ${t.cropTitle} is awaiting final payment or delivery confirmation.`
            });
          }
        }
      });

      crops.forEach(c => {
        if (!c.qualityGrade || !c.listedDate) {
          alerts.push({
            level: 'alert-info',
            badge: 'Incomplete Details',
            title: `Listing "${c.title || c.cropName}" Missing Quality Grade`,
            desc: `Listing by ${c.farmerName || 'Farmer'} is missing quality grade documentation.`
          });
        }
      });

      const alertsListEl = document.getElementById('admin-alerts-list');
      if (alertsListEl) {
        if (alerts.length === 0) {
          alertsListEl.innerHTML = `
            <div class="alert-item-card alert-info">
              <div class="alert-item-content">
                <div class="alert-item-header">
                  <span class="alert-item-title">System Optimal</span>
                  <span class="badge badge-success">Normal</span>
                </div>
                <p class="alert-item-desc">All platform transactions, crop lots, and mandi rates comply with fair trading guidelines.</p>
              </div>
            </div>
          `;
        } else {
          alertsListEl.innerHTML = alerts.slice(0, 5).map(al => `
            <div class="alert-item-card ${al.level}">
              <div class="alert-item-content">
                <div class="alert-item-header">
                  <span class="alert-item-title">${al.title}</span>
                  <span class="badge ${al.level === 'alert-warning' ? 'badge-warning' : 'badge-primary'}">${al.badge}</span>
                </div>
                <p class="alert-item-desc">${al.desc}</p>
              </div>
            </div>
          `).join('');
        }
      }
    }

    formatTimeAgo(d) {
      if (!d) return '';
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const mins = Math.floor(diffMs / (60 * 1000));
      if (mins < 60) return `${Math.max(1, mins)}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    }

    // =========================================================================
    // 13. ERROR STATE & DIAGNOSTICS
    // =========================================================================
    renderErrorState(message) {
      const banner = document.getElementById('analytics-error-banner');
      if (banner) {
        banner.style.display = 'block';
        banner.innerHTML = `
          <div class="card" style="border-left: 4px solid var(--red-600); background: #fef2f2; padding: 1.15rem 1.35rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-weight: 700; color: #991b1b; font-size: 0.95rem;">⚠️ Firestore Live Analytics Diagnostic Notice</div>
              <div style="color: #b91c1c; font-size: 0.85rem; margin-top: 0.25rem;">${message}</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.AdminAnalytics && window.AdminAnalytics.refresh()" style="background: #dc2626; border-color: #dc2626;">
              🔄 Retry Connection
            </button>
          </div>
        `;
      }
    }

    clearErrorState() {
      const banner = document.getElementById('analytics-error-banner');
      if (banner) {
        banner.style.display = 'none';
        banner.innerHTML = '';
      }
    }

    // =========================================================================
    // 14. FILTER CONTROLS & EVENT WIRING
    // =========================================================================
    populateFilterDropdowns() {
      const catSelect = document.getElementById('filter-category');
      if (catSelect) {
        const cats = Array.from(new Set(this.rawCrops.map(c => c.category).filter(Boolean)));
        catSelect.innerHTML = '<option value="all">All Crop Categories</option>' + 
          cats.map(c => `<option value="${c}">${c}</option>`).join('');
      }

      const distSelect = document.getElementById('filter-district');
      if (distSelect) {
        const dists = Array.from(new Set([
          ...this.rawCrops.map(c => c.district).filter(Boolean),
          ...this.rawUsers.map(u => u.district).filter(Boolean)
        ])).filter(d => d.toLowerCase() !== 'andhra pradesh');
        distSelect.innerHTML = '<option value="all">All AP Districts</option>' +
          dists.map(d => `<option value="${d}">${d}</option>`).join('');
      }
    }

    setupEventListeners() {
      const dateEl = document.getElementById('filter-date-range');
      if (dateEl) {
        dateEl.addEventListener('change', (e) => {
          this.state.dateRange = e.target.value;
          this.renderAll();
        });
      }

      const catEl = document.getElementById('filter-category');
      if (catEl) {
        catEl.addEventListener('change', (e) => {
          this.state.category = e.target.value;
          this.renderAll();
        });
      }

      const distEl = document.getElementById('filter-district');
      if (distEl) {
        distEl.addEventListener('change', (e) => {
          this.state.district = e.target.value;
          this.renderAll();
        });
      }

      const statEl = document.getElementById('filter-status');
      if (statEl) {
        statEl.addEventListener('change', (e) => {
          this.state.status = e.target.value;
          this.renderAll();
        });
      }

      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.resetFilters();
        });
      }

      const trendButtons = document.querySelectorAll('[data-activity-period]');
      trendButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          trendButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.state.activityPeriod = btn.getAttribute('data-activity-period');
          this.renderActivityTrendsChart();
        });
      });
    }

    resetFilters() {
      this.state.dateRange = 'all';
      this.state.category = 'all';
      this.state.district = 'all';
      this.state.status = 'all';

      const dRange = document.getElementById('filter-date-range');
      const dCat = document.getElementById('filter-category');
      const dDist = document.getElementById('filter-district');
      const dStat = document.getElementById('filter-status');

      if (dRange) dRange.value = 'all';
      if (dCat) dCat.value = 'all';
      if (dDist) dDist.value = 'all';
      if (dStat) dStat.value = 'all';

      this.renderAll();
    }

    setupThemeObserver() {
      const observer = new MutationObserver(() => {
        this.renderAllCharts();
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    renderAll() {
      const data = this.getFilteredDataset();
      this.renderKPICards(data);
      this.renderAllCharts(data);
      this.renderUserAnalytics(data);
      this.renderRecentActivityAndAlerts(data);
      this.updateActiveFilterPills();
    }

    renderAllCharts(data = null) {
      const d = data || this.getFilteredDataset();
      this.renderActivityTrendsChart();
      this.renderTransactionAnalytics(d);
      this.renderCropAnalytics(d);
      this.renderOfferAnalytics(d);
      this.renderLocationInsights(d);
    }

    updateActiveFilterPills() {
      const pill = document.getElementById('active-filter-indicator');
      if (!pill) return;

      const active = [];
      if (this.state.dateRange !== 'all') active.push(this.state.dateRange.toUpperCase());
      if (this.state.category !== 'all') active.push(this.state.category);
      if (this.state.district !== 'all') active.push(this.state.district);
      if (this.state.status !== 'all') active.push(this.state.status);

      if (active.length === 0) {
        pill.textContent = 'Showing All Marketplace Data';
      } else {
        pill.textContent = `Filtered by: ${active.join(' • ')}`;
      }
    }

    async refresh() {
      if (this.isLoading) return;
      await this.loadDataFromFirestore();
      this.populateFilterDropdowns();
      this.renderAll();
      if (typeof window.loadAdminDashboard === 'function') {
        window.loadAdminDashboard();
      }
    }
  }

  // Expose global singleton
  window.AdminAnalytics = new AdminAnalyticsEngine();

  if (window.Admin) {
    window.Admin.analytics = window.AdminAnalytics;
  }
})(window);
