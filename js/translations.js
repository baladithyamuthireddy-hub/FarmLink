/**
 * FarmLink - Comprehensive Bilingual Translation System (English ↔ Telugu)
 * Provides authentic, high-quality Telugu translations for Andhra Pradesh agricultural context.
 */

const translations = {
  en: {
    // Brand & Common Navigation
    brandName: "FarmLink",
    tagline: "Direct Farmer & Dealer Connection Platform",
    navHome: "Home",
    navAbout: "About",
    navFeatures: "Features",
    navHowItWorks: "How It Works",
    navMarketPrices: "Market Prices",
    navLogin: "Login",
    navRegister: "Register",
    navGetStarted: "Get Started",
    navExplore: "Explore Marketplace",
    logout: "Logout",
    profile: "Profile",
    settings: "Settings",

    // Roles
    roleFarmer: "Farmer",
    roleDealer: "Dealer / Wholesaler",
    roleAdmin: "Admin",

    // Farmer Navigation
    fNavOverview: "Overview",
    fNavMyCrops: "My Listed Crops",
    fNavAddCrop: "Add New Crop",
    fNavOffers: "Dealer Offers",
    fNavMessages: "Messages",
    fNavMarket: "Market Prices",
    fNavWeather: "Weather & Advisories",
    fNavCalculator: "Profit Calculator",
    fNavTransactions: "Sales History",
    fNavProfile: "Farmer Profile",

    // Dealer Navigation
    dNavOverview: "Overview",
    dNavMarketplace: "Browse Crops",
    dNavMyOffers: "My Offers",
    dNavMessages: "Messages",
    dNavPurchases: "Purchase History",
    dNavSaved: "Saved Crops",
    dNavProfile: "Business Profile",

    // Admin Navigation
    aNavOverview: "Admin Overview",
    aNavFarmers: "Farmer Accounts",
    aNavDealers: "Dealer Accounts",
    aNavListings: "Moderate Listings",
    aNavPrices: "Market Reference Prices",
    aNavTransactions: "All Transactions",
    aNavSettings: "System Settings",

    // Common Actions & Buttons
    btnSave: "Save Changes",
    btnCancel: "Cancel",
    btnSubmit: "Submit",
    btnDelete: "Delete",
    btnEdit: "Edit",
    btnAccept: "Accept Offer",
    btnReject: "Reject Offer",
    btnCounter: "Counter Offer",
    btnMakeOffer: "Make an Offer",
    btnViewDetails: "View Details",
    btnCalculate: "Calculate Profit",
    btnReset: "Reset",
    btnSend: "Send",
    btnSearch: "Search",
    btnFilter: "Filter",
    btnContactFarmer: "Chat with Farmer",
    btnContactDealer: "Chat with Dealer",

    // Landing Page Hero & Sections
    heroHeadline: "Connecting Farmers Directly to Better Markets.",
    heroSubhead: "Empowering farmers and agricultural dealers with direct trading, transparent fair pricing, quality-based grading, and intelligent weather advisories.",
    heroCtaPrimary: "Get Started as Farmer or Dealer",
    heroCtaSecondary: "Explore How It Works",

    whyTitle: "Why FarmLink?",
    whyDirectTitle: "Direct Connection",
    whyDirectDesc: "Eliminate middlemen and commissions by connecting directly with licensed wholesale buyers.",
    whyPriceTitle: "Fair Price Discovery",
    whyPriceDesc: "Admin-verified APMC mandi reference rates help farmers negotiate with confidence.",
    whyQualityTitle: "Quality Transparency",
    whyQualityDesc: "Clear Grade A/B/C standards prevent arbitrary price cuts at the delivery point.",
    whyWeatherTitle: "Weather-Smart Farming",
    whyWeatherDesc: "Timely rainfall, temperature, and wind advisories safeguard input costs.",

    howItWorksTitle: "How FarmLink Works",
    howStep1Title: "1. Farmer Lists Produce",
    howStep1Desc: "Upload crop photos, quantity, expected price, and certified quality grade.",
    howStep2Title: "2. Dealer Discovers Crops",
    howStep2Desc: "Wholesalers browse verified regional crops matching their procurement needs.",
    howStep3Title: "3. Transparent Negotiation",
    howStep3Desc: "Bids are compared against Mandi fair reference bands. Counter-offers can be made in real-time.",
    howStep4Title: "4. Deal Completed",
    howStep4Desc: "Direct agreement reached, invoice generated, and mutual rating recorded.",

    // Quality Grading
    gradeA: "Grade A (Premium Quality)",
    gradeADesc: "Uniform size, harvested within 24-48 hrs, zero pest marks, export/mandi prime.",
    gradeB: "Grade B (Standard Market)",
    gradeBDesc: "Good general quality, slight size variations, standard packaging.",
    gradeC: "Grade C (Processing Grade)",
    gradeCDesc: "Variable size/ripeness, best suited for immediate culinary processing or pulp.",

    // Fair Price System
    marketPrice: "Market Reference Price",
    fairPriceRange: "Suggested Fair Price Range",
    offerBelowFair: "Offer is below suggested fair price range",
    offerInFair: "Offer is within fair market range",
    offerAboveFair: "Premium offer above fair range",
    lastUpdated: "Last Updated",

    // Crop Listing Details
    cropName: "Crop Name",
    category: "Category",
    quantity: "Quantity",
    expectedPrice: "Farmer Expected Price",
    dealerOffer: "Dealer's Offer",
    farmerCounterOffer: "Farmer's Counter-Offer",
    estimatedTotalDeal: "Estimated Deal Amount",
    location: "Location / District",
    harvestDate: "Harvest Date",
    qualityGrade: "Quality Grade",
    description: "Crop Description",

    // Weather & Suggestions
    weatherTitle: "Andhra Pradesh Weather Advisories",
    weatherTemp: "Temperature",
    weatherHumidity: "Humidity",
    weatherRainProb: "Rain Probability",
    weatherWind: "Wind Speed",
    advisoryAlert: "Farming Advisory",

    // Profit Calculator
    calcTitle: "Farmer Net Profit Calculator",
    seedCost: "Seed / Sapling Cost (₹)",
    fertilizerCost: "Fertilizer & Nutrition (₹)",
    pesticideCost: "Pesticides & Crop Protection (₹)",
    labourCost: "Labour & Harvesting (₹)",
    irrigationCost: "Irrigation & Power (₹)",
    transportCost: "Transport & Packaging (₹)",
    otherCost: "Other Miscellaneous (₹)",
    yieldQty: "Total Estimated Yield (kg / Quintal)",
    sellingPrice: "Expected Selling Price (₹ / unit)",
    totalInvestment: "Total Cultivation Investment",
    expectedRevenue: "Total Expected Revenue",
    estimatedProfit: "Estimated Net Profit",
    profitMargin: "Profit Margin",

    // Statuses
    statusActive: "Active",
    statusPending: "Pending",
    statusCountered: "Counter-Offered",
    statusAccepted: "Accepted",
    statusRejected: "Rejected",
    statusCancelled: "Cancelled",
    statusCompleted: "Completed",

    // Notifications & Toasts
    notifNewOffer: "New offer received for your crop!",
    notifOfferAccepted: "Your offer has been accepted!",

    // Settings, Saved Crops, Reports, Activity
    fNavSettings: "Settings",
    dNavSettings: "Settings",
    aNavWeatherSuggestions: "Weather Suggestions",
    aNavReports: "Reports & Analytics",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    sendResetLink: "Send Reset Link",
    savedCrops: "Saved Crops",
    recentActivity: "Recent Activity",
    availableCrops: "Available Crops",
    pendingNegotiations: "Pending Negotiations",
    marketHighlights: "Market Price Highlights",
    weatherSummary: "Weather Summary",
    notifCounterReceived: "Farmer suggested a counter-offer",
    notifMsgSent: "Message sent successfully",
    cropAddedSuccess: "Crop listing published successfully!",
    marketRefUnavailable: "Market reference unavailable",
    clearFilters: "Clear Filters",
    searchCropsPlaceholder: "Search by crop, farmer, or location...",
    noCropsFound: "No crops match your current filters.",
    noCropsListedYet: "No crops listed yet.",
    addFirstCrop: "Add Your First Crop",
    noOffersYet: "No offers yet.",
    noPurchasesYet: "No purchases finalized yet.",
    estimatedTotalOffer: "Estimated Total Offer",
    quantityRequested: "Quantity Requested",
    offerPricePerUnit: "Offer Price per Unit",
    view: "View",
    remove: "Remove",
    edit: "Edit",
    negotiationHistory: "Negotiation History",
    counterOfferReceived: "Counter Offer Received",
    waitingResponse: "Waiting for response",

    // Stage 4 Weather & Suggestions
    weatherSimNotice: "Simulated Data Notice: Current weather feeds and station readings are simulated for demonstration purposes across Andhra Pradesh agricultural regions.",
    selectDistrict: "Select Agricultural District:",
    weatherSimTitle: "Weather Condition Simulator (Test Rule Engine)",
    weatherSimDesc: "Simulate specific microclimate conditions to observe automated agronomic rule suggestions.",
    simClear: "Clear Sky",
    simRain: "Simulate Heavy Rain",
    simHeat: "Simulate Heatwave",
    simWind: "Simulate Strong Winds",
    simReset: "Reset",
    fiveDayOutlook: "5-Day Regional Agricultural Outlook",
    ruleBasedSuggestions: "Rule-Based Farming Suggestions",
    ruleBasedDesc: "Automated agronomic advisories categorized by Warning, Advisory, and Information.",
    weatherUnavailable: "Weather information is currently unavailable.",
    weatherUnavailableDesc: "Unable to retrieve regional station telemetry. Please choose another agricultural district.",
    btnViewWeather: "View Weather",
    weatherHumidity: "Humidity",
    weatherRainProb: "Rain Probability",
    weatherWind: "Wind Speed",

    // Stage 4 Profit Calculator
    selectListedCrop: "Populate from My Listed Crops:",
    quickPresets: "Quick Regional Presets:",
    cropCostDetails: "Cultivation Cost Breakdown (₹)",
    cropNameLabel: "Crop / Produce Name",
    acreageLabel: "Cultivation Land Area (Acres)",
    seedCost: "Seed / Sapling Cost (₹)",
    fertilizerCost: "Fertilizers & Nutrients (₹)",
    pesticideCost: "Pesticides & Protection (₹)",
    labourCost: "Labour & Harvesting (₹)",
    irrigationCost: "Irrigation & Power (₹)",
    transportCost: "Transportation & Mandi Bags (₹)",
    otherCost: "Other Expenses & Mandi Cess (₹)",
    harvestYieldHeading: "Estimated Harvest Yield & Selling Price",
    yieldQty: "Estimated Yield (kg / units)",
    sellingPrice: "Selling Price (₹ per unit)",
    btnSaveCalculation: "Save Calculation",
    financialSummary: "Financial Summary",
    totalInvestment: "Total Investment:",
    costPerKg: "Production Cost per kg:",
    roiLabel: "Return on Investment (ROI):",
    estimatedLoss: "ESTIMATED LOSS",
    calcFormulaNote: "* Formulas: Total Investment = Seed + Fertilizer + Pesticide + Labour + Irrigation + Transport + Other. Revenue = Quantity × Price. Profit/Loss = Revenue - Investment. Margin = (Profit / Revenue) × 100.",
    savedCalculationsTitle: "Saved Calculations",
    savedCalculationsSub: "Review previously analyzed cultivation budgets, revenues, and profit margins.",
    noSavedCalculations: "No saved calculations yet.",
    noSavedCalculationsDesc: "Use the calculator above to model your costs and click 'Save Calculation' to track records.",
    profitCalcTitle: "Farmer Profit Calculator",
    profitCalcSub: "Estimate total production costs, net profit, and profit margins before closing dealer deals.",
    btnCalculateProfit: "Calculate Profit",

    // Stage 4 Ratings & Reviews
    farmerTrustRating: "Farmer Trust Rating",
    dealerTrustRating: "Dealer Trust Rating",
    dealerRating: "Dealer Rating",
    verifiedReviews: "Verified Dealer Reviews & Trust Ratings",
    verifiedReviewsSub: "Feedback submitted by wholesale buyers after successful delivery and settlement.",
    verifiedFarmerReviews: "Verified Farmer Reviews & Partner Feedback",
    verifiedFarmerReviewsSub: "Direct feedback and reliability ratings given by farmers following completed harvests.",
    btnRateReview: "Rate & Review",
    reviewSubmitted: "Review Submitted",
    noReviewsYet: "No reviews yet.",
    noReviewsDesc: "Ratings and verified feedback will appear here after completed transactions.",
    aboutFarmer: "About the Farmer",

    // Stage 5 Notifications, Search, Filters & Admin Benchmark
    notificationsTitle: "Notifications",
    viewNotifications: "View Notifications",
    viewAllNotifications: "View All Notifications",
    notificationsAll: "All Notifications",
    notificationsUnread: "Unread",
    markAllRead: "Mark all as read",
    markAsRead: "Mark as read",
    noNotifications: "No notifications",
    allCaughtUp: "You're all caught up!",
    resetFiltersBtn: "Reset Filters",
    effectiveDate: "Effective Date",

    // Two-Party Delivery Confirmation
    markDispatched: "Mark as Dispatched",
    confirmDelivery: "Confirm Delivery",
    viewDeliveryDetails: "View Delivery Details",
    deliveryDispatched: "Delivery: Dispatched",
    awaitingConfirmation: "Awaiting dealer confirmation",
    deliveryDelivered: "Delivery: Delivered",
    confirmedByDealer: "Confirmed by dealer"
  },

  te: {
    // Brand & Common Navigation
    brandName: "ఫార్మ్‌లింక్",
    tagline: "రైతులు మరియు వ్యాపారుల ప్రత్యక్ష అనుసంధాన వేదిక",
    navHome: "హోమ్",
    navAbout: "మా గురించి",
    navFeatures: "ఫీచర్లు",
    navHowItWorks: "ఇది ఎలా పనిచేస్తుంది",
    navMarketPrices: "మార్కెట్ ధరలు",
    navLogin: "లాగిన్",
    navRegister: "రిజిస్ట్రేషన్",
    navGetStarted: "ప్రారంభించండి",
    navExplore: "మార్కెట్‌ను పరిశీలించండి",
    logout: "లాగ్ అవుట్",
    profile: "ప్రొఫైల్",
    settings: "సెట్టింగులు",

    // Roles
    roleFarmer: "రైతు",
    roleDealer: "వ్యాపారి / హోల్‌సేలర్",
    roleAdmin: "అడ్మిన్",

    // Farmer Navigation
    fNavOverview: "ముఖచిత్రం",
    fNavMyCrops: "నా పంట జాబితా",
    fNavAddCrop: "కొత్త పంటను చేర్చండి",
    fNavOffers: "వచ్చిన ఆఫర్లు",
    fNavMessages: "సందేశాలు",
    fNavMarket: "మార్కెట్ ధరలు",
    fNavWeather: "వాతావరణం & సూచనలు",
    fNavCalculator: "లాభాల కాలిక్యులేటర్",
    fNavTransactions: "అమ్మకాల చరిత్ర",
    fNavProfile: "రైతు ప్రొఫైల్",

    // Dealer Navigation
    dNavOverview: "ముఖచిత్రం",
    dNavMarketplace: "పంటలను చూడండి",
    dNavMyOffers: "నా ఆఫర్లు",
    dNavMessages: "సందేశాలు",
    dNavPurchases: "కొనుగోలు చరిత్ర",
    dNavSaved: "సేవ్ చేసిన పంటలు",
    dNavProfile: "వ్యాపార ప్రొఫైల్",

    // Admin Navigation
    aNavOverview: "అడ్మిన్ ముఖచిత్రం",
    aNavFarmers: "రైతుల ఖాతాలు",
    aNavDealers: "వ్యాపారుల ఖాతాలు",
    aNavListings: "పంటల నిర్వహణ",
    aNavPrices: "మార్కెట్ సూచన ధరలు",
    aNavTransactions: "లావాదేవీల రికార్డు",
    aNavSettings: "సిస్టమ్ సెట్టింగులు",

    // Common Actions & Buttons
    btnSave: "మార్పులను భద్రపరచు",
    btnCancel: "రద్దు చేయి",
    btnSubmit: "సమర్పించు",
    btnDelete: "తొలగించు",
    btnEdit: "సవరించు",
    btnAccept: "ఆఫర్ అంగీకరించు",
    btnReject: "ఆఫర్ తిరస్కరించు",
    btnCounter: "ఎదురు ఆఫర్ ఇవ్వండి",
    btnMakeOffer: "ఆఫర్ ఇవ్వండి",
    btnViewDetails: "వివరాలు చూడండి",
    btnCalculate: "లాభం లెక్కించు",
    btnReset: "రీసెట్ చేయి",
    btnSend: "పంపించు",
    btnSearch: "వెతుకు",
    btnFilter: "వడపోత",
    btnContactFarmer: "రైతుతో మాట్లాడండి",
    btnContactDealer: "వ్యాపారితో మాట్లాడండి",

    // Landing Page Hero & Sections
    heroHeadline: "రైతులను సరైన మార్కెట్లతో నేరుగా అనుసంధానించడం.",
    heroSubhead: "దళారుల ప్రమేయం లేకుండా నాణ్యమైన పంటలకు గిట్టుబాటు ధరలు, మార్కెట్ సూచనలు, నాణ్యతా శ్రేణులు మరియు వాతావరణ ఆధారిత వ్యవసాయ సలహాలు.",
    heroCtaPrimary: "రైతు లేదా వ్యాపారిగా ప్రారంభించండి",
    heroCtaSecondary: "ఎలా పనిచేస్తుందో తెలుసుకోండి",

    whyTitle: "ఫార్మ్‌లింక్ ఎందుకు?",
    whyDirectTitle: "ప్రత్యక్ష అనుసంధానం",
    whyDirectDesc: "మధ్యవర్తులు మరియు కమిషన్ల సమస్య లేకుండా నేరుగా పెద్ద హోల్‌సేల్ వ్యాపారులను కలవండి.",
    whyPriceTitle: "న్యాయమైన ధరల గుర్తింపు",
    whyPriceDesc: "ప్రభుత్వ మార్కెట్ యార్డ్ ప్రామాణిక ధరలతో ఆత్మవిశ్వాసంతో బేరసారాలు చేయండి.",
    whyQualityTitle: "నాణ్యతలో పారదర్శకత",
    whyQualityDesc: "గ్రేడ్ A, B, C ప్రమాణాలు డెలివరీ సమయంలో అకారణంగా ధర తగ్గించే సమస్యను నివారిస్తాయి.",
    whyWeatherTitle: "వాతావరణ ఆధారిత రక్షణ",
    whyWeatherDesc: "సకాలంలో వర్షపాతం, ఉష్ణోగ్రత మరియు గాలుల హెచ్చరికలతో పెట్టుబడి ఖర్చులను ఆదా చేయండి.",

    howItWorksTitle: "ఫార్మ్‌లింక్ ఎలా పనిచేస్తుంది",
    howStep1Title: "1. రైతు పంట వివరాలు నమోదు చేయడం",
    howStep1Desc: "పంట ఫోటోలు, పరిమాణం, ఆశించే ధర మరియు నాణ్యతా గ్రేడ్ వివరాలను అప్‌లోడ్ చేయండి.",
    howStep2Title: "2. వ్యాపారులు పంటను గుర్తించడం",
    howStep2Desc: "హోల్‌సేల్ వ్యాపారులు తమకు కావలసిన నాణ్యమైన పంటలను నేరుగా బ్రౌజ్ చేస్తారు.",
    howStep3Title: "3. పారదర్శక బేరసారాలు",
    howStep3Desc: "మార్కెట్ ధరల పరిధితో పోల్చుతూ ఆఫర్లు మరియు ఎదురు ఆఫర్లు ఇచ్చిపుచ్చుకోవచ్చు.",
    howStep4Title: "4. ఒప్పందం పూర్తి",
    howStep4Desc: "ఇరువైపులా సమ్మతించిన తర్వాత లావాదేవీ ఖరారవుతుంది మరియు రసీదు లభిస్తుంది.",

    // Quality Grading
    gradeA: "గ్రేడ్ A (ఉత్తమ నాణ్యత)",
    gradeADesc: "సమతుల్య పరిమాణం, తాజా కోత (24-48 గంటలు), పురుగుల మచ్చలు లేని ప్రీమియం నాణ్యత.",
    gradeB: "గ్రేడ్ B (సాధారణ మార్కెట్ నాణ్యత)",
    gradeBDesc: "మంచి సగటు నాణ్యత, చిన్నపాటి పరిమాణ భేదాలు, ప్రామాణిక ప్యాకింగ్.",
    gradeC: "గ్రేడ్ C (ప్రాసెసింగ్ నాణ్యత)",
    gradeCDesc: "పరిమాణాల్లో వ్యత్యాసం, వెంటనే ఆహార ప్రాసెసింగ్ లేదా గుజ్జు తయారీకి అనుకూలం.",

    // Fair Price System
    marketPrice: "ప్రస్తుత మార్కెట్ ధర",
    fairPriceRange: "సిఫార్సు చేయబడిన న్యాయమైన ధర పరిధి",
    offerBelowFair: "ఈ ఆఫర్ మార్కెట్ న్యాయమైన ధర కంటే తక్కువగా ఉంది",
    offerInFair: "ఈ ఆఫర్ న్యాయమైన మార్కెట్ పరిధిలోనే ఉంది",
    offerAboveFair: "మార్కెట్ ధర కంటే మెరుగైన ప్రీమియం ఆఫర్",
    lastUpdated: "చివరిగా అప్‌డేట్ చేసిన తేది",

    // Crop Listing Details
    cropName: "పంట పేరు",
    category: "వర్గం",
    quantity: "పరిమాణం",
    expectedPrice: "రైతు ఆశిస్తున్న ధర",
    dealerOffer: "వ్యాపారి ఆఫర్",
    farmerCounterOffer: "రైతు కౌంటర్ ఆఫర్",
    estimatedTotalDeal: "అంచనా మొత్తం డీల్",
    location: "ప్రాంతం / జిల్లా",
    harvestDate: "కోత తేదీ",
    qualityGrade: "నాణ్యతా గ్రేడ్",
    description: "పంట వివరణ",

    // Weather & Suggestions
    weatherTitle: "ఆంధ్రప్రదేశ్ వ్యవసాయ వాతావరణ సూచనలు",
    weatherTemp: "ఉష్ణోగ్రత",
    weatherHumidity: "తేమ శాతం",
    weatherRainProb: "వర్షం పడే అవకాశం",
    weatherWind: "గాలి వేగం",
    advisoryAlert: "రైతులకు సలహా",

    // Profit Calculator
    calcTitle: "రైతు నికర లాభాల కాలిక్యులేటర్",
    seedCost: "విత్తనాల / నారు ఖర్చు (₹)",
    fertilizerCost: "ఎరువులు మరియు పోషకాలు (₹)",
    pesticideCost: "పురుగుమందులు & రక్షణ (₹)",
    labourCost: "కూలీల మరియు కోత ఖర్చులు (₹)",
    irrigationCost: "నీటిపారుదల మరియు విద్యుత్ (₹)",
    transportCost: "రవాణా మరియు ప్యాకింగ్ (₹)",
    otherCost: "ఇతర అనుకోని ఖర్చులు (₹)",
    yieldQty: "మొత్తం అంచనా దిగుబడి (కిలోలు / క్వింటాళ్లు)",
    sellingPrice: "అంచనా విక్రయ ధర (₹ / యూనిట్)",
    totalInvestment: "మొత్తం సాగు పెట్టుబడి",
    expectedRevenue: "రాబడి అంచనా",
    estimatedProfit: "నికర లాభం / నష్టం",
    profitMargin: "లాభ శాతం",

    // Statuses
    statusActive: "అందుబాటులో ఉంది",
    statusPending: "పరిశీలనలో ఉంది",
    statusCountered: "ఎదురు ఆఫర్ పంపబడింది",
    statusAccepted: "అంగీకరించబడింది",
    statusRejected: "తిరస్కరించబడింది",
    statusCancelled: "రద్దు చేయబడింది",
    statusCompleted: "పూర్తయింది",

    // Notifications & Toasts
    notifNewOffer: "మీ పంటకు కొత్త ఆఫర్ వచ్చింది!",
    notifOfferAccepted: "మీ ఆఫర్ అంగీకరించబడింది!",

    // Settings, Saved Crops, Reports, Activity
    fNavSettings: "సెట్టింగులు",
    dNavSettings: "సెట్టింగులు",
    aNavWeatherSuggestions: "వాతావరణ సూచనలు",
    aNavReports: "నివేదికలు & విశ్లేషణలు",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    resetPassword: "పాస్‌వర్డ్ రీసెట్ చేయండి",
    sendResetLink: "రీసెట్ లింక్ పంపండి",
    savedCrops: "సేవ్ చేసిన పంటలు",
    recentActivity: "ఇటీవలి కార్యకలాపాలు",
    availableCrops: "అందుబాటులో ఉన్న పంటలు",
    pendingNegotiations: "పరిశీలనలో ఉన్న బేరసారాలు",
    marketHighlights: "మార్కెట్ ధరల ముఖ్యాంశాలు",
    weatherSummary: "వాతావరణ సారాంశం",
    notifCounterReceived: "రైతు కొత్త ఎదురు ఆఫర్ ఇచ్చారు",
    notifMsgSent: "సందేశం విజయవంతంగా పంపబడింది",
    cropAddedSuccess: "పంట విజయవంతంగా జాబితా చేయబడింది!",
    marketRefUnavailable: "మార్కెట్ ప్రామాణిక ధర అందుబాటులో లేదు",
    clearFilters: "ఫిల్టర్లను క్లియర్ చేయి",
    searchCropsPlaceholder: "పంట, రైతు లేదా ప్రాంతం ద్వారా వెతకండి...",
    noCropsFound: "మీ ఫిల్టర్లకు సరిపోయే పంటలు ఏవీ కనుగొనబడలేదు.",
    noCropsListedYet: "ఇంకా ఏ పంటలు జాబితా చేయబడలేదు.",
    addFirstCrop: "మీ మొదటి పంటను చేర్చండి",
    noOffersYet: "ఇంకా ఎటువంటి ఆఫర్లు రాలేదు.",
    noPurchasesYet: "ఇంకా ఎటువంటి కొనుగోళ్లు ఖరారు కాలేదు.",
    estimatedTotalOffer: "అంచనా మొత్తం ఆఫర్ విలువ",
    quantityRequested: "కోరిన పరిమాణం",
    offerPricePerUnit: "యూనిట్‌కు ఆఫర్ ధర",
    view: "చూడండి",
    remove: "తొలగించు",
    edit: "సవరించు",
    negotiationHistory: "బేరసారాల చరిత్ర",
    counterOfferReceived: "కౌంటర్ ఆఫర్ వచ్చింది",
    waitingResponse: "ప్రతిస్పందన కోసం వేచి ఉంది",

    // Stage 4 Weather & Suggestions
    weatherSimNotice: "గమనిక: ఆంధ్రప్రదేశ్ వ్యవసాయ ప్రాంతాల పరిశీలన కొరకు ప్రస్తుత వాతావరణ సమాచారం అనుకరణ (సిమ్యులేషన్) ద్వారా ప్రదర్శించబడుతోంది.",
    selectDistrict: "వ్యవసాయ జిల్లాను ఎంచుకోండి:",
    weatherSimTitle: "వాతావరణ పరిస్థితుల అనుకరణ (రూల్ ఇంజిన్ పరీక్ష)",
    weatherSimDesc: "స్వయంచాలక వ్యవసాయ సూచనలను పరీక్షించడానికి నిర్దిష్ట వాతావరణ పరిస్థితులను అనుకరించండి.",
    simClear: "తేటగా ఉన్న ఆకాశం",
    simRain: "భారీ వర్షాన్ని అనుకరించండి",
    simHeat: "తీవ్రమైన ఎండను అనుకరించండి",
    simWind: "ఈదురు గాలులను అనుకరించండి",
    simReset: "రీసెట్ చేయండి",
    fiveDayOutlook: "5-రోజుల ప్రాంతీయ వ్యవసాయ వాతావరణ నివేదిక",
    ruleBasedSuggestions: "నియమాల ఆధారిత వ్యవసాయ సూచనలు",
    ruleBasedDesc: "హెచ్చరిక, సలహా మరియు సమాచార వర్గాల వారీగా వర్గీకరించబడిన పంట సూచనలు.",
    weatherUnavailable: "ప్రస్తుతం వాతావరణ సమాచారం అందుబాటులో లేదు.",
    weatherUnavailableDesc: "ప్రాంతీయ స్టేషన్ సమాచారాన్ని పొందలేకపోయాము. దయచేసి మరొక వ్యవసాయ జిల్లాను ఎంచుకోండి.",
    btnViewWeather: "వాతావరణ వివరాలు చూడండి",
    weatherHumidity: "తేమ",
    weatherRainProb: "వర్ష సూచన",
    weatherWind: "గాలి వేగం",

    // Stage 4 Profit Calculator
    selectListedCrop: "నా జాబితాలోని పంటల నుండి ఎంచుకోండి:",
    quickPresets: "ప్రాంతీయ పంటల నమూనాలు:",
    cropCostDetails: "సాగు ఖర్చుల వివరాలు (₹)",
    cropNameLabel: "పంట పేరు",
    acreageLabel: "సాగు భూమి విస్తీర్ణం (ఎకరాలు)",
    seedCost: "విత్తనాలు / నారు ఖర్చు (₹)",
    fertilizerCost: "ఎరువులు మరియు పోషకాలు (₹)",
    pesticideCost: "పురుగుమందులు & పంట రక్షణ (₹)",
    labourCost: "కూలీలు మరియు కోత ఖర్చులు (₹)",
    irrigationCost: "నీటిపారుదల మరియు విద్యుత్ (₹)",
    transportCost: "రవాణా మరియు మార్కెట్ సంచులు (₹)",
    otherCost: "ఇతర ఖర్చులు మరియు మార్కెట్ సెస్ (₹)",
    harvestYieldHeading: "అంచనా దిగుబడి మరియు విక్రయ ధర",
    yieldQty: "అంచనా దిగుబడి (కిలోలు / యూనిట్లు)",
    sellingPrice: "విక్రయ ధర (కిలోకు ₹)",
    btnSaveCalculation: "లెక్కను సేవ్ చేయండి",
    financialSummary: "ఆర్థిక సారాంశం",
    totalInvestment: "మొత్తం పెట్టుబడి:",
    costPerKg: "కిలోకు ఉత్పత్తి ఖర్చు:",
    roiLabel: "పెట్టుబడిపై రాబడి (ROI):",
    estimatedLoss: "అంచనా నష్టం",
    calcFormulaNote: "* సూత్రాలు: మొత్తం పెట్టుబడి = విత్తనాలు + ఎరువులు + పురుగుమందులు + కూలీ + నీటిపారుదల + రవాణా + ఇతర ఖర్చులు. రాబడి = పరిమాణం × ధర. లాభం/నష్టం = రాబడి - పెట్టుబడి. మార్జిన్ = (లాభం / రాబడి) × 100.",
    savedCalculationsTitle: "సేవ్ చేసిన లెక్కలు",
    savedCalculationsSub: "గతంలో విశ్లేషించిన సాగు బడ్జెట్లు, రాబడులు మరియు లాభాల వివరాలు.",
    noSavedCalculations: "ఇంకా ఏ లెక్కలు సేవ్ చేయబడలేదు.",
    noSavedCalculationsDesc: "మీ సాగు ఖర్చులను లెక్కించడానికి పై కాలిక్యులేటర్‌ను ఉపయోగించి 'లెక్కను సేవ్ చేయండి' పై క్లిక్ చేయండి.",
    profitCalcTitle: "రైతు లాభాల కాలిక్యులేటర్",
    profitCalcSub: "వ్యాపారులతో ఒప్పందాలు ఖరారు చేసే ముందు మొత్తం సాగు వ్యయం, నికర లాభం మరియు లాభాల శాతాన్ని అంచనా వేయండి.",
    btnCalculateProfit: "లాభాన్ని లెక్కించండి",

    // Stage 4 Ratings & Reviews
    farmerTrustRating: "రైతు విశ్వసనీయత రేటింగ్",
    dealerTrustRating: "డీలర్ విశ్వసనీయత రేటింగ్",
    dealerRating: "డీలర్ రేటింగ్",
    verifiedReviews: "ధృవీకరించిన డీలర్ సమీక్షలు & రేటింగ్‌లు",
    verifiedReviewsSub: "సరుకు సరఫరా మరియు చెల్లింపులు పూర్తయిన తర్వాత హోల్‌సేల్ కొనుగోలుదారులు ఇచ్చిన సమీక్షలు.",
    verifiedFarmerReviews: "రైతుల ధృవీకరించిన సమీక్షలు & భాగస్వామ్య ఫీడ్‌బ్యాక్",
    verifiedFarmerReviewsSub: "పంటల కొనుగోలు పూర్తయిన తర్వాత రైతులు అందించిన ప్రత్యక్ష విశ్వసనీయతా రేటింగ్‌లు.",
    btnRateReview: "రేటింగ్ & సమీక్ష ఇవ్వండి",
    reviewSubmitted: "సమీక్ష సమర్పించబడింది",
    noReviewsYet: "ఇంకా ఎటువంటి సమీక్షలు లేవు.",
    noReviewsDesc: "లావాదేవీలు పూర్తయిన తర్వాత ధృవీకరించిన రేటింగ్‌లు మరియు సమీక్షలు ఇక్కడ కనిపిస్తాయి.",
    aboutFarmer: "రైతు గురించి",

    // Stage 5 Notifications, Search, Filters & Admin Benchmark
    notificationsTitle: "నోటిఫికేషన్లు",
    viewNotifications: "నోటిఫికేషన్లు చూడండి",
    viewAllNotifications: "అన్ని నోటిఫికేషన్లు చూడండి",
    notificationsAll: "అన్ని నోటిఫికేషన్లు",
    notificationsUnread: "చదవనివి",
    markAllRead: "అన్నీ చదివినట్లు గుర్తించండి",
    markAsRead: "చదివినట్లు గుర్తించండి",
    noNotifications: "నోటిఫికేషన్లు లేవు",
    allCaughtUp: "మీరు అన్ని నోటిఫికేషన్లను చూశారు!",
    resetFiltersBtn: "ఫిల్టర్లను రీసెట్ చేయండి",
    effectiveDate: "అమలు తేదీ",

    // Two-Party Delivery Confirmation
    markDispatched: "రవాణా చేయబడిందిగా గుర్తించండి",
    confirmDelivery: "డెలివరీని ధృవీకరించండి",
    viewDeliveryDetails: "డెలివరీ వివరాలు చూడండి",
    deliveryDispatched: "డెలివరీ: రవాణా చేయబడింది",
    awaitingConfirmation: "డీలర్ ధృవీకరణ పెండింగ్",
    deliveryDelivered: "డెలివరీ: పూర్తయింది",
    confirmedByDealer: "డీలర్ ధృవీకరించారు"
  }
};

