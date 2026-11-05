/**
 * FarmLink Firebase Infrastructure Bridge
 *
 * Active Production Web App configuration: farmlink-production-bf431
 * Safe initialization bridge exposing Firestore & Auth.
 */

(function () {
  'use strict';

  // =========================================================================
  // Active Production Firebase Web App Configuration (farmlink-production-bf431)
  // =========================================================================
  const firebaseConfig = {
    apiKey: "AIzaSyCeHJCEWF-JTuPJpXwQB3VbyR4t1Spm1rc",
    authDomain: "farmlink-production-bf431.firebaseapp.com",
    projectId: "farmlink-production-bf431",
    storageBucket: "farmlink-production-bf431.firebasestorage.app",
    messagingSenderId: "1081751895967",
    appId: "1:1081751895967:web:91b95380dbda93995807aa",
    measurementId: "G-EZWQMBX79B"
  };

  // Internal state flags
  let isInitialized = false;
  let isConfigured = false;
  let status = 'unconfigured'; // 'ready' | 'fallback' | 'offline' | 'error'
  let initError = null;
  let app = null;
  let db = null;
  let auth = null;

  // Safe online status detector
  const isOnline = function () {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    return true;
  };

  // Helper to validate configuration object
  function isValidConfig(cfg) {
    return !!(cfg && cfg.apiKey && cfg.projectId && cfg.projectId === "farmlink-production-bf431");
  }

  // Active global context resolver
  function getGlobal() {
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
    if (typeof globalThis !== 'undefined') return globalThis;
    return {};
  }

  // Safe initialization routine
  function initFirebase() {
    try {
      const g = getGlobal();
      isConfigured = isValidConfig(firebaseConfig);

      if (!isConfigured) {
        status = 'fallback';
        return;
      }

      // Check for Firebase Compat SDK presence
      const fb = (typeof firebase !== 'undefined') ? firebase : (g.firebase || null);

      if (!fb) {
        // Firebase CDN not loaded or running in standalone offline/localStorage mode
        status = 'fallback';
        return;
      }

      // Initialize Firebase App exactly once
      if (!fb.apps || !fb.apps.length) {
        app = fb.initializeApp(firebaseConfig);
      } else {
        app = fb.app();
      }

      // Expose Firestore instance (zero read/write operations during Phase 1)
      if (typeof fb.firestore === 'function') {
        db = fb.firestore();
      }

      // Expose Auth instance (zero sign-in/sync operations during Phase 1)
      if (typeof fb.auth === 'function') {
        auth = fb.auth();
      }

      isInitialized = !!(app && db && auth);
      status = isInitialized ? (isOnline() ? 'ready' : 'offline') : 'fallback';

      if (isInitialized && typeof console !== 'undefined' && console.log) {
        console.log('[FarmLink Firebase] Bridge connected: ' + firebaseConfig.projectId + ' (Phase 1)');
      }
    } catch (err) {
      initError = err;
      status = 'error';
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[FarmLink Firebase] Initialization fallback to localStorage:', err && err.message ? err.message : err);
      }
    }
  }

  // Connectivity change handlers
  if (typeof window !== 'undefined') {
    window.addEventListener('online', function () {
      if (status === 'offline') {
        status = isInitialized ? 'ready' : 'fallback';
      }
    });

    window.addEventListener('offline', function () {
      if (status === 'ready') {
        status = 'offline';
      }
    });
  }

  // Run initialization
  initFirebase();

  // Expose clean, non-invasive FarmLinkFirebase diagnostic bridge
  const FarmLinkFirebase = {
    get isConfigured() {
      return isConfigured;
    },
    get isInitialized() {
      return isInitialized;
    },
    get sdkLoaded() {
      const g = getGlobal();
      return !!((typeof firebase !== 'undefined') || g.firebase);
    },
    get isOnline() {
      return isOnline();
    },
    get status() {
      return status;
    },
    get projectId() {
      return firebaseConfig.projectId;
    },
    get prodConfig() {
      return Object.assign({}, firebaseConfig);
    },
    get error() {
      return initError ? initError.message : null;
    },
    get app() {
      return app;
    },
    get db() {
      return db;
    },
    get auth() {
      return auth;
    },
    init: function () {
      initFirebase();
      return this.getStatus();
    },
    getStatus: function () {
      return {
        sdkLoaded: this.sdkLoaded,
        initialized: isInitialized,
        configured: isConfigured,
        projectId: firebaseConfig.projectId,
        status: status,
        dbReady: !!db,
        authReady: !!auth,
        error: initError ? initError.message : null
      };
    }
  };

  // Expose globally
  const g = getGlobal();
  g.FarmLinkFirebase = FarmLinkFirebase;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FarmLinkFirebase;
  }
})();
