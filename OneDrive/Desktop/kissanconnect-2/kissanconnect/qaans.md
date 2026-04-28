# Codebase Q&A Analysis (KisanConnect)

This file answers your questions based on the current implementation in the repository.

## 1) What payment gateway is used? (Razorpay, Stripe, PayPal, or simulated?)

**Current implementation: simulated/demo gateway.**

- Wallet deposit route is explicitly marked as demo (`/api/wallet/deposit` comment: "Demo payment gateway").
- Wallet controller creates demo transaction IDs like `DEMO...` and stores `paymentGateway: 'demo'`.
- Backend `paymentRoutes.js` is currently a placeholder (`"Coming soon"`).
- `Transaction` schema supports values like `razorpay` and `stripe`, but active flow uses `demo`.
- Frontend has a dedicated `PaymentSimulation` page with text: "Simulation only... No real money transfer occurs."

So: **no live Razorpay/Stripe/PayPal integration is active right now**.

## 2) How does chat work? (Socket.io real-time or polling?)

**Chat is hybrid: REST + Socket.IO real-time push.**

- Message send/history/unread/read are handled via REST endpoints:
  - `POST /api/chat/send`
  - `GET /api/chat/conversations`
  - `GET /api/chat/conversation/:userId`
  - `GET /api/chat/unread-count`
  - `PUT /api/chat/mark-read/:userId`
- Backend server runs Socket.IO (`io.on('connection')`) and tracks connected users in `connectedUsers` map.
- On message send, backend emits `new_message` to receiver socket if online.
- Frontend `SocketContext` listens to socket events and dispatches custom browser events (`newChatMessage`, etc.).
- `Chat.jsx` subscribes to `newChatMessage` and updates UI instantly.

There is **no recurring HTTP polling loop for chat messages**; real-time updates are event-driven via Socket.IO.

## 3) What does the database schema look like at a high level?

Database is MongoDB with Mongoose models. High-level collections:

- `users`
  - Identity and auth fields, role (`farmer|buyer|admin`), profile, address
  - Farmer/buyer specific fields (farm size, company, GST)
  - Bank details
  - Wallet object (`balance`, `lockedAmount`)
  - Legal acceptance fields
  - Rating aggregates (`averageRating`, `totalRatings`)

- `crops`
  - Crop listing details (type, quantity, unit, price, quality, harvest date)
  - Location and images
  - Seller references (`farmerId`, contact snapshot)
  - Status and listing metrics

- `contracts`
  - Links `cropId`, `farmerId`, `buyerId`
  - Quantity, price, total, delivery details, terms
  - Lifecycle status (`Pending` to `Completed/Cancelled`)
  - Payment tracking (`paymentStatus`, `amountPaid`, `escrowTransactionId`)
  - Ratings/reviews, hash lock metadata, admin intervention state

- `messages`
  - `conversationId`, sender/receiver refs, optional `contractId`
  - Message text/type, read status, timestamps

- `transactions`
  - Wallet and contract financial entries (deposit, withdrawal, contract payment, refund, commission, etc.)
  - Status, amount, before/after balances
  - Gateway metadata (`paymentGateway`, `gatewayTransactionId`, response)

- `ratings`
  - Who rated whom, contract/crop refs, star rating + review
  - Category sub-scores (communication/quality/timeliness)

- `disputes`
  - Contract/user references, issue type, title/description, evidence
  - Workflow state, admin assignment, threaded dispute messages, resolution info

- `support`
  - Ticketing collection with generated `ticketId`, category, priority, status
  - Admin assignment and response thread

- `adminsettings`
  - Platform-level controls (fees, SLA, withdrawal limits, support contacts, toggles)

- `auditlogs`
  - Admin/audit trail entries for contract/dispute/withdrawal actions
  - Actor and metadata for compliance tracing

## 4) How does multi-lingual switching work?

**Using `i18next` + `react-i18next` with local JSON translation files.**

- Libraries used:
  - `i18next`
  - `react-i18next`
  - `i18next-browser-languagedetector`
- Translation resources are local files:
  - `src/i18n/locales/en.json`
  - `src/i18n/locales/hi.json`
- Language preference is persisted in `localStorage` (`language` key).
- `LanguageSwitcher` toggles between `en` and `hi` using `i18n.changeLanguage(...)`.

No Google Translate API usage was found in the implementation.

## 5) Third-party libraries/APIs worth mentioning

Backend notable dependencies/integrations:

- `mongoose` (MongoDB ODM)
- `jsonwebtoken` (auth tokens)
- `bcryptjs` (password hashing)
- `socket.io` (real-time events)
- `cloudinary` (profile image upload/storage)
- `multer` (file upload handling)
- `nodemailer` (transactional emails)
- `helmet`, `cors`, `express-validator` (security/validation)
- `pdfkit` (PDF generation)

Frontend notable dependencies:

- `react`, `react-router-dom`
- `axios` (API client)
- `socket.io-client` (real-time client)
- `i18next`, `react-i18next`
- `framer-motion`, `aos` (animations)
- `react-hook-form` (forms)
- `react-toastify`, `react-hot-toast` (notifications)
- `recharts` (charts/analytics)
- `tailwindcss` (styling)

## 6) How many modules/pages does frontend have approximately?

Approximate current counts from `frontend/src`:

- **Page files:** `30`
  - root pages: `10`
  - admin pages: `9`
  - auth pages: `2`
  - buyer pages: `5`
  - farmer pages: `4`
- **Component files:** `27`
- **Service modules:** `10`
- **Context modules:** `2`
- **Route declarations in App router:** about `33` paths (including wildcard route)

So a fair summary is: **roughly 30 pages and 40+ feature modules when combining components/services/context.**

---

If you want, I can also generate a one-page architecture diagram (API, Socket, DB, and frontend modules) in Mermaid format.
