# 🌾 FarmLink — Direct Farmer & Dealer Connection Platform

<p align="center">
  <strong>Connecting Farmers. Empowering Dealers. Building Fair Agricultural Markets.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/github/last-commit/baladithyamuthireddy-hub/FarmLink?style=for-the-badge" alt="Last Commit">
  <img src="https://img.shields.io/github/issues/baladithyamuthireddy-hub/FarmLink?style=for-the-badge" alt="GitHub Issues">
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub">
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
</p>

**FarmLink** is a modern, bilingual agricultural marketplace designed to connect farmers directly with agricultural dealers and wholesalers. It enables transparent crop listings, fair price discovery, real-time negotiations, transaction tracking, and data-driven agricultural insights.

Built using **HTML5, CSS3, Vanilla JavaScript, and Firebase**, FarmLink aims to make agricultural trading more accessible, transparent, and efficient for farming communities.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Core Features](#-core-features)
- [User Roles](#-user-roles)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Transaction Workflow](#-transaction-workflow)
- [Demo Access](#-demo-access)
- [Deployment](#-deployment)
- [Security and Data Management](#-security-and-data-management)
- [Future Enhancements](#-future-enhancements)
- [Project Objectives](#-project-objectives)
- [Development and Contribution](#-development-and-contribution)
- [License](#-license)

---

## 🌱 Project Overview

Traditional agricultural markets can create challenges for smallholder farmers, including limited access to wholesale buyers, unpredictable pricing, insufficient market information, and a lack of transparent negotiation processes.

Dealers and wholesalers also face difficulties in discovering available produce, evaluating crop quality, and coordinating procurement with farmers.

**FarmLink addresses these challenges through a digital agricultural marketplace** where farmers and dealers can communicate, negotiate, and manage agricultural transactions through a unified platform.

### Project Information

| Attribute | Details |
|---|---|
| Project Name | FarmLink |
| Project Category | Agricultural Technology (AgriTech) |
| Application Type | Responsive Web Application |
| Primary Users | Farmers, Dealers, Administrators |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend Services | Firebase |
| Database | Cloud Firestore |
| Authentication | Firebase Authentication |
| Localization | English and Telugu |
| Hosting | Firebase Hosting and Vercel |
| Version Control | Git and GitHub |
| License | MIT License |

---

## 🎯 Problem Statement

Farmers and agricultural dealers often operate through fragmented communication and trading processes.

Key challenges include:

- Limited direct access to agricultural dealers and wholesalers.
- Unclear crop pricing and inconsistent price information.
- Difficulty negotiating fair prices.
- Lack of structured crop quality information.
- Manual coordination of purchase and delivery.
- Limited digital transaction records.
- Insufficient access to useful agricultural insights.

FarmLink aims to reduce these difficulties through a transparent digital trading environment.

---

## 💡 Our Solution

FarmLink provides a centralized platform with the following capabilities:

1. **Direct Farmer–Dealer Connectivity:** Farmers can publish crop listings and connect with interested dealers.
2. **Transparent Price Discovery:** Mandi benchmark rates and fair price ranges help users make informed decisions.
3. **Quality-Based Listings:** Structured Grade A, Grade B, and Grade C classifications communicate produce quality.
4. **Digital Negotiations:** Dealers can submit offers, while farmers can accept or negotiate through counter-offers.
5. **Transaction Management:** Both parties independently confirm delivery and payment milestones.
6. **Agricultural Insights:** Weather advisories and cultivation-profit calculations support better farming decisions.
7. **Regional Accessibility:** English and Telugu interfaces improve accessibility for Andhra Pradesh agricultural communities.

---

## 🚀 Core Features

### 👨‍🌾 1. Farmer Portal

- Farmer registration and authentication.
- Farmer dashboard with crop and transaction summaries.
- Create, update, and manage crop listings.
- Crop images and detailed crop information.
- Specify crop quantity, expected price, location, and quality grade.
- View incoming dealer offers.
- Accept, reject, and negotiate offers.
- Communicate directly with dealers.
- Track delivery and payment confirmations.
- Access digital transaction receipts.
- View transaction history and dealer ratings.
- Manage personal and farming profiles.

### 💼 2. Dealer / Wholesaler Portal

- Dealer registration and business profiles.
- Browse available agricultural produce.
- Search and filter crops by category, quality, price, and location.
- Inspect detailed crop information.
- Submit purchase offers and counter-offers.
- Manage outgoing procurement bids.
- Communicate directly with farmers.
- Track purchases and transaction status.
- Confirm received quantities and payment declarations.
- Rate farmers after completed transactions.

### 🛡️ 3. Admin & Market Committee Portal

- Platform-wide dashboard and analytics.
- Farmer and dealer directories.
- Crop listing moderation.
- Farmer and dealer verification management.
- Transaction monitoring.
- Mandi benchmark price management.
- Fair price range configuration.
- Market activity and trading analytics.
- Platform governance and administrative controls.

### 🤝 4. Multi-Round Negotiation System

FarmLink supports structured negotiations between farmers and dealers.

**Example negotiation:**

| Stage | Action | Price |
|---|---|---:|
| 1 | Farmer lists tomatoes | ₹100/kg |
| 2 | Dealer submits offer | ₹93/kg |
| 3 | Farmer counter-offers | ₹98/kg |
| 4 | Dealer counter-offers | ₹96/kg |
| 5 | Farmer accepts | ₹96/kg |

The agreed quantity and price are used to establish the transaction.

### 📦 5. Delivery & Payment Verification

FarmLink supports a two-party confirmation workflow:

- Farmer confirms dispatched quantity.
- Dealer independently confirms received quantity.
- Dealer declares that payment has been sent.
- Farmer independently confirms receipt of payment.
- Transaction completion depends on the required delivery and payment confirmations.

This provides a structured transaction record rather than relying solely on a single status update.

### 🌦️ 6. Weather & Agricultural Advisories

- Regional weather information and simulation.
- Rule-based agricultural recommendations.
- Rainfall-related warnings.
- Irrigation scheduling suggestions.
- Foliar spray timing guidance.

### 💰 7. Farmer Profit Calculator

- Crop-specific cultivation cost estimation.
- Regional crop presets for one-acre cultivation.
- Investment and expected revenue calculations.
- Estimated net profit.
- Return on Investment (ROI) calculations.

### 📊 8. Mandi Price Intelligence

- Agricultural market benchmark rates.
- Fair price range comparisons.
- Crop-specific price references.
- Administrative price management.

### 💬 9. Direct Messaging & Notifications

- Farmer-to-dealer conversations.
- Individual message bubbles.
- Conversation updates.
- Notifications for relevant platform activities.

### 🌐 10. Bilingual Interface & Accessibility

- English ↔ Telugu localization.
- Light and dark themes.
- Responsive layouts.
- Mobile-friendly navigation.
- Horizontal scrolling for wide administrative tables.
- Reduced-motion accessibility support.

---

## 👥 User Roles

| Role | Main Responsibilities |
|---|---|
| Farmer | List crops, negotiate prices, communicate with dealers, confirm delivery and payment |
| Dealer | Discover crops, submit offers, procure produce, confirm receipt and payment |
| Administrator | Manage users, monitor listings, maintain market prices, and review platform activity |

---

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling, layouts, responsive design, animations |
| Vanilla JavaScript | Frontend logic and application functionality |
| Firebase Authentication | User authentication |
| Cloud Firestore | Cloud-based application data |
| LocalStorage | Local preferences, caching, and demo-related functionality |
| Git | Version control |
| GitHub | Source-code management |
| Firebase Hosting | Web application hosting |
| Vercel | Additional web application deployment |

---

## 🏗️ System Architecture

FarmLink uses a modular frontend architecture supported by Firebase services.

```text
                 FARMLINK WEB APPLICATION
                           |
              HTML + CSS + Vanilla JavaScript
                           |
          +----------------+----------------+
          |                |                |
     Farmer Portal    Dealer Portal     Admin Portal
          |                |                |
          +----------------+----------------+
                           |
                  Application Services
                           |
       +-------------------+-------------------+
       |                   |                   |
   Authentication     Data Management     Business Logic
       |                   |                   |
       +-------------------+-------------------+
                           |
                    FIREBASE SERVICES
                           |
                +----------+----------+
                |                     |
          Firebase Auth         Cloud Firestore
                |                     |
          User Sessions      Application Collections
                                      |
             +------------------------+----------------------+
             |            |           |          |           |
           Users         Crops       Offers  Transactions  Reviews
             |            |           |          |           |
             +------------+-----------+----------+-----------+
                                      |
                             Notifications,
                             Conversations,
                             Messages,
                             Market Prices
```

### Firebase Integration

FarmLink integrates Firebase Authentication and Cloud Firestore.

**Authentication**

- Email and password authentication.
- Firebase-based user identity.
- Session restoration and role-based application access.

**Cloud Firestore**

Application data is organized into collections:

| Collection | Purpose |
|---|---|
| `users` | Farmer, dealer, and user profile information |
| `crops` | Agricultural crop listings |
| `offers` | Dealer offers and negotiation records |
| `transactions` | Purchase, delivery, and payment records |
| `conversations` | Farmer–dealer conversations |
| `messages` | Individual conversation messages |
| `notifications` | Application notifications |
| `reviews` | Transaction-related ratings and reviews |
| `market_prices` | Mandi benchmark prices and market information |

The application also uses local caching and demo-related functionality where applicable.

---

## 📁 Project Structure

```text
FarmLink/
│
├── index.html
├── login.html
├── register.html
│
├── farmer/
│   ├── dashboard.html
│   ├── crops.html
│   ├── add-crop.html
│   ├── offers.html
│   ├── messages.html
│   ├── market-prices.html
│   ├── weather.html
│   ├── profit-calculator.html
│   ├── transactions.html
│   └── profile.html
│
├── dealer/
│   ├── dashboard.html
│   ├── marketplace.html
│   ├── crop-details.html
│   ├── offers.html
│   ├── messages.html
│   ├── purchases.html
│   └── profile.html
│
├── admin/
│   ├── dashboard.html
│   ├── market-prices.html
│   ├── listings.html
│   ├── farmers.html
│   ├── dealers.html
│   ├── transactions.html
│   ├── reports.html
│   └── settings.html
│
├── css/
│   ├── style.css
│   ├── themes.css
│   ├── dashboard.css
│   ├── responsive.css
│   └── admin-analytics.css
│
├── js/
│   ├── firebase-config.js
│   ├── storage.js
│   ├── auth.js
│   ├── translations.js
│   ├── theme.js
│   ├── crops.js
│   ├── offers.js
│   ├── chat.js
│   ├── market.js
│   ├── weather.js
│   ├── calculator.js
│   ├── admin.js
│   └── app.js
│
├── README.md
├── LICENSE
├── .gitignore
├── firebase.json
└── .firebaserc
```

*Note: This is a representative structure. The repository may contain additional pages, scripts, configuration files, and documentation.*

---

## 🔄 Transaction Workflow

```text
Farmer Registers / Logs In
          |
          v
     Creates Crop Listing
          |
          v
   Dealer Discovers Crop
          |
          v
   Dealer Submits Offer
          |
          v
 Farmer Reviews the Offer
          |
          v
 Accept / Reject / Counter
          |
          v
    Agreement Reached
          |
          v
  Transaction Established
          |
          v
 Farmer Confirms Dispatch
          |
          v
 Dealer Confirms Receipt
          |
          v
 Dealer Declares Payment Sent
          |
          v
 Farmer Confirms Payment
          |
          v
 Transaction Completed
          |
          v
    Ratings & Reviews
```

---

## 🎮 Demo Access

The application supports demo login personas for evaluation.

| Role | Demo Persona | District / Location |
|---|---|---|
| Farmer | Ramesh Naidu | Guntur |
| Dealer | Venkat Rao | Vijayawada |
| Admin | APMC Market Committee Officer | Administration |

Demo credentials should be distributed separately when appropriate. Do not publish real passwords or production account credentials in a public repository.

---

## 🌍 Deployment

FarmLink has two separate hosting deployments.

### Vercel

- Connected to the GitHub repository.
- Supports automatic deployment following successful pushes to the configured production branch.
- Provides a live web application deployment.

### Firebase Hosting

- Separate hosting deployment.
- Uses the configured Firebase production project.
- Deployment is managed independently from Vercel.

### Development and Deployment Workflow

```text
Local Development
       |
       v
   Git Commit
       |
       v
   GitHub Push
       |
       v
 Vercel Deployment
       |
       v
 Live Web Application
```

Firebase Hosting is managed separately and is not automatically updated by a GitHub push unless a separate deployment workflow is configured.

---

## 🔐 Security and Data Management

FarmLink uses Firebase Authentication and Firestore security rules to support authenticated access and structured transaction operations.

Important security considerations include:

- Authentication-based user identity.
- Role-aware access to application functionality.
- Firestore security rules for protected data operations.
- Transaction validation for delivery and payment confirmations.
- Protection of important transaction fields from unauthorized modification.
- Separation of frontend configuration from private service credentials.

**Security note:** Firebase client configuration is intended for frontend use. Actual security must be enforced through Firebase Authentication, Firestore security rules, and appropriate project configuration—not by hiding frontend JavaScript.

Never commit private keys, service-account credentials, passwords, or other secrets.

---

## 🔮 Future Enhancements

Potential improvements for subsequent development phases:

- Integration with live weather services such as OpenWeatherMap or suitable IMD data sources.
- More detailed crop disease detection and image-based quality assessment.
- Agricultural logistics and delivery tracking.
- Online payment gateway integration.
- Improved multilingual agricultural support.
- More advanced regional market price analytics.
- AI-powered crop recommendations and market insights.
- Verified dealer credentials and enhanced trust mechanisms.
- Progressive Web App (PWA) capabilities.
- Additional accessibility and performance improvements.

---

## 🎯 Project Objectives

1. Improve direct connectivity between farmers and agricultural dealers.
2. Encourage transparent agricultural price discovery.
3. Provide a structured digital negotiation process.
4. Improve visibility into crop quality and availability.
5. Support transparent delivery and payment confirmations.
6. Provide useful market and agricultural information.
7. Make digital agricultural services accessible in regional languages.
8. Demonstrate the practical application of web development and cloud technologies to real-world agricultural challenges.

---

## 👨‍💻 Development and Contribution

FarmLink is developed as an academic and practical software project with an emphasis on real-world problem solving, modular development, and user-focused design.

Contributions, suggestions, and feedback are welcome.

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/baladithyamuthireddy-hub/FarmLink.git
   ```

2. Navigate to the project directory:

   ```bash
   cd FarmLink
   ```

3. Open the project in VS Code or another editor.

4. Configure the appropriate Firebase project settings.

5. Run the static web application using a local development server, such as the VS Code Live Server extension.

6. Test the farmer, dealer, and admin workflows using authorized demo accounts.

### Contributing

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Commit your changes with a meaningful message.
5. Submit a pull request describing your contribution.

Never commit private keys, service-account credentials, passwords, or other secrets.

---

## 📜 License

FarmLink is licensed under the **MIT License**.

You are free to use, copy, modify, distribute, and adapt this software, subject to the conditions of the license.

See the [LICENSE](LICENSE) file for the complete license terms.

---

## 🌾 FarmLink

**Building a more connected, transparent, and accessible agricultural marketplace.**

*Empowering Farmers. Connecting Dealers. Strengthening Agricultural Trade.*