window.translations = translations;

class TranslationService {
  constructor() {
    this.currentLang = localStorage.getItem("farmlink_lang") || "en";
  }

  get(key) {
    return (translations[this.currentLang] && translations[this.currentLang][key]) || 
           (translations.en && translations.en[key]) || key;
  }

  setLanguage(lang) {
    if (lang === "en" || lang === "te") {
      this.currentLang = lang;
      localStorage.setItem("farmlink_lang", lang);
      this.applyTranslations();
      document.documentElement.lang = lang;
      
      // Dispatch event for other components if needed
      window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
    }
  }

  toggleLanguage() {
    const nextLang = this.currentLang === "en" ? "te" : "en";
    this.setLanguage(nextLang);
  }

  applyTranslations(rootElement = document) {
    // Translate text content
    const elements = rootElement.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translation = this.get(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Translate placeholders
    const placeholderEls = rootElement.querySelectorAll("[data-i18n-placeholder]");
    placeholderEls.forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const translation = this.get(key);
      if (translation) {
        el.setAttribute("placeholder", translation);
      }
    });

    // Translate titles
    const titleEls = rootElement.querySelectorAll("[data-i18n-title]");
    titleEls.forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      const translation = this.get(key);
      if (translation) {
        el.setAttribute("title", translation);
      }
    });

    // Update Language Toggle Button text if present
    const toggleBtns = document.querySelectorAll(".lang-toggle-text");
    toggleBtns.forEach(btn => {
      btn.textContent = this.currentLang === "en" ? "తెలుగు" : "English";
    });
  }

  translatePage(rootElement = document) {
    this.applyTranslations(rootElement);
  }
}

// Global instance
window.I18n = new TranslationService();
document.addEventListener("DOMContentLoaded", () => {
  window.I18n.applyTranslations();
});
