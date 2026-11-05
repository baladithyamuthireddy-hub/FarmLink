/**
 * FarmLink - Core Application Coordinator & UI Utilities
 */

class AppController {
  constructor() {
    this.initToastContainer();
    this.initEventListeners();
  }

  initToastContainer() {
    if (!document.getElementById("toast-container")) {
      const container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }
  }

  escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  showToast(message, type = "info", duration = 3500) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconSvg = `
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
      </svg>
    `;

    if (type === "success") {
      iconSvg = `
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
      `;
    } else if (type === "error") {
      iconSvg = `
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span style="font-size: 0.88rem; font-weight: 500;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  updateUserDisplay() {
    if (!window.Auth) return;
    const user = window.Auth.getCurrentUser();
    if (!user) return;

    // 1. User Name Displays across Farmer, Dealer, and Admin layouts
    const nameEls = document.querySelectorAll(".user-name-display, .user-name, .sidebar-footer .user-name, .user-mini-profile .user-name");
    nameEls.forEach(el => {
      el.textContent = user.name;
    });

    // 2. User Role Displays
    const roleEls = document.querySelectorAll(".user-role-display, .user-role, .sidebar-footer .user-role, .user-mini-profile .user-role");
    roleEls.forEach(el => {
      const loc = user.district || (user.location ? user.location.split(",")[0] : "AP");
      el.textContent = `${user.role.toUpperCase()} • ${loc}`;
    });

    // 3. User Avatar Initials
    const avatarEls = document.querySelectorAll(".user-avatar-display, .user-avatar, .sidebar-footer .user-avatar, .user-mini-profile .user-avatar");
    const initials = (user.name || "FL").trim().split(/\s+/).map(n => n[0]).join("").substring(0, 2).toUpperCase();
    avatarEls.forEach(el => {
      el.textContent = initials;
    });

    // 4. Welcome Banner Titles on Dashboards & Profile Headers
    const welcomeNameEls = document.querySelectorAll("#farmer-welcome-name, #dealer-welcome-name, .welcome-user-name, #welcome-user-name, #profile-name, #dealer-name");
    welcomeNameEls.forEach(el => {
      el.textContent = user.name;
    });
  }

  initEventListeners() {
    const onReady = () => {
      // Mobile sidebar drawer
      const toggleBtn = document.querySelector(".mobile-menu-toggle");
      const sidebar = document.querySelector(".sidebar");
      const overlay = document.querySelector(".sidebar-overlay");

      if (toggleBtn && sidebar && overlay) {
        toggleBtn.addEventListener("click", () => {
          sidebar.classList.toggle("open");
          overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", () => {
          sidebar.classList.remove("open");
          overlay.classList.remove("active");
        });
      }

      // Populate user info in header/sidebar if logged in
      this.updateUserDisplay();

      // Close modal on backdrop click
      document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
        backdrop.addEventListener("click", (e) => {
          if (e.target === backdrop) {
            backdrop.classList.remove("active");
          }
        });
      });

      // Initialize Notification Bell in Topbar
      this.initNotificationWidget();

      // Listen for real-time notification updates
      window.addEventListener("farmlink:notifications-updated", () => {
        this.updateNotificationBadge();
        const dropdown = document.getElementById("app-notif-dropdown");
        if (dropdown && dropdown.style.display === "flex") {
          this.renderNotificationList();
        }
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onReady);
    } else {
      onReady();
    }
  }

  formatRelativeTime(isoOrDateString) {
    if (!isoOrDateString) return "";
    const date = new Date(isoOrDateString);
    if (isNaN(date.getTime())) return String(isoOrDateString);
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    const isTe = window.I18n && window.I18n.currentLang === "te";

    if (diffMins < 1) return isTe ? "ఇప్పుడే" : "Just now";
    if (diffMins < 60) return isTe ? `${diffMins} నిమిషాల క్రితం` : `${diffMins} min ago`;
    if (diffHours < 24) return isTe ? `${diffHours} గంటల క్రితం` : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return isTe ? "నిన్న" : "Yesterday";
    if (diffDays < 7) return isTe ? `${diffDays} రోజుల క్రితం` : `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  initNotificationWidget() {
    const topbarRight = document.querySelector(".topbar-right");
    if (!topbarRight || document.querySelector(".notification-dropdown-wrapper")) return;

    const user = window.Auth ? window.Auth.getCurrentUser() : null;
    if (!user) return;

    const notifPageLink = "notifications.html";

    const wrapper = document.createElement("div");
    wrapper.className = "notification-dropdown-wrapper";
    wrapper.style.cssText = "position: relative; display: inline-flex; align-items: center; margin-right: 0.25rem;";
    wrapper.innerHTML = `
      <button id="notif-bell-btn" class="btn-icon" title="Notifications" style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: var(--radius-full); border: 1px solid var(--border-color); background: var(--bg-surface);">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span id="app-notif-badge" style="display: none; position: absolute; top: -3px; right: -3px; background: #dc2626; color: white; border-radius: 999px; font-size: 0.65rem; font-weight: 700; padding: 0.1rem 0.35rem; min-width: 17px; text-align: center; border: 2px solid var(--bg-surface); line-height: 1.1;">0</span>
      </button>
      <div id="app-notif-dropdown" style="display: none; position: absolute; right: 0; top: calc(100% + 8px); width: 330px; z-index: 10000; padding: 0; border: 1px solid var(--border-color); border-radius: var(--radius-lg); max-height: 440px; overflow: hidden; flex-direction: column; background: var(--bg-surface); box-shadow: var(--shadow-lg);">
        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-secondary);">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);" data-i18n="notificationsTitle">Notifications</span>
          <button onclick="window.App.markAllNotificationsRead()" style="font-size: 0.75rem; text-decoration: none; color: var(--primary-600); cursor: pointer; border: none; background: transparent; padding: 0; font-weight: 600;" data-i18n="markAllRead">Mark all read</button>
        </div>
        <div id="app-notif-list" style="overflow-y: auto; max-height: 320px; padding: 0.25rem 0;"></div>
        <div style="padding: 0.65rem 1rem; border-top: 1px solid var(--border-color); text-align: center; background: var(--bg-surface-secondary);">
          <a href="${notifPageLink}" style="font-size: 0.78rem; font-weight: 700; color: var(--primary-700); display: inline-flex; align-items: center; gap: 0.35rem;" data-i18n="viewAllNotifications">
            <span>View All Notifications</span> <span>&rarr;</span>
          </a>
        </div>
      </div>
    `;

    topbarRight.insertBefore(wrapper, topbarRight.firstChild);

    // Event listener for toggling dropdown
    const bellBtn = wrapper.querySelector("#notif-bell-btn");
    bellBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleNotificationDropdown();
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const dropdown = document.getElementById("app-notif-dropdown");
      if (dropdown && !wrapper.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });

    this.updateNotificationBadge();

    // Start realtime notification listener if user logged in
    if (window.Storage && typeof window.Storage.initNotificationsSync === "function") {
      window.Storage.initNotificationsSync(() => {
        this.updateNotificationBadge();
      }, user.role);
    }
  }

