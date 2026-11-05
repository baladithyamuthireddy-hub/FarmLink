/**
 * FarmLink - Fair Price & Market Reference Engine
 * Solves the price conflict by providing transparent benchmark ranges based on APMC Mandi rates.
 */

class MarketService {
  constructor() {}

  getBenchmarkForCrop(cropName) {
    if (!cropName) return null;
    const prices = window.Storage.getMarketPrices();
    const cleanName = cropName.toLowerCase().trim();

    // 1. Exact match
    const exact = prices.find(p => {
      const pCrop = (p.crop || p.cropName || "").toLowerCase().trim();
      return pCrop === cleanName;
    });
    if (exact) return exact;

    // 2. Longest / most specific substring match
    const matches = prices.filter(p => {
      const pCrop = (p.crop || p.cropName || "").toLowerCase().trim();
      return pCrop && (cleanName.includes(pCrop) || pCrop.includes(cleanName));
    });

    if (matches.length > 0) {
      matches.sort((a, b) => {
        const lenA = (a.crop || a.cropName || "").length;
        const lenB = (b.crop || b.cropName || "").length;
        return lenB - lenA;
      });
      return matches[0];
    }

    return null;
  }

  evaluateOffer(cropName, offerPrice) {
    const benchmark = this.getBenchmarkForCrop(cropName);
    if (!benchmark) {
      return {
        hasBenchmark: false,
        status: "unavailable",
        badgeClass: "fair-range-badge unavailable",
        message: "Market reference unavailable",
        messageTe: "మార్కెట్ ప్రామాణిక ధర అందుబాటులో లేదు"
      };
    }

    const marketPrice = Number(benchmark.marketPrice || 0);
    const minFairPrice = Number(benchmark.minFairPrice || benchmark.fairMin || marketPrice * 0.95);
    const maxFairPrice = Number(benchmark.maxFairPrice || benchmark.fairMax || marketPrice * 1.05);
    const unit = benchmark.unit || "kg";
    const price = Number(offerPrice);

    if (price < minFairPrice) {
      return {
        hasBenchmark: true,
        status: "below",
        badgeClass: "fair-range-badge below-range",
        marketPrice,
        minFairPrice,
        maxFairPrice,
        unit,
        message: "This offer is below the current reference range.",
        messageTe: "ఈ ఆఫర్ ప్రస్తుత ప్రామాణిక పరిధి కంటే తక్కువగా ఉంది."
      };
    } else if (price > maxFairPrice) {
      return {
        hasBenchmark: true,
        status: "above",
        badgeClass: "fair-range-badge above-range",
        marketPrice,
        minFairPrice,
        maxFairPrice,
        unit,
        message: "Offer is above the current reference range.",
        messageTe: "ఈ ఆఫర్ ప్రస్తుత ప్రామాణిక పరిధి కంటే ఎక్కువగా ఉంది."
      };
    } else {
      return {
        hasBenchmark: true,
        status: "fair",
        badgeClass: "fair-range-badge in-range",
        marketPrice,
        minFairPrice,
        maxFairPrice,
        unit,
        message: "Offer is within the current reference range.",
        messageTe: "ఈ ఆఫర్ ప్రస్తుత ప్రామాణిక పరిధిలోనే ఉంది."
      };
    }
  }

  renderPriceBenchmarkBadge(cropName, currentPrice) {
    const evaluation = this.evaluateOffer(cropName, currentPrice);
    const lang = window.I18n ? window.I18n.currentLang : "en";

    if (!evaluation.hasBenchmark) {
      const msg = lang === "te" ? evaluation.messageTe : evaluation.message;
      return `
        <div class="fair-price-meter">
          <div class="fair-range-badge" style="background: var(--bg-surface-secondary); color: var(--text-muted); border: 1px dashed var(--border-color); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>ℹ️</span>
            <span data-i18n="marketRefUnavailable">${msg}</span>
          </div>
        </div>
      `;
    }

    const msg = lang === "te" ? evaluation.messageTe : evaluation.message;

    return `
      <div class="fair-price-meter">
        <div class="fair-price-header" style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.35rem; color: var(--text-secondary);">
          <span><strong>Mandi Reference:</strong> ₹${evaluation.marketPrice}/${evaluation.unit}</span>
          <span><strong>Fair Range:</strong> ₹${evaluation.minFairPrice} – ₹${evaluation.maxFairPrice}/${evaluation.unit}</span>
        </div>
        <div class="${evaluation.badgeClass}">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" style="flex-shrink: 0;">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          <span>${msg}</span>
        </div>
      </div>
    `;
  }
}

// Global instance
window.Market = new MarketService();
