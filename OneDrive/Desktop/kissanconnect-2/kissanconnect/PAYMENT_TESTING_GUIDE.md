# 🧪 Payment System Testing Guide

Complete step-by-step guide to test all payment features in KisanConnect.

---

## 📋 Prerequisites

### 1. Start Backend Server
```bash
cd backend
npm start
```
**Expected Output:**
```
✅ MongoDB Connected
✅ Server running on port 5000
✅ Socket.IO initialized
╔══════════════════════════════════╗
║  Developer: Shivraj Singh Chundawat  ║
╚══════════════════════════════════╝
```

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
**Expected Output:**
```
VITE ready in 500ms
➜ Local: http://localhost:5173/
```

### 3. Create Test Accounts

**Create 3 Users:**
1. **Admin** (email: admin@test.com, password: admin123)
2. **Farmer** (email: farmer@test.com, password: farmer123)
3. **Buyer** (email: buyer@test.com, password: buyer123)

---

## 🎬 Test Scenarios

### **Test 1: Demo Payment Gateway - Wallet Deposit**

**Goal:** Test instant fund addition to wallet

#### Steps:
1. Login as **Buyer** (buyer@test.com)
2. Navigate to **Wallet** page (sidebar)
3. Check initial balance (should be ₹0 or existing balance)
4. Click **"Add Funds"** button
5. Enter amount: `1000`
6. Click **"Add Funds"** button in modal

#### ✅ Expected Results:
- Modal shows: "Demo Payment Gateway - Funds will be added instantly"
- Toast notification: "Deposit successful"
- Balance increases by ₹1000
- Transaction appears in history with:
  - Type: **Deposit**
  - Amount: **+₹1,000**
  - Status: **Completed** (green badge)
  - Description: "Wallet deposit of ₹1000"
  - Transaction ID: `DEMO{timestamp}{random}`

#### 🔍 Backend Check:
```bash
# Check terminal logs
✅ Wallet deposit: User {buyer_id} deposited ₹1000
```

---

### **Test 2: Contract Payment - Escrow System**

**Goal:** Test fund locking when buyer accepts contract

#### Setup:
1. Login as **Farmer**
2. Add a crop:
   - Type: Wheat
   - Quantity: 100
   - Unit: quintal
   - Price: ₹2000/quintal
   - Total: ₹2,00,000
   - Status: Available
3. Logout

#### Steps:
1. Login as **Buyer**
2. Add funds: ₹250,000 (enough for contract + testing)
3. Navigate to **Browse Crops**
4. Find the wheat listing
5. Click **"View Details & Send Proposal"**
6. Fill proposal form:
   - Quantity: 100
   - Price: ₹2000
   - Delivery Date: (any future date)
   - **Payment System:** Shows "🔒 Secure Escrow Payment" info box (read-only)
   - Delivery Address: (fill all fields)
7. Click **"Send Proposal"**
8. **Notice:** Payment terms is automatically set to "Escrow Payment (100% Secured)"
9. Logout

#### Farmer Accepts Contract:
9. Login as **Farmer**
10. Go to **Contracts** page
11. Find pending contract from buyer
12. Click **"Accept"** button
13. Confirm acceptance

#### ✅ Expected Results (Acceptance):
- Toast: "Contract accepted successfully"
- Notification: "₹200,000 locked in escrow"
- Contract status: **Accepted**
- Buyer's wallet:
  - Balance: ₹250,000 (unchanged)
  - Locked Balance: ₹200,000
  - Available Balance: ₹50,000
- Transaction created:
  - Type: **Contract Advance**
  - Status: **Pending**
  - Amount: ₹200,000
  - Description: "Escrow for Contract #{id}"
- **NEW: Farmer sees "Start Delivery / In Progress" button**

#### 🔍 Backend Check:
```bash
✅ Contract accepted: Buyer funds locked - ₹200,000
✅ Escrow transaction created: {transaction_id}
```

#### ⚠️ Test Insufficient Balance:
1. Create new buyer with ₹10,000 balance
2. Try to accept ₹200,000 contract
3. **Expected:** Error message: "Insufficient wallet balance"

---

### **Test 3: Contract Delivery Flow - NEW! ✨**

**Goal:** Test proper delivery and buyer confirmation before payment release

#### Part 1: Farmer Starts Delivery (Accepted → In Progress)
1. Login as **Farmer**
2. Navigate to **Contracts**
3. Find **Accepted** contract
4. Click **"Start Delivery / In Progress"** button
5. **Expected:**
   - Toast: "Contract moved to In Progress"
   - Contract status: **In Progress**
   - Button changes to: **"Mark as Delivered"**

#### Part 2: Farmer Marks as Delivered (In Progress → Delivered)
1. Still as **Farmer**
2. On same contract, click **"Mark as Delivered"**
3. Confirm: "Mark this order as delivered? Buyer will need to confirm receipt."
4. **Expected:**
   - Toast: "Marked as delivered! Waiting for buyer confirmation."
   - Contract status: **Delivered**
   - Shows: "⏳ Waiting for Buyer Confirmation" message
   - **NO PAYMENT YET** - Escrow still locked!
   - Buyer receives notification: "Order Delivered - Please confirm receipt"

