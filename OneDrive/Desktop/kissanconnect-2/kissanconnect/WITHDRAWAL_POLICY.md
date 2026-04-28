# 💰 Withdrawal System - Policy & Implementation Guide

**Last Updated:** February 6, 2026  
**Status:** Active & Working

---

## 📋 WITHDRAWAL POLICY

### Minimum Withdrawal Amount
- **₹100** is the minimum amount you can withdraw
- This prevents excessive small transactions and reduces processing costs

### Eligibility Requirements

To withdraw funds, you MUST have:

1. ✅ **Verified Bank Details**
   - Bank account added in Settings
   - Account verified by admin
   - All details (Account Number, IFSC, Name) must match

2. ✅ **Sufficient Available Balance**
   - Minimum ₹100 available (not locked)
   - Available Balance = Total Balance - Locked Amount

3. ✅ **Unlocked Funds Only**
   - Funds locked in active contracts/escrow CANNOT be withdrawn
   - Locked funds are released only when:
     - Buyer confirms delivery (Farmer gets paid)
     - Contract is rejected/cancelled (Buyer gets refund)

---

## 🔒 WHAT FUNDS ARE LOCKED?

### Farmer's Locked Funds:
❌ **Cannot withdraw while funds are locked**

Funds get locked when:
- You have PENDING withdrawal requests
- You received payment but haven't delivered yet

### Buyer's Locked Funds:
❌ **Cannot withdraw while funds are locked**

