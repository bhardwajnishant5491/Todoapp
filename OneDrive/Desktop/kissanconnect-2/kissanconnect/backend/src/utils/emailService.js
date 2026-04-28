import nodemailer from 'nodemailer';
import config from '../config/env.js';

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// ─── Base HTML wrapper ────────────────────────────────────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin:0; padding:0; background:#f4f6f0; font-family: Arial, sans-serif; }
    .wrapper { max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
    .header { background:linear-gradient(135deg,#2F4F1C,#4a7c2f); padding:28px 32px; text-align:center; }
    .header h1 { margin:0; color:#ffffff; font-size:24px; letter-spacing:1px; }
    .header p { margin:4px 0 0; color:#c8e6a0; font-size:13px; }
    .body { padding:32px; color:#333333; }
    .body h2 { color:#2F4F1C; margin-top:0; }
    .info-box { background:#f0f7e8; border-left:4px solid #4a7c2f; border-radius:6px; padding:16px 20px; margin:20px 0; }
    .info-box p { margin:6px 0; font-size:14px; color:#444; }
    .info-box strong { color:#2F4F1C; }
    .badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:bold; }
    .badge-green { background:#d4edda; color:#155724; }
    .badge-red { background:#f8d7da; color:#721c24; }
    .badge-yellow { background:#fff3cd; color:#856404; }
    .badge-blue { background:#d1ecf1; color:#0c5460; }
    .btn { display:inline-block; margin-top:20px; padding:12px 28px; background:linear-gradient(135deg,#2F4F1C,#4a7c2f); color:#ffffff !important; text-decoration:none; border-radius:8px; font-weight:bold; font-size:14px; }
    .divider { border:none; border-top:1px solid #e8f0e0; margin:24px 0; }
    .footer { background:#f0f7e8; padding:20px 32px; text-align:center; font-size:12px; color:#888; }
    .footer a { color:#4a7c2f; text-decoration:none; }
    .amount { font-size:28px; font-weight:bold; color:#2F4F1C; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🌾 KisanConnect</h1>
      <p>Digital Contract Farming Platform</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© 2026 KisanConnect. All rights reserved.</p>
      <p>Need help? <a href="mailto:support@kissanconnect.in">support@kissanconnect.in</a></p>
    </div>
  </div>
</body>
</html>`;

// ─── Core send function ───────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to} — "${subject}"`);
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    // Never throw — email failure should not break the main flow
  }
};

// ─── 1. Welcome Email ─────────────────────────────────────────────────────────
export const sendWelcomeEmail = async (user) => {
  const roleLabel = user.role === 'farmer' ? '👨‍🌾 Farmer' : '🧑‍💼 Buyer';
  await sendEmail({
    to: user.email,
    subject: '🌾 Welcome to KisanConnect!',
    html: baseTemplate(`
      <h2>Welcome, ${user.name}! 🎉</h2>
      <p>You've successfully registered as a <strong>${roleLabel}</strong> on KisanConnect.</p>
      <div class="info-box">
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${roleLabel}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
      </div>
      <p>You can now ${user.role === 'farmer' ? 'list your crops and receive contract proposals from buyers' : 'browse crops and send contract proposals to farmers'}.</p>
      <a href="${config.frontend.url}/login" class="btn">Go to Dashboard →</a>
    `),
  });
};

// ─── 2. Contract Proposal Received (Farmer) ───────────────────────────────────
export const sendContractProposalEmail = async (farmer, buyer, contract, crop) => {
  await sendEmail({
    to: farmer.email,
    subject: `📋 New Contract Proposal from ${buyer.name}`,
    html: baseTemplate(`
      <h2>New Contract Proposal Received</h2>
      <p>Hi <strong>${farmer.name}</strong>, you have received a new contract proposal.</p>
      <div class="info-box">
        <p><strong>Buyer:</strong> ${buyer.name} ${buyer.companyName ? `(${buyer.companyName})` : ''}</p>
        <p><strong>Crop:</strong> ${crop.cropType}</p>
        <p><strong>Quantity:</strong> ${contract.quantity} ${contract.unit}</p>
        <p><strong>Price per Unit:</strong> ₹${contract.pricePerUnit}</p>
        <p><strong>Total Amount:</strong> <span class="amount">₹${contract.totalAmount?.toLocaleString('en-IN')}</span></p>
        <p><strong>Delivery Date:</strong> ${new Date(contract.deliveryDate).toLocaleDateString('en-IN')}</p>
      </div>
      <p>Please review and accept or reject this proposal from your dashboard.</p>
      <a href="${config.frontend.url}/farmer/contracts" class="btn">Review Proposal →</a>
    `),
  });
};

// ─── 3. Contract Accepted ─────────────────────────────────────────────────────
export const sendContractAcceptedEmail = async (buyer, farmer, contract, crop) => {
  await sendEmail({
    to: buyer.email,
    subject: `✅ Contract Accepted by ${farmer.name}`,
    html: baseTemplate(`
      <h2>Your Contract Has Been Accepted! ✅</h2>
      <p>Hi <strong>${buyer.name}</strong>, great news! <strong>${farmer.name}</strong> has accepted your contract proposal.</p>
      <div class="info-box">
        <p><strong>Contract ID:</strong> #${String(contract._id).slice(-8).toUpperCase()}</p>
        <p><strong>Crop:</strong> ${crop?.cropType || 'N/A'}</p>
        <p><strong>Quantity:</strong> ${contract.quantity} ${contract.unit}</p>
        <p><strong>Total Amount:</strong> <span class="amount">₹${contract.totalAmount?.toLocaleString('en-IN')}</span></p>
        <p><strong>Delivery Date:</strong> ${new Date(contract.deliveryDate).toLocaleDateString('en-IN')}</p>
        <p><strong>Status:</strong> <span class="badge badge-green">Accepted & Locked</span></p>
      </div>
      <p>Funds of <strong>₹${contract.totalAmount?.toLocaleString('en-IN')}</strong> have been locked in escrow and will be released to the farmer upon delivery confirmation.</p>
      <a href="${config.frontend.url}/buyer/contracts" class="btn">View Contract →</a>
    `),
  });
};

// ─── 4. Contract Rejected ─────────────────────────────────────────────────────
export const sendContractRejectedEmail = async (buyer, farmer, contract, crop) => {
  await sendEmail({
    to: buyer.email,
    subject: `❌ Contract Proposal Rejected`,
    html: baseTemplate(`
      <h2>Contract Proposal Rejected</h2>
      <p>Hi <strong>${buyer.name}</strong>, unfortunately <strong>${farmer.name}</strong> has rejected your contract proposal.</p>
      <div class="info-box">
        <p><strong>Crop:</strong> ${crop?.cropType || 'N/A'}</p>
        <p><strong>Quantity:</strong> ${contract.quantity} ${contract.unit}</p>
        <p><strong>Total Amount:</strong> ₹${contract.totalAmount?.toLocaleString('en-IN')}</p>
        ${contract.rejectionReason ? `<p><strong>Reason:</strong> ${contract.rejectionReason}</p>` : ''}
        <p><strong>Status:</strong> <span class="badge badge-red">Rejected</span></p>
      </div>
      <p>Don't worry — you can browse other available crops and send new proposals.</p>
      <a href="${config.frontend.url}/buyer/browse-crops" class="btn">Browse Crops →</a>
    `),
  });
};

// ─── 5. Contract Completed + Payment Released (Farmer) ───────────────────────
export const sendPaymentReleasedEmail = async (farmer, buyer, contract, farmerAmount, platformCommission) => {
  await sendEmail({
    to: farmer.email,
    subject: `💰 Payment Released — ₹${farmerAmount?.toLocaleString('en-IN')} Credited`,
    html: baseTemplate(`
      <h2>Payment Received! 💰</h2>
      <p>Hi <strong>${farmer.name}</strong>, your payment has been released successfully.</p>
      <div class="info-box">
        <p><strong>Contract ID:</strong> #${String(contract._id).slice(-8).toUpperCase()}</p>
        <p><strong>Buyer:</strong> ${buyer.name}</p>
        <p><strong>Gross Amount:</strong> ₹${contract.totalAmount?.toLocaleString('en-IN')}</p>
        <p><strong>Platform Commission (4%):</strong> - ₹${platformCommission?.toLocaleString('en-IN')}</p>
        <p><strong>Amount Credited:</strong> <span class="amount">₹${farmerAmount?.toLocaleString('en-IN')}</span></p>
        <p><strong>Status:</strong> <span class="badge badge-green">Completed</span></p>
      </div>
      <p>The amount has been added to your KisanConnect wallet. You can withdraw it to your bank account anytime.</p>
      <a href="${config.frontend.url}/wallet" class="btn">View Wallet →</a>
    `),
  });
};

// ─── 6. Contract Completed (Buyer) ───────────────────────────────────────────
export const sendContractCompletedEmail = async (buyer, farmer, contract) => {
  await sendEmail({
    to: buyer.email,
    subject: `✅ Contract Completed Successfully`,
    html: baseTemplate(`
      <h2>Contract Completed! ✅</h2>
      <p>Hi <strong>${buyer.name}</strong>, your contract with <strong>${farmer.name}</strong> has been completed successfully.</p>
      <div class="info-box">
        <p><strong>Contract ID:</strong> #${String(contract._id).slice(-8).toUpperCase()}</p>
        <p><strong>Farmer:</strong> ${farmer.name}</p>
        <p><strong>Total Paid:</strong> <span class="amount">₹${contract.totalAmount?.toLocaleString('en-IN')}</span></p>
        <p><strong>Completed On:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
        <p><strong>Status:</strong> <span class="badge badge-green">Completed</span></p>
      </div>
      <p>Please take a moment to rate your experience with the farmer.</p>
      <a href="${config.frontend.url}/buyer/contracts" class="btn">Rate & Review →</a>
    `),
  });
};

// ─── 7. Dispute Raised ────────────────────────────────────────────────────────
export const sendDisputeRaisedEmail = async (raisedBy, otherParty, contract, dispute) => {
  // Notify the other party
  await sendEmail({
    to: otherParty.email,
    subject: `⚠️ Dispute Raised on Your Contract`,
    html: baseTemplate(`
      <h2>A Dispute Has Been Raised ⚠️</h2>
      <p>Hi <strong>${otherParty.name}</strong>, a dispute has been raised on one of your contracts by <strong>${raisedBy.name}</strong>.</p>
      <div class="info-box">
        <p><strong>Contract ID:</strong> #${String(contract._id).slice(-8).toUpperCase()}</p>
        <p><strong>Raised By:</strong> ${raisedBy.name}</p>
        <p><strong>Reason:</strong> ${dispute.reason || 'Not specified'}</p>
        <p><strong>Status:</strong> <span class="badge badge-yellow">Under Review</span></p>
      </div>
      <p>Our admin team will review the dispute and mediate a fair resolution. You may be contacted for more information.</p>
      <a href="${config.frontend.url}/disputes" class="btn">View Dispute →</a>
    `),
  });

  // Confirm to the person who raised it
  await sendEmail({
    to: raisedBy.email,
    subject: `📋 Dispute Submitted Successfully`,
    html: baseTemplate(`
      <h2>Dispute Submitted ✅</h2>
      <p>Hi <strong>${raisedBy.name}</strong>, your dispute has been submitted and is under review.</p>
      <div class="info-box">
        <p><strong>Contract ID:</strong> #${String(contract._id).slice(-8).toUpperCase()}</p>
        <p><strong>Reason:</strong> ${dispute.reason || 'Not specified'}</p>
        <p><strong>Status:</strong> <span class="badge badge-yellow">Under Review</span></p>
      </div>
      <p>Our admin team will review and resolve this within 3-5 business days.</p>
      <a href="${config.frontend.url}/disputes" class="btn">Track Dispute →</a>
    `),
  });
};

// ─── 8. Dispute Resolved ──────────────────────────────────────────────────────
export const sendDisputeResolvedEmail = async (user, contract, resolution) => {
  await sendEmail({
    to: user.email,
    subject: `✅ Dispute Resolved`,
    html: baseTemplate(`
      <h2>Your Dispute Has Been Resolved ✅</h2>
      <p>Hi <strong>${user.name}</strong>, the admin has resolved the dispute on your contract.</p>
      <div class="info-box">
        <p><strong>Contract ID:</strong> #${String(contract._id).slice(-8).toUpperCase()}</p>
        <p><strong>Resolution:</strong> ${resolution}</p>
        <p><strong>Status:</strong> <span class="badge badge-green">Resolved</span></p>
        <p><strong>Resolved On:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
      </div>
      <a href="${config.frontend.url}/disputes" class="btn">View Details →</a>
    `),
  });
};

// ─── 9. Withdrawal Approved ───────────────────────────────────────────────────
export const sendWithdrawalApprovedEmail = async (user, amount) => {
  await sendEmail({
    to: user.email,
    subject: `✅ Withdrawal Approved — ₹${amount?.toLocaleString('en-IN')}`,
    html: baseTemplate(`
      <h2>Withdrawal Approved! ✅</h2>
      <p>Hi <strong>${user.name}</strong>, your withdrawal request has been approved.</p>
      <div class="info-box">
        <p><strong>Amount:</strong> <span class="amount">₹${amount?.toLocaleString('en-IN')}</span></p>
        <p><strong>Status:</strong> <span class="badge badge-green">Approved</span></p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
      </div>
      <p>The amount will be transferred to your registered bank account within 2-3 business days.</p>
      <a href="${config.frontend.url}/wallet" class="btn">View Wallet →</a>
    `),
  });
};

// ─── 10. Withdrawal Rejected ──────────────────────────────────────────────────
export const sendWithdrawalRejectedEmail = async (user, amount, reason) => {
  await sendEmail({
    to: user.email,
    subject: `❌ Withdrawal Request Rejected`,
    html: baseTemplate(`
      <h2>Withdrawal Request Rejected</h2>
      <p>Hi <strong>${user.name}</strong>, unfortunately your withdrawal request has been rejected.</p>
      <div class="info-box">
        <p><strong>Amount Requested:</strong> ₹${amount?.toLocaleString('en-IN')}</p>
        <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
        <p><strong>Status:</strong> <span class="badge badge-red">Rejected</span></p>
      </div>
      <p>Please contact support if you have any questions.</p>
      <a href="mailto:support@kissanconnect.in" class="btn">Contact Support →</a>
    `),
  });
};

export default {
  sendWelcomeEmail,
  sendContractProposalEmail,
  sendContractAcceptedEmail,
  sendContractRejectedEmail,
  sendPaymentReleasedEmail,
  sendContractCompletedEmail,
  sendDisputeRaisedEmail,
  sendDisputeResolvedEmail,
  sendWithdrawalApprovedEmail,
  sendWithdrawalRejectedEmail,
};
