/**
 * FarmLink - Dark/Light Theme Controller
 */

class ThemeService {
  constructor() {
    this.theme = localStorage.getItem("farmlink_theme") || 
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
  }

  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("farmlink_theme", theme);
    this.updateIcons();
  }

  toggleTheme() {
    const nextTheme = this.theme === "light" ? "dark" : "light";
    this.applyTheme(nextTheme);
  }

  updateIcons() {
    const themeBtns = document.querySelectorAll(".theme-toggle-btn");
    themeBtns.forEach(btn => {
      if (this.theme === "dark") {
        btn.innerHTML = `
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"></circle>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
          </svg>
          <span class="theme-label">Light</span>
        `;
      } else {
        btn.innerHTML = `
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <span class="theme-label">Dark</span>
        `;
      }
    });
  }
}

// Global instance
window.Theme = new ThemeService();
document.addEventListener("DOMContentLoaded", () => {
  window.Theme.updateIcons();
});