  updateNotificationBadge() {
    const badge = document.getElementById("app-notif-badge");
    if (!badge || !window.Storage) return;

    const user = window.Auth ? window.Auth.getCurrentUser() : null;
    const targetUserId = user ? (user.uid || user.id) : null;
    const count = window.Storage.getUnreadNotificationCount(targetUserId, user ? user.role : null);
    if (count > 0) {
      badge.textContent = count > 9 ? "9+" : count;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }

    // Also update any in-page summary counters without clobbering full dashboard banner text
    if (typeof window.updateDashboardNotificationSummary === 'function') {
      try { window.updateDashboardNotificationSummary(); } catch (e) {}
    } else {
      const summaryText = document.getElementById("dashboard-notif-summary-text");
      if (summaryText) {
        const isTe = window.I18n && window.I18n.currentLang === "te";
        const newText = count > 0
          ? (isTe ? `మీకు ${count} కొత్త / చదవని నోటిఫికేషన్${count > 1 ? 'లు' : ''} ఉన్నాయి.` : `You have ${count} unread notification${count > 1 ? 's' : ''} awaiting your review.`)
          : (isTe ? "అన్ని నోటిఫికేషన్లు చదవబడ్డాయి. కొత్త అప్‌డేట్‌లు లేవు." : "You are all caught up! No unread notifications.");
        if (summaryText.textContent !== newText) {
          summaryText.textContent = newText;
        }
      }
    }
  }

  toggleNotificationDropdown() {
    const dropdown = document.getElementById("app-notif-dropdown");
    if (!dropdown) return;

    if (dropdown.style.display === "flex") {
      dropdown.style.display = "none";
    } else {
      this.renderNotificationList();
      dropdown.style.display = "flex";
    }
  }