#### Part 3: Buyer Confirms Receipt (Delivered → Completed) - **PAYMENT RELEASED! 💰**
1. Logout → Login as **Buyer**
2. Navigate to **Contracts**
3. Find **Delivered** contract
4. See purple notification box: "Order Delivered! Farmer has marked this order as delivered."
5. Click **"Confirm Receipt & Release Payment"** button
6. Confirm: "Confirm that you have received the order? Payment will be released to the farmer."
7. **Expected:**
   - Toast: "Order confirmed! Payment released to farmer."
   - Contract status: **Completed**

#### ✅ Expected Results (Payment Release on Buyer Confirmation):
**Buyer Side:**
- Balance: ₹250,000 → ₹50,000 (deducted)
- Locked Balance: ₹200,000 → ₹0 (unlocked and deducted)
- Available Balance: ₹50,000 (unchanged)

**Farmer Side:**
- Balance increases by: **₹192,000** (96% of ₹200,000)
- Calculation: ₹200,000 - (₹200,000 × 0.04) = ₹192,000
- Notification: "₹192,000 credited (After 4% commission)"

**Transactions Created (3 total):**

1. **Escrow Transaction Updated:**
   - Status: **Completed**
   - Type: Contract Advance
   
2. **Farmer Payment:**
   - Type: **Contract Payment**
   - Amount: **+₹192,000**
   - Status: **Completed**
   - Description: "Payment for Contract #{id}"
   - User: Farmer
   
3. **Platform Commission:**
   - Type: **Commission**
   - Amount: **₹8,000** (4% of ₹200,000)
   - Status: **Completed**
   - Description: "Platform commission (4%)"
   - Metadata: {platformCommission: 8000}

#### 🔍 Backend Check:
```bash
✅ Contract status updated: Accepted → In Progress → Delivered → Completed
✅ Buyer confirmed receipt
✅ Buyer deducted: ₹200,000
✅ Farmer credited: ₹192,000
✅ Platform commission: ₹8,000
```

---

### **Test 3B: Proper Status Flow Verification**

**Goal:** Verify status can only progress in correct order

#### Test Invalid Status Transitions:
1. **Try to complete without delivery:**
   - Contract status: In Progress
   - Buyer tries to mark "Completed"
   - **Expected Error:** "Contract must be delivered first"

2. **Try farmer to mark complete:**
   - Contract status: Delivered
   - Farmer tries to mark "Completed"
   - **Expected Error:** "Only buyer can confirm receipt and complete the contract"

3. **Try to skip In Progress:**
   - Contract status: Accepted
   - Try to mark "Delivered" directly
   - **Expected:** Button not available (only "Start Delivery" shows)

---

### **Test 4: Contract Cancellation - Refund**

**Goal:** Test fund unlock and refund on cancellation

#### Setup:
1. Create new contract (Farmer + Buyer)
2. Buyer adds ₹50,000
3. Contract: ₹30,000 (Farmer accepts)
4. Buyer's locked balance: ₹30,000

#### Steps:
1. Login as **Farmer** or **Buyer**
2. Navigate to **Contracts**
3. Find **Accepted** or **In Progress** contract
4. Click **"Cancel Contract"**
5. Enter reason: "Quality issues"
6. Confirm cancellation

#### ✅ Expected Results:
- Contract status: **Cancelled**
- Buyer's wallet:
  - Locked Balance: ₹0
  - Available Balance: ₹50,000 (funds returned)
- Notification: "Funds unlocked due to cancellation"

**Transactions Created (2 total):**

1. **Escrow Transaction Updated:**
   - Status: **Cancelled**
   
2. **Refund Transaction:**
   - Type: **Refund**
   - Amount: **+₹30,000**
   - Status: **Completed**
   - User: Buyer
   - Description: "Refund for cancelled contract"

#### 🔍 Backend Check:
```bash
✅ Contract cancelled: #{contract_id}
✅ Buyer funds unlocked: ₹30,000
✅ Refund transaction created
```

---

### **Test 5: Withdrawal Request - Admin Approval**

**Goal:** Test withdrawal request and admin processing

#### Part A: Request Withdrawal

1. Login as **Farmer** (must have balance > ₹100)
2. Navigate to **Wallet** page
3. Note current balance: e.g., ₹192,000
4. Click **"Withdraw"** button
5. Enter amount: `50000`
6. Add bank details (if not added):
   - Account Number: 1234567890
   - IFSC Code: SBIN0001234
   - Bank Name: State Bank of India
   - Account Holder: Farmer Name
7. Click **"Request Withdrawal"**

#### ✅ Expected Results:
- Toast: "Withdrawal request submitted"
- Transaction created:
  - Type: **Withdrawal**
  - Amount: **-₹50,000**
  - Status: **Pending**
  - Metadata: Contains bank details
- Farmer's balance unchanged (pending approval)

#### Part B: Admin Approval