Funds get locked when:
- You sent a contract proposal (buyer's wallet debited, locked in escrow)
- Farmer accepted contract (payment in escrow waiting for delivery)
- Contract status is "Accepted" or "In Progress"

Funds get UNLOCKED when:
- You confirm delivery → Farmer gets paid
- Contract is rejected → Your wallet gets refunded
- Contract is cancelled → Your wallet gets refunded

---

## 💵 AVAILABLE VS LOCKED BALANCE

### Balance Calculation:
```
Total Balance = All money in your wallet
Locked Amount = Money held in escrow/pending withdrawals
Available Balance = Total Balance - Locked Amount

Example:
Total Balance: ₹5,000
Locked Amount: ₹2,000 (in escrow for active order)
Available Balance: ₹3,000 ← You can withdraw this
```

### Withdrawal Button States:

#### ✅ **Enabled (Green)** - You can withdraw
- Bank details verified ✓
- Available balance ≥ ₹100 ✓
- Click to request withdrawal

#### ❌ **Disabled (Grey)** - Cannot withdraw yet  
Shows reason:
- "Please add and verify bank details in Settings"
- "Minimum withdrawal is ₹100. Available: ₹X"
- "(₹X locked in active orders)"

---

## 🔄 WITHDRAWAL PROCESS

### Step 1: Request Withdrawal
1. Go to **Wallet** page
2. Check **Available Balance** (must be ≥ ₹100)
3. Click **"Withdraw"** button
4. Enter amount (₹100 to available balance)
5. Submit request

### Step 2: Admin Approval
- Your withdrawal request goes to **Admin Dashboard**
- Funds are **immediately locked** (can't be used)
- Status shows as **"Pending"**
- Processing time: **1-2 business days**

### Step 3: Payment Processing
- Admin reviews and approves withdrawal
- Money transferred to your bank account
- Status changes to **"Completed"**
- You receive notification

### Step 4: Confirmation
- Check your bank account (1-2 days)
- Transaction marked as "Completed" in Wallet history

---

## ⚠️ WITHDRAWAL RESTRICTIONS

### Cannot Withdraw If:

1. **❌ Bank Not Verified**
   ```
   Error: "Bank details not verified. Please add and verify 
   your bank details first."
   
   Solution: Go to Settings → Add bank details → 
   Wait for admin verification
   ```

2. **❌ Insufficient Balance**
   ```
   Error: "Insufficient available balance. Available: ₹X"
   
   Reason: You have ₹X available, but minimum is ₹100
   ```

3. **❌ Funds Locked in Contracts**
   ```
   Error: "Cannot withdraw locked funds"
   
   Reason: Money is in escrow for active orders.
   Wait for: Buyer confirms delivery OR Contract cancelled
   ```

4. **❌ Pending Withdrawal Exists**
   ```
   Error: "You already have a pending withdrawal request"
   
   Solution: Wait for admin to process current request first
   ```

---

## 🎯 COMMON SCENARIOS

### Scenario 1: Farmer Wants to Withdraw After Delivery
```
Initial State:
- Total Balance: ₹10,000
- Locked: ₹5,000 (payment for delivered order)
- Available: ₹5,000

Action: Buyer confirms delivery
Result:
- Total Balance: ₹10,000
- Locked: ₹0 (funds released)
- Available: ₹10,000 ✅ Can withdraw ₹10,000 now!
```

### Scenario 2: Buyer Wants to Withdraw During Active Order
```
Initial State:
- Total Balance: ₹8,000
- Locked: ₹3,000 (in escrow for pending delivery)
- Available: ₹5,000

Action: Try to withdraw ₹6,000
Result: ❌ Error - Only ₹5,000 available

Action: Try to withdraw ₹4,500
Result: ✅ Success - Request sent to admin
New Available: ₹500 (₹4,500 locked for withdrawal)
```

### Scenario 3: New User Without Bank Details
```
State:
- Total Balance: ₹2,000
- Bank Details: Not added ❌

Action: Click Withdraw button
Result: 
❌ Button disabled
Message: "Please add and verify bank details in Settings"

Solution:
1. Go to Settings
2. Add bank details
3. Wait for admin verification
4. Come back to Wallet and withdraw
```

---

## 📊 WITHDRAWAL LIMITS

| Tier | Min Withdrawal | Max Per Request | Processing Time |
|------|---------------|-----------------|-----------------|
| All Users | ₹100 | Available Balance | 1-2 business days |

**Future Plans** (from FUTURE_ENHANCEMENTS.md):
- Gold Verified users: Instant withdrawal for amounts < ₹1 lakh
- Higher trust score: Faster processing
- VIP users: Same-day processing

---

## 🔔 NOTIFICATIONS

You will receive notifications for:

### ✅ Withdrawal Requested
```
Type: Info (Blue)
Title: "Withdrawal Requested"
Message: "Your withdrawal request of ₹X is pending approval"
When: Immediately after submitting request
```

### ✅ Withdrawal Approved
```
Type: Success (Green)
Title: "Withdrawal Approved"
Message: "₹X has been transferred to your bank account"
When: Admin approves
```

### ❌ Withdrawal Rejected
```
Type: Error (Red)
Title: "Withdrawal Rejected"
Message: "Reason: [Admin's reason]"
When: Admin rejects (rare)
```

---

## 💬 NEW: CHAT MESSAGE NOTIFICATIONS

**Just Implemented!**

When someone sends you a message in chat:

### Notification Dropdown
```
Type: Message (Purple icon)
Title: "New Message"
Message: "[Name] sent you a message"
Link: Opens chat with that user
When: Real-time (instant)
```

### Where You'll See It:
1. **Notification Bell** - Badge shows count
2. **Notification Dropdown** - Click bell to see message
3. **Browser Notification** - If enabled
4. **Chat Page** - Real-time message appears

---

## 🛠️ TECHNICAL DETAILS

### Backend Validation (walletController.js)

```javascript
// Minimum amount check
if (amount < 100) {
  return res.status(400).json({ 
    message: 'Minimum withdrawal amount is ₹100' 
  });
}

// Bank verification check
if (!user.bankDetails || !user.bankDetails.isVerified) {
  return res.status(400).json({ 
    message: 'Bank details not verified' 
  });
}

// Available balance check
if (!user.canWithdraw(amount)) {
  return res.status(400).json({ 
    message: `Insufficient available balance. Available: ₹${user.getAvailableBalance()}` 
  });
}
```

### User Model Methods

```javascript
// Check if user can withdraw a specific amount
canWithdraw(amount) {
  return this.getAvailableBalance() >= amount;
}

// Calculate available balance
getAvailableBalance() {
  return this.wallet.balance - this.wallet.lockedAmount;
}

// Lock funds (for withdrawal/escrow)
lockFunds(amount) {
  this.wallet.lockedAmount += amount;
  this.wallet.lastUpdated = Date.now();
}

// Release locked funds
releaseFunds(amount) {
  this.wallet.lockedAmount = Math.max(0, this.wallet.lockedAmount - amount);
  this.wallet.lastUpdated = Date.now();
}
```

---

## 🎨 UI IMPROVEMENTS (Just Added!)

### Before:
- Withdraw button disabled (grey)
- No explanation why it's disabled
- User confused

### After (NOW):
- Withdraw button disabled (grey) when can't withdraw
- **Yellow info box** appears explaining WHY:
  - "⚠️ Withdrawal disabled: Please add and verify bank details"
  - "⚠️ Withdrawal disabled: Minimum withdrawal is ₹100. Available: ₹X"
  - "(₹X locked in active orders)" if applicable
- Click disabled button shows **toast error** with clear message
- Button automatically **redirects to Settings** if bank not verified

---

## 📈 WITHDRAWAL STATISTICS

### In Wallet Page:
```
Statistics Section Shows:
━━━━━━━━━━━━━━━━━━━━━━━━
Total Deposits:     ₹50,000
Total Withdrawals:  ₹30,000
Total Transactions: 45
Success Rate:       97.8%
```

### Transaction History:
- **Type**: Withdrawal
- **Amount**: ₹2,500
- **Status**: Pending / Completed / Failed
- **Date**: Feb 6, 2026, 3:45 PM
- **Transaction ID**: WD123456789

---

## 🚀 FUTURE ENHANCEMENTS

From [FUTURE_ENHANCEMENTS.md](./FUTURE_ENHANCEMENTS.md):

### Phase 1: Trust-Based Withdrawals
- **Gold Verified** users: Instant withdrawal up to ₹1 lakh
- **Silver users**: 24-hour processing
- **Bronze users**: 48-hour processing
- **New users**: 72-hour processing

### Phase 2: Lower Fees for Loyal Users
- 100+ transactions: ₹50 minimum withdrawal
- Gold tier: Free withdrawals
- Others: ₹10 processing fee per withdrawal

### Phase 3: Multiple Payment Methods
- Bank transfer (current)
- UPI instant transfer
- Digital wallets (Paytm, PhonePe)
- Cryptocurrency (future consideration)

---

## ✅ WHAT'S FIXED TODAY

### 1. **Withdrawal Button Now Shows Why It's Disabled**
- Before: Just disabled (grey)
- Now: Shows yellow warning with exact reason

### 2. **Added Chat Message Notifications**
- Notifications now sent when someone messages you
- Shows in notification dropdown
- Click to open chat

### 3. **Better Error Messages**
- Clear explanations for why withdrawal failed
- Guides user to fix the issue
- Auto-redirect to Settings if needed

### 4. **Documented Everything**
- Created FUTURE_ENHANCEMENTS.md (67 KB!)
- Created this WITHDRAWAL_POLICY.md
- All scenarios explained

---

## 📝 ADMIN RESPONSIBILITIES

### Withdrawal Approval Process:

1. **Review Request**
   - Check user's bank details match
   - Verify sufficient balance
   - Check for suspicious activity

2. **Approve or Reject**
   - Approve: Money transfers to user's bank
   - Reject: Funds returned to available balance
   - Always provide reason if rejecting

3. **Monitor Patterns**
   - Multiple withdrawal requests
   - Same-day deposit & withdrawal
   - Unusual amounts or frequency

---

## 🔗 RELATED DOCUMENTS

- [FUTURE_ENHANCEMENTS.md](./FUTURE_ENHANCEMENTS.md) - All planned features
- [CONTRACT_FLOW_FIXED.md](./CONTRACT_FLOW_FIXED.md) - How escrow works
- [PAYMENT_TESTING_GUIDE.md](./PAYMENT_TESTING_GUIDE.md) - Testing payments
- [NOTIFICATION_TESTING.md](./NOTIFICATION_TESTING.md) - Testing notifications

---

## ❓ FAQ

**Q: Why can't I withdraw if I have ₹500 in my wallet?**  
A: Check if funds are locked. If you have ₹500 total but ₹450 locked in an active order, only ₹50 is available. You need ₹100 minimum.

**Q: How long does withdrawal take?**  
A: 1-2 business days after admin approval.

**Q: Can I cancel a withdrawal request?**  
A: Not currently. Contact admin if urgent.

**Q: What if admin rejects my withdrawal?**  
A: Funds return to your available balance immediately. Check notification for reason.

**Q: Can I withdraw during weekends?**  
A: You can request anytime, but admin processes Monday-Friday business hours.

**Q: Is there a fee for withdrawal?**  
A: Currently NO fee. (May change in future for small amounts)

**Q: What's the maximum I can withdraw?**  
A: Your entire available balance (not locked amount).

**Q: Can I have multiple pending withdrawal requests?**  
A: No, only one at a time. Wait for current request to complete.

**Q: What if my bank details are wrong?**  
A: Transaction will fail. Update details in Settings → Request verification again.

---

*For support, contact: support@kissanconnect.com*  
*Last updated: February 6, 2026*