  renderNotificationList() {
    const listEl = document.getElementById("app-notif-list");
    if (!listEl || !window.Storage) return;

    const user = window.Auth ? window.Auth.getCurrentUser() : null;
    const targetUserId = user ? (user.uid || user.id) : null;
    const notifications = window.Storage.getNotifications(targetUserId, user ? user.role : null);
    const isTe = window.I18n && window.I18n.currentLang === "te";

    if (notifications.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          <div style="font-size: 1.75rem; margin-bottom: 0.25rem;">🔔</div>
          <span data-i18n="noNotifications">${isTe ? "నోటిఫికేషన్లు లేవు" : "No notifications yet"}</span>
        </div>
      `;
      return;
    }

    listEl.innerHTML = notifications.slice(0, 15).map(n => {
      const isRead = !!(n.isRead || n.read);
      const rawTitle = (isTe && n.titleTe) ? n.titleTe : (n.title || "");
      const rawMsg = (isTe && n.messageTe) ? n.messageTe : (n.message || "");
      const title = this.escapeHtml(rawTitle);
      const msg = this.escapeHtml(rawMsg);
      const timeStr = this.formatRelativeTime(n.timestamp || n.createdAt);

      return `
        <div onclick="window.App.handleNotificationClick('${n.id}', '${n.link || ''}')" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); cursor: pointer; background: ${isRead ? 'transparent' : 'rgba(22, 163, 74, 0.08)'}; transition: background 0.15s ease; display: flex; gap: 0.75rem; align-items: flex-start;" onmouseover="this.style.background='var(--bg-surface-secondary)'" onmouseout="this.style.background='${isRead ? 'transparent' : 'rgba(22, 163, 74, 0.08)'}'">
          <div style="margin-top: 5px; width: 8px; height: 8px; border-radius: 50%; background: ${isRead ? 'transparent' : 'var(--primary-600)'}; flex-shrink: 0;"></div>
          <div style="flex: 1;">
            <div style="font-size: 0.85rem; font-weight: ${isRead ? '600' : '700'}; color: var(--text-primary); margin-bottom: 2px;">${title}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.35;">${msg}</div>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">${timeStr}</div>
          </div>
        </div>
      `;
    }).join("");

    if (window.I18n && typeof window.I18n.applyTranslations === "function") window.I18n.applyTranslations();
  }

  handleNotificationClick(id, link) {
    if (window.Storage) {
      window.Storage.markNotificationAsRead(id);
      this.updateNotificationBadge();
    }
    const dropdown = document.getElementById("app-notif-dropdown");
    if (dropdown) dropdown.style.display = "none";
    if (link) {
      window.location.href = link;
    } else {
      this.renderNotificationList();
    }
  }

  markAllNotificationsRead() {
    if (window.Storage) {
      const user = window.Auth ? window.Auth.getCurrentUser() : null;
      const targetUserId = user ? (user.uid || user.id) : null;
      window.Storage.markAllNotificationsAsRead(targetUserId, user ? user.role : null);
      this.updateNotificationBadge();
      this.renderNotificationList();
      const isTe = window.I18n && window.I18n.currentLang === "te";
      this.showToast(isTe ? "అన్ని నోటిఫికేషన్లు చదివినట్లు గుర్తించబడ్డాయి." : "All notifications marked as read.", "info");
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
}

// Global instance
window.App = new AppController();

// Global helper functions
window.escapeHtml = function (str) {
  return window.App ? window.App.escapeHtml(str) : String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};

// Global Network Status Listeners
if (typeof window !== "undefined") {
  window.addEventListener("online", function () {
    if (window.App && typeof window.App.showToast === "function") {
      const isTe = window.I18n && window.I18n.currentLang === "te";
      window.App.showToast(isTe ? "ఇంటర్నెట్ కనెక్షన్ పునరుద్ధరించబడింది." : "Internet connection restored.", "success");
    }
  });

  window.addEventListener("offline", function () {
    if (window.App && typeof window.App.showToast === "function") {
      const isTe = window.I18n && window.I18n.currentLang === "te";
      window.App.showToast(isTe ? "ఇంటర్నెట్ కనెక్షన్ కోల్పోయింది. ఆఫ్‌లైన్ మోడ్." : "Internet connection lost. Operating in offline mode.", "warning");
    }
  });
}

function toggleLanguage() {
  if (window.I18n) {
    window.I18n.toggleLanguage();
    if (window.App) {
      const msg = window.I18n.currentLang === "te" ? "భాష తెలుగులోకి మార్చబడింది" : "Language switched to English";
      window.App.showToast(msg, "info");
    }
  }
}

function toggleTheme() {
  if (window.Theme) {
    window.Theme.toggleTheme();
  }
}

function logoutUser() {
  if (window.Auth) {
    window.Auth.logout();
  }
}