8. Logout → Login as **Admin**
9. Navigate to **Withdrawals** page (sidebar)
10. Check stats:
    - Pending: 1
    - Total Pending Amount: ₹50,000
11. Find farmer's withdrawal in table
12. Click **"Approve"** button
13. (Optional) Add notes: "Processed via NEFT"
14. Click **"Confirm"**

#### ✅ Expected Results:
- Toast: "Withdrawal processed successfully"
- Transaction updated:
  - Status: **Completed**
  - ProcessedBy: Admin user ID
  - ProcessedAt: Current timestamp
  - Notes: "Processed via NEFT"
- Farmer's balance: ₹192,000 - ₹50,000 = ₹142,000
- Farmer receives notification: "Withdrawal approved"

#### 🔍 Test Rejection:
1. Submit another withdrawal
2. Admin clicks **"Reject"**
3. Add notes: "Invalid bank details"
4. **Expected:**
   - Status: **Failed**
   - Farmer's balance: Unchanged
   - Notification: "Withdrawal rejected"

---

### **Test 6: Minimum Balance Validation**

#### Test Deposit Limits:
1. Try deposit < ₹10 → Error: "Minimum deposit ₹10"
2. Try deposit > ₹100,000 → Error: "Maximum deposit ₹1,00,000"

#### Test Withdrawal Limits:
1. Try withdraw < ₹100 → Error: "Minimum withdrawal ₹100"
2. Try withdraw > available balance → Error: "Insufficient balance"

---

## 📊 Database Verification (Optional)

### Check MongoDB Collections:

```javascript
// Users collection
db.users.findOne({email: "buyer@test.com"})
// Check: wallet.balance, wallet.lockedBalance, wallet.transactions

// Transactions collection
db.transactions.find({type: "deposit"})
db.transactions.find({type: "contract_advance"})
db.transactions.find({type: "commission"})

// Contracts collection
db.contracts.findOne({_id: ObjectId("...")})
// Check: escrowTransactionId, totalAmount, status
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Crop is not available for contract"
**Solution:** Crop status must be "Available" - check [CropDetails.jsx](frontend/src/pages/buyer/CropDetails.jsx)

### Issue 2: Locked balance not showing
**Solution:** Check `User.getAvailableBalance()` method in backend

### Issue 3: Commission not deducted
**Solution:** Check [contractController.js](backend/src/controllers/contractController.js) line ~390

### Issue 4: Admin can't see withdrawals
**Solution:** Ensure admin route `/api/admin/withdrawals` is working

### Issue 5: Socket notifications not working
**Solution:** Check backend logs for Socket.IO connection

---

## 📸 Expected Screenshots

### 1. Wallet Deposit Success
- ✅ Balance updated
- ✅ Transaction in history
- ✅ Green success toast

### 2. Contract Escrow
- ✅ Locked balance shown
- ✅ Available balance reduced
- ✅ Escrow transaction created

### 3. Commission Deduction
- ✅ Farmer receives 96%
- ✅ 3 transactions created
- ✅ Contract status: Completed

### 4. Admin Withdrawal Panel
- ✅ Stats dashboard
- ✅ Pending withdrawals table
- ✅ Approve/Reject buttons

---

## 🎯 Complete Test Checklist

### Wallet Features
- [ ] Deposit ₹1000 - Success
- [ ] Deposit ₹5 - Error (min ₹10)
- [ ] Deposit ₹200,000 - Error (max ₹100,000)
- [ ] View transaction history
- [ ] Real-time notification on deposit

### Contract Payment Flow
- [ ] Accept contract - Funds locked
- [ ] Check locked balance
- [ ] Complete contract - 4% commission deducted
- [ ] Farmer receives 96% of amount
- [ ] 3 transactions created
- [ ] Cancel contract - Refund issued

### Withdrawal System
- [ ] Request withdrawal - Status: Pending
- [ ] Admin views in withdrawal panel
- [ ] Admin approves - Status: Completed
- [ ] Admin rejects - Status: Failed
- [ ] Balance deducted only on approval

### Edge Cases
- [ ] Insufficient balance error
- [ ] Crop unavailable error
- [ ] Minimum withdrawal validation
- [ ] Bank details required validation

---

## 🚀 Quick Test Script

Run this sequence for full system test (15 minutes):

1. **Setup (2 min):** Create 3 accounts (Admin, Farmer, Buyer)
2. **Deposit (1 min):** Buyer adds ₹250,000
3. **Crop (2 min):** Farmer lists wheat ₹200,000
4. **Contract (3 min):** Buyer sends proposal → Farmer accepts
5. **Check Escrow (1 min):** Verify locked balance
6. **Complete (2 min):** Farmer marks complete
7. **Verify Commission (2 min):** Check 3 transactions
8. **Withdrawal (2 min):** Farmer requests → Admin approves

---

## 📞 Support

If any test fails, check:
1. Backend terminal logs
2. Browser console (F12)
3. Network tab for API responses
4. MongoDB collections

---

**Created by:** Shivraj Singh Chundawat  
**Email:** singhshivraj1408@gmail.com  
**Institution:** Lovely Professional University  
**Batch:** 2022-2026
