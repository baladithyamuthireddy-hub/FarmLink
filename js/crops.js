/**
 * FarmLink - Crop Listings & Quality Standards Service
 */

class CropService {
  constructor() {}

  getQualityGuidelines() {
    return {
      "Grade A": {
        badge: "badge-grade-a",
        label: "Grade A (Premium / Export Quality)",
        labelTe: "గ్రేడ్ A (ఉత్తమ / ఎగుమతి నాణ్యత)",
        criteria: "Uniform color and size, harvested within 24-48 hours, free of pest punctures or scars, moisture strictly verified."
      },
      "Grade B": {
        badge: "badge-grade-b",
        label: "Grade B (Standard Mandi Quality)",
        labelTe: "గ్రేడ్ B (సాధారణ మార్కెట్ నాణ్యత)",
        criteria: "Healthy produce with acceptable minor shape/size variations, standard commercial market grading."
      },
      "Grade C": {
        badge: "badge-grade-c",
        label: "Grade C (Processing / Bulk Grade)",
        labelTe: "గ్రేడ్ C (ప్రాసెసింగ్ / బల్క్ గ్రేడ్)",
        criteria: "Variable sizing or higher ripeness, recommended for commercial pulp, paste, or cattle feed."
      }
    };
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[m]);
  }

  getAvailableCrops() {
    if (window.Storage && typeof window.Storage.getCrops === "function") {
      return window.Storage.getCrops().filter(c => String(c.status || "").toLowerCase().trim() !== "removed");
    }
    return [];
  }

  filterCrops(crops, filters = {}) {
    if (!Array.isArray(crops) && typeof crops === "object" && crops !== null) {
      filters = crops;
      crops = this.getAvailableCrops();
    }
    if (!Array.isArray(crops)) crops = [];

    return crops.filter(crop => {
      const cropStatus = String(crop.status || "").toLowerCase().trim();
      const filterStatus = String(filters.status || "").toLowerCase().trim();
      const isRemoved = cropStatus === "removed";
      const wantRemoved = filterStatus === "removed";

      // Don't show Removed crops unless explicitly requested
      if (isRemoved && !filters.includeRemoved && !wantRemoved) {
        return false;
      }

      // Search across Crop name, Farmer name, Location, District, Description
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const cropTitle = (crop.title || crop.cropName || "").toLowerCase();
        const category = (crop.category || "").toLowerCase();
        const location = (crop.location || "").toLowerCase();
        const district = (crop.district || "").toLowerCase();
        const farmerName = (crop.farmerName || "").toLowerCase();
        const description = (crop.description || "").toLowerCase();

        const matches = cropTitle.includes(query) ||
                        category.includes(query) ||
                        location.includes(query) ||
                        district.includes(query) ||
                        farmerName.includes(query) ||
                        description.includes(query);
        if (!matches) return false;
      }

      // Category
      if (filters.category && filters.category !== "all") {
        if (crop.category !== filters.category) return false;
      }

      // Quality Grade
      const reqGrade = filters.qualityGrade || filters.grade;
      if (reqGrade && reqGrade !== "all") {
        const qg = (crop.qualityGrade || "").toLowerCase().trim();
        const target = reqGrade.toLowerCase().trim();
        if (target === "grade a" || target === "a") {
          if (qg !== "grade a" && qg !== "a") return false;
        } else if (target === "grade b" || target === "b") {
          if (qg !== "grade b" && qg !== "b") return false;
        } else if (target === "grade c" || target === "c") {
          if (qg !== "grade c" && qg !== "c") return false;
        } else if (qg !== target) {
          return false;
        }
      }

      // District / Location
      if (filters.district && filters.district !== "all") {
        const dQuery = filters.district.toLowerCase();
        const hasDistrict = (crop.district || "").toLowerCase() === dQuery;
        const hasLoc = (crop.location || "").toLowerCase().includes(dQuery);
        if (!hasDistrict && !hasLoc) return false;
      }

      // Status / Availability
      if (filters.status && filterStatus !== "all") {
        if (filterStatus === "available") {
          if (cropStatus !== "available" && cropStatus !== "active") return false;
        } else {
          if (cropStatus !== filterStatus) return false;
        }
      }

      // Min Price
      if (filters.minPrice !== undefined && filters.minPrice !== "" && !isNaN(Number(filters.minPrice))) {
        if (Number(crop.expectedPrice) < Number(filters.minPrice)) return false;
      }

      // Max Price
      if (filters.maxPrice !== undefined && filters.maxPrice !== "" && !isNaN(Number(filters.maxPrice))) {
        if (Number(crop.expectedPrice) > Number(filters.maxPrice)) return false;
      }

      // Min Quantity
      if (filters.minQuantity !== undefined && filters.minQuantity !== "" && !isNaN(Number(filters.minQuantity))) {
        if (Number(crop.quantity) < Number(filters.minQuantity)) return false;
      }

      // Max Quantity
      if (filters.maxQuantity !== undefined && filters.maxQuantity !== "" && !isNaN(Number(filters.maxQuantity))) {
        if (Number(crop.quantity) > Number(filters.maxQuantity)) return false;
      }

      // Harvest Date Timeline (upcoming, this_week, this_month, all)
      if (filters.harvestDate && filters.harvestDate !== "all") {
        const cropHarvest = crop.harvestDate ? new Date(crop.harvestDate).getTime() : 0;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const nowMs = now.getTime();
        const oneWeekAgoMs = nowMs - 7 * 86400000;
        const oneWeekAheadMs = nowMs + 7 * 86400000;
        const oneMonthAgoMs = nowMs - 30 * 86400000;
        const oneMonthAheadMs = nowMs + 30 * 86400000;

        if (filters.harvestDate === "upcoming") {
          if (cropHarvest < nowMs) return false;
        } else if (filters.harvestDate === "this_week") {
          if (cropHarvest < oneWeekAgoMs || cropHarvest > oneWeekAheadMs) return false;
        } else if (filters.harvestDate === "this_month") {
          if (cropHarvest < oneMonthAgoMs || cropHarvest > oneMonthAheadMs) return false;
        }
      }

      return true;
    });
  }

  renderCropCard(crop, role = "dealer") {
    const isFarmer = role === "farmer";
    const guidelines = this.getQualityGuidelines();
    const gradeInfo = guidelines[crop.qualityGrade] || guidelines["Grade A"];
    const cropName = this.escapeHtml(crop.cropName || crop.title || "Fresh Agricultural Produce");
    const farmerName = this.escapeHtml(crop.farmerName || "Verified Farmer");
    const location = this.escapeHtml(crop.location || "Andhra Pradesh");
    const description = this.escapeHtml(crop.description || "");
    const fairHtml = window.Market ? window.Market.renderPriceBenchmarkBadge(cropName, crop.expectedPrice) : "";
    const rawStatus = crop.status || "Available";
    const displayStatus = (rawStatus === "active" || rawStatus === "Available") ? "Available" : rawStatus;

    // Status badge style
    let statusBadgeClass = "badge-success";
    if (displayStatus === "Under Negotiation") statusBadgeClass = "badge-warning";
    if (displayStatus === "Sold") statusBadgeClass = "badge-grade-b";
    if (displayStatus === "Removed") statusBadgeClass = "badge-danger";

    const imgSrc = crop.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80";

    return `
      <div class="crop-card" id="card-${crop.id}">
        <div class="crop-card-img" style="background-image: url('${imgSrc}'); background-size: cover; background-position: center; position: relative;">
          <div class="crop-card-badges" style="position: absolute; top: 10px; left: 10px; display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <span class="badge ${gradeInfo.badge}">${this.escapeHtml(crop.qualityGrade || "Grade A")}</span>
            <span class="badge badge-success">${this.escapeHtml(crop.category || "Produce")}</span>
          </div>
          <div style="position: absolute; top: 10px; right: 10px;">
            <span class="badge ${statusBadgeClass}">${displayStatus}</span>
          </div>
        </div>
        <div class="crop-card-body">
          <div class="crop-card-header">
            <h3 class="crop-card-title">${cropName}</h3>
          </div>
          
          <div class="crop-card-location">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${location} • By ${farmerName}</span>
          </div>

          <p class="text-sm text-muted" style="margin-bottom: 0.85rem; line-height: 1.4;">
            ${description ? description.substring(0, 95) + (description.length > 95 ? '...' : '') : 'Freshly harvested authentic produce from verified regional farmers.'}
          </p>

          <div class="crop-card-stats">
            <div class="crop-stat-item">
              <span class="crop-stat-key">Available Qty</span>
              <span class="crop-stat-val">${Number(crop.quantity || 0).toLocaleString()} ${this.escapeHtml(crop.unit || 'kg')}</span>
            </div>
            <div class="crop-stat-item">
              <span class="crop-stat-key">Harvest Date</span>
              <span class="crop-stat-val">${crop.harvestDate || 'Freshly Harvested'}</span>
            </div>
          </div>

          ${fairHtml}

          <div class="crop-price-box">
            <div>
              <span class="text-xs text-muted" style="display:block; text-transform:uppercase; font-weight:600;">Expected Price</span>
              <span class="crop-price-val">₹${crop.expectedPrice} <small class="text-xs text-muted">/ ${this.escapeHtml(crop.unit || 'kg')}</small></span>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${isFarmer ? `
                <button class="btn btn-secondary btn-sm" onclick="viewCropDetails('${crop.id}')">View</button>
                <button class="btn btn-outline btn-sm" onclick="editCrop('${crop.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCropListing('${crop.id}', this)">Remove</button>
              ` : `
                <a href="crop-details.html?id=${crop.id}" class="btn btn-secondary btn-sm">View Details</a>
                ${displayStatus === 'Sold' ? `
                  <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: not-allowed;">Sold Out</button>
                ` : `
                  <button class="btn btn-primary btn-sm" onclick="openOfferModal('${crop.id}')">Make Offer</button>
                `}
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Global instance
window.Crops = new CropService();
