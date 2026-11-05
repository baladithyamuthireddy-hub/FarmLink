# FarmLink — Direct Farmer & Dealer Connection Platform

> A modern, production-grade agricultural web application connecting farmers directly with agricultural dealers and wholesalers. Built with **HTML5, CSS3, and Vanilla JavaScript**.

---

## 🌾 Project Overview

In traditional agricultural markets, smallholder farmers often face arbitrary price cuts, lack of direct access to wholesale buyers, and asymmetric price information. Meanwhile, dealers struggle with unpredictable crop quality, lack of certified harvest details, and fragmented supply chains.

**FarmLink** addresses this challenge through:
1. **Direct Connection**: Connecting farmers directly with licensed wholesalers to eliminate excessive commission cuts.
2. **Fair Price Discovery**: APMC Mandi benchmark reference prices and fair price range bands.
3. **Quality Transparency**: Structured Grade A (Export/Premium), Grade B (Standard Mandi), and Grade C (Processing) quality standards.
4. **Interactive Multi-Round Negotiations**: Live offers, counter-offers, and instant deal acceptance.
5. **Weather & Agronomic Advisories**: Rule-based farming suggestions (rainfall warnings, foliar spray timing, irrigation schedules).
6. **Farmer Net Profit Calculator**: Detailed cultivation cost breakdowns, net profit estimations, and ROI calculations with 1-acre regional crop presets.
7. **Bilingual Localization**: Instant client-side English ↔ Telugu (తెలుగు) translation for Andhra Pradesh agricultural communities.
8. **Dark / Light Mode**: Seamless theme switching with persistent user preferences.

---

## 🚀 Fast Demo Logins (For Evaluation)

The application includes **1-Click Fast Login** buttons on `login.html`:
- **👨‍🌾 Farmer Persona**: Ramesh Naidu (`ramesh@farmlink.in` / `password123`) — Guntur District
- **💼 Dealer Persona**: Venkat Rao (`venkat@agritraders.in` / `password123`) — Sri Lakshmi Agri Traders, Vijayawada
- **🛡️ Admin Persona**: APMC Market Committee Officer (`admin@farmlink.in` / `password123`)

---

## 📁 Project Directory Structure

```
FarmLink/
├── index.html                   # Public SaaS landing page
├── login.html                   # Unified authentication & 1-click demo logins
├── register.html                # Farmer & Dealer onboarding with AP districts
│
├── farmer/                      # Farmer Portal
│   ├── dashboard.html           # Farmer overview & live dealer negotiations
│   ├── crops.html               # My Listed Crops with search & filters
│   ├── add-crop.html            # Add new crop with quality grade transparency
│   ├── offers.html              # Incoming dealer offers & counter-offer engine
│   ├── messages.html            # Direct chat with wholesale dealers
│   ├── market-prices.html       # Official Mandi reference rates & fair bands
│   ├── weather.html             # Regional weather & rule-based farming advisories
│   ├── profit-calculator.html   # Cultivation investment & profit calculator
│   ├── transactions.html        # Sales history, digital receipts & dealer rating
│   └── profile.html             # Farmer credentials & farming portfolio
│
├── dealer/                      # Dealer / Wholesaler Portal
│   ├── dashboard.html           # Procurement dashboard & active negotiations
│   ├── marketplace.html         # Crop discovery with category, grade & price filters
│   ├── crop-details.html        # Detailed produce inspection & offer modal
│   ├── offers.html              # Outgoing procurement bids & raise/cancel tools
│   ├── messages.html            # Direct communication with regional farmers
│   ├── purchases.html           # Purchase history, contract receipts & farmer rating
│   └── profile.html             # Business profile & procurement preferences
│
├── admin/                       # Admin & Market Committee Portal
│   ├── dashboard.html           # Platform analytics & trade volume
│   ├── market-prices.html       # Mandi benchmark rate CRUD & fair range editor
│   ├── listings.html            # Crop listing moderation & compliance
│   ├── farmers.html             # Farmer verification directory
│   ├── dealers.html             # Licensed wholesaler directory
│   ├── transactions.html        # Platform-wide transactions ledger
│   └── settings.html            # Prototype controls & 1-click demo data reset
│
├── css/
│   ├── style.css                # Base layout, typography, buttons, tables, modals & toasts
│   ├── themes.css               # Light & Dark theme CSS custom variables
│   ├── dashboard.css            # Sidebar layout, topbar, cards, chat & widgets
│   └── responsive.css           # Mobile navigation drawer & responsive grids
│
└── js/
    ├── storage.js               # Central LocalStorage data store with AP seed data
    ├── auth.js                  # Authentication, session guards & demo helpers
    ├── translations.js          # Bilingual English ↔ Telugu dictionary & DOM translator
    ├── theme.js                 # Theme switcher & persistence
    ├── crops.js                 # Crop listing CRUD & quality grade standards
    ├── offers.js                # Negotiation engine (offers, counter-offers, accept, reject)
    ├── chat.js                  # Farmer-dealer direct messaging with auto-replies
    ├── market.js                # Mandi benchmark rates & fair range evaluator
    ├── weather.js               # AP weather simulator & rule-based advisories
    ├── calculator.js            # Farmer profit calculator & crop presets
    ├── admin.js                 # Platform metrics & moderation actions
    └── app.js                   # Application coordinator, modals & toast alerts
```

---

## 🔮 Future Firebase Integration Roadmap

The code is strictly decoupled into reusable JavaScript services:
- **Firebase Authentication**: Drop-in replacement in `js/auth.js` for `signInWithEmailAndPassword`, `signInWithPhoneNumber`, and `createUserWithEmailAndPassword`.
- **Firebase Firestore**: `js/storage.js` CRUD methods map 1:1 to Firestore collections (`users`, `crops`, `offers`, `messages`, `transactions`, `market_prices`).
- **Firebase Storage**: For direct farmer photo and crop image uploads.
- **OpenWeatherMap / IMD API**: Drop-in adapter in `js/weather.js` for live Andhra Pradesh weather data.
