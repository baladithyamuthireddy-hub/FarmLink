/**
 * FarmLink - Farmer Cultivation & Profit Calculator Service
 */

class CalculatorService {
  constructor() {
    this.presets = {
      chilli: {
        name: "1 Acre Guntur Teja Chilli",
        seed: 8500,
        fertilizer: 19000,
        pesticide: 16000,
        labour: 28000,
        irrigation: 5500,
        transport: 7000,
        other: 4000,
        yield: 1400, // kg
        price: 205 // ₹/kg
      },
      tomato: {
        name: "1 Acre Hybrid Round Tomato",
        seed: 6500,
        fertilizer: 14000,
        pesticide: 11000,
        labour: 22000,
        irrigation: 4500,
        transport: 9000,
        other: 3000,
        yield: 8000, // kg
        price: 24 // ₹/kg
      },
      rice: {
        name: "1 Acre Sona Masoori Rice (Paddy)",
        seed: 3500,
        fertilizer: 9500,
        pesticide: 5500,
        labour: 15000,
        irrigation: 3500,
        transport: 4500,
        other: 2500,
        yield: 2600, // kg
        price: 27 // ₹/kg
      },
      cotton: {
        name: "1 Acre Long Staple Cotton",
        seed: 4500,
        fertilizer: 11000,
        pesticide: 8500,
        labour: 19000,
        irrigation: 4000,
        transport: 5000,
        other: 3000,
        yield: 1200, // kg
        price: 76 // ₹/kg
      }
    };
  }

  calculate(inputs = {}) {
    const safeNum = (v) => {
      const n = Number(v);
      return isNaN(n) ? 0 : Math.max(0, n);
    };

    const totalInvestment = safeNum(inputs.seed) +
                            safeNum(inputs.fertilizer) +
                            safeNum(inputs.pesticide) +
                            safeNum(inputs.labour) +
                            safeNum(inputs.irrigation) +
                            safeNum(inputs.transport) +
                            safeNum(inputs.other);

    const yieldQty = safeNum(inputs.yield);
    const sellingPrice = safeNum(inputs.price);
    const expectedRevenue = yieldQty * sellingPrice;
    const netProfit = expectedRevenue - totalInvestment;
    const isProfit = netProfit >= 0;
    const margin = expectedRevenue > 0 ? Number(((netProfit / expectedRevenue) * 100).toFixed(1)) : 0;
    const roi = totalInvestment > 0 ? Number(((netProfit / totalInvestment) * 100).toFixed(1)) : 0;
    const costPerKg = yieldQty > 0 ? Number((totalInvestment / yieldQty).toFixed(2)) : 0;

    return {
      totalInvestment,
      expectedRevenue,
      netProfit,
      isProfit,
      margin: Number(margin),
      roi: Number(roi),
      costPerKg: Number(costPerKg)
    };
  }

  saveCalculation(data) {
    if (!window.Storage) return null;
    return window.Storage.addCalculation(data);
  }

  getSavedCalculations(farmerId) {
    if (!window.Storage) return [];
    return window.Storage.getCalculations(farmerId);
  }

  deleteCalculation(id) {
    if (!window.Storage) return false;
    return window.Storage.deleteCalculation(id);
  }

  getCalculationById(id) {
    if (!window.Storage) return null;
    return window.Storage.getCalculationById(id);
  }
}

// Global instance
window.Calculator = new CalculatorService();
