/**
 * FarmLink - Admin Management & Moderation Service
 */

class AdminService {
  constructor() {}

  getPlatformStats() {
    const users = window.Storage.getUsers();
    const crops = window.Storage.getCrops();
    const transactions = window.Storage.getTransactions();
    const offers = window.Storage.getOffers();

    const farmers = users.filter(u => u.role === "farmer");
    const dealers = users.filter(u => u.role === "dealer");
    const activeCrops = crops.filter(c => c.status === "active");

    const totalVolume = transactions.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

    return {
      totalFarmers: farmers.length,
      totalDealers: dealers.length,
      activeListings: activeCrops.length,
      totalTransactions: transactions.length,
      totalVolume: totalVolume,
      activeNegotiations: offers.filter(o => o.status === "pending" || o.status === "countered").length
    };
  }

  saveMarketPrice(data) {
    if (data.id) {
      return window.Storage.updateMarketPrice(data.id, data);
    } else {
      return window.Storage.addMarketPrice(data);
    }
  }

  deleteMarketPrice(id) {
    window.Storage.deleteMarketPrice(id);
  }

  removeCropListing(id) {
    window.Storage.deleteCrop(id);
  }
}

// Global instance
window.Admin = new AdminService();
