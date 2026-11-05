/**
 * FarmLink - Central Data Storage Service (LocalStorage / Future Firebase Firestore Adapter)
 * Provides pre-seeded Andhra Pradesh agricultural demo data and CRUD operations.
 */

const STORAGE_KEYS = {
  USERS: "farmlink_users",
  CROPS: "farmlink_crops",
  MARKET_PRICES: "farmlink_market_prices",
  OFFERS: "farmlink_offers",
  MESSAGES: "farmlink_messages",
  CONVERSATIONS: "farmlink_conversations_cache",
  TRANSACTIONS: "farmlink_transactions",
  WEATHER: "farmlink_weather",
  CALCULATIONS: "farmlink_calculations",
  REVIEWS: "farmlink_reviews",
  NOTIFICATIONS: "farmlink_notifications",
  ACTIVITIES: "farmlink_activities",
  SAVED_CROPS: "farmlink_saved_crops",
  SETTINGS: "farmlink_settings"
};

// Aliases for compatibility
const farmLink_weather = STORAGE_KEYS.WEATHER;
const farmLink_calculations = STORAGE_KEYS.CALCULATIONS;
const farmLink_reviews = STORAGE_KEYS.REVIEWS;

// Deterministic IDs for demo records
const PREDEFINED_DEMO_USER_IDS = ["farmer_1", "dealer_1", "admin_1", "farmer_2", "farmer_3", "farmer_4", "dealer_2"];
const PREDEFINED_DEMO_CROP_IDS = ["crop_1", "crop_2", "crop_3", "crop_4", "crop_5", "crop_6"];
const PREDEFINED_DEMO_OFFER_IDS = ["offer_1", "offer_2"];
const PREDEFINED_DEMO_TX_IDS = ["tx_101", "tx_102"];

class StorageService {
  constructor() {
    this.initDemoData();
    this.migrateLegacyDemoRecords();
  }

  initDemoData() {
    // 1. Pre-seeded Users
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const initialUsers = [
        {
          id: "farmer_1",
          email: "ramesh@farmlink.in",
          password: "password123",
          phone: "9876543210",
          name: "Ramesh Naidu",
          role: "farmer",
          location: "Tadikonda, Guntur Dist, AP",
          district: "Guntur",
          age: 46,
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          currentCrops: "Guntur Teja Chilli, Hybrid Tomato, Cotton",
          previousCrops: "Black Gram, Groundnut, Maize",
          totalTransactions: 34,
          successfulSales: 34,
          rating: 4.9,
          reviewsCount: 28,
          about: "Progressive farmer with 22 years experience in cultivating export-quality Teja Chilli and high-yield tomatoes using drip irrigation and integrated pest management.",
          isDemo: true
        },
        {
          id: "dealer_1",
          email: "venkat@agritraders.in",
          password: "password123",
          phone: "9848012345",
          name: "Venkat Rao",
          role: "dealer",
          businessName: "Sri Lakshmi Wholesale Agri Traders",
          location: "Gollapudi Wholesale Market, Vijayawada, AP",
          district: "Krishna",
          businessType: "Wholesaler & Exporter",
          commonlyPurchased: "Chilli, Tomato, Rice, Cotton, Maize",
          rating: 4.8,
          reviewsCount: 42,
          totalPurchases: 62,
          photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
          about: "Leading agricultural wholesale distributor operating since 2008. We supply top quality regional agricultural produce to food processors and supermarkets across South India.",
          isDemo: true
        },
        {
          id: "admin_1",
          email: "admin@farmlink.in",
          password: "password123",
          phone: "9000000001",
          name: "APMC Agricultural Officer",
          role: "admin",
          location: "Amaravati / Guntur Market Yard",
          district: "Guntur",
          about: "Official Agricultural Market Committee monitor ensuring price transparency and fair trade practices.",
          isDemo: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }

    // 2. Pre-seeded Market Reference Prices (Admin-managed)
    if (!localStorage.getItem(STORAGE_KEYS.MARKET_PRICES)) {
      const initialPrices = [
        {
          id: "mp_1",
          crop: "Tomato",
          cropName: "Tomato",
          cropTe: "టమాటా",
          mandi: "Madanapalle Mandi, Chittoor",
          location: "Madanapalle Mandi, Chittoor",
          marketPrice: 32,
          referencePrice: 32,
          minFairPrice: 30,
          maxFairPrice: 35,
          fairMin: 30,
          fairMax: 35,
          unit: "kg",
          effectiveDate: "2026-09-17",
          updatedDate: "Today, 07:00 AM",
          isDemo: true
        },
        {
          id: "mp_2",
          crop: "Guntur Teja Chilli",
          cropName: "Guntur Teja Chilli",
          cropTe: "గుంటూరు తేజ మిరప",
          mandi: "Guntur Mirchi Yard",
          location: "Guntur Mirchi Yard",
          marketPrice: 205,
          referencePrice: 205,
          minFairPrice: 195,
          maxFairPrice: 215,
          fairMin: 195,
          fairMax: 215,
          unit: "kg",
          effectiveDate: "2026-09-17",
          updatedDate: "Today, 06:45 AM",
          isDemo: true
        },
        {
          id: "mp_3",
          crop: "Sona Masoori Rice (Paddy)",
          cropName: "Sona Masoori Rice (Paddy)",
          cropTe: "సోనా మసూరి వరి",
          mandi: "Tadepalligudem Mandi, West Godavari",
          location: "Tadepalligudem Mandi, West Godavari",
          marketPrice: 28,
          referencePrice: 28,
          minFairPrice: 26,
          maxFairPrice: 30,
          fairMin: 26,
          fairMax: 30,
          unit: "kg",
          effectiveDate: "2026-09-17",
          updatedDate: "Yesterday, 05:30 PM",
          isDemo: true
        },
        {
          id: "mp_4",
          crop: "Long Staple Cotton",
          cropName: "Long Staple Cotton",
          cropTe: "పొడవాటి పత్తి",
          mandi: "Kurnool Cotton Market",
          location: "Kurnool Cotton Market",
          marketPrice: 76,
          referencePrice: 76,
          minFairPrice: 73,
          maxFairPrice: 80,
          fairMin: 73,
          fairMax: 80,
          unit: "kg",
          effectiveDate: "2026-09-17",
          updatedDate: "Today, 08:15 AM",
          isDemo: true
        },
        {
          id: "mp_5",
          crop: "Cavendish Banana",
          cropName: "Cavendish Banana",
          cropTe: "అరటి పండ్లు",
          mandi: "Kadapa Fruit Market",
          location: "Kadapa Fruit Market",
          marketPrice: 21,
          referencePrice: 21,
          minFairPrice: 19,
          maxFairPrice: 23,
          fairMin: 19,
          fairMax: 23,
          unit: "kg",
          effectiveDate: "2026-09-17",
          updatedDate: "Today, 06:00 AM",
          isDemo: true
        },
        {
          id: "mp_6",
          crop: "Bold Groundnut",
          cropName: "Bold Groundnut",
          cropTe: "వేరుశనగ",
          mandi: "Anantapur Agricultural Yard",
          location: "Anantapur Agricultural Yard",
          marketPrice: 71,
          referencePrice: 71,
          minFairPrice: 68,
          maxFairPrice: 74,
          fairMin: 68,
          fairMax: 74,
          unit: "kg",
          effectiveDate: "2026-09-17",
          updatedDate: "Today, 07:30 AM",
          isDemo: true
        },
        {
          id: "mp_7",
          crop: "Yellow Dent Maize",
          cropName: "Yellow Dent Maize",
          cropTe: "మొక్కజొన్న",
          mandi: "Nandyal Mandi",
          location: "Nandyal Mandi",
          marketPrice: 23,
          referencePrice: 23,
          minFairPrice: 21,
          maxFairPrice: 25,
          fairMin: 21,
          fairMax: 25,
          unit: "kg",
          effectiveDate: "2026-09-17",
          updatedDate: "Yesterday, 04:00 PM",
          isDemo: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.MARKET_PRICES, JSON.stringify(initialPrices));
    }

    // 3. Pre-seeded Crops
    if (!localStorage.getItem(STORAGE_KEYS.CROPS)) {
      const initialCrops = [
        {
          id: "crop_1",
          farmerId: "farmer_1",
          farmerName: "Ramesh Naidu",
          farmerPhone: "9876543210",
          title: "Hybrid Fresh Red Tomatoes",
          category: "Vegetables",
          quantity: 1800,
          unit: "kg",
          expectedPrice: 34,
          harvestDate: "2026-09-12",
          location: "Tadikonda, Guntur Dist",
          district: "Guntur",
          qualityGrade: "Grade A",
          gradeDetails: "Uniform size, harvested 24 hrs ago, firm skin, nil blemish.",
          description: "Organically nurtured hybrid round tomatoes. Carefully crate packed and ready for immediate wholesale pickup.",
          image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
          status: "active",
          listedDate: "2026-09-12",
          isDemo: true
        },
        {
          id: "crop_2",
          farmerId: "farmer_1",
          farmerName: "Ramesh Naidu",
          farmerPhone: "9876543210",
          title: "Guntur Teja Dry Red Chilli",
          category: "Spices & Cash Crops",
          quantity: 1200,
          unit: "kg",
          expectedPrice: 210,
          harvestDate: "2026-09-10",
          location: "Tadikonda, Guntur Dist",
          district: "Guntur",
          qualityGrade: "Grade A",
          gradeDetails: "Deep red natural gloss, high pungency/SHU, moisture < 10%.",
          description: "Certified Guntur Teja variety, sun-dried on clean tarpaulins. Ideal for spice grinding and international export batches.",
          image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80",
          status: "active",
          listedDate: "2026-09-11",
          isDemo: true
        },
        {
          id: "crop_3",
          farmerId: "farmer_2",
          farmerName: "Smt. Lakshmi Devi",
          farmerPhone: "9876501234",
          title: "Premium Long Staple White Cotton",
          category: "Cash Crops",
          quantity: 2800,
          unit: "kg",
          expectedPrice: 77,
          harvestDate: "2026-09-08",
          location: "Adoni, Kurnool Dist",
          district: "Kurnool",
          qualityGrade: "Grade B",
          gradeDetails: "Clean staple length 29-30mm, minimal leaf trash, standard pressing.",
          description: "First-picking high quality cotton bales with excellent staple strength.",
          image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80",
          status: "active",
          listedDate: "2026-09-10",
          isDemo: true
        },
        {
          id: "crop_4",
          farmerId: "farmer_3",
          farmerName: "K. Appala Swamy",
          farmerPhone: "9849123456",
          title: "Sona Masoori Raw Paddy Rice",
          category: "Grains",
          quantity: 6000,
          unit: "kg",
          expectedPrice: 28,
          harvestDate: "2026-09-22",
          location: "Bhimavaram, West Godavari",
          district: "West Godavari",
          qualityGrade: "Grade A",
          gradeDetails: "Uniform golden grains, moisture 12%, zero discoloration.",
          description: "Freshly threshed premium Sona Masoori single polish paddy, moisture strictly tested.",
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
          status: "active",
          listedDate: "2026-09-09",
          isDemo: true
        },
        {
          id: "crop_5",
          farmerId: "farmer_1",
          farmerName: "Ramesh Naidu",
          farmerPhone: "9876543210",
          title: "Ripe Robusta Cooking & Table Bananas",
          category: "Fruits",
          quantity: 2200,
          unit: "kg",
          expectedPrice: 22,
          harvestDate: "2026-09-25",
          location: "Tadikonda, Guntur Dist",
          district: "Guntur",
          qualityGrade: "Grade B",
          gradeDetails: "Medium uniform hands, no bruising, natural tree ripened.",
          description: "Fresh bunch cut bananas suitable for fruit wholesale stalls.",
          image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
          status: "active",
          listedDate: "2026-09-12",
          isDemo: true
        },
        {
          id: "crop_6",
          farmerId: "farmer_4",
          farmerName: "V. Ramamurthy",
          farmerPhone: "9700112233",
          title: "Sun-Dried Bold Groundnut Pods",
          category: "Pulses & Oilseeds",
          quantity: 1600,
          unit: "kg",
          expectedPrice: 72,
          harvestDate: "2026-09-07",
          location: "Dharmavaram, Anantapur Dist",
          district: "Anantapur",
          qualityGrade: "Grade A",
          gradeDetails: "Two-seeded pods, clean dry shells, oil content > 48%.",
          description: "Rich oilseed groundnuts dried in natural sunlight, free from soil contamination.",
          image: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=600&auto=format&fit=crop&q=80",
          status: "active",
          listedDate: "2026-09-08",
          isDemo: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(initialCrops));
    }

    // 4. Pre-seeded Offers & Negotiations
    if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
      const initialOffers = [
        {
          id: "offer_1",
          cropId: "crop_1",
          cropTitle: "Hybrid Fresh Red Tomatoes",
          farmerId: "farmer_1",
          farmerName: "Ramesh Naidu",
          dealerId: "dealer_1",
          dealerName: "Venkat Rao",
          dealerBusiness: "Sri Lakshmi Wholesale Agri Traders",
          quantity: 1800,
          unit: "kg",
          farmerExpectedPrice: 34,
          dealerOfferPrice: 31,
          farmerCounterPrice: 33,
          offeredPrice: 29,
          marketPrice: 32,
          fairMin: 30,
          fairMax: 35,
          currentOfferPrice: 31,
          status: "countered", // pending, countered, accepted, rejected, cancelled
          lastSender: "dealer",
          history: [
            {
              sender: "dealer",
              price: 29,
              note: "Willing to pick up full 1800 kg load tomorrow morning with our own truck.",
              timestamp: "2026-09-12 10:30 AM"
            },
            {
              sender: "farmer",
              price: 33,
              note: "The crop is Grade A export-quality with zero pesticide markings. ₹33/kg is fair.",
              timestamp: "2026-09-12 11:15 AM"
            },
            {
              sender: "dealer",
              price: 31,
              note: "Fair enough, how about ₹31.50/kg and immediate cash transfer upon weighing?",
              timestamp: "2026-09-12 01:45 PM"
            }
          ],
          isDemo: true
        },
        {
          id: "offer_2",
          cropId: "crop_2",
          cropTitle: "Guntur Teja Dry Red Chilli",
          farmerId: "farmer_1",
          farmerName: "Ramesh Naidu",
          dealerId: "dealer_2",
          dealerName: "Balaji Agro Spices",
          dealerBusiness: "Balaji Wholesale Mandi Yard",
          quantity: 1200,
          unit: "kg",
          farmerExpectedPrice: 210,
          dealerOfferPrice: 206,
          farmerCounterPrice: null,
          offeredPrice: 206,
          marketPrice: 205,
          fairMin: 195,
          fairMax: 215,
          currentOfferPrice: 206,
          status: "pending",
          lastSender: "dealer",
          history: [
            {
              sender: "dealer",
              price: 206,
              note: "We can inspect and take delivery at Tadikonda yard this Saturday.",
              timestamp: "2026-09-13 09:00 AM"
            }
          ],
          isDemo: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(initialOffers));
    }

    // 5. Pre-seeded Messages / Chat
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      const initialMessages = [
        {
          id: "msg_1",
          conversationId: "conv_farmer_1_dealer_1",
          senderId: "dealer_1",
          senderName: "Venkat Rao",
          receiverId: "farmer_1",
          text: "Namaste Ramesh garu, I saw your listing for Grade A Hybrid Tomatoes (1800 kg). Is the harvest completed today?",
          timestamp: "Yesterday, 10:15 AM",
          isDemo: true
        },
        {
          id: "msg_2",
          conversationId: "conv_farmer_1_dealer_1",
          senderId: "farmer_1",
          senderName: "Ramesh Naidu",
          receiverId: "dealer_1",
          text: "Namaste Venkat Rao garu. Yes, harvested fresh yesterday morning and crated in shade. Quality is excellent.",
          timestamp: "Yesterday, 10:22 AM",
          isDemo: true
        },
        {
          id: "msg_3",
          conversationId: "conv_farmer_1_dealer_1",
          senderId: "dealer_1",
          senderName: "Venkat Rao",
          receiverId: "farmer_1",
          text: "Great. I have placed an offer on the portal for ₹31/kg. Let's close the deal if that works for you.",
          timestamp: "Yesterday, 02:00 PM",
          isDemo: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessages));
    }

    // 6. Pre-seeded Transactions
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      const initialTransactions = [
        {
          id: "tx_101",
          cropTitle: "Sona Masoori Single Polish Paddy",
          quantity: 2500,
          unit: "kg",
          finalPrice: 28,
          totalAmount: 70000,
          farmerId: "farmer_1",
          farmerName: "Ramesh Naidu",
          dealerId: "dealer_1",
          dealerName: "Venkat Rao",
          date: "2026-08-25",
          status: "Completed",
          farmerRated: true,
          farmerRating: 5,
          farmerReview: "Prompt payment and honest weighing scales.",
          dealerRated: true,
          dealerRating: 5,
          dealerReview: "Top grade produce, perfectly dried.",
          isDemo: true
        },
        {
          id: "tx_102",
          cropTitle: "Guntur Teja Dry Chilli (Previous Batch)",
          quantity: 800,
          unit: "kg",
          finalPrice: 202,
          totalAmount: 161600,
          farmerId: "farmer_1",
          farmerName: "Ramesh Naidu",
          dealerId: "dealer_1",
          dealerName: "Venkat Rao",
          date: "2026-08-10",
          status: "Completed",
          farmerRated: true,
          farmerRating: 5,
          farmerReview: "Excellent dealer to work with.",
          dealerRated: true,
          dealerRating: 5,
          dealerReview: "Authentic pungency and color.",
          isDemo: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTransactions));
    }

    // 7. Weather and Rule-Based Advisories
    if (!localStorage.getItem(STORAGE_KEYS.WEATHER)) {
      const initialWeather = {
        cities: {
          Guntur: {
            temp: 33,
            condition: "Partly Cloudy",
            conditionTe: "పాక్షికంగా మేఘావృతం",
            humidity: 62,
            rainProb: 15,
            wind: 14,
            icon: "cloud-sun",
            forecast: [
              { day: "Mon", temp: 34, cond: "Sunny", rain: 10 },
              { day: "Tue", temp: 33, cond: "Partly Cloudy", rain: 20 },
              { day: "Wed", temp: 31, cond: "Scattered Showers", rain: 45 },
              { day: "Thu", temp: 32, cond: "Sunny", rain: 15 },
              { day: "Fri", temp: 35, cond: "Clear", rain: 5 }
            ],
            advisories: [
              {
                id: "adv_1",
                type: "warning",
                title: "Chilli Sun-Drying Alert",
                titleTe: "మిరప ఆరబెట్టుట హెచ్చరిక",
                text: "Optimal 33°C conditions for open yard chilli sun-drying. Ensure tarpaulins are tied down due to 14 km/h afternoon gusts.",
                textTe: "మిరప ఆరబెట్టడానికి 33°C అనుకూలమైన వాతావరణం. మధ్యాహ్నం 14 కి.మీ వేగంతో వీచే గాలుల దృష్ట్యా టార్పాలిన్లను సురక్షితంగా కట్టండి."
              },
              {
                id: "adv_2",
                type: "info",
                title: "Pesticide Spray Recommendation",
                titleTe: "పురుగుమందుల పిచికారీ సలహా",
                text: "Wind speeds are mild this morning. Safe window for leaf protection spray before 11:00 AM.",
                textTe: "ఈ ఉదయం గాలి వేగం సాధారణంగా ఉంది. ఉదయం 11:00 గంటలలోపు పురుగుమందుల పిచికారీ పూర్తి చేయండి."
              }
            ]
          },
          Kurnool: {
            temp: 37,
            condition: "High Heat & Dry",
            conditionTe: "తీవ్రమైన ఎండ & పొడి వాతావరణం",
            humidity: 38,
            rainProb: 5,
            wind: 18,
            icon: "sun",
            forecast: [
              { day: "Mon", temp: 37, cond: "Sunny", rain: 5 },
              { day: "Tue", temp: 38, cond: "Hot", rain: 5 },
              { day: "Wed", temp: 36, cond: "Sunny", rain: 10 },
              { day: "Thu", temp: 35, cond: "Clear", rain: 10 },
              { day: "Fri", temp: 36, cond: "Clear", rain: 15 }
            ],
            advisories: [
              {
                id: "adv_k1",
                type: "danger",
                title: "High Heat Advisory for Cotton & Groundnut",
                titleTe: "పత్తి మరియు వేరుశనగ పంటలకు అధిక ఉష్ణోగ్రత హెచ్చరిక",
                text: "Daytime temperatures reaching 37°C. Schedule drip or furrow irrigation during early morning (5-8 AM) or evening to prevent flower drop.",
                textTe: "పగటి ఉష్ణోగ్రతలు 37°C కి చేరవచ్చు. పూత రాలకుండా ఉండటానికి ఉదయం 5-8 గంటల మధ్య లేదా సాయంత్రం వేళల్లో మాత్రమే నీటిపారుదల అందించండి."
              }
            ]
          },
          Chittoor: {
            temp: 28,
            condition: "Heavy Rain Forecast",
            conditionTe: "భారీ వర్ష సూచన",
            humidity: 84,
            rainProb: 80,
            wind: 24,
            icon: "cloud-rain",
            forecast: [
              { day: "Mon", temp: 27, cond: "Rain", rain: 80 },
              { day: "Tue", temp: 28, cond: "Thunderstorm", rain: 85 },
              { day: "Wed", temp: 29, cond: "Showers", rain: 60 },
              { day: "Thu", temp: 30, cond: "Cloudy", rain: 30 },
              { day: "Fri", temp: 31, cond: "Partly Cloudy", rain: 20 }
            ],
            advisories: [
              {
                id: "adv_c1",
                type: "danger",
                title: "Heavy Rainfall Alert: Postpone Tomato Harvest",
                titleTe: "భారీ వర్ష హెచ్చరిక: టమాటా కోతను జాగ్రత్తగా నిర్వహించండి",
                text: "Rain probability is 80% over next 48 hours. Avoid all foliar chemical sprays immediately. Ensure proper water drainage channels in tomato plots.",
                textTe: "రాబోయే 48 గంటల్లో 80% వర్షపాతం నమోదయ్యే అవకాశం ఉంది. ఎటువంటి రసాయన పిచికారీ చేయవద్దు. తోటల్లో నీరు నిల్వ ఉండకుండా కాలువలు తీయండి."
              }
            ]
          },
          Krishna: {
            temp: 32,
            condition: "Moderate Humid",
            conditionTe: "సాధారణ తేమ వాతావరణం",
            humidity: 68,
            rainProb: 25,
            wind: 12,
            icon: "cloud-sun",
            forecast: [
              { day: "Mon", temp: 32, cond: "Sunny", rain: 20 },
              { day: "Tue", temp: 33, cond: "Partly Cloudy", rain: 25 },
              { day: "Wed", temp: 32, cond: "Scattered Clouds", rain: 30 },
              { day: "Thu", temp: 31, cond: "Sunny", rain: 15 },
              { day: "Fri", temp: 33, cond: "Clear", rain: 10 }
            ],
            advisories: []
          },
          "West Godavari": {
            temp: 31,
            condition: "Scattered Clouds",
            conditionTe: "చెల్లాచెదురుగా మేఘాలు",
            humidity: 74,
            rainProb: 35,
            wind: 10,
            icon: "cloud",
            forecast: [
              { day: "Mon", temp: 31, cond: "Cloudy", rain: 30 },
              { day: "Tue", temp: 30, cond: "Showers", rain: 40 },
              { day: "Wed", temp: 31, cond: "Partly Cloudy", rain: 30 },
              { day: "Thu", temp: 32, cond: "Sunny", rain: 20 },
              { day: "Fri", temp: 32, cond: "Sunny", rain: 15 }
            ],
            advisories: []
          },
          Anantapur: {
            temp: 36,
            condition: "Hot & Arid",
            conditionTe: "తీవ్రమైన ఎండ & పొడి గాలులు",
            humidity: 32,
            rainProb: 5,
            wind: 22,
            icon: "sun",
            forecast: [
              { day: "Mon", temp: 36, cond: "Sunny", rain: 5 },
              { day: "Tue", temp: 37, cond: "Hot", rain: 5 },
              { day: "Wed", temp: 36, cond: "Hot", rain: 10 },
              { day: "Thu", temp: 35, cond: "Clear", rain: 5 },
              { day: "Fri", temp: 35, cond: "Clear", rain: 5 }
            ],
            advisories: []
          },
          Visakhapatnam: {
            temp: 30,
            condition: "Coastal Breezy",
            conditionTe: "తీరప్రాంత చల్లని గాలులు",
            humidity: 78,
            rainProb: 40,
            wind: 21,
            icon: "wind",
            forecast: [
              { day: "Mon", temp: 30, cond: "Partly Cloudy", rain: 35 },
              { day: "Tue", temp: 29, cond: "Scattered Rain", rain: 50 },
              { day: "Wed", temp: 30, cond: "Showers", rain: 45 },
              { day: "Thu", temp: 31, cond: "Partly Cloudy", rain: 25 },
              { day: "Fri", temp: 31, cond: "Sunny", rain: 20 }
            ],
            advisories: []
          }
        }
      };
      localStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify(initialWeather));
    }

    // 8. Pre-seeded Activities (Recent Activity Feed for Farmers & Dealers)
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      const initialActivities = [
        {
          id: "act_1",
          targetRole: "farmer",
          type: "offer",
          icon: "tag",
          title: "New Bid Received",
          titleTe: "కొత్త ఆఫర్ వచ్చింది",
          desc: "Sri Lakshmi Wholesale placed an offer of ₹28/kg on Hybrid Tomato (3,500 kg).",
          descTe: "శ్రీ లక్ష్మి హోల్‌సేల్ వారు హైబ్రిడ్ టమాటాకు ₹28/కిలో ఆఫర్ ఇచ్చారు.",
          time: "10 mins ago",
          timeTe: "10 నిమిషాల క్రితం",
          date: new Date(Date.now() - 600000).toISOString(),
          isDemo: true
        },
        {
          id: "act_2",
          targetRole: "dealer",
          type: "bid",
          icon: "send",
          title: "Offer Placed",
          titleTe: "ఆఫర్ పంపబడింది",
          desc: "Submitted bid of ₹28/kg for 3,500 kg Hybrid Organic Tomatoes to Ramesh Naidu.",
          descTe: "రమేష్ నాయుడు గారి టమాటా కోసం ₹28/కిలో చొప్పున బిడ్ సమర్పించారు.",
          time: "25 mins ago",
          timeTe: "25 నిమిషాల క్రితం",
          date: new Date(Date.now() - 1500000).toISOString(),
          isDemo: true
        },
        {
          id: "act_3",
          targetRole: "farmer",
          type: "price",
          icon: "trending-up",
          title: "Mandi Price Surge",
          titleTe: "మార్కెట్ ధరల పెరుగుదల",
          desc: "Madanapalle Mandi tomato prices rose by ₹3/kg today to ₹32/kg.",
          descTe: "మదనపల్లె మార్కెట్లో టమాటా ధర నేడు ₹3 పెరిగి ₹32 కి చేరింది.",
          time: "1 hour ago",
          timeTe: "1 గంట క్రితం",
          date: new Date(Date.now() - 3600000).toISOString(),
          isDemo: true
        },
        {
          id: "act_4",
          targetRole: "dealer",
          type: "crop",
          icon: "plus-circle",
          title: "New Crop Listed",
          titleTe: "కొత్త పంట జాబితా చేయబడింది",
          desc: "K. Appala Swamy listed 6,000 kg Sona Masoori Raw Paddy in West Godavari.",
          descTe: "పశ్చిమ గోదావరిలో కే. అప్పల స్వామి 6,000 కిలోల సోనా మసూరి వడ్లను జాబితా చేశారు.",
          time: "2 hours ago",
          timeTe: "2 గంటల క్రితం",
          date: new Date(Date.now() - 7200000).toISOString(),
          isDemo: true
        },
        {
          id: "act_5",
          targetRole: "farmer",
          type: "payment",
          icon: "check-circle",
          title: "Direct Escrow Settled",
          titleTe: "చెల్లింపు పూర్తయింది",
          desc: "Payment of ₹85,000 for Guntur Teja Chilli sale credited to your linked Bank Account.",
          descTe: "తేజ మిరప అమ్మకం మొత్తం ₹85,000 మీ బ్యాంకు ఖాతాలో జమయింది.",
          time: "Yesterday",
          timeTe: "నిన్న",
          date: new Date(Date.now() - 86400000).toISOString(),
          isDemo: true
        },
        {
          id: "act_6",
          targetRole: "dealer",
          type: "contract",
          icon: "file-text",
          title: "Procurement Finalized",
          titleTe: "కొనుగోలు ఖరారైంది",
          desc: "Direct purchase order FL-TX-8921 for 2,800 kg Long Staple Cotton successfully executed.",
          descTe: "2,800 కిలోల కాటన్ కొనుగోలు ఆర్డర్ FL-TX-8921 విజయవంతంగా ఖరారైంది.",
          time: "Yesterday",
          timeTe: "నిన్న",
          date: new Date(Date.now() - 90000000).toISOString(),
          isDemo: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initialActivities));
    }

