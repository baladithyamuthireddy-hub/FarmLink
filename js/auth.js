/**
 * FarmLink - Authentication Service (Phase 2: Firebase Auth & Firestore Adapter)
 * Handles Firebase Email/Password Auth, Firestore User Profiles (users/{uid}),
 * Role-based Route Protection, Session Management, and Demo/Evaluation Logins.
 */

const SESSION_KEY = "farmlink_session";
const USERS_STORAGE_KEY = "farmlink_users";

// Explicit allowlist of predefined demo/evaluation credentials (isolated demo mechanism)
const PREDEFINED_DEMO_EMAILS = Object.freeze([
  "farmer@example.com",
  "farmer@farmlink.in",
  "ramesh@farmlink.in",
  "dealer@example.com",
  "dealer@farmlink.in",
  "venkat@agritraders.in",
  "admin@farmlink.gov.in",
  "admin@example.com",
  "admin@farmlink.in"
]);

const PREDEFINED_DEMO_IDS = Object.freeze([
  "farmer_1",
  "dealer_1",
  "admin_1"
]);

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
    this.initFirebaseAuthListener();
  }

  loadSession() {
    if (typeof localStorage === 'undefined') return null;
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  getCurrentUser() {
    if (!this.currentUser) {
      this.currentUser = this.loadSession();
    }
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  setSession(user) {
    if (!user) return;
    const sanitized = { ...user };
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.apiKey;
    sanitized.name = (sanitized.name || sanitized.fullName || sanitized.displayName || "").trim();
    this.currentUser = sanitized;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sanitized));
    }
  }

  clearSession() {
    this.currentUser = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
    if (typeof window !== 'undefined' && window.Storage) {
      if (typeof window.Storage.clearAllDashboardSync === 'function') {
        try { window.Storage.clearAllDashboardSync(); } catch (e) {}
      }
      if (typeof window.Storage.clearReviewsCache === 'function') {
        window.Storage.clearReviewsCache();
      }
      if (typeof window.Storage.clearTransactionsSync === 'function') {
        window.Storage.clearTransactionsSync();
      }
    }
  }

  getFirebaseBridge() {
    if (typeof window !== 'undefined' && window.FarmLinkFirebase) {
      return window.FarmLinkFirebase;
    }
    if (typeof FarmLinkFirebase !== 'undefined') {
      return FarmLinkFirebase;
    }
    return null;
  }

  initFirebaseAuthListener() {
    try {
      const fb = this.getFirebaseBridge();
      if (fb && fb.auth && typeof fb.auth.onAuthStateChanged === 'function') {
        fb.auth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            // Authoritative profile sync from Firestore users/{uid}
            try {
              if (fb.db) {
                const doc = await fb.db.collection("users").doc(firebaseUser.uid).get();
                if (doc && doc.exists) {
                  const profile = doc.data();
                  profile.uid = firebaseUser.uid;
                  profile.id = firebaseUser.uid;
                  profile.isFirebaseAuth = true;
                  profile.name = (profile.name || profile.fullName || profile.displayName || (firebaseUser && firebaseUser.displayName) || "").trim();

                  // Guard against client-side role tampering
                  if (this.currentUser && this.currentUser.role !== profile.role) {
                    console.warn('[FarmLink Auth] Restoring authoritative Firestore role:', profile.role);
                  }

                  this.setSession(profile);

                  // Update Storage user cache
                  if (typeof window !== 'undefined' && window.Storage && window.Storage.getUsers) {
                    const users = window.Storage.getUsers();
                    const idx = users.findIndex(u => u.id === profile.id || u.uid === profile.uid);
                    if (idx !== -1) {
                      users[idx] = { ...users[idx], ...profile };
                    } else {
                      users.push(profile);
                    }
                    if (window.Storage.set) {
                      window.Storage.set(USERS_STORAGE_KEY, users);
                    }
                  }

                  // Update dynamic header displays
                  if (typeof window !== 'undefined' && window.App && window.App.updateUserDisplay) {
                    window.App.updateUserDisplay();
                  }
                }
              }
            } catch (err) {
              console.warn('[FarmLink Auth] Firestore profile sync note:', err.message);
            }
          } else {
            // Signed out from Firebase Auth
            // If active session belongs to a Firebase user, clear session
            if (this.currentUser && (this.currentUser.isFirebaseAuth || this.currentUser.uid)) {
              this.clearSession();
            }
          }
        });
      }
    } catch (e) {
      // Ignore in non-browser or test runner
    }
  }

  isDemoEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const cleanEmail = email.toLowerCase().trim();
    return PREDEFINED_DEMO_EMAILS.includes(cleanEmail);
  }

  async login(email, password, expectedRole = null) {
    const cleanEmail = (email || "").toLowerCase().trim();
    const isDemo = this.isDemoEmail(cleanEmail);

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.auth && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);

    // If Firebase Authentication is available, attempt real Firebase sign-in first
    if (isFbAvailable) {
      try {
        const fbRes = await this.loginWithFirebase(cleanEmail, password, expectedRole, fb);
        if (fbRes && fbRes.success) {
          return fbRes;
        }
        // If the email is not an evaluation demo account, return the authoritative Firebase error
        if (!isDemo) {
          return fbRes;
        }
      } catch (err) {
        if (!isDemo) {
          return {
            success: false,
            message: (err && err.message) || "Unable to connect to FarmLink authentication. Please try again."
          };
        }
      }
    }

    // Explicit predefined college demo accounts fallback (farmer_1, dealer_1, admin_1)
    // Invoked only for evaluation demo emails when running offline or without cloud auth credentials
    if (isDemo) {
      return this.loginDemoOrLocal(cleanEmail, password, expectedRole);
    }

    // If Firebase Authentication is unavailable, normal Farmer/Dealer accounts
    // must NOT authenticate against local storage passwords, must NOT call loginDemoOrLocal,
    // and must NOT create an authenticated session.
    if (!isFbAvailable) {
      return {
        success: false,
        message: "Unable to connect to FarmLink authentication. Please check your internet connection and try again."
      };
    }

    return {
      success: false,
      message: "No account found with this email."
    };
  }

  loginDemoOrLocal(cleanEmail, password, expectedRole = null) {
    // STRICT GUARD: Only explicitly recognized predefined demo accounts are permitted.
    // Normal accounts previously registered through Firebase must NEVER use this path.
    if (!this.isDemoEmail(cleanEmail)) {
      return {
        success: false,
        message: "Unable to connect to FarmLink authentication. Please check your internet connection and try again."
      };
    }

    const users = (typeof window !== 'undefined' && window.Storage && window.Storage.getUsers) ? window.Storage.getUsers() : [];

    // Explicit demo allowlist mapping strictly to farmer_1, dealer_1, admin_1
    let user = null;
    if (cleanEmail === "farmer@example.com" || cleanEmail === "farmer@farmlink.in" || cleanEmail === "ramesh@farmlink.in") {
      user = users.find(u => u.id === "farmer_1");
    } else if (cleanEmail === "dealer@example.com" || cleanEmail === "dealer@farmlink.in" || cleanEmail === "venkat@agritraders.in") {
      user = users.find(u => u.id === "dealer_1");
    } else if (cleanEmail === "admin@farmlink.gov.in" || cleanEmail === "admin@example.com" || cleanEmail === "admin@farmlink.in") {
      user = users.find(u => u.id === "admin_1");
    }

    // If storage was reset, fallback match only against predefined demo IDs or explicit isDemo flag
    if (!user) {
      user = users.find(u => u.email && u.email.toLowerCase() === cleanEmail && (u.isDemo === true || PREDEFINED_DEMO_IDS.includes(u.id)));
    }

    if (!user) {
      return { success: false, message: "No account found with this email." };
    }

    // Role-specific login gating: prevent cross-role authentication
    if (expectedRole && user.role !== expectedRole) {
      const actualRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      return {
        success: false,
        message: `This account is registered as a ${actualRole}. Please use the ${actualRole} Login portal.`
      };
    }

    const isValidPassword = (user.password === password) || 
                            (password === "password123") || 
                            (user.role === "admin" && password === "admin123");

    if (!isValidPassword) {
      return { success: false, message: "Invalid password. Please check your credentials." };
    }

    const sessionObj = { ...user, isFirebaseAuth: false, isDemo: true };
    this.setSession(sessionObj);
    return { success: true, user: sessionObj };
  }

  async loginWithFirebase(cleanEmail, password, expectedRole, fb) {
    try {
      const userCredential = await fb.auth.signInWithEmailAndPassword(cleanEmail, password);
      const uid = userCredential.user.uid;

      // Authoritative read from Firestore users/{uid}
      let profile = null;
      if (fb.db) {
        try {
          const doc = await fb.db.collection("users").doc(uid).get();
          if (doc && doc.exists) {
            profile = doc.data();
          }
        } catch (dbErr) {
          console.warn('[FarmLink Auth] Firestore read note:', dbErr.message);
          // If Firestore read fails due to network or service error, sign out and fail safely
          try { await fb.auth.signOut(); } catch (_) {}
          this.clearSession();
          return {
            success: false,
            message: "Unable to connect to FarmLink authentication. Please check your internet connection and try again."
          };
        }
      }

      if (!profile) {
        // Safe profile-recovery check: do NOT create an arbitrary role
        try { await fb.auth.signOut(); } catch (_) {}
        this.clearSession();
        return {
          success: false,
          message: "User account exists in Firebase, but no profile was found in Firestore. Please contact support or re-register."
        };
      }

      profile.uid = uid;
      profile.id = uid;
      profile.isFirebaseAuth = true;
      profile.name = (profile.name || profile.fullName || profile.displayName || (userCredential.user && userCredential.user.displayName) || "").trim();
      delete profile.password; // Explicit safeguard: passwords never in memory profile

      // Enforce authoritative role validation against expected portal role
      if (expectedRole && profile.role !== expectedRole) {
        try { await fb.auth.signOut(); } catch (_) {}
        this.clearSession();
        const actualRole = profile.role.charAt(0).toUpperCase() + profile.role.slice(1);
        return {
          success: false,
          message: `This account is registered as a ${actualRole}. Please use the ${actualRole} Login portal.`
        };
      }

      // Establish session
      this.setSession(profile);

      // Cache user locally without password
      if (typeof window !== 'undefined' && window.Storage && window.Storage.getUsers) {
        const users = window.Storage.getUsers();
        const idx = users.findIndex(u => u.id === uid || u.uid === uid);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...profile };
        } else {
          users.push(profile);
        }
        if (window.Storage.set) {
          window.Storage.set(USERS_STORAGE_KEY, users);
        }
      }

      return { success: true, user: profile };
    } catch (err) {
      let msg = "Invalid email or password.";
      if (err.code === "auth/user-not-found") {
        msg = "No account found with this email.";
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many failed login attempts. Please try again later.";
      } else if (err.code === "auth/network-request-failed" || (err.message && err.message.toLowerCase().includes("network"))) {
        msg = "Unable to connect to FarmLink authentication. Please check your internet connection and try again.";
      } else if (err.message) {
        msg = err.message;
      }
      return { success: false, message: msg, error: err };
    }
  }

  loginWithOtp(phone, otp, expectedRole = "farmer") {
    if (!phone || phone.length < 10) {
      return { success: false, message: "Please enter a valid 10-digit phone number." };
    }

    if (!otp || otp.length !== 6) {
      return { success: false, message: "Please enter a valid 6-digit OTP." };
    }

    const users = (typeof window !== 'undefined' && window.Storage && window.Storage.getUsers) ? window.Storage.getUsers() : [];
    let user = users.find(u => u.phone === phone);

    if (user && expectedRole && user.role !== expectedRole) {
      const actualRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      const reqRole = expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1);
      return {
        success: false,
        message: `This mobile number is registered as a ${actualRole}. Please use the ${reqRole} Login.`
      };
    }

    if (!user) {
      const role = expectedRole || "farmer";
      user = {
        id: (role === "dealer" ? "dealer_" : "farmer_") + Date.now(),
        uid: (role === "dealer" ? "dealer_" : "farmer_") + Date.now(),
        phone: phone,
        email: phone + "@farmlink.mock",
        name: (role === "dealer" ? "Dealer " : "Farmer ") + phone.slice(-4),
        role: role,
        location: "Guntur District, AP",
        district: "Guntur",
        totalTransactions: 0,
        rating: 5.0,
        isDemo: true,
        isFirebaseAuth: false,
        about: `New verified ${role} on FarmLink.`
      };
      users.push(user);
      if (typeof window !== 'undefined' && window.Storage && window.Storage.set) {
        window.Storage.set(USERS_STORAGE_KEY, users);
      }
    }

    this.setSession(user);
    return { success: true, user };
  }

  register(userData) {
    if (!userData) {
      return { success: false, message: "Registration details are required." };
    }

    // Normal registration can NEVER create an admin account (safely force to farmer/dealer)
    if (userData.role !== "farmer" && userData.role !== "dealer") {
      userData.role = "farmer";
    }

    // Name validation
    const cleanName = (userData.name || "").trim();
    if (!cleanName || cleanName.length < 2) {
      return { success: false, message: "Please enter your full name (minimum 2 characters)." };
    }
    if (cleanName.length > 100) {
      return { success: false, message: "Name cannot exceed 100 characters." };
    }

    // Email validation
    const cleanEmail = (userData.email || "").toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    // Phone validation
    const cleanPhone = (userData.phone || "").trim().replace(/\D/g, "");
    if (cleanPhone && (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone))) {
      return { success: false, message: "Please enter a valid 10-digit Indian mobile number." };
    }

    // Password validation
    if (!userData.password || userData.password.length < 6) {
      return { success: false, message: "Password should be at least 6 characters." };
    }
    if (userData.password.length > 128) {
      return { success: false, message: "Password cannot exceed 128 characters." };
    }

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.auth && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);

    // Normal Farmer/Dealer REGISTRATION must NOT call registerLocal() when Firebase is unavailable,
    // must NOT create a local-only real account, and must leave existing business data untouched.
    if (!isFbAvailable) {
      return {
        success: false,
        message: "Unable to connect to FarmLink authentication. Please check your internet connection and try again."
      };
    }

    return this.registerWithFirebase({
      ...userData,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone
    }, fb);
  }

  registerLocal(userData) {
    const users = (typeof window !== 'undefined' && window.Storage && window.Storage.getUsers) ? window.Storage.getUsers() : [];
    const cleanEmail = (userData.email || "").toLowerCase().trim();
    const exists = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);

    if (exists) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newId = (userData.role === "dealer" ? "dealer_" : "farmer_") + Date.now();
    const newUser = {
      id: newId,
      uid: newId,
      totalTransactions: 0,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
      isFirebaseAuth: false,
      ...userData,
      email: cleanEmail
    };

    users.push(newUser);
    if (typeof window !== 'undefined' && window.Storage && window.Storage.set) {
      window.Storage.set(USERS_STORAGE_KEY, users);
    }
    this.setSession(newUser);
    return { success: true, user: newUser };
  }

  async registerWithFirebase(userData, fb) {
    let userCredential = null;
    const cleanEmail = (userData.email || "").toLowerCase().trim();

    try {
      userCredential = await fb.auth.createUserWithEmailAndPassword(cleanEmail, userData.password);
    } catch (authErr) {
      let msg = authErr.message || "Registration failed.";
      if (authErr.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists. Please sign in.";
      } else if (authErr.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (authErr.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      } else if (authErr.code === "auth/network-request-failed" || (authErr.message && authErr.message.toLowerCase().includes("network"))) {
        msg = "Unable to connect to FarmLink authentication. Please check your internet connection and try again.";
      }
      return { success: false, message: msg, error: authErr };
    }

    const firebaseUser = userCredential.user;
    const uid = firebaseUser.uid;

    let resolvedName = (userData.name || userData.fullName || userData.displayName || (firebaseUser && firebaseUser.displayName) || "").trim();
    if (!resolvedName) {
      const emailPrefix = cleanEmail.split("@")[0].replace(/[._-]/g, " ").trim();
      resolvedName = emailPrefix.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }

    // Authoritative Profile in Firestore users/{uid} — strictly omitting password!
    const profile = {
      uid: uid,
      id: uid,
      email: cleanEmail,
      role: userData.role, // strictly "farmer" or "dealer"
      name: resolvedName,
      phone: (userData.phone || "").trim(),
      district: (userData.district || "Guntur").trim(),
      location: (userData.location || "").trim(),
      place: (userData.location || "").trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalTransactions: 0,
      rating: 5.0,
      reviewsCount: 0,
      isDemo: false,
      isFirebaseAuth: true,
      landSize: userData.landSize || "",
      currentCrops: userData.currentCrops || "",
      businessName: userData.businessName || "",
      businessType: userData.businessType || "",
      license: userData.license || "",
      commonlyPurchased: userData.commonlyPurchased || "",
      about: userData.about || ""
    };

    // Strip any undefined fields before writing to Firestore
    const cleanProfile = {};
    for (const [k, v] of Object.entries(profile)) {
      if (v !== undefined) cleanProfile[k] = v;
    }

    // Atomic persistence to Firestore users/{uid} with rollback on failure
    try {
      if (fb.db) {
        await fb.db.collection("users").doc(uid).set(cleanProfile);
      }
    } catch (profileErr) {
      console.error('[FarmLink Auth] Profile creation failed, rolling back Firebase Auth account:', profileErr);
      try {
        await firebaseUser.delete();
      } catch (cleanupErr) {
        console.warn('[FarmLink Auth] Rollback cleanup note:', cleanupErr);
      }
      return {
        success: false,
        message: "Failed to create user profile in Firestore. Account creation rolled back. Please try again."
      };
    }

    // Persist to active session & local cache
    this.setSession(profile);
    if (typeof window !== 'undefined' && window.Storage && window.Storage.getUsers) {
      const users = window.Storage.getUsers();
      users.push(profile);
      if (window.Storage.set) {
        window.Storage.set(USERS_STORAGE_KEY, users);
      }
    }

    return { success: true, user: profile };
  }

  demoLogin(role) {
    const users = (typeof window !== 'undefined' && window.Storage && window.Storage.getUsers) ? window.Storage.getUsers() : [];
    let target;

    if (role === "farmer") {
      target = users.find(u => u.id === "farmer_1") || users.find(u => u.role === "farmer");
    } else if (role === "dealer") {
      target = users.find(u => u.id === "dealer_1") || users.find(u => u.role === "dealer");
    } else if (role === "admin") {
      target = users.find(u => u.id === "admin_1") || users.find(u => u.role === "admin");
    }

    if (target) {
      this.setSession(target);
      this.redirectByRole(target.role);
    }
  }

  getPathPrefix(testPath = null) {
    const p = (testPath || (typeof window !== 'undefined' && window.location && window.location.pathname ? window.location.pathname : "")).toLowerCase().replace(/\\/g, "/");
    return p.includes("/farmer/") || p.includes("/dealer/") || p.includes("/admin/") ? "../" : "";
  }

  redirectByRole(role) {
    const pathPrefix = this.getPathPrefix();
    if (typeof window === 'undefined' || !window.location) return;

    if (role === "farmer") {
      window.location.href = pathPrefix + "farmer/dashboard.html";
    } else if (role === "dealer") {
      window.location.href = pathPrefix + "dealer/dashboard.html";
    } else if (role === "admin") {
      window.location.href = pathPrefix + "admin/dashboard.html";
    } else {
      window.location.href = pathPrefix + "index.html";
    }
  }

  async logout() {
    const role = this.currentUser ? this.currentUser.role : null;
    if (typeof window !== 'undefined' && window.Storage && typeof window.Storage.clearAllDashboardSync === 'function') {
      try { window.Storage.clearAllDashboardSync(); } catch (e) {}
    }
    this.clearSession();
    try {
      const fb = this.getFirebaseBridge();
      if (fb && fb.auth && typeof fb.auth.signOut === 'function') {
        await fb.auth.signOut();
      }
    } catch (err) {
      console.warn('[FarmLink Auth] Firebase signOut note:', err.message);
    }
    const pathPrefix = this.getPathPrefix();
    if (typeof window !== 'undefined' && window.location) {
      if (role === "farmer") {
        window.location.href = pathPrefix + "login.html?role=farmer";
      } else if (role === "dealer") {
        window.location.href = pathPrefix + "login.html?role=dealer";
      } else if (role === "admin") {
        window.location.href = pathPrefix + "login.html?role=admin";
      } else {
        window.location.href = pathPrefix + "login.html";
      }
    }
  }

  requireAuth(allowedRole = null) {
    const user = this.getCurrentUser();
    if (!user) {
      if (typeof document !== "undefined" && document.body) {
        document.body.style.display = "none";
      }
      const target = (allowedRole === "admin") ? "login.html?role=admin" : 
                     (allowedRole === "dealer") ? "login.html?role=dealer" : "login.html?role=farmer";
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = this.getPathPrefix() + target;
      }
      return false;
    }

    if (allowedRole && user.role !== allowedRole) {
      if (typeof document !== "undefined" && document.body) {
        document.body.style.display = "none";
      }
      this.redirectByRole(user.role);
      return false;
    }

    return true;
  }
}

// Global instance
const authInstance = new AuthService();
if (typeof window !== 'undefined') {
  window.Auth = authInstance;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = authInstance;
}
