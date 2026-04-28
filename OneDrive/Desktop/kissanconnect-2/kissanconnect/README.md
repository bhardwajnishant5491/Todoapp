
# 🌾 KisanConnect

### The All-in-One Digital Platform for Secure, Transparent, and Efficient Contract Farming

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/) [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [What is KisanConnect?](#what-is-kisanconnect)
- [Key Features](#key-features)
- [User Flows & Dashboards](#user-flows--dashboards)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API & Smart Contract Flow](#api--smart-contract-flow)
- [UI/UX Principles](#uiux-principles)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 What is KisanConnect?

**KisanConnect** is a next-generation digital platform that empowers Indian farmers and buyers to create, manage, and fulfill contract farming agreements with complete trust, transparency, and efficiency. It replaces risky verbal or paper contracts with a secure, milestone-based digital system—featuring real-time chat, escrow payments, ratings, notifications, and full legal proof for every deal.

**Who is it for?**
- 👨‍🌾 **Farmers**: List crops, receive proposals, sign digital contracts, track payments, chat with buyers, and get paid securely.
- 🧑‍💼 **Buyers**: Browse crops, send proposals, sign contracts, pay in milestones, chat with farmers, and rate sellers.
- 🛡️ **Admins**: Oversee all activity, resolve disputes, block fraud, and ensure platform integrity.

**How is it different?**
- Hybrid smart contract system (cryptographic hash, timestamp, digital signature)
- No blockchain/gas fees—100% free for users
- End-to-end digital workflow: contract, payment, chat, rating, dispute, and proof
- Multi-language (English/Hindi) for rural accessibility

---

## 🔴 Problem Statement

### Current Challenges in Contract Farming:

1. **Lack of Trust** – Verbal agreements lead to disputes
2. **Price Manipulation** – Buyers change prices after harvest
3. **Payment Delays** – Farmers don't receive timely payments
4. **No Legal Proof** – Paper contracts get lost or forged
5. **Limited Market Access** – Farmers struggle to find buyers
6. **Information Asymmetry** – Buyers and farmers lack transparency

### Impact:

- 🚨 70% of farmers face payment issues
- 🚨 60% of contracts end in disputes
- 🚨 Middlemen exploit both parties

---

## ✨ Solution & Novelty

### How KisanConnect Solves This:

| Problem | KisanConnect Solution |
|---------|----------------------|
| Trust Issues | **Cryptographic Hash** locks contracts – cannot be altered |
| Price Changes | **Fixed Terms** stored in hash-verified contracts |
| Payment Delays | **Milestone Tracking** with automated alerts |
| Lost Documents | **Cloud Storage** with hash verification |
| Limited Reach | **Digital Marketplace** connects farmers nationwide |
| Disputes | **Admin-Mediated** resolution with contract proof |

### 🎖️ Novelty Factor

**Patent-Worthy Innovation** (As per your edited patent document):

- **Hash-based Contract Verification** – Each contract generates a unique SHA-256 hash
- **Tamper-Proof System** – Any modification invalidates the hash
- **Timestamp Locking** – Contracts are timestamped for legal validity
- **No Blockchain Overhead** – Achieves trust without expensive infrastructure

---


## 🌟 Key Features

### 🌱 Core Platform
- **Digital Contract Farming**: Create, sign, and manage contracts with cryptographic hash, timestamp, and digital signature—no blockchain needed.
- **Milestone-Based Escrow Payments**: Funds are locked and released only when both parties confirm delivery milestones.
- **Real-Time Chat**: Secure, role-based chat between farmers and buyers with safety warnings and admin monitoring.
- **Dispute Resolution**: Raise disputes, upload evidence, and get admin mediation with full contract proof.
- **Multi-Language Support**: Switch instantly between English and Hindi (more coming soon).
- **Notifications**: Real-time alerts for proposals, payments, contract status, and disputes.
- **Ratings & Reviews**: Both parties rate each other after every contract—builds trust and reputation.
- **Wallet System**: Track balance, locked funds, and all transactions. Add/withdraw money securely.
- **Downloadable Proof**: Every contract can be downloaded as a PDF with hash for legal evidence.

### 👨‍🌾 Farmer Dashboard
- List crops (type, quantity, price, harvest date, quality)
- Receive and review contract proposals
- Accept/reject with digital signature
- Track all contracts and payment milestones
- Chat with buyers (with safety modal)
- Rate buyers after completion
- Raise disputes and upload evidence
- View wallet, transaction history, and analytics

### 🧑‍💼 Buyer Dashboard
- Browse/search/filter crops
- Send proposals to farmers
- Sign contracts digitally
- Make milestone payments (escrow)
- Track delivery and contract status
- Chat with farmers
- Rate farmers after completion
- Raise disputes if needed
- View wallet, purchase history, and analytics

### 🛡️ Admin Dashboard
- View/manage all users, contracts, and disputes
- Verify contract authenticity (hash check)
- Mediate disputes and block fraud
- Platform analytics: payment delays, delivery rates, user risk, usage stats

### 💬 Chat & Communication
- Secure, role-based chat (buyer ↔ farmer)
- Chat warning modal for safety
- Admin can monitor/report abuse

### 💸 Payment System
- Milestone-based escrow (advance, delivery, final)
- Wallet for each user (add, withdraw, view locked funds)
- Payment release only after both parties confirm
- Full transaction history

### 🌐 Language & Accessibility
- English/Hindi toggle (top-right, always visible)
- All UI, forms, and notifications translated
- Large fonts, mobile-first, accessible for rural users

---

## 🧭 User Flows & Dashboards

### 👨‍🌾 Farmer Flow
1. Register/login → Complete profile
2. List crops (add details, upload images)
3. Receive proposals → Review terms
4. Accept/reject (digital signature)
5. Contract is locked (hash, timestamp)
6. Track payment milestones in wallet
7. Chat with buyer (secure, monitored)
8. Mark delivery, upload proof
9. Rate buyer, download contract proof
10. Raise dispute if needed

### 🧑‍💼 Buyer Flow
1. Register/login → Complete profile
2. Browse/search crops
3. Send proposal (set terms)
4. Sign contract (digital signature)
5. Pay advance (escrow)
6. Chat with farmer
7. Track delivery, confirm receipt
8. Release final payment
9. Rate farmer, download contract proof
10. Raise dispute if needed

### 🛡️ Admin Flow
1. Login to admin dashboard
2. View all users, contracts, disputes
3. Verify contract hashes
4. Mediate disputes, block users
5. View analytics and platform health

---

---


## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Farmer     │  │    Buyer     │  │    Admin     │      │
│  │     UI       │  │      UI      │  │      UI      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                    React.js + Tailwind CSS                 │
└─────────────────────────────────────────────────────────────┘
        │
      HTTPS REST API
        │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Express.js Server                         │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Auth     │  │  Contract  │  │  Payment   │    │   │
│  │  │ Controller │  │ Controller │  │ Controller │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │      Smart Contract Engine                  │   │   │
│  │  │  - Hash Generation (SHA-256)                │   │   │
│  │  │  - Timestamp Locking                        │   │   │
│  │  │  - Contract Verification                    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
        │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MongoDB Atlas (Cloud)                   │   │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │   │
│  │  │Users │  │Crops │  │Contra│  │Paymen│  │Disput│  │   │
│  │  │      │  │      │  │cts   │  │ts    │  │es    │  │   │
│  │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- React.js 18.x (UI Framework)
- Tailwind CSS 3.x (Responsive Styling)
- Framer Motion (Animations)
- React Router v6 (Navigation)
- Axios (API Calls)
- React Hook Form (Forms)
- React Toastify (Notifications)
- Chart.js / Recharts (Analytics)
- i18next + react-i18next (Multi-language)

### Backend
- Node.js 18.x (Runtime)
- Express.js 4.x (API Server)
- MongoDB Atlas (Database)
- Mongoose (ODM)
- JWT (Authentication)
- bcrypt (Password Hashing)
- crypto (SHA-256 Hash)
- express-validator (Validation)
- multer (File Uploads)
- nodemailer (Email)

### DevOps & Deployment
- Vercel (Frontend Hosting)
- Render (Backend Hosting)
- MongoDB Atlas (Database)
- GitHub (Version Control)
- GitHub Actions (CI/CD)
- Cloudinary (Image Storage)

---

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Farmer     │  │    Buyer     │  │    Admin     │      │
│  │     UI       │  │      UI      │  │      UI      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                    React.js + Tailwind CSS                   │
└─────────────────────────────────────────────────────────────┘
                            │
                     HTTPS REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Express.js Server                         │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Auth     │  │  Contract  │  │  Payment   │    │   │
│  │  │ Controller │  │ Controller │  │ Controller │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │      Smart Contract Engine                  │   │   │
│  │  │  - Hash Generation (SHA-256)                │   │   │
│  │  │  - Timestamp Locking                        │   │   │
│  │  │  - Contract Verification                    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MongoDB Atlas (Cloud)                   │   │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │   │
│  │  │Users │  │Crops │  │Contra│  │Paymen│  │Disput│  │   │
│  │  │      │  │      │  │cts   │  │ts    │  │es    │  │   │
│  │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
kissanconnect/
│
├── frontend/                      # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/           # Logo, illustrations
│   │   │   └── icons/            # Custom SVG icons
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx           # Main navigation
│   │   │   │   ├── Footer.jsx           # Footer component
│   │   │   │   ├── Loader.jsx           # Loading spinner
│   │   │   │   ├── ProtectedRoute.jsx   # Auth wrapper
│   │   │   │   └── ContractCard.jsx     # Reusable card
│   │   │   │
│   │   │   ├── farmer/
│   │   │   │   ├── FarmerDashboard.jsx
│   │   │   │   ├── CropListing.jsx
│   │   │   │   ├── ContractProposals.jsx
│   │   │   │   └── PaymentTracker.jsx
│   │   │   │
│   │   │   ├── buyer/
│   │   │   │   ├── BuyerDashboard.jsx
│   │   │   │   ├── CropBrowser.jsx
│   │   │   │   ├── ContractCreator.jsx
│   │   │   │   └── PaymentManager.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── UserManagement.jsx
│   │   │       ├── DisputeResolver.jsx
│   │   │       └── Analytics.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Landing page
│   │   │   ├── About.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── farmer/
│   │   │   │   └── FarmerProfile.jsx
│   │   │   ├── buyer/
│   │   │   │   └── BuyerProfile.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance
│   │   │   ├── authService.js      # Auth API calls
│   │   │   ├── cropService.js      # Crop API calls
│   │   │   └── contractService.js  # Contract API calls
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js          # Custom auth hook
│   │   │
│   │   ├── utils/
│   │   │   ├── formatDate.js       # Date formatting
│   │   │   └── validators.js       # Form validation
│   │   │
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── backend/                        # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── env.js             # Environment config
│   │   │
│   │   ├── models/
│   │   │   ├── User.js            # User schema (Farmer/Buyer/Admin)
│   │   │   ├── Crop.js            # Crop listing schema
│   │   │   ├── Contract.js        # Contract schema with hash
│   │   │   ├── Payment.js         # Payment milestone schema
│   │   │   └── Dispute.js         # Dispute schema
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js       # Login, Register, Logout
│   │   │   ├── cropController.js       # CRUD for crops
│   │   │   ├── contractController.js   # Contract operations + hash
│   │   │   ├── paymentController.js    # Payment tracking
│   │   │   └── adminController.js      # Admin operations
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── cropRoutes.js
│   │   │   ├── contractRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   └── adminRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js       # JWT verification
│   │   │   ├── roleMiddleware.js       # Role-based access
│   │   │   └── errorHandler.js         # Global error handling
│   │   │
│   │   ├── utils/
│   │   │   ├── hashGenerator.js        # SHA-256 hash logic
│   │   │   ├── timestamp.js            # Timestamp utilities
│   │   │   └── emailService.js         # Email notifications
│   │   │
│   │   ├── app.js                      # Express app setup
│   │   └── server.js                   # Server entry point
│   │
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── docs/                           # Documentation
│   ├── API.md                      # API documentation
│   ├── DEPLOYMENT.md               # Deployment guide
│   └── TESTING.md                  # Testing guide
│
├── .gitignore
├── README.md                       # This file
└── LICENSE

```

---

## 🚀 Installation & Setup

### Prerequisites

```bash
Node.js >= 18.x
npm >= 9.x
MongoDB Atlas Account (FREE)
Git
```

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/kissanconnect.git
cd kissanconnect
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (see [Environment Variables](#-environment-variables))

```bash
npm run dev
# Backend runs on http://localhost:5000
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### 4️⃣ Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Docs**: http://localhost:5000/api-docs (Swagger)

---

## 🔐 Environment Variables

### Backend `.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database (MongoDB Atlas - FREE Tier)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/kissanconnect?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email (Gmail SMTP - FREE)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Cloudinary (FREE Tier - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=KisanConnect
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/auth/logout` | Logout user | ✅ |

### Crop Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/crops` | Get all crops | ❌ |
| GET | `/api/crops/:id` | Get single crop | ❌ |
| POST | `/api/crops` | Create crop (Farmer) | ✅ |
| PUT | `/api/crops/:id` | Update crop | ✅ |
| DELETE | `/api/crops/:id` | Delete crop | ✅ |

### Contract Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contracts/create` | Create contract | ✅ |
| GET | `/api/contracts/:id` | Get contract details | ✅ |
| PUT | `/api/contracts/:id/accept` | Accept contract | ✅ |
| PUT | `/api/contracts/:id/reject` | Reject contract | ✅ |
| GET | `/api/contracts/:id/verify` | Verify contract hash | ✅ |
| GET | `/api/contracts/:id/pdf` | Download PDF | ✅ |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/create` | Record payment | ✅ |
| GET | `/api/payments/contract/:id` | Get payments | ✅ |
| PUT | `/api/payments/:id/confirm` | Confirm payment | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | Get all users | ✅ (Admin) |
| GET | `/api/admin/contracts` | Get all contracts | ✅ (Admin) |
| GET | `/api/admin/disputes` | Get disputes | ✅ (Admin) |
| PUT | `/api/admin/users/:id/block` | Block user | ✅ (Admin) |

**Full API documentation available at** `/docs/API.md`

---

## 🔒 Smart Contract Flow

### Contract Creation & Hashing Process

```javascript
// 1. Farmer lists crop
Crop {
  type: "Wheat",
  quantity: 1000,
  price: 2500,
  harvestDate: "2026-05-15"
}

// 2. Buyer sends proposal
Proposal {
  cropId: "crop_123",
  buyerId: "buyer_456",
  terms: {...}
}

// 3. Farmer accepts → Contract Created
Contract {
  cropId: "crop_123",
  farmerId: "farmer_789",
  buyerId: "buyer_456",
  terms: {
    quantity: 1000,
    pricePerUnit: 2500,
    totalAmount: 2500000,
    deliveryDate: "2026-06-01",
    paymentSchedule: [
      { milestone: "advance", amount: 750000, date: "2026-04-01" },
      { milestone: "delivery", amount: 1750000, date: "2026-06-01" }
    ]
  },
  timestamp: "2026-04-01T10:30:00Z"
}

// 4. Generate SHA-256 Hash
const contractString = JSON.stringify(Contract);
const hash = crypto.createHash('sha256').update(contractString).digest('hex');

// 5. Store Hash + Lock Contract
Contract {
  ...allFields,
  contractHash: "a3f7b8c9d2e1f4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
  isLocked: true,
  isActive: true
}

// 6. Verification (Anytime)
const currentHash = crypto.createHash('sha256').update(JSON.stringify(Contract)).digest('hex');
if (currentHash === Contract.contractHash) {
  console.log("✅ Contract is authentic and unmodified");
} else {
  console.log("❌ Contract has been tampered with!");
}
```

### Why This Works:

- **Immutable**: Any change invalidates the hash
- **Verifiable**: Anyone can verify the contract
- **Timestamped**: Proves when the contract was created
- **No Blockchain Needed**: Uses standard crypto library
- **Free**: No gas fees or mining costs

---

## 🎨 UI/UX Design Principles

### Design Philosophy: **Farmer-First, Simple, Beautiful**

#### 1️⃣ Visual Design

```
Color Palette (Farming-themed):
- Primary: #10B981 (Green - represents crops)
- Secondary: #F59E0B (Amber - represents harvest)
- Accent: #3B82F6 (Blue - represents trust)
- Background: #F9FAFB (Light gray)
- Text: #1F2937 (Dark gray)
```

#### 2️⃣ Typography

- **Headings**: Poppins (Bold, Modern)
- **Body**: Inter (Clean, Readable)
- **Font Sizes**: Large and accessible for rural users

#### 3️⃣ Icons & Illustrations

- Custom farming-themed icons
- Hand-drawn illustrations for empty states
- Lottie animations for loading states

#### 4️⃣ Mobile-First

- Fully responsive design
- Touch-friendly buttons (min 44px)
- Works on 2G networks (optimized images)

#### 5️⃣ Accessibility

- High contrast ratios (WCAG AA compliant)
- Keyboard navigation support
- Screen reader friendly
- Multi-language support (English, Hindi, Regional)

#### 6️⃣ Farmer-Friendly Features

- **Simple Language**: No technical jargon
- **Visual Guidance**: Step-by-step wizards
- **Voice Input**: For crop listing (future)
- **Offline Mode**: Basic viewing works offline
- **SMS Notifications**: For users without smartphones

---

## 🧪 Testing

### Unit Testing (Backend)

```bash
cd backend
npm test
```

**Tools**: Jest, Supertest

### Integration Testing (API)

```bash
# Import Postman collection from /docs/postman-collection.json
```

### Frontend Testing

```bash
cd frontend
npm run test
```

**Tools**: Vitest, React Testing Library

### Manual Testing Checklist

- [ ] User registration & login
- [ ] Crop listing creation
- [ ] Contract proposal
- [ ] Contract acceptance
- [ ] Hash verification
- [ ] Payment tracking
- [ ] Dispute creation
- [ ] Admin panel operations

---

## 🚀 Deployment

### 🌐 Frontend Deployment (Vercel - FREE)

```bash
cd frontend
npm run build

# Deploy to Vercel
npx vercel --prod
```

**Alternative**: Netlify (also FREE)

### ⚙️ Backend Deployment (Render - FREE)

1. Create account on [render.com](https://render.com)
2. Connect GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Add all from `.env`

### 💾 Database (MongoDB Atlas - FREE)

1. Create FREE cluster (512MB)
2. Whitelist IPs: `0.0.0.0/0` (allow all)
3. Create database user
4. Get connection string

**Total Cost: $0/month** ✅

---

## 🔮 Future Enhancements

### Phase 2 (Next 6 months)

- [ ] Mobile App (React Native)
- [ ] SMS Notifications (Twilio FREE tier)
- [ ] Payment Gateway Integration (Razorpay/Stripe)
- [ ] AI-based Price Prediction
- [ ] Weather Integration (OpenWeather API)
- [ ] Multi-language Support (i18n)

### Phase 3 (Next 12 months)

- [ ] Voice Commands (for illiterate farmers)
- [ ] Offline-First PWA
- [ ] Government Scheme Integration
- [ ] Crop Insurance Integration
- [ ] Logistics & Transportation Tracking
- [ ] Video KYC for verification

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use ESLint & Prettier
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

**Your Name** - [GitHub](https://github.com/yourusername) | [LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Capstone Project Guide: [Guide Name]
- Institution: [Your College Name]
- Special Thanks: All farmers who inspired this project

---

## 📞 Support

For support, email: support@kissanconnect.com  
Or raise an issue on GitHub

---

## 📊 Project Status

**Current Version**: 1.0.0 (In Development)  
**Target Launch**: May 2026  
**Status**: 🟡 Development Phase

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for Indian Farmers**

</div>