    // 9. Pre-seeded Saved Crops for Dealer
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_CROPS)) {
      const initialSaved = ["crop_1", "crop_2"];
      localStorage.setItem(STORAGE_KEYS.SAVED_CROPS, JSON.stringify(initialSaved));
    }

    // 10. Pre-seeded Notifications
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      const now = Date.now();
      const initialNotifications = [
        // Farmer Notifications
        {
          id: "notif_1",
          recipientUserId: "farmer_1",
          userId: "farmer_1",
          role: "farmer",
          type: "offer",
          title: "New Procurement Bid",
          titleTe: "కొత్త కొనుగోలు ఆఫర్",
          message: "Venkat Rao submitted an offer of ₹31/kg for your Grade A Tomatoes.",
          messageTe: "మీ గ్రేడ్ A టమాటాలకు వెంకట్ రావు గారు ₹31/కిలో ఆఫర్ ఇచ్చారు.",
          relatedId: "offer_1",
          link: "offers.html",
          isRead: false,
          read: false,
          timestamp: new Date(now - 10 * 60 * 1000).toISOString(),
          createdAt: new Date(now - 10 * 60 * 1000).toISOString(),
          isDemo: true
        },
        {
          id: "notif_2",
          recipientUserId: "farmer_1",
          userId: "farmer_1",
          role: "farmer",
          type: "counter",
          title: "Counter-Offer Received",
          titleTe: "కౌంటర్ ఆఫర్ అందింది",
          message: "A counter offer of ₹98/kg was received for your Dry Red Chilli listing.",
          messageTe: "మీ ఎర్ర మిర్చి లిస్టింగ్‌కు ₹98/కిలో కౌంటర్ ఆఫర్ వచ్చింది.",
          relatedId: "offer_2",
          link: "offers.html",
          isRead: false,
          read: false,
          timestamp: new Date(now - 60 * 60 * 1000).toISOString(),
          createdAt: new Date(now - 60 * 60 * 1000).toISOString(),
          isDemo: true
        },
        {
          id: "notif_3",
          recipientUserId: "farmer_1",
          userId: "farmer_1",
          role: "farmer",
          type: "transaction",
          title: "Transaction Completed",
          titleTe: "లావాదేవీ పూర్తయింది",
          message: "Tomato transaction of ₹45,000 marked completed by Sri Lakshmi Traders.",
          messageTe: "శ్రీ లక్ష్మి ట్రేడర్స్ ద్వారా ₹45,000 టమాటా లావాదేవీ విజయవంతంగా పూర్తయింది.",
          relatedId: "tx_101",
          link: "transactions.html",
          isRead: true,
          read: true,
          timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
          isDemo: true
        },
        {
          id: "notif_4",
          recipientUserId: "farmer_1",
          userId: "farmer_1",
          role: "farmer",
          type: "review",
          title: "New Rating Received",
          titleTe: "కొత్త రేటింగ్ అందింది",
          message: "Venkat Rao gave you a 5-star rating: 'Exceptional Grade A produce! Very satisfied.'",
          messageTe: "వెంకట్ రావు గారు మీకు 5-స్టార్ రేటింగ్ ఇచ్చారు: 'అద్భుతమైన గ్రేడ్ A సరుకు!'",
          relatedId: "rev_1",
          link: "profile.html",
          isRead: false,
          read: false,
          timestamp: new Date(now - 3 * 3600 * 1000).toISOString(),
          createdAt: new Date(now - 3 * 3600 * 1000).toISOString(),
          isDemo: true
        },

        // Dealer Notifications
        {
          id: "notif_5",
          recipientUserId: "dealer_1",
          userId: "dealer_1",
          role: "dealer",
          type: "accepted",
          title: "Farmer Accepted Offer",
          titleTe: "రైతు మీ ఆఫర్‌ను ఆమోదించారు",
          message: "Ramesh Naidu accepted your procurement bid of ₹30/kg for 1,500 kg Tomatoes.",
          messageTe: "1,500 కిలోల టమాటాలకు మీ ₹30/కిలో ఆఫర్‌ను రమేష్ నాయుడు ఆమోదించారు.",
          relatedId: "offer_1",
          link: "offers.html",
          isRead: false,
          read: false,
          timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
          createdAt: new Date(now - 25 * 60 * 1000).toISOString(),
          isDemo: true
        },
        {
          id: "notif_6",
          recipientUserId: "dealer_1",
          userId: "dealer_1",
          role: "dealer",
          type: "matching_crop",
          title: "New Crop Matching Marketplace Filters",
          titleTe: "మీ ఫిల్టర్లకు సరిపోయే కొత్త పంట",
          message: "New listing: Grade A Guntur Teja Chilli (5,000 kg) listed in Guntur Mandi.",
          messageTe: "కొత్త లిస్టింగ్: గ్రేడ్ A గుంటూరు తేజ మిర్చి (5,000 కిలోలు) మార్కెట్లో చేరింది.",
          relatedId: "crop_2",
          link: "marketplace.html",
          isRead: false,
          read: false,
          timestamp: new Date(now - 2 * 3600 * 1000).toISOString(),
          createdAt: new Date(now - 2 * 3600 * 1000).toISOString(),
          isDemo: true
        },
        {
          id: "notif_7",
          recipientUserId: "dealer_1",
          userId: "dealer_1",
          role: "dealer",
          type: "message",
          title: "New Message from Farmer",
          titleTe: "రైతు నుండి కొత్త సందేశం",
          message: "Ramesh Naidu sent you a dispatch update regarding lot logistics.",
          messageTe: "రమేష్ నాయుడు గారు సరుకు రవాణా సమాచారాన్ని పంపారు.",
          relatedId: "msg_1",
          link: "messages.html",
          isRead: true,
          read: true,
          timestamp: new Date(now - 26 * 3600 * 1000).toISOString(),
          createdAt: new Date(now - 26 * 3600 * 1000).toISOString(),
          isDemo: true
        },

        // Admin Notifications
        {
          id: "notif_8",
          recipientUserId: "admin_1",
          userId: "admin_1",
          role: "admin",
          type: "user_registration",
          title: "New User Registration",
          titleTe: "కొత్త వినియోగదారు నమోదు",
          message: "New verified farmer registered: Appa Rao (Tenali, Guntur District).",
          messageTe: "కొత్త ధృవీకరించబడిన రైతు నమోదు: అప్పారావు (తెనాలి, గుంటూరు జిల్లా).",
          relatedId: "farmer_2",
          link: "farmers.html",
          isRead: false,
          read: false,
          timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
          createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
          isDemo: true
        },
        {
          id: "notif_9",
          recipientUserId: "admin_1",
          userId: "admin_1",
          role: "admin",
          type: "crop_listing",
          title: "New Crop Listing",
          titleTe: "కొత్త పంట నమోదు",
          message: "Fresh listing pending APMC review: 2,500 kg Sweet Orange (Chittoor).",
          messageTe: "APMC సమీక్ష కోసం కొత్త లిస్టింగ్: 2,500 కిలోల బత్తాయి (చిత్తూరు).",
          relatedId: "crop_3",
          link: "listings.html",
          isRead: false,
          read: false,
          timestamp: new Date(now - 3 * 3600 * 1000).toISOString(),
          createdAt: new Date(now - 3 * 3600 * 1000).toISOString(),
          isDemo: true
        },
        {
          id: "notif_10",
          recipientUserId: "admin_1",
          userId: "admin_1",
          role: "admin",
          type: "transaction",
          title: "New Completed Transaction",
          titleTe: "కొత్తగా పూర్తయిన లావాదేవీ",
          message: "₹45,000 direct trade successfully finalized between farmer_1 and dealer_1.",
          messageTe: "farmer_1 మరియు dealer_1 మధ్య ₹45,000 ప్రత్యక్ష లావాదేవీ పూర్తయింది.",
          relatedId: "tx_101",
          link: "transactions.html",
          isRead: true,
          read: true,
          timestamp: new Date(now - 24 * 3600 * 1000).toISOString(),
          createdAt: new Date(now - 24 * 3600 * 1000).toISOString(),
          isDemo: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
    }

    // 11. Pre-seeded Calculations (Profit Calculator)
    if (!localStorage.getItem(STORAGE_KEYS.CALCULATIONS)) {
      const initialCalculations = [
        {
          id: "calc_1",
          farmerId: "farmer_1",
          cropId: "crop_2",
          cropName: "Guntur Teja Dry Red Chilli",
          acreage: 1,
          seedCost: 5000,
          fertilizerCost: 8000,
          pesticideCost: 4000,
          labourCost: 10000,
          irrigationCost: 3000,
          transportCost: 2000,
          otherCost: 1000,
          totalInvestment: 33000,
          quantity: 500,
          unit: "kg",
          sellingPrice: 90,
          expectedRevenue: 45000,
          netProfit: 12000,
          profitMargin: 26.7,
          isProfit: true,
          createdAt: "2026-09-14T09:30:00.000Z",
          isDemo: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(initialCalculations));
    }

    // 12. Pre-seeded Reviews & Ratings (Completed Transactions)
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      const initialReviews = [
        {
          id: "rev_1",
          transactionId: "tx_101",
          cropTitle: "Sona Masoori Single Polish Paddy",
          reviewerId: "farmer_1",
          reviewerName: "Ramesh Naidu",
          reviewerRole: "farmer",
          receiverId: "dealer_1",
          receiverName: "Venkat Rao",
          receiverRole: "dealer",
          rating: 5,
          feedback: "Prompt payment and honest weighing scales. Highly dependable wholesale partner.",
          createdAt: "2026-08-26T11:00:00.000Z",
          isDemo: true
        },
        {
          id: "rev_2",
          transactionId: "tx_101",
          cropTitle: "Sona Masoori Single Polish Paddy",
          reviewerId: "dealer_1",
          reviewerName: "Venkat Rao",
          reviewerRole: "dealer",
          receiverId: "farmer_1",
          receiverName: "Ramesh Naidu",
          receiverRole: "farmer",
          rating: 5,
          feedback: "Top grade produce, perfectly dried with zero moisture issues. Great farmer to work with.",
          createdAt: "2026-08-26T14:30:00.000Z",
          isDemo: true
        },
        {
          id: "rev_3",
          transactionId: "tx_102",
          cropTitle: "Guntur Teja Dry Chilli (Previous Batch)",
          reviewerId: "farmer_1",
          reviewerName: "Ramesh Naidu",
          reviewerRole: "farmer",
          receiverId: "dealer_1",
          receiverName: "Venkat Rao",
          receiverRole: "dealer",
          rating: 5,
          feedback: "Instant NEFT transfer on loading. Transparent settlement.",
          createdAt: "2026-08-11T09:15:00.000Z",
          isDemo: true
        },
        {
          id: "rev_4",
          transactionId: "tx_102",
          cropTitle: "Guntur Teja Dry Chilli (Previous Batch)",
          reviewerId: "dealer_1",
          reviewerName: "Venkat Rao",
          reviewerRole: "dealer",
          receiverId: "farmer_1",
          receiverName: "Ramesh Naidu",
          receiverRole: "farmer",
          rating: 5,
          feedback: "Authentic pungency and deep red color. Clean stalks.",
          createdAt: "2026-08-11T12:00:00.000Z",
          isDemo: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialReviews));
    }

    // Phase 3E: Hook online reconnection and authenticated application startup notification retries
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('online', () => {
        this.retryPendingNotifications();
      });

      const attachAuthRetry = () => {
        const fb = this.getFirebaseBridge();
        if (fb && fb.auth && typeof fb.auth.onAuthStateChanged === 'function') {
          fb.auth.onAuthStateChanged(user => {
            if (user) {
              this.retryPendingNotifications();
            }
          });
        }
      };

      if (typeof this.waitForFirebaseAuth === 'function') {
        this.waitForFirebaseAuth(3000).then(u => {
          if (u) this.retryPendingNotifications();
        });
      }
      setTimeout(attachAuthRetry, 500);
    }
  }

  migrateLegacyDemoRecords() {
    try {
      // 1. Users
      const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (rawUsers) {
        const users = JSON.parse(rawUsers);
        let changed = false;
        users.forEach(u => {
          if (PREDEFINED_DEMO_USER_IDS.includes(u.id) && !u.isDemo) {
            u.isDemo = true;
            changed = true;
          }
        });
        if (changed) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }

      // 2. Crops
      const rawCrops = localStorage.getItem(STORAGE_KEYS.CROPS);
      if (rawCrops) {
        const crops = JSON.parse(rawCrops);
        let changed = false;
        crops.forEach(c => {
          if ((PREDEFINED_DEMO_CROP_IDS.includes(c.id) || PREDEFINED_DEMO_CROP_IDS.includes(c.cropId) || PREDEFINED_DEMO_USER_IDS.includes(c.farmerId)) && !c.isDemo) {
            c.isDemo = true;
            changed = true;
          }
        });
        if (changed) localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
      }

      // 3. Offers
      const rawOffers = localStorage.getItem(STORAGE_KEYS.OFFERS);
      if (rawOffers) {
        const offers = JSON.parse(rawOffers);
        let changed = false;
        offers.forEach(o => {
          if ((PREDEFINED_DEMO_OFFER_IDS.includes(o.id) || PREDEFINED_DEMO_OFFER_IDS.includes(o.offerId) || PREDEFINED_DEMO_CROP_IDS.includes(o.cropId)) && !o.isDemo) {
            o.isDemo = true;
            changed = true;
          }
        });
        if (changed) localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
      }

      // 4. Transactions
      const rawTxs = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (rawTxs) {
        const txs = JSON.parse(rawTxs);
        let changed = false;
        txs.forEach(t => {
          if ((PREDEFINED_DEMO_TX_IDS.includes(t.id) || PREDEFINED_DEMO_TX_IDS.includes(t.transactionId)) && !t.isDemo) {
            t.isDemo = true;
            changed = true;
          }
        });
        if (changed) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
      }

      // 5. Messages
      const rawMsgs = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (rawMsgs) {
        const msgs = JSON.parse(rawMsgs);
        let changed = false;
        msgs.forEach(m => {
          if ((m.conversationId === "conv_farmer_1_dealer_1" || m.id === "msg_1" || m.id === "msg_2" || m.id === "msg_3") && !m.isDemo) {
            m.isDemo = true;
            changed = true;
          }
        });
        if (changed) localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(msgs));
      }
    } catch (e) {
      console.warn('[FarmLink Storage] migrateLegacyDemoRecords note:', e);
    }
  }

  // --- CRUD helpers ---
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Users
  getUsers() { return this.get(STORAGE_KEYS.USERS); }
  getUserById(id) { 
    return this.getUsers().find(u => u.id === id || u.uid === id) || null; 
  }
  updateUser(id, updatedFields) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id || u.uid === id);
    if (idx === -1) return null;

    const sanitized = {};
    for (const [k, v] of Object.entries(updatedFields || {})) {
      if (v !== undefined) sanitized[k] = v;
    }
    delete sanitized.role;
    delete sanitized.uid;
    delete sanitized.id;
    sanitized.updatedAt = new Date().toISOString();

    const cleanUserDoc = this.validateAndSanitizeFirestoreDoc("users_update", sanitized, []);

    users[idx] = { ...users[idx], ...cleanUserDoc };
    this.set(STORAGE_KEYS.USERS, users);

    // If real Firebase user: propagate update to Firestore users/{uid}
    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    const isRealFirebase = this.isRealFirebaseUser(currentUser);
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);

    if (isRealFirebase && currentUser && (currentUser.uid === id || currentUser.id === id) && isFbAvailable && fb.auth && fb.auth.currentUser) {
      const promise = (async () => {
        try {
          await fb.db.collection("users").doc(id).update(cleanUserDoc);
        } catch (dbErr) {
          console.warn("[FarmLink Storage] Firestore user profile sync note:", dbErr.message);
        }
        return users[idx];
      })();
      Object.assign(promise, users[idx]);
      return promise;
    }

    const resolvedP = Promise.resolve(users[idx]);
    Object.assign(resolvedP, users[idx]);
    return resolvedP;
  }
  updateUserPassword(identifier, newPassword) {
    const users = this.getUsers();
    const clean = identifier.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === clean || u.phone === clean);
    if (user) {
      user.password = newPassword;
      this.set(STORAGE_KEYS.USERS, users);
      return { success: true, user };
    }
    return { success: false, message: "User account not found." };
  }

  // Synchronize registered user directory from Firestore for Admin oversight
  async syncUsersFromFirestore() {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return this.getUsers();

    try {
      const snapshot = await fb.db.collection("users").get();
      const cloudUsers = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!data) return;
        const normalizedRole = String(data.role || "farmer").toLowerCase().trim();
        cloudUsers.push({
          ...data,
          id: doc.id,
          uid: doc.id,
          name: data.name || data.displayName || data.businessName || "User",
          businessName: data.businessName || data.name || "",
          email: data.email || "",
          phone: data.phone || data.phoneNumber || "",
          role: normalizedRole,
          location: data.location || data.district || "Andhra Pradesh",
          district: data.district || data.location || "Andhra Pradesh",
          status: data.status || "active",
          rating: Number(data.rating) || 5.0,
          reviewsCount: Number(data.reviewsCount) || 0,
          totalTransactions: Number(data.totalTransactions) || 0,
          totalPurchases: Number(data.totalPurchases) || 0,
          isDemo: Boolean(data.isDemo),
          userCreated: true,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        });
      });

      const localUsers = this.getUsers();
      const mergedMap = new Map();

      // 1. Keep demo users
      localUsers.forEach(u => {
        if (this.isDemoUser(u) || u.isDemo) {
          mergedMap.set(u.id, u);
        }
      });

      // 2. Cloud users are authoritative for real Firebase accounts
      cloudUsers.forEach(u => {
        mergedMap.set(u.id, u);
      });

      // 3. Keep any local userCreated users
      localUsers.forEach(u => {
        if (!mergedMap.has(u.id)) {
          mergedMap.set(u.id, u);
        }
      });

      const mergedUsers = Array.from(mergedMap.values());
      this.set(STORAGE_KEYS.USERS, mergedUsers);
      return mergedUsers;
    } catch (err) {
      console.warn('[FarmLink Storage] syncUsersFromFirestore note:', err.message);
      return this.getUsers();
    }
  }

  // --- Firebase Bridge & Real User Helpers ---
  getFirebaseBridge() {
    if (typeof window !== 'undefined' && window.FarmLinkFirebase) {
      return window.FarmLinkFirebase;
    }
    return null;
  }

  /**
   * Universal Firestore Document Sanitizer and Validator
   * Ensures documents written to Cloud Firestore (.set, .add, .update, or transaction/batch)
   * never contain undefined values, strictly conform to required fields, and enforce positive numbers.
   */
  validateAndSanitizeFirestoreDoc(collectionName, data, requiredFields = [], numericConstraints = {}) {
    if (!data || typeof data !== 'object') {
      throw new Error(`[Firestore Data Integrity] Invalid document payload for "${collectionName}": must be a non-null object.`);
    }

    // Deep sanitize helper: recursively strips any undefined property and validates numbers
    const sanitizeValue = (val) => {
      if (val === undefined) return undefined;
      if (val === null) return null;
      if (typeof val === 'number') {
        if (isNaN(val)) {
          throw new Error(`[Firestore Data Integrity] Numeric NaN detected in "${collectionName}".`);
        }
        if (!isFinite(val)) {
          throw new Error(`[Firestore Data Integrity] Non-finite number (${val}) detected in "${collectionName}".`);
        }
        return val;
      }
      if (typeof val === 'string') {
        return val;
      }
      if (Array.isArray(val)) {
        return val
          .filter(item => item !== undefined)
          .map(item => sanitizeValue(item));
      }
      if (typeof val === 'object') {
        const sanitizedObj = {};
        for (const [k, v] of Object.entries(val)) {
          if (v !== undefined) {
            sanitizedObj[k] = sanitizeValue(v);
          }
        }
        return sanitizedObj;
      }
      return val;
    };

    const sanitized = sanitizeValue(data);

    // Validate all required fields
    if (Array.isArray(requiredFields)) {
      for (const field of requiredFields) {
        if (!(field in sanitized) || sanitized[field] === undefined || sanitized[field] === null) {
          throw new Error(`[Firestore Data Integrity] Required field "${field}" is missing or null in "${collectionName}".`);
        }
        if (typeof sanitized[field] === 'string' && sanitized[field].trim().length === 0) {
          throw new Error(`[Firestore Data Integrity] Required string field "${field}" cannot be empty in "${collectionName}".`);
        }
      }
    }

    // Validate numeric constraints
    if (numericConstraints && typeof numericConstraints === 'object') {
      for (const [field, rules] of Object.entries(numericConstraints)) {
        if (rules && sanitized[field] !== undefined && sanitized[field] !== null) {
          const num = Number(sanitized[field]);
          if (isNaN(num)) {
            throw new Error(`[Firestore Data Integrity] Field "${field}" must be a valid number in "${collectionName}".`);
          }
          if (rules.positive && num <= 0) {
            throw new Error(`[Firestore Data Integrity] Field "${field}" must be strictly positive (> 0) in "${collectionName}". Received: ${num}`);
          }
          if (rules.integer && !Number.isInteger(num)) {
            throw new Error(`[Firestore Data Integrity] Field "${field}" must be an integer in "${collectionName}". Received: ${num}`);
          }
          if (rules.min !== undefined && num < rules.min) {
            throw new Error(`[Firestore Data Integrity] Field "${field}" must be >= ${rules.min} in "${collectionName}". Received: ${num}`);
          }
          if (rules.max !== undefined && num > rules.max) {
            throw new Error(`[Firestore Data Integrity] Field "${field}" must be <= ${rules.max} in "${collectionName}". Received: ${num}`);
          }
        }
      }
    }

    return sanitized;
  }

  /**
   * Resolves the authoritative farmer name using:
   * 1. Explicitly provided cropData.farmerName (if valid and not generic fallback)
   * 2. Active session profile (name || fullName || displayName)
   * 3. Firebase Auth currentUser displayName
   * 4. Authoritative Firestore users/{uid} lookup (with local session backfill)
   * 5. Safe email prefix fallback (e.g. "suresh.kumar" -> "Suresh Kumar")
   * 6. Fails safely with a clear, user-facing error if name is genuinely unavailable.
   */
  async resolveFarmerName(currentUser, cropData = null) {
    // 1. Explicitly provided cropData.farmerName
    if (cropData && typeof cropData.farmerName === 'string') {
      const trimmed = cropData.farmerName.trim();
      if (trimmed.length > 0 && trimmed.toLowerCase() !== "farmer") {
        return trimmed;
      }
    }

    // 2. Active session profile
    if (currentUser) {
      const candidates = [currentUser.name, currentUser.fullName, currentUser.displayName];
      for (const c of candidates) {
        if (typeof c === 'string') {
          const trimmed = c.trim();
          if (trimmed.length > 0 && trimmed.toLowerCase() !== "farmer") {
            return trimmed;
          }
        }
      }
    }

    // 3. Firebase Auth bridge
    const fb = this.getFirebaseBridge();
    if (fb && fb.auth && fb.auth.currentUser) {
      const authUser = fb.auth.currentUser;
      if (typeof authUser.displayName === 'string' && authUser.displayName.trim().length > 0) {
        const name = authUser.displayName.trim();
        if (currentUser && !currentUser.name) {
          currentUser.name = name;
          if (typeof window !== 'undefined' && window.Auth && typeof window.Auth.setSession === 'function') {
            window.Auth.setSession(currentUser);
          }
        }
        return name;
      }

      // 4. Authoritative Firestore users/{uid} lookup
      if (fb.db && authUser.uid) {
        try {
          const userDoc = await fb.db.collection("users").doc(authUser.uid).get();
          if (userDoc && userDoc.exists) {
            const data = userDoc.data();
            const docName = (data.name || data.fullName || data.displayName || "").trim();
            if (docName.length > 0 && docName.toLowerCase() !== "farmer") {
              if (currentUser) {
                currentUser.name = docName;
                if (typeof window !== 'undefined' && window.Auth && typeof window.Auth.setSession === 'function') {
                  window.Auth.setSession(currentUser);
                }
              }
              return docName;
            }
          }
        } catch (fetchErr) {
          console.warn("[FarmLink Storage] Note during authoritative farmerName lookup:", fetchErr.message);
        }
      }

      // 5. Safe email prefix fallback
      if (authUser.email && typeof authUser.email === 'string') {
        const emailPrefix = authUser.email.split("@")[0].replace(/[._-]/g, " ").trim();
        if (emailPrefix.length > 0) {
          const formatted = emailPrefix.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          return formatted;
        }
      }
    }

    // Email from currentUser session
    if (currentUser && currentUser.email && typeof currentUser.email === 'string') {
      const emailPrefix = currentUser.email.split("@")[0].replace(/[._-]/g, " ").trim();
      if (emailPrefix.length > 0) {
        return emailPrefix.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      }
    }

    // If genuinely unavailable, throw descriptive error stopping crop submission
    throw new Error("Farmer name could not be resolved from profile. Please update your profile with your full name before listing crops.");
  }

  isRealFirebaseUser(user) {
    return !!(user && user.isFirebaseAuth && user.uid && (user.id === user.uid) && !user.isDemo);
  }

  isDemoUser(user) {
    if (!user) return true;
    if (user.isDemo === true) return true;
    if (PREDEFINED_DEMO_USER_IDS.includes(user.id) || PREDEFINED_DEMO_USER_IDS.includes(user.uid)) return true;
    if (!user.uid && !user.isFirebaseAuth) return true;
    return false;
  }

  isDemoCrop(crop) {
    if (!crop) return false;
    if (crop.isDemo === true) return true;
    const id = crop.id || crop.cropId;
    if (PREDEFINED_DEMO_CROP_IDS.includes(id)) return true;
    if (PREDEFINED_DEMO_USER_IDS.includes(crop.farmerId) || PREDEFINED_DEMO_USER_IDS.includes(crop.farmerUid)) return true;
    return false;
  }

  isDemoOffer(offer) {
    if (!offer) return false;
    if (offer.isDemo === true) return true;
    const id = offer.id || offer.offerId;
    if (PREDEFINED_DEMO_OFFER_IDS.includes(id)) return true;
    if (PREDEFINED_DEMO_CROP_IDS.includes(offer.cropId)) return true;
    if (PREDEFINED_DEMO_USER_IDS.includes(offer.farmerId) || PREDEFINED_DEMO_USER_IDS.includes(offer.dealerId)) return true;
    return false;
  }

  isDemoTransaction(tx) {
    if (!tx) return false;
    if (tx.isDemo === true) return true;
    const id = tx.id || tx.transactionId;
    if (PREDEFINED_DEMO_TX_IDS.includes(id)) return true;
    if (PREDEFINED_DEMO_USER_IDS.includes(tx.farmerId) || PREDEFINED_DEMO_USER_IDS.includes(tx.dealerId)) return true;
    return false;
  }

  isDemoNotification(notif) {
    if (!notif) return false;
    if (notif.isDemo === true) return true;
    const id = notif.id || notif.notificationId;
    if (PREDEFINED_DEMO_USER_IDS.includes(notif.userId) || PREDEFINED_DEMO_USER_IDS.includes(notif.recipientUserId)) return true;
    return false;
  }

  isDemoReview(review) {
    if (!review) return false;
    if (review.isDemo === true) return true;
    const id = review.id || review.reviewId;
    if (PREDEFINED_DEMO_TX_IDS.includes(review.transactionId)) return true;
    if (PREDEFINED_DEMO_USER_IDS.includes(review.reviewerId) || PREDEFINED_DEMO_USER_IDS.includes(review.receiverId)) return true;
    return false;
  }

  getGenuineUsers() {
    return (this.getUsers() || []).filter(u => !this.isDemoUser(u) && !u.isDemo);
  }

  getGenuineFarmers() {
    return this.getGenuineUsers().filter(u => String(u.role || '').toLowerCase().trim() === 'farmer');
  }

  getGenuineDealers() {
    return this.getGenuineUsers().filter(u => String(u.role || '').toLowerCase().trim() === 'dealer');
  }

  getGenuineCrops() {
    return (this.getCrops() || []).filter(c => !this.isDemoCrop(c) && !c.isDemo && c.status !== 'Removed');
  }

  getGenuineTransactions() {
    return (this.getTransactions() || []).filter(t => !this.isDemoTransaction(t) && !t.isDemo);
  }

  getGenuineOffers() {
    return (this.getOffers() || []).filter(o => !this.isDemoOffer(o) && !o.isDemo);
  }

  getGenuineReviews() {
    return (this.getReviews() || []).filter(r => !this.isDemoReview(r) && !r.isDemo);
  }

  getGenuineMarketPrices() {
    return (this.getMarketPrices() || []).filter(p => p && p.isDemo !== true);
  }

  async waitForFirebaseAuth(timeoutMs = 3000) {
    const fb = this.getFirebaseBridge();
    if (!fb || !fb.auth) return null;
    if (fb.auth.currentUser) return fb.auth.currentUser;

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    if (!currentUser || !currentUser.isFirebaseAuth) {
      return null;
    }

    return new Promise(resolve => {
      let resolved = false;
      let unsubscribe = null;
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          if (typeof unsubscribe === 'function') unsubscribe();
          resolve(fb.auth.currentUser || null);
        }
      }, timeoutMs);

      try {
        unsubscribe = fb.auth.onAuthStateChanged(user => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            if (typeof unsubscribe === 'function') unsubscribe();
            resolve(user || fb.auth.currentUser || null);
          }
        });
      } catch (e) {
        clearTimeout(timer);
        resolve(fb.auth.currentUser || null);
      }
    });
  }

  // --- Firestore Crops Synchronization (Phase 3A) ---
  async syncCropsFromFirestore() {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return this.getCrops();

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(3000);
    }
    if (!fbUser) {
      return this.getCrops();
    }

    try {
      const snapshot = await fb.db.collection("crops").get();
      const cloudCrops = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!data) return;
        const cropId = doc.id;
        const cropName = data.cropName || data.title || "Agricultural Produce";
        cloudCrops.push({
          id: cropId,
          cropId: cropId,
          farmerId: data.farmerId || data.farmerUid || "",
          farmerUid: data.farmerUid || data.farmerId || "",
          farmerName: data.farmerName || "Farmer",
          farmerPhone: data.farmerPhone || "",
          title: cropName,
          cropName: cropName,
          category: data.category || "Vegetables",
          quantity: Number(data.quantity) || 0,
          unit: data.unit || "kg",
          expectedPrice: Number(data.expectedPrice) || 0,
          qualityGrade: data.qualityGrade || "Grade A",
          gradeDetails: data.gradeDetails || "",
          location: data.location || "",
          district: data.district || "Guntur",
          harvestDate: data.harvestDate || "",
          listedDate: data.listedDate || (data.createdAt ? data.createdAt.split('T')[0] : ""),
          description: data.description || "",
          image: data.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
          status: data.status || "Available",
          isDemo: false,
          userCreated: true,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          ...data
        });
      });

      // Reconcile with local cache without deleting demo crops
      const localCrops = this.getCrops();
      const mergedMap = new Map();

      // 1. Keep demo crops from local storage
      localCrops.forEach(c => {
        if (this.isDemoCrop(c)) {
          mergedMap.set(c.id, c);
        }
      });

      // 2. Cloud crops are authoritative for all Firebase-backed listings
      cloudCrops.forEach(c => {
        const local = localCrops.find(l => l.id === c.id || l.cropId === c.id);
        if (local && String(local.status || '').toLowerCase().trim() === 'removed' && String(c.status || '').toLowerCase().trim() !== 'removed') {
          const localUpdated = new Date(local.updatedAt || 0).getTime();
          const cloudUpdated = new Date(c.updatedAt || 0).getTime();
          if (localUpdated >= cloudUpdated) {
            mergedMap.set(c.id, { ...c, status: "Removed", updatedAt: local.updatedAt });
            return;
          }
        }
        mergedMap.set(c.id, c);
      });

      // 3. Keep local userCreated crops that might be in flight
      localCrops.forEach(c => {
        if (!this.isDemoCrop(c) && !mergedMap.has(c.id)) {
          mergedMap.set(c.id, c);
        }
      });

      const mergedCrops = Array.from(mergedMap.values());
      this.set(STORAGE_KEYS.CROPS, mergedCrops);
      return mergedCrops;
    } catch (err) {
      console.warn('[FarmLink Storage] syncCropsFromFirestore note:', err.message);
      return this.getCrops();
    }
  }

  async fetchCropByIdFromFirestore(cropId) {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return this.getCropById(cropId);

    try {
      const doc = await fb.db.collection("crops").doc(cropId).get();
      if (!doc.exists) return null;
      const data = doc.data();
      const cropName = data.cropName || data.title || "Agricultural Produce";
      const normalized = {
        id: doc.id,
        cropId: doc.id,
        farmerId: data.farmerId || data.farmerUid || "",
        farmerUid: data.farmerUid || data.farmerId || "",
        farmerName: data.farmerName || "Farmer",
        farmerPhone: data.farmerPhone || "",
        title: cropName,
        cropName: cropName,
        category: data.category || "Vegetables",
        quantity: Number(data.quantity) || 0,
        unit: data.unit || "kg",
        expectedPrice: Number(data.expectedPrice) || 0,
        qualityGrade: data.qualityGrade || "Grade A",
        gradeDetails: data.gradeDetails || "",
        location: data.location || "",
        district: data.district || "Guntur",
        harvestDate: data.harvestDate || "",
        listedDate: data.listedDate || (data.createdAt ? data.createdAt.split('T')[0] : ""),
        description: data.description || "",
        image: data.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
        status: data.status || "Available",
        isDemo: false,
        userCreated: true,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        ...data
      };

      const crops = this.getCrops();
      const idx = crops.findIndex(c => c.id === cropId || c.cropId === cropId);
      if (idx !== -1) {
        crops[idx] = normalized;
      } else {
        crops.unshift(normalized);
      }
      this.set(STORAGE_KEYS.CROPS, crops);
      return normalized;
    } catch (err) {
      console.warn('[FarmLink Storage] fetchCropByIdFromFirestore note:', err.message);
      return this.getCropById(cropId);
    }
  }

  clearCropsSync() {
    if (typeof this._cropsListenerUnsubscribe === 'function') {
      try { this._cropsListenerUnsubscribe(); } catch (e) {}
      this._cropsListenerUnsubscribe = null;
    }
  }

  initCropsSync(callback) {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable || this._cropsListenerUnsubscribe) return;

    const fbAuth = fb.auth;
    if (!fbAuth) return;

    fbAuth.onAuthStateChanged(user => {
      if (user) {
        if (this._cropsListenerUnsubscribe) return;
        try {
          this._cropsListenerUnsubscribe = fb.db.collection("crops").onSnapshot(snapshot => {
            const cloudCrops = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              if (!data) return;
              const cropId = doc.id;
              const cropName = data.cropName || data.title || "Agricultural Produce";
              cloudCrops.push({
                id: cropId,
                cropId: cropId,
                farmerId: data.farmerId || data.farmerUid || "",
                farmerUid: data.farmerUid || data.farmerId || "",
                farmerName: data.farmerName || "Farmer",
                farmerPhone: data.farmerPhone || "",
                title: cropName,
                cropName: cropName,
                category: data.category || "Vegetables",
                quantity: Number(data.quantity) || 0,
                unit: data.unit || "kg",
                expectedPrice: Number(data.expectedPrice) || 0,
                qualityGrade: data.qualityGrade || "Grade A",
                gradeDetails: data.gradeDetails || "",
                location: data.location || "",
                district: data.district || "Guntur",
                harvestDate: data.harvestDate || "",
                listedDate: data.listedDate || (data.createdAt ? data.createdAt.split('T')[0] : ""),
                description: data.description || "",
                image: data.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
                status: data.status || "Available",
                isDemo: false,
                userCreated: true,
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || new Date().toISOString(),
                ...data
              });
            });

            const localCrops = this.getCrops();
            const mergedMap = new Map();
            localCrops.forEach(c => { if (this.isDemoCrop(c)) mergedMap.set(c.id, c); });
            cloudCrops.forEach(c => {
              const local = localCrops.find(l => l.id === c.id || l.cropId === c.id);
              if (local && String(local.status || '').toLowerCase().trim() === 'removed' && String(c.status || '').toLowerCase().trim() !== 'removed') {
                const localUpdated = new Date(local.updatedAt || 0).getTime();
                const cloudUpdated = new Date(c.updatedAt || 0).getTime();
                if (localUpdated >= cloudUpdated) {
                  mergedMap.set(c.id, { ...c, status: "Removed", updatedAt: local.updatedAt });
                  return;
                }
              }
              mergedMap.set(c.id, c);
            });
            localCrops.forEach(c => { if (!this.isDemoCrop(c) && !mergedMap.has(c.id)) mergedMap.set(c.id, c); });
            this.set(STORAGE_KEYS.CROPS, Array.from(mergedMap.values()));
            if (typeof callback === 'function') callback(cloudCrops);
          }, err => {
            console.warn('[FarmLink Storage] Crops real-time listener note:', err.message);
          });
        } catch (e) {
          console.warn('[FarmLink Storage] Failed to initialize crops listener:', e.message);
        }
      } else {
        if (this._cropsListenerUnsubscribe) {
          this._cropsListenerUnsubscribe();
          this._cropsListenerUnsubscribe = null;
        }
      }
    });
  }

  // Crops
  getCrops() { return this.get(STORAGE_KEYS.CROPS); }
  getCropById(id) { 
    return this.getCrops().find(c => c.id === id || c.cropId === id) || null; 
  }

  addCrop(crop) {
    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    const isRealFirebase = this.isRealFirebaseUser(currentUser);
    const newId = (crop && (crop.id || crop.cropId)) || ("crop_" + Date.now());

    // Sanitize input crop payload (strip undefined properties)
    const sanitizedInputCrop = {};
    for (const [k, v] of Object.entries(crop || {})) {
      if (v !== undefined) sanitizedInputCrop[k] = v;
    }

    const qty = Number(sanitizedInputCrop.quantity);
    const price = Number(sanitizedInputCrop.expectedPrice);
    if (isNaN(qty) || qty <= 0) {
      const err = new Error(`[Firestore Data Integrity] Crop quantity must be a positive number (> 0). Received: ${sanitizedInputCrop.quantity}`);
      const rejectedP = Promise.reject(err);
      Object.assign(rejectedP, crop);
      return rejectedP;
    }
    if (isNaN(price) || price <= 0) {
      const err = new Error(`[Firestore Data Integrity] Crop expected price must be a positive number (> 0). Received: ${sanitizedInputCrop.expectedPrice}`);
      const rejectedP = Promise.reject(err);
      Object.assign(rejectedP, crop);
      return rejectedP;
    }

    const cropTitle = (sanitizedInputCrop.cropName || sanitizedInputCrop.title || "Fresh Crop").trim();

    const promise = (async () => {
      // Resolve farmer name authoritatively
      let resolvedFarmerName = "";
      if (isRealFirebase) {
        resolvedFarmerName = await this.resolveFarmerName(currentUser, crop);
      } else {
        resolvedFarmerName = (crop && crop.farmerName) || (currentUser ? currentUser.name : null) || "Farmer";
      }

      const newCrop = {
        id: newId,
        cropId: newId,
        farmerId: isRealFirebase ? currentUser.uid : (sanitizedInputCrop.farmerId || (currentUser ? currentUser.id : ("farmer_" + Date.now()))),
        farmerUid: isRealFirebase ? currentUser.uid : (sanitizedInputCrop.farmerUid || (currentUser ? (currentUser.uid || currentUser.id) : "")),
        farmerName: resolvedFarmerName,
        farmerPhone: sanitizedInputCrop.farmerPhone || (currentUser ? currentUser.phone : "9876543210"),
        cropName: cropTitle,
        title: cropTitle,
        category: sanitizedInputCrop.category || "Vegetables",
        quantity: qty,
        unit: sanitizedInputCrop.unit || "kg",
        expectedPrice: price,
        harvestDate: sanitizedInputCrop.harvestDate || new Date().toISOString().split("T")[0],
        location: sanitizedInputCrop.location || "Guntur, AP",
        district: sanitizedInputCrop.district || (currentUser ? currentUser.district : "Guntur"),
        qualityGrade: sanitizedInputCrop.qualityGrade || "Grade A",
        gradeDetails: sanitizedInputCrop.gradeDetails || "",
        description: sanitizedInputCrop.description || "",
        image: sanitizedInputCrop.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
        createdAt: sanitizedInputCrop.createdAt || new Date().toISOString(),
        listedDate: sanitizedInputCrop.listedDate || new Date().toISOString().split("T")[0],
        updatedAt: sanitizedInputCrop.updatedAt || new Date().toISOString(),
        status: sanitizedInputCrop.status || "Available",
        isDemo: isRealFirebase ? false : (sanitizedInputCrop.isDemo !== undefined ? sanitizedInputCrop.isDemo : (currentUser ? !!currentUser.isDemo : false)),
        userCreated: true,
        ...sanitizedInputCrop,
        // Enforce authoritative overrides
        farmerName: resolvedFarmerName,
        quantity: qty,
        expectedPrice: price
      };

      if (isRealFirebase) {
        newCrop.farmerId = currentUser.uid;
        newCrop.farmerUid = currentUser.uid;
        newCrop.isDemo = false;
        newCrop.isFirebaseAuth = true;

        const fb = this.getFirebaseBridge();
        const isFbAvailable = fb && fb.isConfigured && fb.db && fb.auth && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);

        if (!isFbAvailable || !fb.auth.currentUser) {
          throw new Error("Unable to connect to FarmLink cloud database. Please check your internet connection.");
        }

        const cloudDoc = {
          id: newId,
          cropId: newId,
          farmerId: currentUser.uid,
          farmerUid: currentUser.uid,
          farmerName: resolvedFarmerName,
          farmerPhone: newCrop.farmerPhone,
          cropName: newCrop.cropName,
          title: newCrop.title,
          category: newCrop.category,
          quantity: qty,
          unit: newCrop.unit,
          expectedPrice: price,
          harvestDate: newCrop.harvestDate,
          listedDate: newCrop.listedDate,
          location: newCrop.location,
          district: newCrop.district,
          qualityGrade: newCrop.qualityGrade,
          gradeDetails: newCrop.gradeDetails || "",
          description: newCrop.description || "",
          image: newCrop.image,
          status: newCrop.status || "Available",
          isDemo: false,
          userCreated: true,
          createdAt: newCrop.createdAt,
          updatedAt: newCrop.updatedAt
        };

        const sanitizedCloudDoc = this.validateAndSanitizeFirestoreDoc(
          "crops",
          cloudDoc,
          ["id", "cropId", "farmerId", "farmerName", "cropName", "quantity", "unit", "expectedPrice", "status"],
          { quantity: { positive: true }, expectedPrice: { positive: true } }
        );

        await fb.db.collection("crops").doc(newId).set(sanitizedCloudDoc);
        // Update local cache only after successful Firestore write
        const crops = this.getCrops();
        crops.unshift(newCrop);
        this.set(STORAGE_KEYS.CROPS, crops);
        return newCrop;
      }

      // Demo farmer or offline test runner:
      const crops = this.getCrops();
      crops.unshift(newCrop);
      this.set(STORAGE_KEYS.CROPS, crops);
      return newCrop;
    })();

    // Synchronously attach draft properties for legacy non-awaiting callers
    const syncDraft = {
      id: newId,
      cropId: newId,
      farmerId: isRealFirebase ? (currentUser ? currentUser.uid : "") : (sanitizedInputCrop.farmerId || ""),
      cropName: cropTitle,
      title: cropTitle,
      quantity: qty,
      expectedPrice: price,
      status: "Available"
    };
    Object.assign(promise, syncDraft);
    return promise;
  }

  updateCrop(id, updatedFields) {
    const crops = this.getCrops();
    const idx = crops.findIndex(c => c.id === id || c.cropId === id);
    if (idx === -1) return null;

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    const isRealFirebase = this.isRealFirebaseUser(currentUser);
    const existing = crops[idx];

    // Ownership immutability: do not allow changing id, farmerId, or farmerUid
    const sanitized = {};
    for (const [k, v] of Object.entries(updatedFields || {})) {
      if (v !== undefined) sanitized[k] = v;
    }
    delete sanitized.id;
    delete sanitized.cropId;
    delete sanitized.farmerId;
    delete sanitized.farmerUid;
    sanitized.updatedAt = new Date().toISOString();

    if (sanitized.cropName && !sanitized.title) sanitized.title = sanitized.cropName;
    if (sanitized.title && !sanitized.cropName) sanitized.cropName = sanitized.title;

    const numericRules = {};
    if (sanitized.quantity !== undefined) numericRules.quantity = { positive: true };
    if (sanitized.expectedPrice !== undefined) numericRules.expectedPrice = { positive: true };

    const cleanUpdateDoc = this.validateAndSanitizeFirestoreDoc("crops_update", sanitized, [], numericRules);

    const updatedCrop = { ...existing, ...cleanUpdateDoc };

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && fb.auth && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);

    if (isRealFirebase && existing.farmerId === currentUser.uid && isFbAvailable && fb.auth.currentUser) {
      const promise = (async () => {
        await fb.db.collection("crops").doc(existing.id).update(cleanUpdateDoc);
        crops[idx] = updatedCrop;
        this.set(STORAGE_KEYS.CROPS, crops);
        return updatedCrop;
      })();
      Object.assign(promise, updatedCrop);
      return promise;
    }

    crops[idx] = updatedCrop;
    this.set(STORAGE_KEYS.CROPS, crops);
    const resolvedP = Promise.resolve(updatedCrop);
    Object.assign(resolvedP, updatedCrop);
    return resolvedP;
  }

  deleteCrop(id, soft = true) {
    const crops = this.getCrops();
    const idx = crops.findIndex(c => c.id === id || c.cropId === id);
    if (idx === -1) return null;

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    const isRealFirebase = this.isRealFirebaseUser(currentUser);
    const existing = crops[idx];

    // Strict ownership verification: only owning farmer or admin can remove
    const isOwner = currentUser && (
      existing.farmerId === currentUser.uid ||
      existing.farmerUid === currentUser.uid ||
      existing.farmerId === currentUser.id ||
      existing.farmerUid === currentUser.id
    );
    const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.isAdmin === true);

    if (currentUser && !isOwner && !isAdmin) {
      console.warn('[FarmLink Storage] Unauthorized deletion attempt by user:', currentUser.id || currentUser.uid);
      const deniedErr = new Error("Unauthorized: You can only remove your own crop listings.");
      const rejectedP = Promise.reject(deniedErr);
      Object.assign(rejectedP, { error: deniedErr.message });
      return rejectedP;
    }

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && fb.auth && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);

    if (soft) {
      const updatedCrop = { ...existing, status: "Removed", updatedAt: new Date().toISOString() };
      
      // Optimistic local cache update immediately
      crops[idx] = updatedCrop;
      this.set(STORAGE_KEYS.CROPS, crops);

      if (isRealFirebase && (isOwner || isAdmin) && isFbAvailable && fb.auth.currentUser) {
        const promise = (async () => {
          try {
            await fb.db.collection("crops").doc(existing.id).update({
              status: "Removed",
              updatedAt: updatedCrop.updatedAt
            });
            return updatedCrop;
          } catch (err) {
            console.error('[FarmLink Storage] Failed to update crop removal status in Firestore:', err);
            // Revert optimistic update on failure
            const currentCrops = this.getCrops();
            const revertIdx = currentCrops.findIndex(c => c.id === id || c.cropId === id);
            if (revertIdx !== -1) {
              currentCrops[revertIdx] = existing;
              this.set(STORAGE_KEYS.CROPS, currentCrops);
            }
            throw err;
          }
        })();
        Object.assign(promise, updatedCrop);
        return promise;
      }

      const resolvedP = Promise.resolve(updatedCrop);
      Object.assign(resolvedP, updatedCrop);
      return resolvedP;
    } else {
      const remaining = crops.filter(c => c.id !== id && c.cropId !== id);
      this.set(STORAGE_KEYS.CROPS, remaining);
      return true;
    }
  }

  // Market Prices
  getMarketPrices() { return this.get(STORAGE_KEYS.MARKET_PRICES); }
  getMarketPriceById(id) {
    return this.getMarketPrices().find(p => p.id === id) || null;
  }
  addMarketPrice(priceItem) {
    const prices = this.getMarketPrices();
    const nowStr = new Date().toISOString().split("T")[0];
    const cropName = priceItem.crop || priceItem.cropName || "";
    const mandiName = priceItem.mandi || priceItem.location || "";
    const refPrice = Number(priceItem.marketPrice !== undefined ? priceItem.marketPrice : (priceItem.referencePrice || 0));
    const minFair = Number(priceItem.minFairPrice !== undefined ? priceItem.minFairPrice : (priceItem.fairMin || Math.round(refPrice * 0.95)));
    const maxFair = Number(priceItem.maxFairPrice !== undefined ? priceItem.maxFairPrice : (priceItem.fairMax || Math.round(refPrice * 1.05)));

    const newPrice = {
      id: priceItem.id || ("mp_" + Date.now()),
      crop: cropName,
      cropName: cropName,
      cropTe: priceItem.cropTe || "",
      mandi: mandiName,
      location: mandiName,
      marketPrice: refPrice,
      referencePrice: refPrice,
      unit: priceItem.unit || "kg",
      minFairPrice: minFair,
      maxFairPrice: maxFair,
      fairMin: minFair,
      fairMax: maxFair,
      effectiveDate: priceItem.effectiveDate || nowStr,
      updatedDate: "Today, Just Now",
      isDemo: false,
      userCreated: true,
      ...priceItem
    };
    prices.push(newPrice);
    this.set(STORAGE_KEYS.MARKET_PRICES, prices);
    return newPrice;
  }
  updateMarketPrice(id, updatedFields) {
    const prices = this.getMarketPrices();
    const idx = prices.findIndex(p => p.id === id);
    if (idx !== -1) {
      const merged = { ...prices[idx], ...updatedFields, updatedDate: "Today, Just Now" };
      if (updatedFields.crop || updatedFields.cropName) {
        merged.crop = updatedFields.crop || updatedFields.cropName;
        merged.cropName = merged.crop;
      }
      if (updatedFields.mandi || updatedFields.location) {
        merged.mandi = updatedFields.mandi || updatedFields.location;
        merged.location = merged.mandi;
      }
      if (updatedFields.marketPrice !== undefined || updatedFields.referencePrice !== undefined) {
        merged.marketPrice = Number(updatedFields.marketPrice !== undefined ? updatedFields.marketPrice : updatedFields.referencePrice);
        merged.referencePrice = merged.marketPrice;
      }
      if (updatedFields.minFairPrice !== undefined || updatedFields.fairMin !== undefined) {
        merged.minFairPrice = Number(updatedFields.minFairPrice !== undefined ? updatedFields.minFairPrice : updatedFields.fairMin);
        merged.fairMin = merged.minFairPrice;
      }
      if (updatedFields.maxFairPrice !== undefined || updatedFields.fairMax !== undefined) {
        merged.maxFairPrice = Number(updatedFields.maxFairPrice !== undefined ? updatedFields.maxFairPrice : updatedFields.fairMax);
        merged.fairMax = merged.maxFairPrice;
      }
      prices[idx] = merged;
      this.set(STORAGE_KEYS.MARKET_PRICES, prices);
      return prices[idx];
    }
    return null;
  }
  deleteMarketPrice(id) {
    const prices = this.getMarketPrices().filter(p => p.id !== id);
    this.set(STORAGE_KEYS.MARKET_PRICES, prices);
    return true;
  }

  _normalizeOfferDoc(offerId, data) {
    if (!data) return null;
    return {
      id: offerId,
      offerId: offerId,
      cropId: data.cropId || "",
      cropName: data.cropName || data.cropTitle || "Agricultural Produce",
      cropTitle: data.cropTitle || data.cropName || "Agricultural Produce",
      cropImage: data.cropImage || "",
      farmerId: data.farmerId || data.farmerUid || "",
      farmerUid: data.farmerUid || data.farmerId || "",
      farmerName: data.farmerName || "Farmer",
      farmerPhone: data.farmerPhone || "",
      dealerId: data.dealerId || data.dealerUid || "",
      dealerUid: data.dealerUid || data.dealerId || "",
      dealerName: data.dealerName || "Dealer",
      dealerBusiness: data.dealerBusiness || "",
      dealerPhone: data.dealerPhone || "",
      offeredPrice: Number(data.offeredPrice || 0),
      dealerOfferPrice: Number(data.dealerOfferPrice || data.offeredPrice || 0),
      farmerCounterPrice: data.farmerCounterPrice !== undefined && data.farmerCounterPrice !== null ? Number(data.farmerCounterPrice) : null,
      farmerExpectedPrice: Number(data.farmerExpectedPrice || 0),
      currentOfferPrice: Number(data.currentOfferPrice || data.offeredPrice || 0),
      requestedQuantity: Number(data.requestedQuantity || data.quantity || 0),
      quantity: Number(data.quantity || data.requestedQuantity || 0),
      unit: data.unit || "kg",
      totalAmount: Number(data.totalAmount || 0),
      message: data.message || "",
      status: data.status || "Pending",
      lastSender: data.lastSender || "dealer",
      history: data.history || [],
      isDemo: false,
      userCreated: true,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      ...data,
      id: offerId,
      offerId: offerId
    };
  }

  _reconcileOffersWithLocal(cloudOffers) {
    const localOffers = this.getOffers();
    const mergedMap = new Map();

    // 1. Keep demo offers from local storage
    localOffers.forEach(o => {
      if (this.isDemoOffer(o)) {
        mergedMap.set(o.id, o);
      }
    });

    // 2. Authoritative cloud offers
    cloudOffers.forEach(o => {
      if (o && o.id) {
        mergedMap.set(o.id, o);
      }
    });

    // 3. Keep local userCreated offers that might be in flight
    localOffers.forEach(o => {
      if (!this.isDemoOffer(o) && !mergedMap.has(o.id)) {
        mergedMap.set(o.id, o);
      }
    });

    const mergedOffers = Array.from(mergedMap.values());
    mergedOffers.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    this.set(STORAGE_KEYS.OFFERS, mergedOffers);
    return mergedOffers;
  }

  // --- Firestore Offers Synchronization (Phase 3B-1) ---
  async syncOffersFromFirestore(role = null) {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return this.getOffers();

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(3000);
    }
    if (!fbUser) {
      return this.getOffers();
    }

    const uid = fbUser.uid;
    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    const userRole = role || (currentUser ? currentUser.role : null);

    try {
      const cloudOffers = [];
      const queries = [];

      if (userRole === 'dealer') {
        queries.push(fb.db.collection("offers").where("dealerId", "==", uid).get());
      } else if (userRole === 'farmer') {
        queries.push(fb.db.collection("offers").where("farmerId", "==", uid).get());
      } else if (userRole === 'admin' || (currentUser && currentUser.role === 'admin')) {
        queries.push(fb.db.collection("offers").get());
      } else {
        queries.push(fb.db.collection("offers").where("dealerId", "==", uid).get());
        queries.push(fb.db.collection("offers").where("farmerId", "==", uid).get());
      }

      const snapshots = await Promise.all(queries);
      const seenDocIds = new Set();

      snapshots.forEach(snapshot => {
        snapshot.forEach(doc => {
          if (seenDocIds.has(doc.id)) return;
          seenDocIds.add(doc.id);
          const data = doc.data();
          if (!data) return;
          const normalized = this._normalizeOfferDoc(doc.id, data);
          if (normalized) cloudOffers.push(normalized);
        });
      });

      return this._reconcileOffersWithLocal(cloudOffers);
    } catch (err) {
      console.warn('[FarmLink Storage] syncOffersFromFirestore note:', err.message);
      return this.getOffers();
    }
  }

  async fetchOfferByIdFromFirestore(offerId) {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return this.getOfferById(offerId);

    try {
      const doc = await fb.db.collection("offers").doc(offerId).get();
      if (!doc.exists) return null;
      const data = doc.data();
      const normalized = this._normalizeOfferDoc(doc.id, data);
      if (!normalized) return null;

      const offers = this.getOffers();
      const idx = offers.findIndex(o => o.id === offerId || o.offerId === offerId);
      if (idx !== -1) {
        offers[idx] = normalized;
      } else {
        offers.unshift(normalized);
      }
      this.set(STORAGE_KEYS.OFFERS, offers);
      return normalized;
    } catch (err) {
      console.warn('[FarmLink Storage] fetchOfferByIdFromFirestore note:', err.message);
      return this.getOfferById(offerId);
    }
  }

  clearOffersSync() {
    if (this._offersListenerUnsubscribes && this._offersListenerUnsubscribes.length > 0) {
      this._offersListenerUnsubscribes.forEach(unsub => {
        try { unsub(); } catch (e) {}
      });
      this._offersListenerUnsubscribes = [];
    }
  }

  initOffersSync(callback, role = null) {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return;

    const fbAuth = fb.auth;
    if (!fbAuth) return;

    fbAuth.onAuthStateChanged(user => {
      if (user) {
        if (this._offersListenerUnsubscribes && this._offersListenerUnsubscribes.length > 0) {
          this._offersListenerUnsubscribes.forEach(unsub => unsub());
          this._offersListenerUnsubscribes = [];
        } else {
          this._offersListenerUnsubscribes = [];
        }

        const uid = user.uid;
        const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
          ? window.Auth.getCurrentUser() 
          : null;
        const userRole = role || (currentUser ? currentUser.role : null);

        const handleSnapshot = (snapshot) => {
          try {
            if (snapshot && typeof snapshot.forEach === 'function') {
              const cloudOffers = [];
              snapshot.forEach(doc => {
                const data = doc.data();
                if (!data) return;
                const normalized = this._normalizeOfferDoc(doc.id, data);
                if (normalized) cloudOffers.push(normalized);
              });
              const merged = this._reconcileOffersWithLocal(cloudOffers);
              if (typeof callback === 'function') callback(merged);
            } else {
              this.syncOffersFromFirestore(userRole).then(merged => {
                if (typeof callback === 'function') callback(merged);
              });
            }
          } catch (e) {
            console.warn('[FarmLink Storage] Offers listener processing note:', e);
            this.syncOffersFromFirestore(userRole).then(merged => {
              if (typeof callback === 'function') callback(merged);
            });
          }
        };

        try {
          if (userRole === 'dealer') {
            const unsub = fb.db.collection("offers").where("dealerId", "==", uid).onSnapshot(handleSnapshot, err => {
              console.warn('[FarmLink Storage] Dealer offers listener note:', err.message);
            });
            this._offersListenerUnsubscribes.push(unsub);
          } else if (userRole === 'farmer') {
            const unsub = fb.db.collection("offers").where("farmerId", "==", uid).onSnapshot(handleSnapshot, err => {
              console.warn('[FarmLink Storage] Farmer offers listener note:', err.message);
            });
            this._offersListenerUnsubscribes.push(unsub);
          } else {
            const unsub1 = fb.db.collection("offers").where("dealerId", "==", uid).onSnapshot(handleSnapshot, () => {});
            const unsub2 = fb.db.collection("offers").where("farmerId", "==", uid).onSnapshot(handleSnapshot, () => {});
            this._offersListenerUnsubscribes.push(unsub1, unsub2);
          }
        } catch (e) {
          console.warn('[FarmLink Storage] Failed to initialize offers listener:', e.message);
        }
      } else {
        if (this._offersListenerUnsubscribes && this._offersListenerUnsubscribes.length > 0) {
          this._offersListenerUnsubscribes.forEach(unsub => unsub());
          this._offersListenerUnsubscribes = [];
        }
      }
    });
  }

  // Offers
  getOffers() { return this.get(STORAGE_KEYS.OFFERS); }
  getOfferById(id) { 
    return this.getOffers().find(o => o.id === id || o.offerId === id); 
  }
  addOffer(offer) {
    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    const isRealFirebase = this.isRealFirebaseUser(currentUser);
    const offers = this.getOffers();
    const offerId = offer.id || offer.offerId || ("offer_" + Date.now());
    const offeredPrice = Number(offer.offeredPrice !== undefined ? offer.offeredPrice : (offer.currentOfferPrice || 0));
    const dealerOfferPrice = Number(offer.dealerOfferPrice !== undefined ? offer.dealerOfferPrice : offeredPrice);
    const reqQty = Number(offer.requestedQuantity || offer.quantity || 1);
    const totalAmount = Number(offer.totalAmount || (offeredPrice * reqQty));

    let expectedPrice = offer.farmerExpectedPrice;
    if (expectedPrice === undefined || expectedPrice === null || isNaN(Number(expectedPrice))) {
      const c = offer.cropId ? this.getCropById(offer.cropId) : null;
      if (c && c.expectedPrice !== undefined) {
        expectedPrice = Number(c.expectedPrice);
      }
    }
    const finalExpectedPrice = Number(expectedPrice || 0);

    const nowIso = new Date().toISOString();
    const newOffer = {
      id: offerId,
      offerId: offerId,
      cropId: offer.cropId,
      cropName: offer.cropName || offer.cropTitle || "Crop Produce",
      cropTitle: offer.cropTitle || offer.cropName || "Crop Produce",
      cropImage: offer.cropImage || "",
      farmerId: offer.farmerId,
      farmerUid: offer.farmerUid || offer.farmerId,
      farmerName: offer.farmerName || "Farmer",
      farmerPhone: offer.farmerPhone || "",
      dealerId: isRealFirebase ? currentUser.uid : (offer.dealerId || (currentUser ? currentUser.id : "dealer")),
      dealerUid: isRealFirebase ? currentUser.uid : (offer.dealerUid || (currentUser ? (currentUser.uid || currentUser.id) : "")),
      dealerName: isRealFirebase ? currentUser.name : (offer.dealerName || (currentUser ? currentUser.name : "Dealer")),
      dealerBusiness: (currentUser && currentUser.businessName) || offer.dealerBusiness || "",
      dealerPhone: (currentUser && currentUser.phone) || offer.dealerPhone || "",
      offeredPrice: offeredPrice,
      dealerOfferPrice: dealerOfferPrice,
      farmerCounterPrice: offer.farmerCounterPrice !== undefined ? offer.farmerCounterPrice : null,
      currentOfferPrice: offeredPrice,
      farmerExpectedPrice: finalExpectedPrice,
      requestedQuantity: reqQty,
      quantity: reqQty,
      unit: offer.unit || "kg",
      totalAmount: totalAmount,
      message: offer.message || offer.initialNote || "",
      status: "Pending",
      lastSender: "dealer",
      createdAt: offer.createdAt || nowIso,
      updatedAt: nowIso,
      isDemo: isRealFirebase ? false : (offer.isDemo !== undefined ? offer.isDemo : (currentUser ? !!currentUser.isDemo : false)),
      userCreated: true,
      history: offer.history || [
        {
          sender: "dealer",
          price: offeredPrice,
          quantity: reqQty,
          note: offer.message || offer.initialNote || "Initial offer submitted.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      ...offer,
      // Ensure exact user-entered prices and canonical IDs are never lost
      id: offerId,
      offerId: offerId,
      farmerExpectedPrice: finalExpectedPrice,
      dealerOfferPrice: dealerOfferPrice,
      offeredPrice: offeredPrice,
      currentOfferPrice: offeredPrice,
      quantity: reqQty,
      requestedQuantity: reqQty,
      status: "Pending",
      lastSender: "dealer"
    };

    if (isRealFirebase) {
      newOffer.dealerId = currentUser.uid;
      newOffer.dealerUid = currentUser.uid;
      newOffer.isDemo = false;
      newOffer.isFirebaseAuth = true;
    }

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && fb.auth && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);

    // If real Firebase user: write to Firestore offers/{offerId}
    if (isRealFirebase) {
      let resolvedDealerName = (newOffer.dealerName || (currentUser ? currentUser.name : null) || "").trim();
      if (!resolvedDealerName && fb.auth && fb.auth.currentUser && fb.auth.currentUser.displayName) {
        resolvedDealerName = fb.auth.currentUser.displayName.trim();
      }
      if (!resolvedDealerName && currentUser && currentUser.email) {
        resolvedDealerName = currentUser.email.split("@")[0];
      }
      if (!resolvedDealerName) resolvedDealerName = "Wholesale Dealer";

      const cloudDoc = {
        id: offerId,
        offerId: offerId,
        cropId: newOffer.cropId,
        cropName: newOffer.cropName || newOffer.cropTitle || "Crop Produce",
        cropTitle: newOffer.cropTitle || newOffer.cropName || "Crop Produce",
        cropImage: newOffer.cropImage || "",
        farmerId: newOffer.farmerId,
        farmerUid: newOffer.farmerUid || newOffer.farmerId,
        farmerName: newOffer.farmerName || "Farmer",
        farmerPhone: newOffer.farmerPhone || "",
        dealerId: currentUser.uid,
        dealerUid: currentUser.uid,
        dealerName: resolvedDealerName,
        dealerBusiness: newOffer.dealerBusiness || "",
        dealerPhone: newOffer.dealerPhone || (currentUser.phone || ""),
        offeredPrice: Number(newOffer.offeredPrice),
        dealerOfferPrice: Number(newOffer.dealerOfferPrice || newOffer.offeredPrice),
        farmerCounterPrice: newOffer.farmerCounterPrice !== undefined ? newOffer.farmerCounterPrice : null,
        farmerExpectedPrice: Number(newOffer.farmerExpectedPrice || newOffer.offeredPrice),
        currentOfferPrice: Number(newOffer.currentOfferPrice || newOffer.offeredPrice),
        requestedQuantity: Number(newOffer.requestedQuantity || newOffer.quantity),
        quantity: Number(newOffer.quantity || newOffer.requestedQuantity),
        unit: newOffer.unit || "kg",
        totalAmount: Number(newOffer.totalAmount || (Number(newOffer.offeredPrice) * Number(newOffer.quantity))),
        message: newOffer.message || "",
        status: "Pending",
        lastSender: "dealer",
        createdAt: newOffer.createdAt || new Date().toISOString(),
        updatedAt: newOffer.updatedAt || new Date().toISOString(),
        isDemo: false,
        userCreated: true,
        history: Array.isArray(newOffer.history) ? newOffer.history : []
      };

      const sanitizedCloudOffer = this.validateAndSanitizeFirestoreDoc(
        "offers",
        cloudDoc,
        ["id", "offerId", "cropId", "dealerId", "farmerId", "offeredPrice", "quantity", "status"],
        { offeredPrice: { positive: true }, quantity: { positive: true } }
      );

      const promise = (async () => {
        if (!isFbAvailable) {
          throw new Error("Unable to connect to FarmLink cloud database. Please check your internet connection.");
        }

        let fbUser = fb.auth ? fb.auth.currentUser : null;
        if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
          fbUser = await this.waitForFirebaseAuth(2500);
        }
        if (!fbUser) {
          throw new Error("Unable to connect to FarmLink cloud database. Please check your internet connection.");
        }

        await fb.db.collection("offers").doc(offerId).set(sanitizedCloudOffer);
        // Update local cache only after successful Firestore write
        const currentOffers = this.getOffers();
        currentOffers.unshift(newOffer);
        this.set(STORAGE_KEYS.OFFERS, currentOffers);
        return newOffer;
      })();

      Object.assign(promise, newOffer);
      return promise;
    }

    // Demo dealer or offline test runner:
    offers.unshift(newOffer);
    this.set(STORAGE_KEYS.OFFERS, offers);
    const resolvedP = Promise.resolve(newOffer);
    Object.assign(resolvedP, newOffer);
    return resolvedP;
  }
  updateOffer(id, updatedFields) {
    const offers = this.getOffers();
    const idx = offers.findIndex(o => o.id === id || o.offerId === id);
    if (idx !== -1) {
      offers[idx] = { ...offers[idx], ...updatedFields, updatedAt: new Date().toISOString() };
      this.set(STORAGE_KEYS.OFFERS, offers);
      return offers[idx];
    }
    return null;
  }

  // --- Firestore Atomic Negotiation Methods (Phase 3B-2) ---
  async counterOfferInFirestore(offerId, counterPrice, note = "", senderRole = "farmer") {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) throw new Error("Unable to connect to FarmLink cloud database.");

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(2500);
    }
    if (!fbUser) throw new Error("You must be logged in to negotiate offers.");

    const uid = fbUser.uid;
    const price = Number(counterPrice);
    if (isNaN(price) || price <= 0) {
      throw new Error("Please enter a valid positive counter price.");
    }

    const offerRef = fb.db.collection("offers").doc(offerId);

    const updatedData = await fb.db.runTransaction(async (transaction) => {
      const sfDoc = await transaction.get(offerRef);
      if (!sfDoc.exists) {
        throw new Error("Offer not found in cloud database.");
      }
      const currentData = sfDoc.data();
      if (!currentData) throw new Error("Invalid offer data.");

      // Terminal state protection
      const currentStatus = String(currentData.status || '').toLowerCase().trim();
      if (currentStatus === 'accepted' || currentStatus === 'rejected' || currentStatus === 'cancelled' || currentStatus === 'withdrawn') {
        throw new Error(`This offer is already in terminal state (${currentData.status}) and cannot be modified.`);
      }

      // Authorization & turn verification
      const farmerUid = currentData.farmerId || currentData.farmerUid;
      const dealerUid = currentData.dealerId || currentData.dealerUid;

      if (senderRole === 'farmer') {
        if (uid !== farmerUid) {
          throw new Error("Unauthorized: Only the farmer receiving this offer can counter it.");
        }
        if (currentData.lastSender === 'farmer') {
          throw new Error("It is not your turn. Please wait for the dealer to respond to your previous counter-offer.");
        }
      } else if (senderRole === 'dealer') {
        if (uid !== dealerUid) {
          throw new Error("Unauthorized: Only the dealer who placed this offer can revise or counter it.");
        }
        if (currentData.lastSender === 'dealer') {
          throw new Error("It is not your turn. Please wait for the farmer to respond to your previous offer.");
        }
      } else {
        throw new Error("Invalid sender role for negotiation.");
      }

      const nowIso = new Date().toISOString();
      const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const qty = Number(currentData.quantity || currentData.requestedQuantity || 1);
      const totalAmount = price * qty;

      const existingHistory = Array.isArray(currentData.history) ? [...currentData.history] : [];
      const newStep = {
        sender: senderRole,
        action: "counter",
        price: price,
        quantity: qty,
        note: note ? String(note).trim() : (senderRole === "farmer" ? "Farmer counter-offered." : "Dealer adjusted offer."),
        timestamp: nowTimeStr
      };
      existingHistory.push(newStep);

      const updatePayload = {
        currentOfferPrice: price,
        totalAmount: totalAmount,
        status: "Countered",
        lastSender: senderRole,
        updatedAt: nowIso,
        history: existingHistory
      };

      if (senderRole === 'farmer') {
        updatePayload.farmerCounterPrice = price;
      }

      const cleanCounterPayload = this.validateAndSanitizeFirestoreDoc(
        "offers_counter",
        updatePayload,
        ["currentOfferPrice", "totalAmount", "status", "lastSender", "updatedAt"],
        { currentOfferPrice: { positive: true }, totalAmount: { positive: true } }
      );

      // Ensure immutable identity & reference fields are never overwritten:
      // id, offerId, cropId, farmerId, dealerId, isDemo, createdAt, farmerExpectedPrice, offeredPrice
      transaction.update(offerRef, cleanCounterPayload);

      return {
        ...currentData,
        ...updatePayload
      };
    });

    const normalized = this._normalizeOfferDoc(offerId, updatedData);
    const localOffers = this.getOffers();
    const idx = localOffers.findIndex(o => o.id === offerId || o.offerId === offerId);
    if (idx !== -1) {
      localOffers[idx] = normalized;
    } else {
      localOffers.unshift(normalized);
    }
    this.set(STORAGE_KEYS.OFFERS, localOffers);

    return normalized;
  }

  async acceptOfferInFirestore(offerId, senderRole = "farmer") {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) throw new Error("Unable to connect to FarmLink cloud database.");

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(2500);
    }
    if (!fbUser) throw new Error("You must be logged in to accept offers.");

    const uid = fbUser.uid;
    const offerRef = fb.db.collection("offers").doc(offerId);

    const updatedData = await fb.db.runTransaction(async (transaction) => {
      const sfDoc = await transaction.get(offerRef);
      if (!sfDoc.exists) {
        throw new Error("Offer not found in cloud database.");
      }
      const currentData = sfDoc.data();
      if (!currentData) throw new Error("Invalid offer data.");
      const currentStatus = String(currentData.status || '').toLowerCase().trim();

      // Deterministic transaction document ID: tx_${offerId}
      const txId = "tx_" + offerId;
      const txRef = fb.db.collection("transactions").doc(txId);

      // Terminal state protection: offers already in terminal state cannot be accepted
      if (currentStatus === 'accepted' || currentStatus === 'rejected' || currentStatus === 'cancelled' || currentStatus === 'withdrawn') {
        throw new Error(`This offer is already in terminal state (${currentData.status}) and cannot be accepted.`);
      }

      const farmerUid = currentData.farmerId || currentData.farmerUid;
      const dealerUid = currentData.dealerId || currentData.dealerUid;

      if (senderRole === 'farmer') {
        if (uid !== farmerUid) {
          throw new Error("Unauthorized: Only the farmer receiving this offer can accept it.");
        }
        if (currentData.lastSender === 'farmer') {
          throw new Error("You cannot accept your own counter-offer. Awaiting dealer response.");
        }
      } else if (senderRole === 'dealer') {
        if (uid !== dealerUid) {
          throw new Error("Unauthorized: Only the dealer who made this offer can accept the farmer's counter.");
        }
        if (currentData.lastSender === 'dealer') {
          throw new Error("You cannot accept your own bid. Awaiting farmer response.");
        }
      } else {
        throw new Error("Invalid role for offer acceptance.");
      }

      const nowIso = new Date().toISOString();
      const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const finalPrice = Number(currentData.currentOfferPrice || currentData.offeredPrice || 0);
      const qty = Number(currentData.quantity || currentData.requestedQuantity || 1);
      const totalAmount = finalPrice * qty;

      const existingHistory = Array.isArray(currentData.history) ? [...currentData.history] : [];
      const newStep = {
        sender: senderRole,
        action: "accept",
        price: finalPrice,
        quantity: qty,
        note: `${senderRole === 'farmer' ? 'Farmer' : 'Dealer'} accepted the deal at ₹${finalPrice}/${currentData.unit || 'kg'}.`,
        timestamp: nowTimeStr
      };
      existingHistory.push(newStep);

      const updatePayload = {
        status: "Accepted",
        acceptedBy: uid,
        acceptedRole: senderRole,
        acceptedAt: nowIso,
        updatedAt: nowIso,
        history: existingHistory
      };

      const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
        ? window.Auth.getCurrentUser() 
        : null;

      let resolvedFarmerName = (currentData.farmerName || "").trim();
      if ((!resolvedFarmerName || resolvedFarmerName.toLowerCase() === "farmer") && senderRole === 'farmer' && currentUser && currentUser.name) {
        resolvedFarmerName = currentUser.name.trim();
      }
      if (!resolvedFarmerName) resolvedFarmerName = "Farmer";

      let resolvedDealerName = (currentData.dealerName || "").trim();
      if ((!resolvedDealerName || resolvedDealerName.toLowerCase() === "dealer") && senderRole === 'dealer' && currentUser) {
        resolvedDealerName = (currentUser.businessName || currentUser.name || "").trim();
      }
      if (!resolvedDealerName) resolvedDealerName = "Wholesale Dealer";

      const resolvedFarmerPhone = currentData.farmerPhone || (senderRole === 'farmer' && currentUser ? (currentUser.phone || "") : "");
      const resolvedDealerPhone = currentData.dealerPhone || (senderRole === 'dealer' && currentUser ? (currentUser.phone || "") : "");

      const txPayload = {
        id: txId,
        txId: txId,
        transactionId: txId,
        offerId: offerId,
        cropId: currentData.cropId || "",
        cropName: currentData.cropName || currentData.cropTitle || "Agricultural Produce",
        cropTitle: currentData.cropTitle || currentData.cropName || "Agricultural Produce",
        cropImage: currentData.cropImage || "",
        farmerId: farmerUid,
        farmerUid: farmerUid,
        farmerName: resolvedFarmerName,
        farmerPhone: resolvedFarmerPhone,
        dealerId: dealerUid,
        dealerUid: dealerUid,
        dealerName: resolvedDealerName,
        dealerPhone: resolvedDealerPhone,
        quantity: qty,
        unit: currentData.unit || "kg",
        finalPrice: finalPrice,
        totalAmount: totalAmount,
        date: nowIso.split("T")[0],
        dealStatus: "Accepted",
        paymentStatus: "Pending_Payment",
        deliveryStatus: "Pending_Delivery",
        status: "Completed",
        farmerRated: false,
        dealerRated: false,
        isDemo: false,
        userCreated: true,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      const cleanTxPayload = this.validateAndSanitizeFirestoreDoc(
        "transactions",
        txPayload,
        ["id", "txId", "cropId", "farmerId", "dealerId", "quantity", "finalPrice", "totalAmount", "status"],
        { quantity: { positive: true }, finalPrice: { positive: true }, totalAmount: { positive: true } }
      );

      const cleanOfferUpdate = this.validateAndSanitizeFirestoreDoc(
        "offers_accept",
        updatePayload,
        ["status", "acceptedBy", "acceptedAt", "updatedAt"]
      );

      transaction.set(txRef, cleanTxPayload);
      transaction.update(offerRef, cleanOfferUpdate);

      return {
        offer: {
          ...currentData,
          ...updatePayload
        },
        transaction: txPayload
      };
    });

    const normalizedOffer = this._normalizeOfferDoc(offerId, updatedData.offer);
    const localOffers = this.getOffers();
    const idx = localOffers.findIndex(o => o.id === offerId || o.offerId === offerId);
    if (idx !== -1) {
      localOffers[idx] = normalizedOffer;
    } else {
      localOffers.unshift(normalizedOffer);
    }
    this.set(STORAGE_KEYS.OFFERS, localOffers);

    // Reconcile new transaction into local storage cache
    const normalizedTx = this._normalizeTransactionDoc(updatedData.transaction.id || ("tx_" + offerId), updatedData.transaction);
    this._reconcileTransactionsWithLocal([normalizedTx]);

    return {
      offer: normalizedOffer,
      transaction: normalizedTx
    };
  }

  async rejectOfferInFirestore(offerId, senderRole = "farmer", reason = "") {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) throw new Error("Unable to connect to FarmLink cloud database.");

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(2500);
    }
    if (!fbUser) throw new Error("You must be logged in to reject offers.");

    const uid = fbUser.uid;
    const offerRef = fb.db.collection("offers").doc(offerId);

    const updatedData = await fb.db.runTransaction(async (transaction) => {
      const sfDoc = await transaction.get(offerRef);
      if (!sfDoc.exists) {
        throw new Error("Offer not found in cloud database.");
      }
      const currentData = sfDoc.data();
      if (!currentData) throw new Error("Invalid offer data.");

      // Terminal state protection
      const currentStatus = String(currentData.status || '').toLowerCase().trim();
      if (currentStatus === 'accepted' || currentStatus === 'rejected' || currentStatus === 'cancelled' || currentStatus === 'withdrawn') {
        throw new Error(`This offer is already in terminal state (${currentData.status}) and cannot be rejected.`);
      }

      const farmerUid = currentData.farmerId || currentData.farmerUid;
      const dealerUid = currentData.dealerId || currentData.dealerUid;

      if (senderRole === 'farmer') {
        if (uid !== farmerUid) {
          throw new Error("Unauthorized: Only the farmer receiving this offer can reject it.");
        }
      } else if (senderRole === 'dealer') {
        if (uid !== dealerUid) {
          throw new Error("Unauthorized: Only the dealer on this offer can reject or withdraw it.");
        }
      } else {
        throw new Error("Invalid role for offer rejection.");
      }

      const nowIso = new Date().toISOString();
      const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const finalPrice = Number(currentData.currentOfferPrice || currentData.offeredPrice || 0);
      const qty = Number(currentData.quantity || currentData.requestedQuantity || 1);

      const existingHistory = Array.isArray(currentData.history) ? [...currentData.history] : [];
      const newStep = {
        sender: senderRole,
        action: senderRole === "dealer" ? "cancel" : "reject",
        price: finalPrice,
        quantity: qty,
        note: reason ? String(reason).trim() : (senderRole === "dealer" ? "Dealer withdrew offer." : "Farmer rejected the offer. Negotiation closed."),
        timestamp: nowTimeStr
      };
      existingHistory.push(newStep);

      const updatePayload = {
        status: "Rejected",
        rejectedBy: uid,
        rejectedRole: senderRole,
        rejectedAt: nowIso,
        updatedAt: nowIso,
        history: existingHistory
      };

      const cleanRejectUpdate = this.validateAndSanitizeFirestoreDoc(
        "offers_reject",
        updatePayload,
        ["status", "rejectedBy", "rejectedRole", "rejectedAt", "updatedAt"]
      );

      transaction.update(offerRef, cleanRejectUpdate);

      return {
        ...currentData,
        ...updatePayload
      };
    });

    const normalized = this._normalizeOfferDoc(offerId, updatedData);
    const localOffers = this.getOffers();
    const idx = localOffers.findIndex(o => o.id === offerId || o.offerId === offerId);
    if (idx !== -1) {
      localOffers[idx] = normalized;
    } else {
      localOffers.unshift(normalized);
    }
    this.set(STORAGE_KEYS.OFFERS, localOffers);

    return normalized;
  }

  async cancelOfferInFirestore(offerId, reason = "") {
    return this.rejectOfferInFirestore(offerId, "dealer", reason || "Dealer withdrew offer.");
  }

  // =========================================================================
  // --- Messages & Conversations (Phase 3E: Cloud Firestore Sync & Cache) ---
  // =========================================================================

  getDeterministicConversationId(farmerUid, dealerUid) {
    if (!farmerUid || !dealerUid) return null;
    return `conv_${farmerUid}_${dealerUid}`;
  }

  _normalizeConversationDoc(convId, data) {
    if (!data) return null;
    const farmerId = data.farmerId || "";
    const dealerId = data.dealerId || "";
    return {
      ...data,
      id: convId,
      conversationId: convId,
      farmerId: farmerId,
      farmerName: data.farmerName || "Farmer",
      dealerId: dealerId,
      dealerName: data.dealerName || "Dealer",
      dealerBusiness: data.dealerBusiness || "",
      participants: Array.isArray(data.participants) ? data.participants : [farmerId, dealerId].filter(Boolean),
      cropId: data.cropId || "",
      cropContext: data.cropContext || "",
      lastMessage: data.lastMessage || "",
      lastMessageSenderId: data.lastMessageSenderId || "",
      lastMessageAt: data.lastMessageAt || data.updatedAt || "",
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
      isDemo: Boolean(data.isDemo)
    };
  }

  _normalizeMessageDoc(msgId, data) {
    if (!data) return null;
    const createdAt = data.createdAt || new Date().toISOString();
    let timestamp = data.timestamp;
    if (!timestamp) {
      try {
        timestamp = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        timestamp = "Recent";
      }
    }
    return {
      ...data,
      id: msgId,
      messageId: msgId,
      conversationId: data.conversationId || "",
      senderId: data.senderId || "",
      senderName: data.senderName || "",
      senderRole: data.senderRole || "",
      recipientId: data.recipientId || data.receiverId || "",
      text: (data.text || "").trim(),
      createdAt: createdAt,
      timestamp: timestamp,
      read: Boolean(data.read || data.isRead),
      isRead: Boolean(data.isRead || data.read),
      isDemo: Boolean(data.isDemo)
    };
  }

  _updateLocalConversationLastMessage(convId, text, senderId, timestamp) {
    if (!convId) return;
    const cached = this.get(STORAGE_KEYS.CONVERSATIONS) || [];
    let found = false;
    const updated = cached.map(c => {
      if (c.id === convId || c.conversationId === convId) {
        found = true;
        return {
          ...c,
          lastMessage: text,
          lastMessageSenderId: senderId,
          lastMessageAt: timestamp,
          updatedAt: timestamp
        };
      }
      return c;
    });

    if (!found) {
      updated.push({
        id: convId,
        conversationId: convId,
        lastMessage: text,
        lastMessageSenderId: senderId,
        lastMessageAt: timestamp,
        updatedAt: timestamp
      });
    }
    this.set(STORAGE_KEYS.CONVERSATIONS, updated);
  }

  _upsertLocalConversation(convData) {
    if (!convData || !convData.id) return;
    const cached = this.get(STORAGE_KEYS.CONVERSATIONS) || [];
    const idx = cached.findIndex(c => c.id === convData.id || c.conversationId === convData.id);
    if (idx >= 0) {
      cached[idx] = { ...cached[idx], ...convData };
    } else {
      cached.push(convData);
    }
    this.set(STORAGE_KEYS.CONVERSATIONS, cached);
  }

  _reconcileMessagesWithLocal(conversationId, remoteMsgs) {
    const allMsgs = this.get(STORAGE_KEYS.MESSAGES) || [];
    const otherMsgs = allMsgs.filter(m => m.conversationId !== conversationId);
    const currentConvMsgs = allMsgs.filter(m => m.conversationId === conversationId);

    const mergedMap = new Map();
    currentConvMsgs.forEach(m => {
      mergedMap.set(m.id || m.messageId, m);
    });

    remoteMsgs.forEach(rm => {
      mergedMap.set(rm.id || rm.messageId, rm);
    });

    const mergedList = Array.from(mergedMap.values());
    mergedList.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

    this.set(STORAGE_KEYS.MESSAGES, [...otherMsgs, ...mergedList]);
  }

  getConversations(currentUser) {
    if (!currentUser) return [];
    const isDemo = this.isDemoUser(currentUser);
    const isFarmer = currentUser.role === "farmer";

    if (isDemo) {
      const allMsgs = this.getMessages("conv_farmer_1_dealer_1");
      const lastMsg = allMsgs.length > 0 ? allMsgs[allMsgs.length - 1] : null;
      return [
        {
          id: "conv_farmer_1_dealer_1",
          conversationId: "conv_farmer_1_dealer_1",
          otherUserId: isFarmer ? "dealer_1" : "farmer_1",
          name: isFarmer ? "Venkat Rao (Sri Lakshmi Traders)" : "Ramesh Naidu (Guntur Farmer)",
          avatar: isFarmer ? "VR" : "RN",
          cropContext: "Hybrid Fresh Red Tomatoes (1800 kg)",
          lastMessage: lastMsg ? lastMsg.text : "Great. I have placed an offer on the portal for ₹31/kg.",
          time: lastMsg ? lastMsg.timestamp : "02:00 PM",
          unread: false,
          isDemo: true
        }
      ];
    }

    const cached = this.get(STORAGE_KEYS.CONVERSATIONS) || [];
    const uid = currentUser.uid || currentUser.id;
    const userConvs = cached.filter(c => {
      if (c.isDemo) return false;
      if (c.farmerId === uid || c.dealerId === uid) return true;
      if (Array.isArray(c.participants) && c.participants.includes(uid)) return true;
      return false;
    });

    userConvs.sort((a, b) => new Date(b.updatedAt || b.lastMessageAt || 0) - new Date(a.updatedAt || a.lastMessageAt || 0));

    return userConvs.map(c => {
      const isCurrentFarmer = (currentUser.role === "farmer" || c.farmerId === uid);
      const otherUserId = isCurrentFarmer ? c.dealerId : c.farmerId;
      const otherName = isCurrentFarmer
        ? (c.dealerName || "Wholesale Dealer") + (c.dealerBusiness ? ` (${c.dealerBusiness})` : "")
        : (c.farmerName || "Verified Farmer");
      const avatar = otherName.split(" ").map(p => p[0]).join("").substring(0, 2).toUpperCase() || (isCurrentFarmer ? "DL" : "FR");
      let time = "";
      if (c.lastMessageAt) {
        try {
          time = new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
          time = "";
        }
      }

      const allMsgs = this.getMessages(c.id);
      const unreadCount = allMsgs.filter(m => (m.recipientId === uid || m.receiverId === uid) && !m.isRead && !m.read).length;

      return {
        ...c,
        otherUserId: otherUserId,
        name: otherName,
        avatar: avatar,
        cropContext: c.cropContext || (c.cropId ? "Linked Crop" : ""),
        time: time || "Recent",
        unread: unreadCount > 0,
        unreadCount: unreadCount
      };
    });
  }

  getMessages(conversationId) {
    const msgs = this.get(STORAGE_KEYS.MESSAGES) || [];
    if (conversationId) {
      const filtered = msgs.filter(m => m.conversationId === conversationId);
      const seen = new Set();
      const deduped = [];
      filtered.forEach(m => {
        const id = m.id || m.messageId;
        if (id && !seen.has(id)) {
          seen.add(id);
          deduped.push(m);
        } else if (!id) {
          deduped.push(m);
        }
      });
      deduped.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      return deduped;
    }
    return msgs;
  }

  async addMessage(msg) {
    const text = (msg.text || "").trim();
    if (!text) {
      return { success: false, error: "Message text cannot be empty." };
    }
    if (text.length > 2000) {
      return { success: false, error: "Message exceeds maximum allowed length of 2000 characters." };
    }

    const convId = msg.conversationId || "conv_farmer_1_dealer_1";
    const isDemo = Boolean(msg.isDemo || convId === "conv_farmer_1_dealer_1" || msg.senderId === "farmer_1" || msg.senderId === "dealer_1");

    if (isDemo) {
      const msgs = this.get(STORAGE_KEYS.MESSAGES) || [];
      const newMsg = {
        id: "msg_" + Date.now(),
        messageId: "msg_" + Date.now(),
        conversationId: convId,
        senderId: msg.senderId || "farmer_1",
        senderName: msg.senderName || "Demo User",
        receiverId: msg.receiverId || msg.recipientId || "dealer_1",
        recipientId: msg.recipientId || msg.receiverId || "dealer_1",
        text: text,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        isRead: false,
        isDemo: true
      };
      msgs.push(newMsg);
      this.set(STORAGE_KEYS.MESSAGES, msgs);

      this._updateLocalConversationLastMessage(convId, text, newMsg.senderId, newMsg.createdAt);

      // Local demo notification (localStorage only)
      const notifId = `notif_msg_${newMsg.id}`;
      const recipientRole = (msg.senderRole === 'farmer') ? 'dealer' : 'farmer';
      const senderDisplayName = msg.senderName || (msg.senderRole === 'farmer' ? 'Farmer' : 'Dealer');
      const snippet = text.length > 50 ? (text.substring(0, 47) + "...") : text;
      try {
        this.addNotification({
          id: notifId,
          notificationId: notifId,
          recipientUserId: newMsg.recipientId,
          userId: newMsg.recipientId,
          senderUserId: newMsg.senderId,
          role: recipientRole,
          type: 'message',
          title: 'New Message',
          titleTe: 'కొత్త సందేశం',
          message: `${senderDisplayName}: "${snippet}"`,
          messageTe: `${senderDisplayName}: "${snippet}"`,
          relatedId: convId,
          link: `messages.html?conversation=${convId}`,
          timestamp: newMsg.createdAt,
          createdAt: newMsg.createdAt,
          updatedAt: newMsg.createdAt,
          isRead: false,
          read: false,
          isDemo: true,
          userCreated: false
        });
      } catch (e) {}

      return newMsg;
    }

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);

    const senderId = msg.senderId;
    const recipientId = msg.recipientId || msg.receiverId;
    if (!senderId || !recipientId) {
      return { success: false, error: "Sender and recipient IDs are required." };
    }

    const messageId = "msg_" + convId + "_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const createdAt = new Date().toISOString();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const normalizedMsg = {
      id: messageId,
      messageId: messageId,
      conversationId: convId,
      senderId: senderId,
      senderName: msg.senderName || "",
      senderRole: msg.senderRole || "",
      recipientId: recipientId,
      text: text,
      createdAt: createdAt,
      timestamp: timestamp,
      read: false,
      isRead: false,
      isDemo: false
    };

    const localMsgs = this.get(STORAGE_KEYS.MESSAGES) || [];
    if (!localMsgs.some(m => m.id === messageId || m.messageId === messageId)) {
      localMsgs.push(normalizedMsg);
      this.set(STORAGE_KEYS.MESSAGES, localMsgs);
    }

    this._updateLocalConversationLastMessage(convId, text, senderId, createdAt);

    if (!isFbAvailable) {
      console.warn("[FarmLink Storage] Firebase unavailable; message saved locally.");
      return normalizedMsg;
    }

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(3000);
    }

    try {
      const convRef = fb.db.collection("conversations").doc(convId);

      // Verify conversation exists in Firestore before updating metadata
      let convExists = false;
      try {
        const convSnap = await convRef.get();
        convExists = Boolean(convSnap && convSnap.exists);
      } catch (checkErr) {
        // Document does not exist yet; security rules reject reading non-existent resource
        convExists = false;
      }

      if (!convExists) {
        const parts = convId.replace('conv_', '').split('_');
        const farmerId = parts[0] || (msg.senderRole === 'farmer' ? senderId : recipientId);
        const dealerId = parts[1] || (msg.senderRole === 'dealer' ? senderId : recipientId);
        const newConvData = {
          id: convId,
          conversationId: convId,
          farmerId: farmerId,
          farmerName: msg.senderRole === 'farmer' ? (msg.senderName || "Farmer") : "Farmer",
          dealerId: dealerId,
          dealerName: msg.senderRole === 'dealer' ? (msg.senderName || "Dealer") : "Dealer",
          dealerBusiness: "",
          participants: [farmerId, dealerId],
          cropId: msg.cropId || "",
          cropContext: msg.cropContext || "",
          lastMessage: text,
          lastMessageSenderId: senderId,
          lastMessageAt: createdAt,
          createdAt: createdAt,
          updatedAt: createdAt,
          isDemo: false
        };
        const sanitizedConvData = this.validateAndSanitizeFirestoreDoc(
          "conversations",
          newConvData,
          ["id", "farmerId", "dealerId", "participants"]
        );
        await convRef.set(sanitizedConvData);
        this._upsertLocalConversation(newConvData);
      }

      const msgRef = convRef.collection("messages").doc(messageId);
      const sanitizedMsg = this.validateAndSanitizeFirestoreDoc(
        "messages",
        normalizedMsg,
        ["id", "conversationId", "senderId", "senderRole", "recipientId", "text", "createdAt"]
      );

      const batch = fb.db.batch();
      batch.set(msgRef, sanitizedMsg);
      batch.update(convRef, {
        lastMessage: text,
        lastMessageSenderId: senderId,
        lastMessageAt: createdAt,
        updatedAt: createdAt
      });

      await batch.commit();

      // Phase 3E: Create recipient message notification in Firestore after successful message commit
      const notifId = `notif_msg_${messageId}`;
      const recipientRole = (msg.senderRole === 'farmer') ? 'dealer' : 'farmer';
      const senderDisplayName = msg.senderName || (msg.senderRole === 'farmer' ? 'Farmer' : 'Dealer');
      const snippet = text.length > 50 ? (text.substring(0, 47) + "...") : text;

      try {
        const notifResult = await this.addNotification({
          id: notifId,
          notificationId: notifId,
          messageId: messageId,
          recipientUserId: recipientId,
          userId: recipientId,
          senderUserId: senderId,
          role: recipientRole,
          type: 'message',
          title: 'New Message',
          titleTe: 'కొత్త సందేశం',
          message: `${senderDisplayName}: "${snippet}"`,
          messageTe: `${senderDisplayName}: "${snippet}"`,
          relatedId: convId,
          link: `messages.html?conversation=${convId}`,
          timestamp: createdAt,
          createdAt: createdAt,
          updatedAt: createdAt,
          isRead: false,
          read: false,
          isDemo: false,
          userCreated: false
        });
        if (notifResult && notifResult._syncError) {
          normalizedMsg._notificationError = notifResult._syncError;
        }
      } catch (notifErr) {
        console.warn("[FarmLink Storage] Recipient message notification creation note:", notifErr);
        normalizedMsg._notificationError = notifErr.message || String(notifErr);
      }

      return normalizedMsg;
    } catch (err) {
      console.error("[FarmLink Storage] Failed to send message to Firestore:", err);
      return { ...normalizedMsg, _syncError: err.message };
    }
  }

  async getOrCreateConversationInFirestore(params) {
    const { farmerId, farmerName, dealerId, dealerName, dealerBusiness, cropId, cropContext } = params;
    if (!farmerId || !dealerId) {
      throw new Error("Both farmerId and dealerId are required to resolve a conversation.");
    }

    const convId = this.getDeterministicConversationId(farmerId, dealerId);
    const isDemo = Boolean(params.isDemo || farmerId === "farmer_1" || dealerId === "dealer_1");

    if (isDemo) {
      return {
        id: "conv_farmer_1_dealer_1",
        conversationId: "conv_farmer_1_dealer_1",
        farmerId: "farmer_1",
        dealerId: "dealer_1",
        isDemo: true
      };
    }

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);

    const now = new Date().toISOString();
    const convData = {
      id: convId,
      conversationId: convId,
      farmerId: farmerId,
      farmerName: farmerName || "Farmer",
      dealerId: dealerId,
      dealerName: dealerName || "Dealer",
      dealerBusiness: dealerBusiness || "",
      participants: [farmerId, dealerId],
      cropId: cropId || "",
      cropContext: cropContext || "",
      lastMessage: "",
      lastMessageSenderId: "",
      lastMessageAt: "",
      createdAt: now,
      updatedAt: now,
      isDemo: false
    };

    this._upsertLocalConversation(convData);

    if (!isFbAvailable) {
      return convData;
    }

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(3000);
    }
    if (!fbUser) {
      return convData;
    }

    try {
      const convRef = fb.db.collection("conversations").doc(convId);
      let docSnap = null;
      try {
        docSnap = await convRef.get();
      } catch (readErr) {
        // Document does not exist yet in Firestore
        docSnap = null;
      }

      if (!docSnap || !docSnap.exists) {
        await convRef.set(convData);
        return convData;
      } else {
        const existing = this._normalizeConversationDoc(docSnap.id, docSnap.data());
        this._upsertLocalConversation(existing);
        return existing;
      }
    } catch (err) {
      console.warn("[FarmLink Storage] getOrCreateConversationInFirestore note:", err.message);
      return convData;
    }
  }

  async markMessagesAsReadInFirestore(conversationId, currentUserId) {
    if (!conversationId || !currentUserId) return;
    if (conversationId === "conv_farmer_1_dealer_1") {
      const localMsgs = this.get(STORAGE_KEYS.MESSAGES) || [];
      let changed = false;
      localMsgs.forEach(m => {
        if (m.conversationId === conversationId && (m.recipientId === currentUserId || m.receiverId === currentUserId) && !m.isRead) {
          m.isRead = true;
          m.read = true;
          changed = true;
        }
      });
      if (changed) this.set(STORAGE_KEYS.MESSAGES, localMsgs);
      return;
    }

    const localMsgs = this.get(STORAGE_KEYS.MESSAGES) || [];
    const unreadForMe = [];
    localMsgs.forEach(m => {
      if (m.conversationId === conversationId && (m.recipientId === currentUserId || m.receiverId === currentUserId) && !m.isRead && !m.read) {
        m.isRead = true;
        m.read = true;
        unreadForMe.push(m.id || m.messageId);
      }
    });
    if (unreadForMe.length > 0) {
      this.set(STORAGE_KEYS.MESSAGES, localMsgs);
    }

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable || unreadForMe.length === 0) return;

    try {
      const batch = fb.db.batch();
      const readAt = new Date().toISOString();
      unreadForMe.forEach(msgId => {
        const mRef = fb.db.collection("conversations").doc(conversationId).collection("messages").doc(msgId);
        batch.update(mRef, { isRead: true, read: true, readAt: readAt, updatedAt: readAt });
      });
      await batch.commit();
    } catch (err) {
      console.warn("[FarmLink Storage] Failed to mark messages as read in Firestore:", err.message);
    }
  }

  initConversationsSync(callback) {
    this.clearConversationsSync();
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return () => {};

    const currentUser = (window.Auth && typeof window.Auth.getCurrentUser === 'function')
      ? window.Auth.getCurrentUser()
      : null;
    if (currentUser && this.isDemoUser(currentUser)) return () => {};

    const attach = (uid, role) => {
      try {
        const queryField = (role === 'dealer' || role === 'buyer') ? 'dealerId' : 'farmerId';
        const q = fb.db.collection("conversations").where(queryField, "==", uid);
        this._conversationsUnsubscribe = q.onSnapshot(
          snapshot => {
            if (!snapshot) return;
            const remoteConvs = [];
            snapshot.forEach(doc => {
              const norm = this._normalizeConversationDoc(doc.id, doc.data());
              if (norm) remoteConvs.push(norm);
            });
            remoteConvs.sort((a, b) => new Date(b.updatedAt || b.lastMessageAt || 0) - new Date(a.updatedAt || a.lastMessageAt || 0));

            const cached = this.get(STORAGE_KEYS.CONVERSATIONS) || [];
            const nonUserConvs = cached.filter(c => c.farmerId !== uid && c.dealerId !== uid);
            this.set(STORAGE_KEYS.CONVERSATIONS, [...remoteConvs, ...nonUserConvs]);

            if (typeof callback === 'function') callback(remoteConvs);
            window.dispatchEvent(new CustomEvent('farmlink:conversations-updated', { detail: { conversations: remoteConvs } }));
          },
          err => {
            console.warn("[FarmLink Storage] Conversations listener note:", err.message);
          }
        );
        return this._conversationsUnsubscribe;
      } catch (e) {
        console.warn("[FarmLink Storage] Failed to initialize conversations listener:", e.message);
        return () => {};
      }
    };

    if (fb.auth && fb.auth.currentUser) {
      const u = window.Auth ? window.Auth.getCurrentUser() : null;
      const role = u ? (u.role || u.userRole) : 'farmer';
      return attach(fb.auth.currentUser.uid, role);
    } else if (typeof this.waitForFirebaseAuth === 'function') {
      this.waitForFirebaseAuth(3000).then(fbUser => {
        if (fbUser) {
          const u = window.Auth ? window.Auth.getCurrentUser() : null;
          if (!u || !this.isDemoUser(u)) {
            const role = u ? (u.role || u.userRole) : 'farmer';
            attach(fbUser.uid, role);
          }
        }
      });
      return () => this.clearConversationsSync();
    }
    return () => {};
  }

  clearConversationsSync() {
    if (typeof this._conversationsUnsubscribe === 'function') {
      try { this._conversationsUnsubscribe(); } catch (e) {}
      this._conversationsUnsubscribe = null;
    }
  }

  initActiveChatSync(conversationId, callback) {
    this.clearActiveChatSync();
    if (!conversationId) return () => {};

    const currentUser = (window.Auth && typeof window.Auth.getCurrentUser === 'function')
      ? window.Auth.getCurrentUser()
      : null;
    const isDemo = !currentUser || this.isDemoUser(currentUser) || conversationId === "conv_farmer_1_dealer_1";

    if (isDemo) {
      if (typeof callback === 'function') {
        callback(this.getMessages(conversationId));
      }
      return () => {};
    }

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) {
      if (typeof callback === 'function') {
        callback(this.getMessages(conversationId));
      }
      return () => {};
    }

    const attach = (uid) => {
      try {
        const q = fb.db.collection("conversations")
          .doc(conversationId)
          .collection("messages")
          .orderBy("createdAt", "asc");

        this._activeChatUnsubscribe = q.onSnapshot(
          snapshot => {
            if (!snapshot) return;
            const remoteMsgs = [];
            snapshot.forEach(doc => {
              const norm = this._normalizeMessageDoc(doc.id, doc.data());
              if (norm) remoteMsgs.push(norm);
            });

            this._reconcileMessagesWithLocal(conversationId, remoteMsgs);
            this.markMessagesAsReadInFirestore(conversationId, uid);

            const currentList = this.getMessages(conversationId);
            if (typeof callback === 'function') callback(currentList);
            window.dispatchEvent(new CustomEvent('farmlink:messages-updated', { detail: { conversationId, messages: currentList } }));
          },
          err => {
            console.warn("[FarmLink Storage] Active chat listener note:", err.message);
          }
        );
        return this._activeChatUnsubscribe;
      } catch (e) {
        console.warn("[FarmLink Storage] Failed to initialize active chat listener:", e.message);
        return () => {};
      }
    };

    if (fb.auth && fb.auth.currentUser) {
      return attach(fb.auth.currentUser.uid);
    } else if (typeof this.waitForFirebaseAuth === 'function') {
      this.waitForFirebaseAuth(3000).then(fbUser => {
        if (fbUser) {
          attach(fbUser.uid);
        }
      });
      return () => this.clearActiveChatSync();
    }
    return () => {};
  }

  clearActiveChatSync() {
    if (typeof this._activeChatUnsubscribe === 'function') {
      try { this._activeChatUnsubscribe(); } catch (e) {}
      this._activeChatUnsubscribe = null;
    }
  }

  // --- Firestore Transactions Synchronization (Phase 3C) ---
  _normalizeTransactionDoc(txId, data) {
    if (!data) return null;
    const finalPrice = Number(data.finalPrice || data.price || 0);
    const qty = Number(data.quantity || data.requestedQuantity || 1);
    const totalAmount = Number(data.totalAmount !== undefined ? data.totalAmount : (finalPrice * qty));
    return {
      ...data,
      id: txId,
      transactionId: txId,
      offerId: data.offerId || "",
      cropId: data.cropId || "",
      cropName: data.cropName || data.cropTitle || "Agricultural Produce",
      cropTitle: data.cropTitle || data.cropName || "Agricultural Produce",
      cropImage: data.cropImage || "",
      farmerId: data.farmerId || data.farmerUid || "",
      farmerUid: data.farmerUid || data.farmerId || "",
      farmerName: data.farmerName || "Farmer",
      farmerPhone: data.farmerPhone || "",
      dealerId: data.dealerId || data.dealerUid || "",
      dealerUid: data.dealerUid || data.dealerId || "",
      dealerName: data.dealerName || "Dealer",
      dealerPhone: data.dealerPhone || "",
      quantity: qty,
      unit: data.unit || "kg",
      finalPrice: finalPrice,
      totalAmount: totalAmount,
      date: data.date || (data.createdAt ? data.createdAt.split("T")[0] : new Date().toISOString().split("T")[0]),
      dealStatus: data.dealStatus || (data.status === "Completed" ? "Accepted" : (data.status || "Accepted")),
      paymentStatus: data.paymentStatus || (data.status === "Completed" && !data.dealStatus ? "Settled" : "Pending_Payment"),
      deliveryStatus: data.deliveryStatus || (data.status === "Completed" && !data.dealStatus ? "Delivered" : "Pending_Delivery"),
      status: data.status || "Completed",
      farmerRated: !!data.farmerRated,
      dealerRated: !!data.dealerRated,
      isDemo: false,
      userCreated: true,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
  }

  _reconcileTransactionsWithLocal(cloudTxs) {
    const localTxs = this.getTransactions();
    const mergedMap = new Map();
    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    const isRealUser = currentUser && !currentUser.isDemo && (currentUser.isFirebaseAuth || !!currentUser.uid);
    const activeUid = currentUser ? (currentUser.uid || currentUser.id) : null;

    // 1. For demo users: keep demo & legacy local transactions from local storage
    // For real authenticated users: only keep demo transactions if explicitly in demo session
    if (!isRealUser) {
      localTxs.forEach(t => {
        if (this.isDemoTransaction(t)) {
          mergedMap.set(t.id, t);
        }
      });
    }

    // 2. Authoritative cloud transactions (preserving any local review & fulfillment metadata)
    cloudTxs.forEach(cloudTx => {
      if (cloudTx && (cloudTx.id || cloudTx.transactionId)) {
        const key = cloudTx.id || cloudTx.transactionId;
        const existingLocal = localTxs.find(t => t.id === key || t.transactionId === key);
        const merged = { ...cloudTx };
        if (existingLocal) {
          // Protect review metadata from being overwritten by cloud synchronization
          if (existingLocal.farmerRated) {
            merged.farmerRated = true;
            if (existingLocal.farmerRating !== undefined) merged.farmerRating = existingLocal.farmerRating;
            if (existingLocal.farmerReview !== undefined) merged.farmerReview = existingLocal.farmerReview;
          }
          if (existingLocal.dealerRated) {
            merged.dealerRated = true;
            if (existingLocal.dealerRating !== undefined) merged.dealerRating = existingLocal.dealerRating;
            if (existingLocal.dealerReview !== undefined) merged.dealerReview = existingLocal.dealerReview;
          }
          // Preserve local fulfillment progress if newer
          if (existingLocal.paymentStatus && (!merged.paymentStatus || existingLocal.paymentStatus === 'Paid' || existingLocal.paymentStatus === 'Settled')) {
            merged.paymentStatus = existingLocal.paymentStatus;
          }
          if (existingLocal.deliveryStatus && (!merged.deliveryStatus || existingLocal.deliveryStatus === 'Delivered')) {
            merged.deliveryStatus = existingLocal.deliveryStatus;
          }
        }
        mergedMap.set(key, merged);
      }
    });

    // 3. Keep local transactions only if they belong to the current authenticated user and aren't demo
    localTxs.forEach(t => {
      const key = t.id || t.transactionId;
      if (!this.isDemoTransaction(t) && !mergedMap.has(key)) {
        if (!isRealUser || (activeUid && (t.farmerId === activeUid || t.dealerId === activeUid || t.farmerUid === activeUid || t.dealerUid === activeUid))) {
          mergedMap.set(key, t);
        }
      }
    });

    const mergedTxs = Array.from(mergedMap.values());
    mergedTxs.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
    this.set(STORAGE_KEYS.TRANSACTIONS, mergedTxs);
    return mergedTxs;
  }

  async syncTransactionsFromFirestore(role = null) {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return this.getTransactions();

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(3000);
    }
    if (!fbUser) return this.getTransactions();

    const uid = fbUser.uid;
    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    if (currentUser && currentUser.isDemo && !fbUser) return this.getTransactions();

    const userRole = role || (currentUser ? currentUser.role : null);

    try {
      const cloudTxs = [];
      if (userRole === "farmer") {
        const snap = await fb.db.collection("transactions").where("farmerId", "==", uid).get();
        snap.forEach(doc => {
          const norm = this._normalizeTransactionDoc(doc.id, doc.data());
          if (norm) cloudTxs.push(norm);
        });
      } else if (userRole === "dealer") {
        const snap = await fb.db.collection("transactions").where("dealerId", "==", uid).get();
        snap.forEach(doc => {
          const norm = this._normalizeTransactionDoc(doc.id, doc.data());
          if (norm) cloudTxs.push(norm);
        });
      } else if (userRole === "admin" || (currentUser && currentUser.role === "admin")) {
        const snap = await fb.db.collection("transactions").get();
        snap.forEach(doc => {
          const norm = this._normalizeTransactionDoc(doc.id, doc.data());
          if (norm) cloudTxs.push(norm);
        });
      } else {
        const [snap1, snap2] = await Promise.all([
          fb.db.collection("transactions").where("farmerId", "==", uid).get(),
          fb.db.collection("transactions").where("dealerId", "==", uid).get()
        ]);
        const seen = new Set();
        [snap1, snap2].forEach(snap => {
          snap.forEach(doc => {
            if (!seen.has(doc.id)) {
              seen.add(doc.id);
              const norm = this._normalizeTransactionDoc(doc.id, doc.data());
              if (norm) cloudTxs.push(norm);
            }
          });
        });
      }
      return this._reconcileTransactionsWithLocal(cloudTxs);
    } catch (err) {
      console.warn("[FarmLink Storage] Transactions sync note:", err);
      return this.getTransactions();
    }
  }

  clearTransactionsSync() {
    if (this._txListenerUnsubscribes && this._txListenerUnsubscribes.length > 0) {
      this._txListenerUnsubscribes.forEach(unsub => {
        try { unsub(); } catch (e) {}
      });
      this._txListenerUnsubscribes = [];
    }
  }

  initTransactionsSync(callback, role = null) {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return;

    const fbAuth = fb.auth;
    if (!fbAuth) return;

    fbAuth.onAuthStateChanged(user => {
      if (user) {
        if (this._txListenerUnsubscribes && this._txListenerUnsubscribes.length > 0) {
          this._txListenerUnsubscribes.forEach(unsub => unsub());
          this._txListenerUnsubscribes = [];
        } else {
          this._txListenerUnsubscribes = [];
        }

        const uid = user.uid;
        const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
          ? window.Auth.getCurrentUser() 
          : null;
        if (currentUser && currentUser.isDemo) return;

        const userRole = role || (currentUser ? currentUser.role : null);

        const handleSnapshot = (snapshot) => {
          try {
            if (snapshot && typeof snapshot.forEach === 'function') {
              const cloudTxs = [];
              snapshot.forEach(doc => {
                const data = doc.data();
                if (!data) return;
                const normalized = this._normalizeTransactionDoc(doc.id, data);
                if (normalized) cloudTxs.push(normalized);
              });
              const merged = this._reconcileTransactionsWithLocal(cloudTxs);
              if (typeof callback === 'function') callback(merged);
            } else {
              this.syncTransactionsFromFirestore(userRole).then(merged => {
                if (typeof callback === 'function') callback(merged);
              });
            }
          } catch (e) {
            console.warn('[FarmLink Storage] Transactions listener processing note:', e);
            this.syncTransactionsFromFirestore(userRole).then(merged => {
              if (typeof callback === 'function') callback(merged);
            });
          }
        };

        try {
          if (userRole === 'farmer') {
            const unsub = fb.db.collection("transactions").where("farmerId", "==", uid).onSnapshot(handleSnapshot, err => {
              console.warn('[FarmLink Storage] Farmer transactions listener note:', err.message);
            });
            this._txListenerUnsubscribes.push(unsub);
          } else if (userRole === 'dealer') {
            const unsub = fb.db.collection("transactions").where("dealerId", "==", uid).onSnapshot(handleSnapshot, err => {
              console.warn('[FarmLink Storage] Dealer transactions listener note:', err.message);
            });
            this._txListenerUnsubscribes.push(unsub);
          } else {
            const unsub1 = fb.db.collection("transactions").where("farmerId", "==", uid).onSnapshot(handleSnapshot, () => {});
            const unsub2 = fb.db.collection("transactions").where("dealerId", "==", uid).onSnapshot(handleSnapshot, () => {});
            this._txListenerUnsubscribes.push(unsub1, unsub2);
          }
        } catch (e) {
          console.warn('[FarmLink Storage] Failed to initialize transactions listener:', e.message);
        }
      } else {
        if (this._txListenerUnsubscribes && this._txListenerUnsubscribes.length > 0) {
          this._txListenerUnsubscribes.forEach(unsub => unsub());
          this._txListenerUnsubscribes = [];
        }
      }
    });
  }

  // Transactions
  getTransactions() { return this.get(STORAGE_KEYS.TRANSACTIONS); }
  addTransaction(tx) {
    const txs = this.getTransactions();
    const txId = (tx && (tx.id || tx.transactionId)) || ("tx_" + Date.now());
    const finalPrice = Number(tx ? (tx.finalPrice || tx.price || 0) : 0);
    const qty = Number(tx ? (tx.quantity || 1) : 1);
    const totalAmount = Number(tx && tx.totalAmount !== undefined ? tx.totalAmount : (finalPrice * qty));

    const cleanInputTx = {};
    for (const [k, v] of Object.entries(tx || {})) {
      if (v !== undefined) cleanInputTx[k] = v;
    }

    const newTx = {
      id: txId,
      transactionId: txId,
      cropId: (tx && tx.cropId) || "",
      offerId: (tx && tx.offerId) || "",
      farmerId: (tx && tx.farmerId) || "",
      farmerName: (tx && tx.farmerName) || "Farmer",
      dealerId: (tx && tx.dealerId) || "",
      dealerName: (tx && tx.dealerName) || "Dealer",
      cropName: (tx && (tx.cropName || tx.cropTitle)) || "Agricultural Produce",
      cropTitle: (tx && (tx.cropTitle || tx.cropName)) || "Agricultural Produce",
      quantity: qty,
      unit: (tx && tx.unit) || "kg",
      finalPrice: finalPrice,
      totalAmount: totalAmount,
      date: (tx && tx.date) || new Date().toISOString().split("T")[0],
      status: (tx && tx.status) || "Completed",
      farmerRated: !!(tx && tx.farmerRated),
      dealerRated: !!(tx && tx.dealerRated),
      isDemo: false,
      userCreated: true,
      ...cleanInputTx,
      id: txId,
      transactionId: txId,
      quantity: qty,
      finalPrice: finalPrice,
      totalAmount: totalAmount
    };

    const sanitizedTx = this.validateAndSanitizeFirestoreDoc(
      "transactions",
      newTx,
      ["id", "transactionId", "cropId", "farmerId", "dealerId", "quantity", "finalPrice", "totalAmount", "status"],
      { quantity: { positive: true }, finalPrice: { positive: true }, totalAmount: { positive: true } }
    );

    txs.unshift(sanitizedTx);
    this.set(STORAGE_KEYS.TRANSACTIONS, txs);
    return sanitizedTx;
  }
  updateTransaction(id, updatedFields) {
    const txs = this.getTransactions();
    const idx = txs.findIndex(t => t.id === id || t.transactionId === id);
    if (idx !== -1) {
      const cleanUpdates = {};
      for (const [k, v] of Object.entries(updatedFields || {})) {
        if (v !== undefined) cleanUpdates[k] = v;
      }
      cleanUpdates.updatedAt = new Date().toISOString();
      const sanitized = this.validateAndSanitizeFirestoreDoc("transactions_update", cleanUpdates, []);
      txs[idx] = { ...txs[idx], ...sanitized };
      this.set(STORAGE_KEYS.TRANSACTIONS, txs);

      // Propagate rating/fulfillment changes to cloud if real transaction
      try {
        const fb = this.getFirebaseBridge();
        const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
        if (isFbAvailable && !txs[idx].isDemo && fb.auth && fb.auth.currentUser) {
          fb.db.collection("transactions").doc(id).update(sanitized).catch(() => {});
        }
      } catch (e) {}

      return txs[idx];
    }
    return null;
  }
  getTransactionById(id) {
    return this.getTransactions().find(t => t.id === id || t.transactionId === id);
  }

  getDeliveryDetails(tx) {
    if (!tx) {
      return {
        isDispatched: false,
        isReceived: false,
        isDelivered: false,
        dispatchDate: null,
        dispatchedQuantity: null,
        transportDetails: null,
        dispatchNotes: null,
        farmerDispatched: false,
        dispatchedAt: null,
        dispatchedBy: null,
        receivedQuantity: null,
        dealerDeliveryConfirmed: false,
        deliveryConfirmedAt: null,
        deliveryConfirmedBy: null,
        deliveryNotes: null,
        raw: {}
      };
    }

    let raw = {};
    if (tx.note && typeof tx.note === 'string' && tx.note.trim().startsWith('{') && (tx.note.includes('"dispatch"') || tx.note.includes('"receipt"'))) {
      try {
        raw = JSON.parse(tx.note);
      } catch (e) {
        raw = {};
      }
    } else if (tx.note && typeof tx.note === 'object') {
      raw = tx.note;
    }

    // Authoritative check: prefer structured fields if present, fallback to raw from note
    const dispatch = tx.farmerDispatch || raw.dispatch || {};
    const receipt = tx.dealerReceipt || raw.receipt || {};

    const isDispatched = Boolean(
      (tx.farmerDispatch && tx.farmerDispatch.farmerConfirmed) ||
      dispatch.dispatched ||
      dispatch.confirmed ||
      tx.farmerDispatched ||
      tx.dispatchDate ||
      (tx.deliveryProgress === "Dispatched")
    );

    const isReceived = Boolean(
      (tx.dealerReceipt && tx.dealerReceipt.dealerConfirmed) ||
      receipt.received ||
      receipt.confirmed ||
      receipt.dealerConfirmed ||
      tx.dealerDeliveryConfirmed ||
      tx.deliveryConfirmedAt ||
      (tx.deliveryProgress === "Delivered")
    );

    const isDelivered = (tx.deliveryStatus === "Delivered" || tx.deliveryStatus === "completed" || tx.deliveryStatus === "delivered") || isReceived;

    return {
      isDispatched,
      isReceived: isDelivered,
      isDelivered,
      dispatchDate: dispatch.dispatchDate || dispatch.date || tx.dispatchDate || null,
      dispatchedQuantity: Number(dispatch.dispatchedQuantity || dispatch.quantity || tx.dispatchedQuantity || 0) || null,
      transportDetails: dispatch.transportDetails || dispatch.transport || dispatch.vehicleNumber || tx.transportDetails || null,
      dispatchNotes: dispatch.dispatchNotes || dispatch.notes || dispatch.farmerNotes || tx.dispatchNotes || null,
      farmerDispatched: isDispatched,
      dispatchedAt: dispatch.dispatchedAt || dispatch.confirmedAt || tx.dispatchedAt || null,
      dispatchedBy: dispatch.farmerUid || tx.dispatchedBy || tx.farmerId || null,
      receivedQuantity: Number(receipt.receivedQuantity || receipt.quantity || tx.receivedQuantity || 0) || null,
      dealerDeliveryConfirmed: isDelivered,
      deliveryConfirmedAt: receipt.receivedAt || receipt.confirmedAt || tx.deliveryConfirmedAt || null,
      deliveryConfirmedBy: receipt.dealerUid || tx.deliveryConfirmedBy || tx.dealerId || null,
      deliveryNotes: receipt.deliveryNotes || receipt.inspectionNotes || receipt.notes || tx.dealerDeliveryNotes || null,
      raw
    };
  }

  getPaymentDetails(tx) {
    if (!tx) {
      return {
        isDeclared: false,
        isConfirmed: false,
        isPaid: false,
        declaredAmount: null,
        confirmedAmount: null,
        paymentDate: null,
        paymentMethod: null,
        referenceNumber: null,
        notes: null,
        confirmedNotes: null
      };
    }
    const dealerPay = tx.dealerPayment || {};
    const farmerPay = tx.farmerPayment || {};
    const isDeclared = Boolean(dealerPay.dealerDeclared || tx.paymentStatus === 'Payment_Declared');
    const isPaid = tx.paymentStatus === 'Paid' || tx.paymentStatus === 'Settled' || tx.paymentStatus === 'completed' || Boolean(farmerPay.farmerConfirmed);

    return {
      isDeclared,
      isConfirmed: isPaid,
      isPaid,
      declaredAmount: dealerPay.amount || null,
      confirmedAmount: farmerPay.confirmedAmount || null,
      paymentDate: dealerPay.paymentDate || null,
      paymentMethod: dealerPay.paymentMethod || null,
      referenceNumber: dealerPay.referenceNumber || null,
      notes: dealerPay.notes || null,
      confirmedNotes: farmerPay.notes || null
    };
  }

  async recordFarmerDispatch(txId, { dispatchDate, dispatchedQuantity, transportDetails = "", dispatchNotes = "" }) {
    if (!txId) throw new Error("Transaction ID is required.");
    const tx = this.getTransactionById(txId);
    if (!tx) throw new Error("Transaction record not found.");

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function")
      ? window.Auth.getCurrentUser()
      : null;
    const currentUid = currentUser ? (currentUser.uid || currentUser.id) : null;

    // Authorization check: only the transaction's farmer or admin
    if (currentUser) {
      const isFarmer = tx.farmerId === currentUid || tx.farmerUid === currentUid || currentUser.role === 'admin';
      if (!isFarmer) {
        throw new Error("Unauthorized: Only the assigned farmer can mark goods as dispatched.");
      }
    }

    if (tx.status === "Cancelled" || tx.status === "cancelled" || tx.dealStatus === "Cancelled" || tx.dealStatus === "cancelled") {
      throw new Error("Cannot dispatch a cancelled transaction.");
    }

    const existingDelivery = this.getDeliveryDetails(tx);
    if (existingDelivery.isDispatched) {
      throw new Error("Goods for this transaction have already been recorded as dispatched.");
    }

    const qty = Number(dispatchedQuantity);
    if (isNaN(qty) || qty <= 0) {
      throw new Error("Dispatched quantity must be a valid number greater than zero.");
    }
    const maxQty = Number(tx.quantity);
    if (qty > maxQty) {
      throw new Error(`Dispatched quantity (${qty} ${tx.unit || 'kg'}) cannot exceed contracted quantity (${maxQty} ${tx.unit || 'kg'}).`);
    }

    const nowIso = new Date().toISOString();
    const formattedDate = dispatchDate ? dispatchDate.split("T")[0] : nowIso.split("T")[0];

    const dispatchRecord = {
      dispatched: true,
      confirmed: true,
      date: formattedDate,
      dispatchDate: formattedDate,
      dispatchedAt: nowIso,
      confirmedAt: nowIso,
      quantity: qty,
      dispatchedQuantity: qty,
      transport: (transportDetails || "").trim(),
      transportDetails: (transportDetails || "").trim(),
      notes: (dispatchNotes || "").trim(),
      dispatchNotes: (dispatchNotes || "").trim(),
      farmerUid: currentUid || tx.farmerId || tx.farmerUid || "farmer"
    };

    const deliveryData = {
      ...existingDelivery.raw,
      type: "two_party_delivery",
      dispatch: dispatchRecord
    };

    const serializedNote = JSON.stringify(deliveryData);

    const farmerDispatch = {
      farmerUid: currentUid || tx.farmerId || tx.farmerUid || "farmer",
      farmerConfirmed: true,
      dispatchedQuantity: qty,
      dispatchDate: formattedDate,
      transportDetails: (transportDetails || "").trim(),
      vehicleNumber: (transportDetails || "").trim(),
      dispatchNotes: (dispatchNotes || "").trim(),
      farmerNotes: (dispatchNotes || "").trim(),
      dispatchedAt: nowIso
    };

    const updates = {
      updatedAt: nowIso,
      farmerDispatch,
      note: serializedNote
    };

    // Ensure deliveryStatus remains a valid allowed status in Firestore ('Pending_Delivery')
    if (!tx.deliveryStatus || tx.deliveryStatus === "pending") {
      updates.deliveryStatus = "Pending_Delivery";
    }

    // Update in Firestore with atomic concurrency control
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    const isReal = tx.isDemo === false && this.isRealFirebaseUser(currentUser);

    if (isReal && isFbAvailable && fb.db) {
      const txRef = fb.db.collection("transactions").doc(txId);
      if (typeof fb.db.runTransaction === "function") {
        await fb.db.runTransaction(async (transaction) => {
          const docSnap = await transaction.get(txRef);
          if (!docSnap.exists) throw new Error("Transaction document not found in cloud database.");
          const currentDoc = docSnap.data();
          if (currentDoc.farmerDispatch && currentDoc.farmerDispatch.farmerConfirmed) {
            throw new Error("Goods for this transaction have already been recorded as dispatched.");
          }
          transaction.update(txRef, updates);
        });
      } else {
        await txRef.update(updates);
      }
    }

    // Local cache update
    const localUpdates = {
      ...updates,
      dispatchDate: dispatchRecord.dispatchDate,
      dispatchedQuantity: dispatchRecord.dispatchedQuantity,
      transportDetails: dispatchRecord.transportDetails,
      dispatchNotes: dispatchRecord.dispatchNotes,
      farmerDispatched: true,
      dispatchedAt: dispatchRecord.dispatchedAt,
      dispatchedBy: dispatchRecord.farmerUid,
      deliveryProgress: "Dispatched"
    };
    const updatedTx = this.updateTransaction(txId, localUpdates);

    // Send transaction notification to dealer
    try {
      const dealerId = tx.dealerId || tx.dealerUid;
      if (dealerId && currentUid !== dealerId) {
        await this.addNotification({
          id: `notif_dispatch_${txId}_${Date.now()}`,
          notificationId: `notif_dispatch_${txId}_${Date.now()}`,
          recipientUserId: dealerId,
          userId: dealerId,
          senderUserId: currentUid || tx.farmerId,
          role: "dealer",
          type: "transaction",
          title: "Produce Lot Dispatched",
          titleTe: "సరుకు రవాణా చేయబడింది",
          message: "Farmer has dispatched your order. Please verify the received quantity and confirm delivery.",
          messageTe: "రైతు మీ ఆర్డర్‌ను రవాణా చేశారు. దయచేసి అందిన పరిమాణాన్ని ధృవీకరించి డెలివరీని నిర్ధారించండి.",
          relatedId: txId,
          link: "purchases.html",
          timestamp: nowIso,
          createdAt: nowIso,
          updatedAt: nowIso,
          isRead: false,
          read: false,
          isDemo: Boolean(tx.isDemo)
        });
      }
    } catch (notifErr) {
      console.warn("[FarmLink Storage] Failed to send dispatch notification:", notifErr);
    }

    return { success: true, transaction: updatedTx };
  }

  async recordDealerDeliveryReceipt(txId, { receivedQuantity, deliveryNotes = "", confirmationChecked = false }) {
    if (!txId) throw new Error("Transaction ID is required.");
    const tx = this.getTransactionById(txId);
    if (!tx) throw new Error("Transaction record not found.");

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function")
      ? window.Auth.getCurrentUser()
      : null;
    const currentUid = currentUser ? (currentUser.uid || currentUser.id) : null;

    // Authorization check: only the transaction's dealer or admin
    if (currentUser) {
      const isDealer = tx.dealerId === currentUid || tx.dealerUid === currentUid || currentUser.role === 'admin';
      if (!isDealer) {
        throw new Error("Unauthorized: Only the assigned dealer can confirm delivery receipt.");
      }
    }

    if (tx.status === "Cancelled" || tx.status === "cancelled" || tx.dealStatus === "Cancelled" || tx.dealStatus === "cancelled") {
      throw new Error("Cannot confirm delivery for a cancelled transaction.");
    }

    const existingDelivery = this.getDeliveryDetails(tx);
    if (!existingDelivery.isDispatched) {
      throw new Error("Goods have not yet been marked as dispatched by the farmer.");
    }
    if (existingDelivery.isDelivered || existingDelivery.isReceived) {
      throw new Error("Delivery has already been confirmed for this transaction.");
    }

    if (!confirmationChecked) {
      throw new Error("You must check the confirmation checkbox to verify that you have received the goods.");
    }

    const recQty = Number(receivedQuantity);
    if (isNaN(recQty) || recQty <= 0) {
      throw new Error("Received quantity must be a valid number greater than zero.");
    }

    const dispQty = existingDelivery.dispatchedQuantity || Number(tx.quantity);
    if (recQty > dispQty) {
      throw new Error(`Received quantity (${recQty} ${tx.unit || 'kg'}) cannot exceed dispatched quantity (${dispQty} ${tx.unit || 'kg'}).`);
    }

    const nowIso = new Date().toISOString();
    const receiptRecord = {
      received: true,
      confirmed: true,
      dealerConfirmed: true,
      date: nowIso.split("T")[0],
      receivedAt: nowIso,
      confirmedAt: nowIso,
      quantity: recQty,
      receivedQuantity: recQty,
      notes: (deliveryNotes || "").trim(),
      deliveryNotes: (deliveryNotes || "").trim(),
      dealerUid: currentUid || tx.dealerId || tx.dealerUid || "dealer"
    };

    const deliveryData = {
      ...existingDelivery.raw,
      type: "two_party_delivery",
      receipt: receiptRecord
    };

    const serializedNote = JSON.stringify(deliveryData);

    const dealerReceipt = {
      dealerUid: currentUid || tx.dealerId || tx.dealerUid || "dealer",
      dealerConfirmed: true,
      receivedQuantity: recQty,
      receiptDate: nowIso.split("T")[0],
      inspectionNotes: (deliveryNotes || "").trim(),
      deliveryNotes: (deliveryNotes || "").trim(),
      notes: (deliveryNotes || "").trim(),
      receivedAt: nowIso
    };

    const updates = {
      updatedAt: nowIso,
      dealerReceipt,
      deliveryStatus: "Delivered",
      note: serializedNote
    };

    // If payment is already Paid or Settled, the overall contract is Completed
    const currentPay = tx.paymentStatus;
    const isPaymentPaid = currentPay === "Paid" || currentPay === "Settled" || currentPay === "completed" || currentPay === "paid" || (tx.farmerPayment && tx.farmerPayment.farmerConfirmed);
    if (isPaymentPaid) {
      updates.dealStatus = "Fulfilled";
      updates.status = "Completed";
    }

    // Update in Firestore with atomic concurrency control
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    const isReal = tx.isDemo === false && this.isRealFirebaseUser(currentUser);

    if (isReal && isFbAvailable && fb.db) {
      const txRef = fb.db.collection("transactions").doc(txId);
      if (typeof fb.db.runTransaction === "function") {
        await fb.db.runTransaction(async (transaction) => {
          const docSnap = await transaction.get(txRef);
          if (!docSnap.exists) throw new Error("Transaction document not found in cloud database.");
          const currentDoc = docSnap.data();
          if (currentDoc.dealerReceipt && currentDoc.dealerReceipt.dealerConfirmed) {
            throw new Error("Delivery has already been confirmed for this transaction.");
          }
          const cloudPay = currentDoc.paymentStatus;
          const isCloudPaymentPaid = cloudPay === "Paid" || cloudPay === "Settled" || cloudPay === "completed" || cloudPay === "paid" ||
            (currentDoc.farmerPayment && currentDoc.farmerPayment.farmerConfirmed);
          if (isCloudPaymentPaid) {
            updates.dealStatus = "Fulfilled";
            updates.status = "Completed";
          }
          transaction.update(txRef, updates);
        });
      } else {
        await txRef.update(updates);
      }
    }

    // Local cache update
    const localUpdates = {
      ...updates,
      receivedQuantity: recQty,
      dealerDeliveryNotes: receiptRecord.deliveryNotes,
      dealerDeliveryConfirmed: true,
      deliveryConfirmedAt: receiptRecord.receivedAt,
      deliveryConfirmedBy: receiptRecord.dealerUid,
      deliveryProgress: "Delivered"
    };
    const updatedTx = this.updateTransaction(txId, localUpdates);

    // Send transaction notification to farmer
    try {
      const farmerId = tx.farmerId || tx.farmerUid;
      if (farmerId && currentUid !== farmerId) {
        await this.addNotification({
          id: `notif_receipt_${txId}_${Date.now()}`,
          notificationId: `notif_receipt_${txId}_${Date.now()}`,
          recipientUserId: farmerId,
          userId: farmerId,
          senderUserId: currentUid || tx.dealerId,
          role: "farmer",
          type: "transaction",
          title: "Delivery Confirmed by Dealer",
          titleTe: "డీలర్ డెలివరీని ధృవీకరించారు",
          message: "Dealer has confirmed receipt of your goods.",
          messageTe: "డీలర్ మీ సరుకు అందినట్లు నిర్ధారించారు.",
          relatedId: txId,
          link: "transactions.html",
          timestamp: nowIso,
          createdAt: nowIso,
          updatedAt: nowIso,
          isRead: false,
          read: false,
          isDemo: Boolean(tx.isDemo)
        });
      }
    } catch (notifErr) {
      console.warn("[FarmLink Storage] Failed to send receipt confirmation notification:", notifErr);
    }

    return { success: true, transaction: updatedTx };
  }

  async recordDealerPaymentDeclaration(txId, { amount, paymentMethod = "Bank Transfer", referenceNumber = "", notes = "" } = {}) {
    if (!txId) throw new Error("Transaction ID is required.");
    const tx = this.getTransactionById(txId);
    if (!tx) throw new Error("Transaction record not found.");

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function")
      ? window.Auth.getCurrentUser()
      : null;
    const currentUid = currentUser ? (currentUser.uid || currentUser.id) : null;

    if (currentUser) {
      const isDealer = tx.dealerId === currentUid || tx.dealerUid === currentUid || currentUser.role === 'admin';
      if (!isDealer) {
        throw new Error("Unauthorized: Only the assigned dealer can declare payment.");
      }
    }

    if (tx.status === "Cancelled" || tx.status === "cancelled" || tx.dealStatus === "Cancelled" || tx.dealStatus === "cancelled") {
      throw new Error("Cannot declare payment for a cancelled transaction.");
    }

    if (tx.dealerPayment && tx.dealerPayment.dealerDeclared) {
      throw new Error("Payment has already been declared for this transaction.");
    }

    const payAmt = Number(amount || tx.totalAmount);
    if (isNaN(payAmt) || payAmt <= 0) {
      throw new Error("Payment amount must be a valid positive number.");
    }

    const nowIso = new Date().toISOString();
    const dealerPayment = {
      dealerUid: currentUid || tx.dealerId || tx.dealerUid || "dealer",
      dealerDeclared: true,
      amount: payAmt,
      paymentDate: nowIso.split("T")[0],
      paymentMethod: (paymentMethod || "Bank Transfer").trim(),
      referenceNumber: (referenceNumber || "").trim(),
      notes: (notes || "").trim(),
      declaredAt: nowIso
    };

    const updates = {
      updatedAt: nowIso,
      dealerPayment,
      paymentStatus: "Payment_Declared"
    };

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    const isReal = tx.isDemo === false && this.isRealFirebaseUser(currentUser);

    if (isReal && isFbAvailable && fb.db) {
      const txRef = fb.db.collection("transactions").doc(txId);
      if (typeof fb.db.runTransaction === "function") {
        await fb.db.runTransaction(async (transaction) => {
          const docSnap = await transaction.get(txRef);
          if (!docSnap.exists) throw new Error("Transaction document not found in cloud database.");
          const currentDoc = docSnap.data();
          if (currentDoc.dealerPayment && currentDoc.dealerPayment.dealerDeclared) {
            throw new Error("Payment has already been declared for this transaction.");
          }
          transaction.update(txRef, updates);
        });
      } else {
        await txRef.update(updates);
      }
    }

    const updatedTx = this.updateTransaction(txId, updates);

    // Send notification to farmer
    try {
      const farmerId = tx.farmerId || tx.farmerUid;
      if (farmerId && currentUid !== farmerId) {
        await this.addNotification({
          id: `notif_paydec_${txId}_${Date.now()}`,
          notificationId: `notif_paydec_${txId}_${Date.now()}`,
          recipientUserId: farmerId,
          userId: farmerId,
          senderUserId: currentUid || tx.dealerId,
          role: "farmer",
          type: "transaction",
          title: "Payment Declared by Buyer",
          titleTe: "కొనుగోలుదారు చెల్లింపు ప్రకటించారు",
          message: `Buyer has declared payment of ₹${payAmt.toLocaleString('en-IN')}. Please verify receipt in your bank account and confirm.`,
          messageTe: `కొనుగోలుదారు ₹${payAmt.toLocaleString('en-IN')} చెల్లింపు ప్రకటించారు. దయచేసి మీ ఖాతాను పరిశీలించి నిర్ధారించండి.`,
          relatedId: txId,
          link: "transactions.html",
          timestamp: nowIso,
          createdAt: nowIso,
          updatedAt: nowIso,
          isRead: false,
          read: false,
          isDemo: Boolean(tx.isDemo)
        });
      }
    } catch (notifErr) {
      console.warn("[FarmLink Storage] Failed to send payment declaration notification:", notifErr);
    }

    return { success: true, transaction: updatedTx };
  }

  async recordFarmerPaymentConfirmation(txId, { confirmedAmount, notes = "" } = {}) {
    if (!txId) throw new Error("Transaction ID is required.");
    const tx = this.getTransactionById(txId);
    if (!tx) throw new Error("Transaction record not found.");

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function")
      ? window.Auth.getCurrentUser()
      : null;
    const currentUid = currentUser ? (currentUser.uid || currentUser.id) : null;

    if (currentUser) {
      const isFarmer = tx.farmerId === currentUid || tx.farmerUid === currentUid || currentUser.role === 'admin';
      if (!isFarmer) {
        throw new Error("Unauthorized: Only the assigned farmer can confirm payment receipt.");
      }
    }

    if (tx.status === "Cancelled" || tx.status === "cancelled" || tx.dealStatus === "Cancelled" || tx.dealStatus === "cancelled") {
      throw new Error("Cannot confirm payment for a cancelled transaction.");
    }

    if (!tx.dealerPayment || !tx.dealerPayment.dealerDeclared) {
      throw new Error("Buyer has not yet declared payment for this transaction.");
    }

    if (tx.farmerPayment && tx.farmerPayment.farmerConfirmed) {
      throw new Error("Payment has already been confirmed for this transaction.");
    }

    const confAmt = Number(confirmedAmount || (tx.dealerPayment && tx.dealerPayment.amount) || tx.totalAmount);
    if (isNaN(confAmt) || confAmt <= 0) {
      throw new Error("Confirmed payment amount must be a valid positive number.");
    }

    const nowIso = new Date().toISOString();
    const farmerPayment = {
      farmerUid: currentUid || tx.farmerId || tx.farmerUid || "farmer",
      farmerConfirmed: true,
      confirmedAmount: confAmt,
      confirmationDate: nowIso.split("T")[0],
      notes: (notes || "").trim(),
      confirmedAt: nowIso
    };

    const updates = {
      updatedAt: nowIso,
      farmerPayment,
      paymentStatus: "Paid"
    };

    // If delivery is also Delivered, transaction is fully complete
    const currentDel = tx.deliveryStatus;
    const isDeliveryDone = currentDel === "Delivered" || currentDel === "completed" || currentDel === "delivered" || (tx.dealerReceipt && tx.dealerReceipt.dealerConfirmed);
    if (isDeliveryDone) {
      updates.dealStatus = "Fulfilled";
      updates.status = "Completed";
    }

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    const isReal = tx.isDemo === false && this.isRealFirebaseUser(currentUser);

    if (isReal && isFbAvailable && fb.db) {
      const txRef = fb.db.collection("transactions").doc(txId);
      if (typeof fb.db.runTransaction === "function") {
        await fb.db.runTransaction(async (transaction) => {
          const docSnap = await transaction.get(txRef);
          if (!docSnap.exists) throw new Error("Transaction document not found in cloud database.");
          const currentDoc = docSnap.data();
          if (currentDoc.farmerPayment && currentDoc.farmerPayment.farmerConfirmed) {
            throw new Error("Payment has already been confirmed for this transaction.");
          }
          const cloudDel = currentDoc.deliveryStatus;
          const isCloudDeliveryDone = cloudDel === "Delivered" || cloudDel === "completed" || cloudDel === "delivered" ||
            (currentDoc.dealerReceipt && currentDoc.dealerReceipt.dealerConfirmed);
          if (isCloudDeliveryDone) {
            updates.dealStatus = "Fulfilled";
            updates.status = "Completed";
          }
          transaction.update(txRef, updates);
        });
      } else {
        await txRef.update(updates);
      }
    }

    const updatedTx = this.updateTransaction(txId, updates);

    // Send notification to dealer
    try {
      const dealerId = tx.dealerId || tx.dealerUid;
      if (dealerId && currentUid !== dealerId) {
        await this.addNotification({
          id: `notif_payconf_${txId}_${Date.now()}`,
          notificationId: `notif_payconf_${txId}_${Date.now()}`,
          recipientUserId: dealerId,
          userId: dealerId,
          senderUserId: currentUid || tx.farmerId,
          role: "dealer",
          type: "transaction",
          title: "Payment Confirmed by Farmer",
          titleTe: "రైతు చెల్లింపును ధృవీకరించారు",
          message: `Farmer has confirmed receipt of ₹${confAmt.toLocaleString('en-IN')}. Payment is officially Settled.`,
          messageTe: `రైతు ₹${confAmt.toLocaleString('en-IN')} చెల్లింపును ధృవీకరించారు. చెల్లింపు పూర్తయింది.`,
          relatedId: txId,
          link: "purchases.html",
          timestamp: nowIso,
          createdAt: nowIso,
          updatedAt: nowIso,
          isRead: false,
          read: false,
          isDemo: Boolean(tx.isDemo)
        });
      }
    } catch (notifErr) {
      console.warn("[FarmLink Storage] Failed to send payment confirmation notification:", notifErr);
    }

    return { success: true, transaction: updatedTx };
  }

  async updateTransactionFulfillment(txId, { paymentStatus, deliveryStatus, note = "" }) {
    if (!txId) throw new Error("Transaction ID is required.");
    const tx = this.getTransactionById(txId);
    if (!tx) throw new Error("Transaction record not found.");

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function")
      ? window.Auth.getCurrentUser()
      : null;
    const currentUid = currentUser ? (currentUser.uid || currentUser.id) : null;
    const isOwner = !currentUid || tx.farmerId === currentUid || tx.farmerUid === currentUid || tx.dealerId === currentUid || tx.dealerUid === currentUid || (currentUser && currentUser.role === 'admin');

    if (currentUser && !isOwner) {
      throw new Error("Unauthorized: Only transaction participants can update fulfillment status.");
    }

    const updates = {
      updatedAt: new Date().toISOString()
    };

    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
    }
    if (deliveryStatus) {
      updates.deliveryStatus = deliveryStatus;
    }
    if (note) {
      updates.note = note;
    }

    const currentPay = updates.paymentStatus || tx.paymentStatus;
    const currentDel = updates.deliveryStatus || tx.deliveryStatus;
    const isFullyDone = (currentPay === 'Paid' || currentPay === 'Settled' || currentPay === 'completed') && (currentDel === 'Delivered' || currentDel === 'completed');

    if (isFullyDone) {
      updates.dealStatus = "Fulfilled";
      updates.status = "Completed";
    }

    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    const isReal = tx.isDemo === false && this.isRealFirebaseUser(currentUser);

    if (isReal && isFbAvailable && fb.db) {
      const txRef = fb.db.collection("transactions").doc(txId);
      await txRef.update(updates);
    }

    // Update in local cache
    const updatedTx = this.updateTransaction(txId, updates);
    return { success: true, transaction: updatedTx };
  }

  getTransactionStatusDisplay(t) {
    if (!t) return {
      label: "Unknown",
      labelTe: "తెలియదు",
      badgeClass: "badge-secondary",
      isFullyCompleted: false,
      summary: "No transaction data",
      paymentLabel: "Unknown",
      paymentLabelTe: "తెలియదు",
      paymentClass: "badge-secondary",
      deliveryLabel: "Unknown",
      deliveryLabelTe: "తెలియదు",
      deliveryClass: "badge-secondary"
    };

    const deliveryInfo = this.getDeliveryDetails(t);

    const isCancelled = t.status === "Cancelled" || t.status === "cancelled" || t.dealStatus === "Cancelled" || t.dealStatus === "cancelled";
    if (isCancelled) {
      return {
        label: "Cancelled",
        labelTe: "రద్దు చేయబడింది",
        badgeClass: "badge-danger",
        isFullyCompleted: false,
        summary: "Contract Cancelled",
        dealStatus: "Cancelled",
        paymentLabel: "Cancelled",
        paymentLabelTe: "రద్దు",
        paymentClass: "badge-danger",
        deliveryLabel: "Cancelled",
        deliveryLabelTe: "రద్దు",
        deliveryClass: "badge-danger",
        isDispatched: false,
        isDelivered: false
      };
    }

    // Granular payment status
    const rawPayment = (t.paymentStatus || "").trim();
    const isPaymentPaid = rawPayment === "Paid" || rawPayment === "Settled" || rawPayment === "completed" || rawPayment === "paid" ||
      Boolean(t.farmerPayment && t.farmerPayment.farmerConfirmed);
    const isPaymentDeclared = !isPaymentPaid && (rawPayment === "Payment_Declared" || Boolean(t.dealerPayment && t.dealerPayment.dealerDeclared));

    let paymentLabel = "Payment: Pending";
    let paymentLabelTe = "చెల్లింపు: పెండింగ్";
    let paymentClass = "badge-warning";

    if (isPaymentPaid) {
      paymentLabel = "Payment: Paid";
      paymentLabelTe = "చెల్లింపు: పూర్తయింది";
      paymentClass = "badge-success";
    } else if (isPaymentDeclared) {
      paymentLabel = "Payment: Declared (Awaiting Confirmation)";
      paymentLabelTe = "చెల్లింపు: ప్రకటించబడింది (ధృవీకరణ పెండింగ్)";
      paymentClass = "badge-primary";
    }

    // Granular delivery status
    const rawDelivery = (t.deliveryStatus || "").trim();
    const isDelivered = rawDelivery === "Delivered" || rawDelivery === "completed" || rawDelivery === "delivered" ||
      Boolean(t.dealerReceipt && t.dealerReceipt.dealerConfirmed) ||
      (!t.deliveryStatus && deliveryInfo.isReceived);
    const isDispatched = !isDelivered && deliveryInfo.isDispatched;

    let deliveryLabel = "Delivery: Pending";
    let deliveryLabelTe = "డెలివరీ: పెండింగ్";
    let deliveryClass = "badge-info";

    if (isDelivered) {
      deliveryLabel = "Delivery: Delivered (Confirmed by dealer)";
      deliveryLabelTe = "డెలివరీ: డీలర్ ధృవీకరించారు";
      deliveryClass = "badge-success";
    } else if (isDispatched) {
      deliveryLabel = "Delivery: Dispatched (Awaiting confirmation)";
      deliveryLabelTe = "డెలివరీ: రవాణా చేయబడింది (ధృవీకరణ పెండింగ్)";
      deliveryClass = "badge-primary";
    }

    // Legacy records with only status === 'Completed' and no granular status fields
    const isLegacyCompleted = (t.status === "Completed" || t.status === "completed") && !t.paymentStatus && !t.deliveryStatus;

    // Final completion condition: BOTH payment is Paid/Settled AND delivery is Delivered
    const isFullyCompleted = isLegacyCompleted || (isPaymentPaid && isDelivered);

    let overallLabel = "In Progress";
    let overallLabelTe = "పురోగతిలో ఉంది";
    let overallClass = "badge-info";
    let summary = "";

    if (isFullyCompleted) {
      overallLabel = "Completed";
      overallLabelTe = "పూర్తయింది";
      overallClass = "badge-success";
      summary = "Payment Settled • Delivery Confirmed by Dealer";
    } else if (isPaymentPaid && isDispatched) {
      overallLabel = "Payment Completed – Delivery In Progress";
      overallLabelTe = "చెల్లింపు పూర్తయింది – డెలివరీ మార్గంలో ఉంది";
      overallClass = "badge-primary";
      summary = "Payment Settled • Goods Dispatched • Awaiting Dealer Receipt Confirmation";
    } else if (isPaymentPaid && !isDispatched) {
      overallLabel = "Payment Completed – Delivery Pending";
      overallLabelTe = "చెల్లింపు పూర్తయింది – డెలివరీ పెండింగ్";
      overallClass = "badge-warning";
      summary = "Payment Settled • Awaiting Farmer Dispatch";
    } else if (!isPaymentPaid && isDelivered) {
      overallLabel = "Delivery Completed – Payment Pending";
      overallLabelTe = "డెలివరీ పూర్తయింది – చెల్లింపు పెండింగ్";
      overallClass = "badge-warning";
      summary = "Goods Delivered & Confirmed • Awaiting Payment Settlement";
    } else if (!isPaymentPaid && isDispatched) {
      overallLabel = "Delivery Dispatched – Payment Pending";
      overallLabelTe = "డెలివరీ రవాణా చేయబడింది – చెల్లింపు పెండింగ్";
      overallClass = "badge-warning";
      summary = "Goods Dispatched • Awaiting Dealer Receipt & Payment Settlement";
    } else {
      overallLabel = "Payment & Delivery Pending";
      overallLabelTe = "చెల్లింపు & డెలివరీ పెండింగ్";
      overallClass = "badge-warning";
      summary = "Deal Accepted • Awaiting Payment Settlement & Produce Dispatch";
    }

    return {
      label: overallLabel,
      labelTe: overallLabelTe,
      badgeClass: overallClass,
      isFullyCompleted,
      summary,
      isDispatched,
      isDelivered,
      paymentStatus: isPaymentPaid ? "Paid" : "Pending_Payment",
      deliveryStatus: isDelivered ? "Delivered" : (isDispatched ? "Dispatched" : "Pending_Delivery"),
      paymentLabel,
      paymentLabelTe,
      paymentClass,
      deliveryLabel,
      deliveryLabelTe,
      deliveryClass
    };
  }

  buildReceiptHtml(tx) {
    if (!tx) return '<div class="alert alert-warning" style="padding: 1.5rem; text-align: center;">No transaction details available.</div>';

    const escape = (str) => {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Farmer Name & Location
    let farmerName = (tx.farmerName || "").trim();
    let farmerPhone = (tx.farmerPhone || "").trim();
    let farmerLocation = (tx.farmerLocation || tx.location || "").trim();

    if ((!farmerLocation || !farmerName || !farmerPhone) && typeof this.getUsers === 'function') {
      const users = this.getUsers() || [];
      const fUser = users.find(u => (u.id === tx.farmerId || u.uid === tx.farmerId || u.id === tx.farmerUid || u.uid === tx.farmerUid));
      if (fUser) {
        if (!farmerName || farmerName.toLowerCase() === "farmer") farmerName = fUser.name || farmerName;
        if (!farmerPhone) farmerPhone = fUser.phone || "";
        if (!farmerLocation) {
          if (fUser.village && fUser.district) farmerLocation = `${fUser.village}, ${fUser.mandal || ''}, ${fUser.district}, ${fUser.state || 'Andhra Pradesh'}`;
          else if (fUser.district) farmerLocation = `${fUser.district}, ${fUser.state || 'Andhra Pradesh'}`;
        }
      }
    }
    farmerName = farmerName || "Not provided";
    farmerPhone = farmerPhone || "Not provided";
    farmerLocation = farmerLocation || "Not provided";

    // Dealer Name & Location
    let dealerName = (tx.dealerName || "").trim();
    let dealerPhone = (tx.dealerPhone || "").trim();
    let dealerLocation = (tx.dealerLocation || "").trim();

    if ((!dealerLocation || !dealerName || !dealerPhone) && typeof this.getUsers === 'function') {
      const users = this.getUsers() || [];
      const dUser = users.find(u => (u.id === tx.dealerId || u.uid === tx.dealerId || u.id === tx.dealerUid || u.uid === tx.dealerUid));
      if (dUser) {
        if (!dealerName || dealerName.toLowerCase() === "dealer") dealerName = dUser.businessName || dUser.name || dealerName;
        if (!dealerPhone) dealerPhone = dUser.phone || "";
        if (!dealerLocation) {
          if (dUser.district) dealerLocation = `${dUser.district}, ${dUser.state || 'Andhra Pradesh'}`;
        }
      }
    }
    dealerName = dealerName || "Not provided";
    dealerPhone = dealerPhone || "Not provided";
    dealerLocation = dealerLocation || "Not provided";

    // Crop Name & Grade
    const cropName = (tx.cropTitle || tx.cropName || "").trim() || "Not provided";
    let cropGrade = (tx.cropGrade || tx.grade || "").trim();
    if (!cropGrade && typeof this.getCrops === 'function') {
      const crops = this.getCrops() || [];
      const c = crops.find(crop => crop.id === tx.cropId);
      if (c && c.grade) cropGrade = String(c.grade).trim();
    }
    cropGrade = cropGrade || "Not provided";

    // Numeric financials
    const qty = Number(tx.quantity || 0);
    const unit = (tx.unit || "kg").trim();
    const finalPrice = Number(tx.finalPrice || 0);
    const totalAmount = Number(tx.totalAmount !== undefined ? tx.totalAmount : (qty * finalPrice));

    // Identifiers & Dates
    const txIdDisplay = tx.id || tx.transactionId || (tx.offerId ? "tx_" + tx.offerId : "Not provided");
    const offerIdDisplay = tx.offerId ? ("#" + tx.offerId) : "Not provided";
    const contractDateDisplay = tx.date || (tx.createdAt ? tx.createdAt.split("T")[0] : "Not provided");

    // Delivery tracking
    const deliveryInfo = this.getDeliveryDetails(tx);

    // Status display
    const overallStatus = tx.status || "Completed";
    const dealStatus = tx.dealStatus || "Accepted";

    // Payment tracking
    const paymentInfo = typeof this.getPaymentDetails === 'function' ? this.getPaymentDetails(tx) : {};
    const rawPayment = (tx.paymentStatus || "").trim();
    const isPaymentPaid = rawPayment === "Paid" || rawPayment === "Settled";
    const isPaymentDeclared = !isPaymentPaid && (rawPayment === "Payment_Declared" || paymentInfo.isDeclared);
    const paymentStatusDisplay = isPaymentPaid
      ? "Settled / Paid"
      : (isPaymentDeclared ? "Payment Declared (Awaiting Confirmation)" : (rawPayment ? rawPayment.replace(/_/g, " ") : "Pending Payment"));

    const isDeliveryDelivered = deliveryInfo.isDelivered;
    const isDeliveryDispatched = !isDeliveryDelivered && deliveryInfo.isDispatched;
    const deliveryStatusDisplay = isDeliveryDelivered
      ? "Delivered (Confirmed by dealer)"
      : (isDeliveryDispatched ? "Dispatched (Awaiting dealer confirmation)" : "Pending Delivery");

    return `
      <div id="printable-receipt-area" class="print-receipt-sheet" style="border: 2px solid #1e293b; padding: 1.5rem; border-radius: 6px; background: #ffffff; color: #111827; width: 100%; box-sizing: border-box;">
        <!-- Header -->
        <div class="print-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #15803d; padding-bottom: 0.85rem; margin-bottom: 1.25rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span style="font-size: 1.6rem; line-height: 1;">🌾</span>
              <h2 class="print-brand-title" style="color: #15803d; font-size: 1.35rem; font-weight: 800; margin: 0;">FarmLink – Transaction Receipt</h2>
            </div>
            <div class="print-sub" style="font-size: 0.8rem; color: #4b5563;">Official Mandi Agricultural Trade & Settlement Note</div>
          </div>
          <div style="text-align: right;">
            <div class="print-sub" style="font-size: 0.8rem; color: #4b5563;">Contract Date</div>
            <div style="font-weight: 700; font-size: 1.05rem; color: #111827;">${escape(contractDateDisplay)}</div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.15rem;">Transaction ID: <strong style="color: #111827;">${escape(txIdDisplay)}</strong></div>
            <div style="font-size: 0.75rem; color: #6b7280;">Offer Ref: ${escape(offerIdDisplay)}</div>
          </div>
        </div>

        <!-- Bilateral Counterparties Grid -->
        <div class="print-parties-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.25rem; border: 1px solid #e5e7eb; padding: 0.85rem; border-radius: 4px; background-color: #f9fafb;">
          <div>
            <div style="font-size: 0.72rem; font-weight: 700; color: #15803d; letter-spacing: 0.05em; text-transform: uppercase;">SELLER / PRODUCER (FARMER)</div>
            <div style="font-weight: 800; font-size: 1.05rem; color: #111827; margin: 0.15rem 0;">${escape(farmerName)}</div>
            <div style="font-size: 0.8rem; color: #4b5563;">📞 Phone: ${escape(farmerPhone)}</div>
            <div style="font-size: 0.8rem; color: #4b5563;">📍 Location: ${escape(farmerLocation)}</div>
            <div style="font-size: 0.72rem; color: #6b7280; margin-top: 0.25rem;">Jurisdiction: AP State Agricultural Marketing Board</div>
          </div>
          <div>
            <div style="font-size: 0.72rem; font-weight: 700; color: #2563eb; letter-spacing: 0.05em; text-transform: uppercase;">BUYER / WHOLESALER (DEALER)</div>
            <div style="font-weight: 800; font-size: 1.05rem; color: #111827; margin: 0.15rem 0;">${escape(dealerName)}</div>
            <div style="font-size: 0.8rem; color: #4b5563;">📞 Phone: ${escape(dealerPhone)}</div>
            <div style="font-size: 0.8rem; color: #4b5563;">📍 Location: ${escape(dealerLocation)}</div>
            <div style="font-size: 0.72rem; color: #6b7280; margin-top: 0.25rem;">Procurement: Authorized Wholesale Mandi Buyer</div>
          </div>
        </div>

        <!-- Commodity & Pricing Table -->
        <table class="print-table" style="width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; font-size: 0.95rem;">
          <thead>
            <tr style="background-color: #f3f4f6; border: 1px solid #d1d5db;">
              <th style="padding: 0.65rem 0.75rem; text-align: left; font-weight: 700; border: 1px solid #d1d5db; color: #111827;">Crop / Produce</th>
              <th style="padding: 0.65rem 0.75rem; text-align: center; font-weight: 700; border: 1px solid #d1d5db; color: #111827;">Quality Grade</th>
              <th style="padding: 0.65rem 0.75rem; text-align: right; font-weight: 700; border: 1px solid #d1d5db; color: #111827;">Quantity</th>
              <th style="padding: 0.65rem 0.75rem; text-align: right; font-weight: 700; border: 1px solid #d1d5db; color: #111827;">Agreed Price / Unit</th>
              <th style="padding: 0.65rem 0.75rem; text-align: right; font-weight: 700; border: 1px solid #d1d5db; color: #111827;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border: 1px solid #d1d5db;">
              <td style="padding: 0.75rem; border: 1px solid #d1d5db;">
                <strong style="color: #111827;">${escape(cropName)}</strong>
                <div style="font-size: 0.75rem; color: #6b7280;">Lot Ref: ${escape(tx.cropId || 'Farm Direct')}</div>
              </td>
              <td style="padding: 0.75rem; text-align: center; border: 1px solid #d1d5db; font-weight: 600; color: #374151;">
                ${escape(cropGrade)}
              </td>
              <td style="padding: 0.75rem; text-align: right; border: 1px solid #d1d5db; font-weight: 600; color: #111827;">
                ${qty.toLocaleString()} ${escape(unit)}
              </td>
              <td style="padding: 0.75rem; text-align: right; border: 1px solid #d1d5db; font-weight: 600; color: #111827;">
                ₹${finalPrice.toLocaleString()} / ${escape(unit)}
              </td>
              <td style="padding: 0.75rem; text-align: right; border: 1px solid #d1d5db; font-weight: 800; color: #15803d; font-size: 1.05rem;">
                ₹${totalAmount.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Highlighted Financial Summary -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background-color: #f0fdf4; border: 1.5px solid #86efac; border-radius: 4px; margin-bottom: 1.25rem;">
          <div>
            <span style="font-size: 0.85rem; font-weight: 600; color: #166534;">Contract Settlement Mode:</span>
            <span style="font-size: 0.85rem; color: #15803d; margin-left: 0.35rem;">Direct APMC Mandi Benchmark • Zero Brokerage Fee</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.85rem; font-weight: 600; color: #166534; margin-right: 0.5rem;">Total Agreed Settlement:</span>
            <strong style="font-size: 1.35rem; color: #15803d;">₹${totalAmount.toLocaleString()}</strong>
          </div>
        </div>

        <!-- Fulfillment & Verification Status Grid -->
        <div class="print-status-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1.25rem; padding: 0.75rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 0.85rem;">
          <div>
            <span style="color: #6b7280; font-size: 0.75rem; display: block;">Contract Status:</span>
            <strong style="color: #111827;">${escape(dealStatus)}</strong>
            <span style="display: inline-block; font-size: 0.7rem; color: #15803d; margin-left: 0.25rem;">(Overall: ${escape(overallStatus)})</span>
          </div>
          <div>
            <span style="color: #6b7280; font-size: 0.75rem; display: block;">Payment Status:</span>
            <strong style="color: ${isPaymentPaid ? '#15803d' : (isPaymentDeclared ? '#2563eb' : '#b45309')};">${escape(paymentStatusDisplay)}</strong>
          </div>
          <div>
            <span style="color: #6b7280; font-size: 0.75rem; display: block;">Delivery Status:</span>
            <strong style="color: ${isDeliveryDelivered ? '#15803d' : '#2563eb'};">${escape(deliveryStatusDisplay)}</strong>
          </div>
        </div>

        <!-- Two-Party Logistics & Delivery Confirmation Record -->
        <div style="margin-bottom: 1.25rem; border: 1px solid #d1d5db; border-radius: 4px; padding: 0.85rem 1rem; background-color: #f9fafb; font-size: 0.85rem;">
          <div style="font-weight: 700; color: #111827; margin-bottom: 0.6rem; font-size: 0.9rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.35rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>🚚</span> Two-Party Logistics &amp; Delivery Confirmation Record
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <!-- Stage A: Farmer Dispatch -->
            <div style="border-left: 3px solid #15803d; padding-left: 0.75rem;">
              <div style="font-size: 0.72rem; font-weight: 700; color: #15803d; letter-spacing: 0.05em; text-transform: uppercase;">STAGE 1: FARMER DISPATCH</div>
              <div style="margin-top: 0.35rem;"><strong>Dispatch Status:</strong> ${deliveryInfo.isDispatched ? '<span style="color: #15803d; font-weight: 700;">✓ Dispatched by Farmer</span>' : '<span style="color: #4b5563;">Pending</span>'}</div>
              <div><strong>Dispatch Date:</strong> ${escape(deliveryInfo.dispatchDate || 'Not recorded')}</div>
              <div><strong>Dispatched Quantity:</strong> ${deliveryInfo.dispatchedQuantity ? `${deliveryInfo.dispatchedQuantity.toLocaleString()} ${escape(unit)}` : 'Not recorded'}</div>
              <div><strong>Transport / Vehicle:</strong> ${escape(deliveryInfo.transportDetails || 'Not recorded')}</div>
              <div><strong>Dispatch Notes:</strong> ${escape(deliveryInfo.dispatchNotes || 'Not recorded')}</div>
            </div>
            <!-- Stage B: Dealer Receipt Confirmation -->
            <div style="border-left: 3px solid #2563eb; padding-left: 0.75rem;">
              <div style="font-size: 0.72rem; font-weight: 700; color: #2563eb; letter-spacing: 0.05em; text-transform: uppercase;">STAGE 2: DEALER RECEIPT CONFIRMATION</div>
              <div style="margin-top: 0.35rem;"><strong>Receipt Status:</strong> ${deliveryInfo.isDelivered ? '<span style="color: #15803d; font-weight: 700;">✓ Confirmed by Wholesale Buyer</span>' : '<span style="color: #b45309;">Awaiting Dealer Confirmation</span>'}</div>
              <div><strong>Confirmation Date:</strong> ${escape(deliveryInfo.deliveryConfirmedAt ? deliveryInfo.deliveryConfirmedAt.split('T')[0] : 'Not recorded')}</div>
              <div><strong>Received Quantity:</strong> ${deliveryInfo.receivedQuantity ? `${deliveryInfo.receivedQuantity.toLocaleString()} ${escape(unit)}` : 'Not recorded'}</div>
              <div><strong>Delivery Notes:</strong> ${escape(deliveryInfo.deliveryNotes || 'Not recorded')}</div>
            </div>
          </div>
        </div>

        <!-- Bilateral Signatures Area -->
        <div class="print-signatures" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px dashed #9ca3af;">
          <div class="print-signature-box" style="text-align: center;">
            <div class="print-signature-line" style="border-bottom: 1px solid #111827; height: 35px; margin-bottom: 0.4rem;"></div>
            <div style="font-size: 0.78rem; font-weight: 600; color: #374151;">Wholesale Dealer / Buyer Signature & Seal</div>
            <div style="font-size: 0.72rem; color: #6b7280;">(${escape(dealerName)})</div>
          </div>
          <div class="print-signature-box" style="text-align: center;">
            <div class="print-signature-line" style="border-bottom: 1px solid #111827; height: 35px; margin-bottom: 0.4rem;"></div>
            <div style="font-size: 0.78rem; font-weight: 600; color: #374151;">Farmer / Producer Signature / Thumbprint</div>
            <div style="font-size: 0.72rem; color: #6b7280;">(${escape(farmerName)})</div>
          </div>
        </div>

        <!-- Compliance & Regulatory Footer -->
        <div class="print-footer-notice" style="font-size: 0.75rem; color: #6b7280; text-align: center; margin-top: 1.25rem; border-top: 1px solid #e5e7eb; padding-top: 0.5rem;">
          ✓ Official FarmLink Direct Trade Receipt. Certified electronic transaction note executed under APMC Direct Procurement Norms.
        </div>
      </div>
    `;
  }

  // --- Notifications (Phase 3D Firestore Synchronization) ---
  _dispatchNotificationsUpdated() {
    if (this._isDispatchingNotifs) return;
    this._isDispatchingNotifs = true;
    try {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        try {
          const evt = typeof CustomEvent === 'function'
            ? new CustomEvent("farmlink:notifications-updated")
            : { type: "farmlink:notifications-updated" };
          window.dispatchEvent(evt);
        } catch (e) {}
      }
      if (this._notificationCallbacks && this._notificationCallbacks.size > 0) {
        const notifs = this.getNotifications();
        this._notificationCallbacks.forEach(cb => {
          try { cb(notifs); } catch (cbErr) { console.warn("[FarmLink Storage] Notification callback error:", cbErr); }
        });
      }
    } finally {
      this._isDispatchingNotifs = false;
    }
  }

  _areNotificationsEqual(aList, bList) {
    if (!Array.isArray(aList) || !Array.isArray(bList)) return false;
    if (aList.length !== bList.length) return false;
    for (let i = 0; i < aList.length; i++) {
      const a = aList[i];
      const b = bList[i];
      if (!a || !b) return false;
      const aId = a.id || a.notificationId;
      const bId = b.id || b.notificationId;
      if (aId !== bId) return false;
      const aRead = Boolean(a.isRead || a.read);
      const bRead = Boolean(b.isRead || b.read);
      if (aRead !== bRead) return false;
      if ((a.updatedAt || a.timestamp) !== (b.updatedAt || b.timestamp)) return false;
    }
    return true;
  }

  _normalizeNotificationDoc(id, data) {
    if (!data) return null;
    const recipient = data.recipientUserId || data.userId || "";
    const isReadVal = !!(data.isRead !== undefined ? data.isRead : data.read);
    const nowIso = new Date().toISOString();
    return {
      ...data,
      id: id,
      notificationId: data.notificationId || id,
      recipientUserId: recipient,
      userId: recipient,
      senderUserId: data.senderUserId || "",
      role: data.role || "farmer",
      type: data.type || "general",
      title: data.title || "Notification",
      titleTe: data.titleTe || data.title || "నోటిఫికేషన్",
      message: data.message || "",
      messageTe: data.messageTe || data.message || "",
      relatedId: data.relatedId || null,
      messageId: data.messageId || (id.startsWith('notif_msg_') ? id.substring(10) : null),
      link: data.link || "",
      timestamp: data.timestamp || data.createdAt || nowIso,
      createdAt: data.createdAt || data.timestamp || nowIso,
      updatedAt: data.updatedAt || data.createdAt || nowIso,
      isRead: isReadVal,
      read: isReadVal,
      isDemo: false,
      userCreated: true,
      _cloudSynced: true,
      _syncPending: false,
      _deliveryStatus: 'delivered'
    };
  }

  _reconcileNotificationsWithLocal(cloudNotifs) {
    const localNotifs = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const mergedMap = new Map();

    // 1. Preserve local demo notifications (never delete or overwrite them)
    localNotifs.forEach(n => {
      if (this.isDemoNotification(n)) {
        mergedMap.set(n.id, n);
      }
    });

    // 2. Authoritative cloud notifications
    cloudNotifs.forEach(cloudNotif => {
      if (cloudNotif && cloudNotif.id) {
        const existingLocal = localNotifs.find(n => n.id === cloudNotif.id || n.notificationId === cloudNotif.id);
        const merged = { ...cloudNotif };
        if (existingLocal) {
          // Stale snapshot protection:
          // If local was marked read, check updatedAt to avoid reverting read state
          if (existingLocal.isRead || existingLocal.read) {
            const localUpdated = new Date(existingLocal.updatedAt || existingLocal.timestamp || 0).getTime();
            const cloudUpdated = new Date(cloudNotif.updatedAt || cloudNotif.timestamp || 0).getTime();
            if (localUpdated >= cloudUpdated) {
              merged.isRead = true;
              merged.read = true;
              merged.updatedAt = existingLocal.updatedAt || cloudNotif.updatedAt;
            }
          }
        }
        mergedMap.set(cloudNotif.id, merged);
      }
    });

    // 3. Keep any in-flight local non-demo notifications not yet received in cloud snapshot
    localNotifs.forEach(n => {
      if (!this.isDemoNotification(n) && !mergedMap.has(n.id) && !mergedMap.has(n.notificationId)) {
        mergedMap.set(n.id || n.notificationId, n);
      }
    });

    const mergedNotifs = Array.from(mergedMap.values());
    mergedNotifs.sort((a, b) => new Date(b.createdAt || b.timestamp || 0) - new Date(a.createdAt || a.timestamp || 0));

    // Check whether notifications actually changed to prevent duplicate re-render loops
    const hasChanged = !this._areNotificationsEqual(localNotifs, mergedNotifs);
    if (hasChanged) {
      this.set(STORAGE_KEYS.NOTIFICATIONS, mergedNotifs);
    }
    return hasChanged;
  }

  hasActiveNotificationsSync() {
    return Boolean(this._activeNotificationsUnsubscribe);
  }

  async syncNotificationsFromFirestore(role = null) {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return this.getNotifications(null, role);

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(2500);
    }
    if (!fbUser) return this.getNotifications(null, role);

    const uid = fbUser.uid;
    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    if (currentUser && currentUser.isDemo) return this.getNotifications(currentUser.id, role);

    try {
      const snap = await fb.db.collection("notifications").where("recipientUserId", "==", uid).get();
      const cloudNotifs = [];
      snap.forEach(doc => {
        const norm = this._normalizeNotificationDoc(doc.id, doc.data());
        if (norm) cloudNotifs.push(norm);
      });
      const hasChanged = this._reconcileNotificationsWithLocal(cloudNotifs);
      if (hasChanged) {
        this._dispatchNotificationsUpdated();
      }
      return this.getNotifications(uid, role);
    } catch (err) {
      console.warn("[FarmLink Storage] Notifications sync note:", err);
      return this.getNotifications(uid, role);
    }
  }

  clearNotificationsSync() {
    if (typeof this._activeNotificationsUnsubscribe === 'function') {
      try {
        this._activeNotificationsUnsubscribe();
      } catch (e) {}
      this._activeNotificationsUnsubscribe = null;
    }
    this._activeNotificationsUid = null;
    if (this._notificationCallbacks) {
      this._notificationCallbacks.clear();
    }
    this._pendingAuthForNotifications = false;
  }

  clearAllDashboardSync() {
    this.clearCropsSync();
    this.clearOffersSync();
    this.clearTransactionsSync();
    this.clearNotificationsSync();
    if (typeof this.clearConversationsSync === 'function') {
      this.clearConversationsSync();
    }
  }

  initNotificationsSync(callback, role = null) {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return () => {};

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    if (currentUser && currentUser.isDemo) return () => {};

    if (!this._notificationCallbacks) {
      this._notificationCallbacks = new Set();
    }
    if (typeof callback === 'function') {
      this._notificationCallbacks.add(callback);
    }

    const startListener = (uid) => {
      // If a listener is already active for this exact UID, do not create a duplicate
      if (this._activeNotificationsUid === uid && typeof this._activeNotificationsUnsubscribe === 'function') {
        if (typeof callback === 'function') {
          try { callback(this.getNotifications(uid, role)); } catch (e) {}
        }
        return () => {
          if (this._notificationCallbacks) this._notificationCallbacks.delete(callback);
        };
      }

      // If switching user, unsubscribe the old listener first
      if (typeof this._activeNotificationsUnsubscribe === 'function') {
        try { this._activeNotificationsUnsubscribe(); } catch (e) {}
        this._activeNotificationsUnsubscribe = null;
      }
      this._activeNotificationsUid = uid;

      try {
        const unsubscribe = fb.db.collection("notifications")
          .where("recipientUserId", "==", uid)
          .onSnapshot(
            (snapshot) => {
              const cloudNotifs = [];
              snapshot.forEach(doc => {
                const norm = this._normalizeNotificationDoc(doc.id, doc.data());
                if (norm) cloudNotifs.push(norm);
              });
              const hasChanged = this._reconcileNotificationsWithLocal(cloudNotifs);
              if (hasChanged) {
                this._dispatchNotificationsUpdated();
              }
              if (this._notificationCallbacks && this._notificationCallbacks.size > 0) {
                this._notificationCallbacks.forEach(cb => {
                  try { cb(cloudNotifs); } catch (cbErr) { console.warn("[FarmLink Storage] Notification callback error:", cbErr); }
                });
              }
            },
            (err) => {
              console.warn("[FarmLink Storage] Notifications realtime listener note:", err);
            }
          );
        this._activeNotificationsUnsubscribe = unsubscribe;
        return () => {
          if (this._notificationCallbacks) this._notificationCallbacks.delete(callback);
        };
      } catch (err) {
        console.warn("[FarmLink Storage] Failed to attach notifications listener:", err);
        return () => {};
      }
    };

    if (fb.auth && fb.auth.currentUser) {
      return startListener(fb.auth.currentUser.uid);
    } else if (typeof this.waitForFirebaseAuth === 'function') {
      if (!this._pendingAuthForNotifications) {
        this._pendingAuthForNotifications = true;
        this.waitForFirebaseAuth(2500).then(u => {
          this._pendingAuthForNotifications = false;
          if (u && (!currentUser || !currentUser.isDemo)) {
            startListener(u.uid);
          }
        }).catch(() => {
          this._pendingAuthForNotifications = false;
        });
      }
      return () => {
        if (this._notificationCallbacks) this._notificationCallbacks.delete(callback);
      };
    }
    return () => {};
  }

  getNotifications(userId = null, role = null) {
    const notifs = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    return notifs.filter(n => {
      const recipient = n.recipientUserId || n.userId;
      if (userId && recipient && recipient !== userId) return false;
      if (role && n.role && n.role !== role) return false;
      return true;
    });
  }

  addNotification(notif) {
    const notifs = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const nowIso = new Date().toISOString();
    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;

    const fb = this.getFirebaseBridge();
    const fbUser = fb && fb.auth ? fb.auth.currentUser : null;
    const recipient = notif.recipientUserId || notif.userId || null;
    const sender = notif.senderUserId || (currentUser && currentUser.uid ? currentUser.uid : (fbUser ? fbUser.uid : (currentUser ? currentUser.id : "system")));
    const isReadVal = notif.isRead !== undefined ? notif.isRead : (notif.read !== undefined ? notif.read : false);

    // Deterministic ID generation
    let notifId = notif.id || notif.notificationId;
    if (!notifId) {
      if (notif.relatedId && notif.type && recipient) {
        notifId = `notif_${notif.type}_${notif.relatedId}_${recipient}`;
      } else {
        notifId = `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      }
    }

    const isDemoNotif = notif.isDemo === true || (currentUser && currentUser.isDemo);

    const isCloudSynced = Boolean(notif._cloudSynced || isDemoNotif);
    let targetNotif = {
      id: notifId,
      notificationId: notifId,
      messageId: notif.messageId || (notifId.startsWith('notif_msg_') ? notifId.substring(10) : null),
      recipientUserId: recipient,
      userId: recipient,
      senderUserId: sender,
      role: notif.role || notif.targetRole || null,
      type: notif.type || "general",
      title: notif.title || "Notification",
      titleTe: notif.titleTe || notif.title || "నోటిఫికేషన్",
      message: notif.message || "",
      messageTe: notif.messageTe || notif.message || "",
      relatedId: notif.relatedId || null,
      link: notif.link || "",
      timestamp: notif.timestamp || notif.createdAt || nowIso,
      createdAt: notif.createdAt || notif.timestamp || nowIso,
      updatedAt: notif.updatedAt || nowIso,
      isRead: isReadVal,
      read: isReadVal,
      isDemo: isDemoNotif,
      userCreated: true,
      _cloudSynced: isCloudSynced,
      _syncPending: !isCloudSynced && !isDemoNotif,
      _deliveryStatus: isDemoNotif ? 'delivered' : (isCloudSynced ? 'delivered' : 'pending'),
      ...notif
    };

    // Replace if existing with same deterministic ID, or unshift
    const existingIdx = notifs.findIndex(n => n.id === notifId || n.notificationId === notifId);
    if (existingIdx !== -1) {
      const existing = notifs[existingIdx];
      // IDEMPOTENCY & READ-STATE PROTECTION:
      // A repeated notification attempt must NOT reset isRead or read from true to false,
      // and must NOT change the original creation timestamp.
      const preservedIsRead = Boolean(existing.isRead || existing.read);
      const preservedCreatedAt = existing.createdAt || existing.timestamp || targetNotif.createdAt;

      targetNotif = {
        ...existing,
        ...targetNotif,
        isRead: preservedIsRead,
        read: preservedIsRead,
        createdAt: preservedCreatedAt,
        timestamp: preservedCreatedAt
      };
      notifs[existingIdx] = targetNotif;
      this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
      this._dispatchNotificationsUpdated();

      // If already confirmed delivered to Cloud Firestore, skip write to prevent redundant network traffic
      if (existing._cloudSynced === true) {
        return notifs[existingIdx];
      }
    } else {
      notifs.unshift(targetNotif);
      this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
      this._dispatchNotificationsUpdated();
    }

    // Write to Firestore if real Firebase user and not demo
    const isReal = (!isDemoNotif) && (this.isRealFirebaseUser(currentUser) || (fbUser && (!currentUser || !currentUser.isDemo)));
    if (isReal) {
      const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
      if (isFbAvailable) {
        // Prevent concurrent duplicate retry attempts for the same notifId
        if (!this._inFlightNotificationWrites) {
          this._inFlightNotificationWrites = new Set();
        }
        if (this._inFlightNotificationWrites.has(notifId)) {
          return targetNotif;
        }

        const cloudDoc = {
          id: notifId,
          notificationId: notifId,
          recipientUserId: recipient,
          userId: recipient,
          senderUserId: sender,
          role: targetNotif.role || "farmer",
          type: targetNotif.type || "general",
          title: targetNotif.title || "Notification",
          message: targetNotif.message || "",
          isRead: Boolean(targetNotif.isRead || targetNotif.read),
          read: Boolean(targetNotif.isRead || targetNotif.read),
          isDemo: false,
          userCreated: true,
          createdAt: targetNotif.createdAt || nowIso,
          updatedAt: targetNotif.updatedAt || nowIso
        };

        if (targetNotif.messageId || (notifId && notifId.startsWith('notif_msg_'))) {
          cloudDoc.messageId = targetNotif.messageId || notifId.substring(10);
        }
        if (targetNotif.relatedId) cloudDoc.relatedId = targetNotif.relatedId;
        if (targetNotif.link) cloudDoc.link = targetNotif.link;
        if (targetNotif.timestamp) cloudDoc.timestamp = targetNotif.timestamp;
        if (targetNotif.titleTe) cloudDoc.titleTe = targetNotif.titleTe;
        if (targetNotif.messageTe) cloudDoc.messageTe = targetNotif.messageTe;

        const sanitizedCloudNotif = this.validateAndSanitizeFirestoreDoc(
          "notifications",
          cloudDoc,
          ["id", "recipientUserId", "type", "title", "message", "isRead", "createdAt"]
        );

        this._inFlightNotificationWrites.add(notifId);

        const promise = (async () => {
          try {
            const notifRef = fb.db.collection("notifications").doc(notifId);

            // Step 1: Check whether notification document already exists in Firestore before creating
            let remoteExists = false;
            let remoteDocData = null;
            try {
              const snap = await notifRef.get();
              if (snap && snap.exists) {
                remoteExists = true;
                remoteDocData = snap.data();
              }
            } catch (readErr) {
              // If read fails (e.g. document does not exist yet), treat as non-existent
              remoteExists = false;
            }

            if (remoteExists) {
              // Document already exists in Firestore: NEVER overwrite or reset its read status!
              const cached = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
              const idx = cached.findIndex(n => n.id === notifId || n.notificationId === notifId);
              const remoteRead = Boolean(remoteDocData && (remoteDocData.isRead || remoteDocData.read));
              if (idx !== -1) {
                cached[idx]._cloudSynced = true;
                cached[idx]._syncPending = false;
                cached[idx]._deliveryStatus = 'delivered';
                cached[idx]._lastError = null;
                if (remoteRead) {
                  cached[idx].isRead = true;
                  cached[idx].read = true;
                }
                this.set(STORAGE_KEYS.NOTIFICATIONS, cached);
                this._dispatchNotificationsUpdated();
              }
              targetNotif._cloudSynced = true;
              targetNotif._syncPending = false;
              targetNotif._deliveryStatus = 'delivered';
              if (remoteRead) {
                targetNotif.isRead = true;
                targetNotif.read = true;
              }
              return targetNotif;
            }

            // Step 2: Write to Firestore if not yet present
            await notifRef.set(sanitizedCloudNotif);

            // Step 3: Mark confirmed delivered in local cache
            const cached = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
            const idx = cached.findIndex(n => n.id === notifId || n.notificationId === notifId);
            if (idx !== -1) {
              cached[idx]._cloudSynced = true;
              cached[idx]._syncPending = false;
              cached[idx]._deliveryStatus = 'delivered';
              cached[idx]._lastError = null;
              this.set(STORAGE_KEYS.NOTIFICATIONS, cached);
              this._dispatchNotificationsUpdated();
            }
            targetNotif._cloudSynced = true;
            targetNotif._syncPending = false;
            targetNotif._deliveryStatus = 'delivered';
            return targetNotif;
          } catch (err) {
            console.warn("[FarmLink Storage] Failed to write notification to Firestore:", err);
            // Step 4: Make failure observable in local cache and returned payload
            const cached = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
            const idx = cached.findIndex(n => n.id === notifId || n.notificationId === notifId);
            if (idx !== -1) {
              cached[idx]._cloudSynced = false;
              cached[idx]._syncPending = true;
              cached[idx]._deliveryStatus = 'failed';
              cached[idx]._retryCount = (cached[idx]._retryCount || 0) + 1;
              cached[idx]._lastError = err.message || String(err);
              cached[idx]._lastFailedAt = new Date().toISOString();
              this.set(STORAGE_KEYS.NOTIFICATIONS, cached);
              this._dispatchNotificationsUpdated();
            }
            targetNotif._cloudSynced = false;
            targetNotif._syncPending = true;
            targetNotif._deliveryStatus = 'failed';
            targetNotif._syncError = err.message || String(err);
            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
              try {
                window.dispatchEvent(new CustomEvent('farmlink:notification-delivery-failed', {
                  detail: { notifId, error: err.message || String(err) }
                }));
              } catch (e) {}
            }
            return targetNotif;
          } finally {
            this._inFlightNotificationWrites.delete(notifId);
          }
        })();

        Object.assign(promise, targetNotif);
        return promise;
      }
    }

    return targetNotif;
  }

  async retryPendingNotifications() {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return [];

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(1500);
    }

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    if (currentUser && currentUser.isDemo) return [];

    // Strictly ensure only notifications created by the currently authenticated sender are retried
    const authenticatedSenderUid = (currentUser && (currentUser.uid || currentUser.id)) || (fbUser && fbUser.uid);
    if (!authenticatedSenderUid) return [];

    const notifs = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const pending = notifs.filter(n => 
      !n.isDemo && 
      n._cloudSynced !== true && 
      n._syncPending === true && 
      n.senderUserId === authenticatedSenderUid
    );
    if (pending.length === 0) return [];

    const results = [];
    for (const p of pending) {
      try {
        const res = await this.addNotification(p);
        results.push(res);
      } catch (e) {
        console.warn("[FarmLink Storage] Retry pending notification note:", e);
      }
    }
    return results;
  }

  markNotificationAsRead(id) {
    const notifs = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const idx = notifs.findIndex(n => n.id === id || n.notificationId === id);
    const nowIso = new Date().toISOString();
    if (idx !== -1) {
      notifs[idx].isRead = true;
      notifs[idx].read = true;
      notifs[idx].updatedAt = nowIso;
      this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
      this._dispatchNotificationsUpdated();

      const notif = notifs[idx];
      const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
        ? window.Auth.getCurrentUser() 
        : null;
      const fb = this.getFirebaseBridge();
      const fbUser = fb && fb.auth ? fb.auth.currentUser : null;
      const isReal = (!notif.isDemo) && (this.isRealFirebaseUser(currentUser) || (fbUser && (!currentUser || !currentUser.isDemo)));

      if (isReal) {
        const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
        if (isFbAvailable) {
          fb.db.collection("notifications").doc(notif.id).update({
            isRead: true,
            read: true,
            updatedAt: nowIso
          }).catch(err => {
            console.warn("[FarmLink Storage] Failed to update notification read status in Firestore:", err);
          });
        }
      }

      return notifs[idx];
    }
    return null;
  }

  markAllNotificationsAsRead(userId = null, role = null) {
    const notifs = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const nowIso = new Date().toISOString();
    const updatedIds = [];

    notifs.forEach(n => {
      const recipient = n.recipientUserId || n.userId;
      const notifRole = n.role || n.targetRole;
      if ((!userId || recipient === userId) && (!role || !notifRole || notifRole === role)) {
        if (!n.isRead || !n.read) {
          n.isRead = true;
          n.read = true;
          n.updatedAt = nowIso;
          if (!n.isDemo) updatedIds.push(n.id);
        }
      }
    });

    this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
    this._dispatchNotificationsUpdated();

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    const fb = this.getFirebaseBridge();
    const fbUser = fb && fb.auth ? fb.auth.currentUser : null;
    const isReal = (this.isRealFirebaseUser(currentUser) || (fbUser && (!currentUser || !currentUser.isDemo)));

    if (updatedIds.length > 0 && isReal) {
      const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
      if (isFbAvailable && typeof fb.db.batch === 'function') {
        const batch = fb.db.batch();
        updatedIds.forEach(id => {
          const docRef = fb.db.collection("notifications").doc(id);
          batch.update(docRef, {
            isRead: true,
            read: true,
            updatedAt: nowIso
          });
        });
        batch.commit().catch(err => {
          console.warn("[FarmLink Storage] Failed to batch-mark notifications as read in Firestore:", err);
        });
      }
    }
  }

  getUnreadNotificationCount(userId = null, role = null) {
    return this.getNotifications(userId, role).filter(n => !(n.isRead || n.read)).length;
  }

  deleteNotification(id) {
    const notifs = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const updated = notifs.filter(n => n.id !== id && n.notificationId !== id);
    this.set(STORAGE_KEYS.NOTIFICATIONS, updated);
    this._dispatchNotificationsUpdated();
    return true;
  }

  clearAllNotifications(userId = null, role = null) {
    const notifs = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const remaining = notifs.filter(n => {
      const recipient = n.recipientUserId || n.userId;
      if (userId && recipient === userId) return false;
      if (role && n.role === role) return false;
      if (!userId && !role) return false;
      return true;
    });
    this.set(STORAGE_KEYS.NOTIFICATIONS, remaining);
    this._dispatchNotificationsUpdated();
    return true;
  }

  // Activities (Recent Activity Feed)
  getActivities(role = null, currentUser = null) {
    const user = currentUser || (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === 'function' ? window.Auth.getCurrentUser() : null);
    const isDemo = this.isDemoUser(user);

    if (isDemo || !user) {
      const list = this.get(STORAGE_KEYS.ACTIVITIES) || [];
      if (!role) return list;
      return list.filter(a => a.targetRole === role || !a.targetRole);
    }

    const uid = user.uid || user.id;
    const targetRole = role || user.role || 'farmer';
    const activities = [];
    const seenKeys = new Set();

    const getRelativeTime = (isoString) => {
      if (typeof window !== 'undefined' && window.App && typeof window.App.formatRelativeTime === 'function') {
        return window.App.formatRelativeTime(isoString);
      }
      if (!isoString) return "Recently";
      try {
        const diff = Date.now() - new Date(isoString).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
      } catch (e) {
        return "Recently";
      }
    };

    // 1. Derive from authenticated user's synchronized notifications
    const notifs = this.getNotifications(uid, targetRole) || [];
    notifs.forEach(n => {
      let icon = "⚡";
      switch (n.type) {
        case "offer": icon = "🏷️"; break;
        case "counter": icon = "🔄"; break;
        case "deal": icon = "🎉"; break;
        case "transaction": icon = "💰"; break;
        case "message": icon = "💬"; break;
        case "rejected": icon = "❌"; break;
        case "cancelled": icon = "⚠️"; break;
        default: icon = "🔔"; break;
      }

      const dedupeKey = `notif_${n.id || (n.type + '_' + (n.relatedId || n.messageId || ''))}`;
      if (!seenKeys.has(dedupeKey)) {
        seenKeys.add(dedupeKey);
        if (n.relatedId) seenKeys.add(`rel_${n.relatedId}`);

        const isoDate = n.createdAt || n.timestamp || new Date().toISOString();
        const relTime = getRelativeTime(isoDate);

        activities.push({
          id: "act_" + (n.id || dedupeKey),
          targetRole: targetRole,
          type: n.type || "notification",
          icon: icon,
          title: n.title || "Notification",
          titleTe: n.titleTe || n.title || "నోటిఫికేషన్",
          desc: n.message || "",
          descTe: n.messageTe || n.message || "",
          time: relTime,
          timeTe: relTime,
          date: isoDate
        });
      }
    });

    // 2. Derive from user's completed transactions (if not already covered by a deal/transaction notification)
    const txs = this.getTransactions() || [];
    const userTxs = txs.filter(t => {
      if (this.isDemoTransaction(t)) return false;
      if (t.status !== "Completed") return false;
      return (targetRole === "farmer" && (t.farmerId === uid || t.farmerUid === uid)) ||
             (targetRole === "dealer" && (t.dealerId === uid || t.dealerUid === uid));
    });

    userTxs.forEach(t => {
      const txKey = t.id || t.transactionId || `tx_${t.offerId}`;
      if (!seenKeys.has(txKey) && !seenKeys.has(`rel_${txKey}`) && !seenKeys.has(`rel_${t.offerId}`)) {
        seenKeys.add(txKey);
        const isoDate = t.createdAt || t.date || new Date().toISOString();
        const relTime = getRelativeTime(isoDate);

        const cropName = t.cropTitle || t.cropName || "Crop";
        const totalFmt = Number(t.totalAmount || 0).toLocaleString();
        const otherParty = (targetRole === "farmer") ? (t.dealerName || "Dealer") : (t.farmerName || "Farmer");

        const titleEn = (targetRole === "farmer") ? "Sale Completed" : "Procurement Completed";
        const titleTe = (targetRole === "farmer") ? "అమ్మకం పూర్తయింది" : "సేకరణ పూర్తయింది";
        const descEn = (targetRole === "farmer") 
          ? `Deal of ₹${totalFmt} with ${otherParty} completed for ${cropName}.`
          : `Contract of ₹${totalFmt} with ${otherParty} completed for ${cropName}.`;
        const descTe = (targetRole === "farmer")
          ? `${cropName} కోసం ${otherParty}తో ₹${totalFmt} ఒప్పందం పూర్తయింది.`
          : `${cropName} కోసం ${otherParty}తో ₹${totalFmt} కాంట్రాక్ట్ పూర్తయింది.`;

        activities.push({
          id: "act_" + txKey,
          targetRole: targetRole,
          type: "transaction",
          icon: "💰",
          title: titleEn,
          titleTe: titleTe,
          desc: descEn,
          descTe: descTe,
          time: relTime,
          timeTe: relTime,
          date: isoDate
        });
      }
    });

    // 3. For Farmer: Listed crops
    if (targetRole === "farmer") {
      const crops = this.getCrops() || [];
      const userCrops = crops.filter(c => !this.isDemoCrop(c) && (c.farmerId === uid || c.farmerUid === uid) && String(c.status || "").toLowerCase() !== "removed");
      userCrops.forEach(c => {
        const cropKey = `crop_${c.id || c.cropId}`;
        if (!seenKeys.has(cropKey)) {
          seenKeys.add(cropKey);
          const isoDate = c.createdAt || new Date().toISOString();
          const relTime = getRelativeTime(isoDate);

          const cName = c.title || c.cropName || "Produce";
          const qty = `${Number(c.quantity || 0).toLocaleString()} ${c.unit || 'kg'}`;
          const price = `₹${c.expectedPrice || c.price || 0}`;

          activities.push({
            id: "act_" + cropKey,
            targetRole: "farmer",
            type: "crop",
            icon: "🌱",
            title: "Crop Listed",
            titleTe: "పంట చేర్చబడింది",
            desc: `Listed ${cName} (${qty}) at ${price}/${c.unit || 'kg'}.`,
            descTe: `${cName} (${qty}) ${price}/${c.unit || 'kg'} వద్ద చేర్చబడింది.`,
            time: relTime,
            timeTe: relTime,
            date: isoDate
          });
        }
      });
    }

    // Sort newest first
    activities.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    return activities;
  }
  addActivity(activity) {
    const list = this.get(STORAGE_KEYS.ACTIVITIES);
    const newAct = {
      id: "act_" + Date.now(),
      date: new Date().toISOString(),
      time: "Just now",
      timeTe: "ఇప్పుడే",
      ...activity
    };
    list.unshift(newAct);
    this.set(STORAGE_KEYS.ACTIVITIES, list);
    return newAct;
  }

  // Saved Crops for Dealer
  getSavedCropIds() {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_CROPS);
    return data ? JSON.parse(data) : [];
  }
  isCropSaved(cropId) {
    const saved = this.getSavedCropIds();
    return saved.includes(cropId);
  }
  toggleSaveCrop(cropId) {
    let saved = this.getSavedCropIds();
    let isSavedNow = false;
    if (saved.includes(cropId)) {
      saved = saved.filter(id => id !== cropId);
      isSavedNow = false;
    } else {
      saved.push(cropId);
      isSavedNow = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_CROPS, JSON.stringify(saved));
    return isSavedNow;
  }
  getSavedCrops() {
    const savedIds = this.getSavedCropIds();
    const allCrops = this.getCrops();
    return allCrops.filter(c => savedIds.includes(c.id));
  }

  // Calculations (Farmer Profit Calculator)
  getCalculations(farmerId = null) {
    const list = this.get(STORAGE_KEYS.CALCULATIONS);
    if (!farmerId) return list;
    return list.filter(c => c.farmerId === farmerId);
  }
  getCalculationById(id) {
    return this.get(STORAGE_KEYS.CALCULATIONS).find(c => c.id === id);
  }
  addCalculation(calc) {
    const list = this.get(STORAGE_KEYS.CALCULATIONS);
    const newCalc = {
      id: calc.id || ("calc_" + Date.now()),
      createdAt: calc.createdAt || new Date().toISOString(),
      userCreated: true,
      ...calc
    };
    list.unshift(newCalc);
    this.set(STORAGE_KEYS.CALCULATIONS, list);
    return newCalc;
  }
  deleteCalculation(id) {
    let list = this.get(STORAGE_KEYS.CALCULATIONS);
    const initialLen = list.length;
    list = list.filter(c => c.id !== id);
    this.set(STORAGE_KEYS.CALCULATIONS, list);
    return list.length < initialLen;
  }

  // Reviews & Ratings (Phase 3F: Firestore Verified Reviews)
  getReviews(receiverId = null) {
    const list = this.get(STORAGE_KEYS.REVIEWS) || [];
    if (!receiverId) return list;
    return list.filter(r => r.receiverId === receiverId);
  }

  getReviewByTransactionAndReviewer(txId, reviewerId) {
    const list = this.get(STORAGE_KEYS.REVIEWS) || [];
    return list.find(r => (r.transactionId === txId || r.txId === txId) && r.reviewerId === reviewerId);
  }

  clearReviewsCache() {
    const list = this.get(STORAGE_KEYS.REVIEWS) || [];
    const demoReviews = list.filter(r => r.isDemo === true);
    this.set(STORAGE_KEYS.REVIEWS, demoReviews);
  }

  async syncReviewsFromFirestore(userId = null) {
    const fb = this.getFirebaseBridge();
    const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
    if (!isFbAvailable) return this.getReviews(userId);

    let fbUser = fb.auth ? fb.auth.currentUser : null;
    if (!fbUser && typeof this.waitForFirebaseAuth === 'function') {
      fbUser = await this.waitForFirebaseAuth(3000);
    }
    if (!fbUser) return this.getReviews(userId);

    const uid = userId || fbUser.uid;
    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;
    if (currentUser && currentUser.isDemo) return this.getReviews(userId);

    try {
      // Query reviews received by and submitted by this user
      const [receivedSnap, submittedSnap] = await Promise.all([
        fb.db.collection("reviews").where("receiverId", "==", uid).get(),
        fb.db.collection("reviews").where("reviewerId", "==", uid).get()
      ]);

      const cloudReviewsMap = new Map();
      [receivedSnap, submittedSnap].forEach(snap => {
        if (snap && typeof snap.forEach === 'function') {
          snap.forEach(doc => {
            const data = doc.data();
            if (data) {
              cloudReviewsMap.set(doc.id, { id: doc.id, ...data });
            }
          });
        }
      });

      // Local storage reconciliation: preserve pre-seeded demo reviews
      const localReviews = this.get(STORAGE_KEYS.REVIEWS) || [];
      const demoReviews = localReviews.filter(r => r.isDemo === true);
      const cloudReviews = Array.from(cloudReviewsMap.values());
      const mergedReviews = [...cloudReviews, ...demoReviews];
      this.set(STORAGE_KEYS.REVIEWS, mergedReviews);

      // Reconcile local transactions so UI marks alreadyReviewed accurately across devices
      const localTxs = this.getTransactions() || [];
      let txUpdated = false;
      localTxs.forEach(tx => {
        cloudReviews.forEach(cr => {
          if (cr.transactionId === tx.id || cr.transactionId === tx.transactionId) {
            if (cr.reviewerRole === "farmer" && !tx.farmerRated) {
              tx.farmerRated = true;
              tx.farmerRating = cr.rating;
              tx.farmerReview = cr.feedback;
              txUpdated = true;
            }
            if (cr.reviewerRole === "dealer" && !tx.dealerRated) {
              tx.dealerRated = true;
              tx.dealerRating = cr.rating;
              tx.dealerReview = cr.feedback;
              txUpdated = true;
            }
          }
        });
      });
      if (txUpdated) {
        this.set(STORAGE_KEYS.TRANSACTIONS, localTxs);
      }

      return userId ? this.getReviews(userId) : mergedReviews;
    } catch (err) {
      console.warn("[FarmLink Storage] Reviews sync note:", err);
      return this.getReviews(userId);
    }
  }

  async addReview(reviewData) {
    const txId = reviewData.transactionId || reviewData.txId;
    if (!txId) {
      return { success: false, error: "Transaction ID is required." };
    }

    const reviewerId = reviewData.reviewerId;
    if (!reviewerId) {
      return { success: false, error: "Reviewer ID is required." };
    }

    const deterministicId = `rev_${txId}_${reviewerId}`;

    // Duplicate check in local store
    const existing = this.getReviewByTransactionAndReviewer(txId, reviewerId);
    if (existing) {
      return { success: false, error: "Review already submitted for this transaction", review: existing };
    }

    // Two-party fulfillment validation: payment must be Paid/Settled and delivery Delivered
    const targetTx = this.getTransactionById(txId);
    if (targetTx) {
      const isLegacy = (targetTx.status === "Completed" || targetTx.status === "completed") && !targetTx.paymentStatus && !targetTx.deliveryStatus;
      const isPaid = (targetTx.paymentStatus === "Paid" || targetTx.paymentStatus === "Settled" || targetTx.paymentStatus === "completed" || targetTx.paymentStatus === "paid") &&
        (isLegacy || Boolean(targetTx.farmerPayment && targetTx.farmerPayment.farmerConfirmed));
      const isDelivered = (targetTx.deliveryStatus === "Delivered" || targetTx.deliveryStatus === "completed" || targetTx.deliveryStatus === "delivered") &&
        (isLegacy || Boolean(targetTx.dealerReceipt && targetTx.dealerReceipt.dealerConfirmed));
      if (!isLegacy && (!isPaid || !isDelivered)) {
        return {
          success: false,
          error: "Review is available only after payment settlement and delivery confirmation are fully completed."
        };
      }
    }

    const currentUser = (typeof window !== 'undefined' && window.Auth && typeof window.Auth.getCurrentUser === "function") 
      ? window.Auth.getCurrentUser() 
      : null;

    const fb = this.getFirebaseBridge();
    const fbUser = fb && fb.auth ? fb.auth.currentUser : null;
    const isReal = (currentUser && !currentUser.isDemo && (currentUser.isFirebaseAuth || !!currentUser.uid)) || (fbUser && (!currentUser || !currentUser.isDemo));

    const numericRating = Math.max(1, Math.min(5, Math.round(Number(reviewData.rating) || 5)));
    const cleanFeedback = (reviewData.feedback || reviewData.review || "").trim().slice(0, 500);
    const nowIso = new Date().toISOString();

    const cleanReview = {
      id: deterministicId,
      reviewId: deterministicId,
      transactionId: txId,
      cropTitle: (reviewData.cropTitle || "Agricultural Produce").slice(0, 100),
      reviewerId: reviewerId,
      reviewerName: (reviewData.reviewerName || "User").slice(0, 100),
      reviewerRole: reviewData.reviewerRole,
      receiverId: reviewData.receiverId,
      receiverName: (reviewData.receiverName || "Counterpart").slice(0, 100),
      receiverRole: reviewData.receiverRole,
      rating: numericRating,
      feedback: cleanFeedback,
      createdAt: reviewData.createdAt || nowIso,
      updatedAt: reviewData.updatedAt || nowIso,
      isDemo: isReal ? false : (reviewData.isDemo !== undefined ? !!reviewData.isDemo : true),
      userCreated: true
    };

    if (reviewData.offerId) cleanReview.offerId = reviewData.offerId;
    if (reviewData.cropId) cleanReview.cropId = reviewData.cropId;

    const sanitizedReview = this.validateAndSanitizeFirestoreDoc(
      "reviews",
      cleanReview,
      ["id", "reviewId", "transactionId", "reviewerId", "reviewerRole", "receiverId", "receiverRole", "rating", "feedback", "createdAt", "updatedAt", "isDemo", "userCreated"],
      { rating: { integer: true, min: 1, max: 5 } }
    );

    if (isReal) {
      const isFbAvailable = fb && fb.isConfigured && fb.db && (typeof fb.isAvailable === 'function' ? fb.isAvailable() : fb.isInitialized);
      if (!isFbAvailable) {
        return {
          success: false,
          error: "Cloud connection unavailable. Real reviews must be verified by Firestore."
        };
      }

      try {
        const docRef = fb.db.collection("reviews").doc(deterministicId);
        const existingDoc = await docRef.get();
        if (existingDoc && existingDoc.exists) {
          return {
            success: false,
            error: "Review already submitted for this transaction in Firestore.",
            review: existingDoc.data()
          };
        }

        await docRef.set(sanitizedReview);
      } catch (err) {
        console.error("[FarmLink Storage] Firestore review write failed:", err);
        return {
          success: false,
          error: err.message || "Failed to commit review to Firestore. Please try again."
        };
      }
    }

    // ONLY save locally if Firestore write succeeded (for real accounts) or running in demo mode
    const list = this.get(STORAGE_KEYS.REVIEWS) || [];
    list.unshift(cleanReview);
    this.set(STORAGE_KEYS.REVIEWS, list);

    // Update local transaction flags
    const tx = this.getTransactionById(txId);
    if (tx) {
      if (cleanReview.reviewerRole === "farmer") {
        this.updateTransaction(tx.id, { farmerRated: true, farmerRating: cleanReview.rating, farmerReview: cleanReview.feedback });
      } else if (cleanReview.reviewerRole === "dealer") {
        this.updateTransaction(tx.id, { dealerRated: true, dealerRating: cleanReview.rating, dealerReview: cleanReview.feedback });
      }
    }

    // Update target user profile cached rating & reviewsCount if user exists in local cache
    if (cleanReview.receiverId) {
      const summary = this.getUserRatingSummary(cleanReview.receiverId);
      this.updateUser(cleanReview.receiverId, {
        rating: summary.average,
        reviewsCount: summary.count
      });
    }

    return { success: true, review: cleanReview };
  }

  getUserRatingSummary(userId) {
    if (!userId) {
      return { average: 5.0, count: 0, reviews: [] };
    }

    const isDemoUser = (userId === "farmer_1" || userId === "dealer_1" || userId === "admin_1");
    let reviews = this.getReviews(userId) || [];

    if (!isDemoUser) {
      reviews = reviews.filter(r => !r.isDemo);
    } else {
      reviews = reviews.filter(r => r.isDemo === true || r.userCreated === true);
    }

    if (!reviews || reviews.length === 0) {
      const user = this.getUserById(userId);
      return {
        average: user && user.rating ? Number(user.rating) : 5.0,
        count: user && user.reviewsCount ? Number(user.reviewsCount) : 0,
        reviews: []
      };
    }

    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const avg = Number((sum / reviews.length).toFixed(1));
    return {
      average: avg,
      count: reviews.length,
      reviews: reviews
    };
  }

  // Reset to initial demo state (preserves user-created listings)
  resetAllDemoData() {
    const existingCrops = this.getCrops().filter(c => !this.isDemoCrop(c) || c.userCreated === true);
    const existingOffers = this.getOffers().filter(o => !this.isDemoOffer(o) || o.userCreated === true);
    const existingTxs = this.getTransactions().filter(t => !this.isDemoTransaction(t) || t.userCreated === true);
    const existingCalcs = this.getCalculations().filter(c => c.userCreated === true);
    const existingRevs = this.getReviews().filter(r => !this.isDemoReview(r) || r.userCreated === true);
    const existingPrices = this.getMarketPrices().filter(p => p.isDemo === false || p.userCreated === true);
    const existingNotifs = this.getNotifications().filter(n => !this.isDemoNotification(n) || n.userCreated === true);

    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CROPS);
    localStorage.removeItem(STORAGE_KEYS.MARKET_PRICES);
    localStorage.removeItem(STORAGE_KEYS.OFFERS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.WEATHER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.SAVED_CROPS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    this.initDemoData();
    this.migrateLegacyDemoRecords();

    if (existingCrops.length > 0) {
      const demoCrops = this.getCrops();
      this.set(STORAGE_KEYS.CROPS, [...existingCrops, ...demoCrops]);
    }
    if (existingOffers.length > 0) {
      const demoOffers = this.getOffers();
      this.set(STORAGE_KEYS.OFFERS, [...existingOffers, ...demoOffers]);
    }
    if (existingTxs.length > 0) {
      const demoTxs = this.getTransactions();
      this.set(STORAGE_KEYS.TRANSACTIONS, [...existingTxs, ...demoTxs]);
    }
    if (existingCalcs.length > 0) {
      const demoCalcs = this.getCalculations();
      this.set(STORAGE_KEYS.CALCULATIONS, [...existingCalcs, ...demoCalcs]);
    }
    if (existingRevs.length > 0) {
      const demoRevs = this.getReviews();
      this.set(STORAGE_KEYS.REVIEWS, [...existingRevs, ...demoRevs]);
    }
    if (existingPrices.length > 0) {
      const demoPrices = this.getMarketPrices();
      this.set(STORAGE_KEYS.MARKET_PRICES, [...existingPrices, ...demoPrices]);
    }
    if (existingNotifs.length > 0) {
      const demoNotifs = this.getNotifications();
      this.set(STORAGE_KEYS.NOTIFICATIONS, [...existingNotifs, ...demoNotifs]);
    }
  }
}

// Global instance
if (typeof window !== 'undefined') {
  window.Storage = new StorageService();
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageService };
}
