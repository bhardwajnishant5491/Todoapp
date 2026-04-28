import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShield } from 'react-icons/fi';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-8 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center text-white/90 hover:text-white transition-colors mb-4 font-inter"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center">
            <FiShield className="text-5xl mr-4" />
            <div>
              <h1 className="text-4xl font-poppins font-bold mb-2">Privacy Policy</h1>
              <p className="text-white/90 font-inter">Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <p className="text-gray-700 font-inter leading-relaxed">
                <strong>KisanConnect</strong> ("we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our Platform. By using KisanConnect, you 
                consent to the data practices described in this policy.
              </p>
            </section>

            {/* 1. INFORMATION WE COLLECT */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                1. INFORMATION WE COLLECT
              </h2>
              
              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">1.1 Account Registration Information</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Name, email address, phone number</li>
                <li>Password (encrypted)</li>
                <li>Role (Farmer or Buyer)</li>
                <li>Age and profile photo</li>
                <li>Address (village, district, state, pincode)</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">1.2 Profile Information</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li><strong>Farmers:</strong> Farm size, crop specializations</li>
                <li><strong>Buyers:</strong> Company name, GST number, business type</li>
                <li>Bio, languages spoken</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">1.3 Financial Information</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Bank account details (account number, IFSC code, bank name, branch)</li>
                <li>UPI ID (if provided)</li>
                <li>PAN number (for tax compliance)</li>
                <li>Transaction history and wallet balances</li>
                <li>Payment gateway information (processed by third-party providers)</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">1.4 Verification Documents</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Aadhaar card (if provided for verification)</li>
                <li>PAN card</li>
                <li>Government-issued IDs</li>
                <li>Business registration documents</li>
                <li>Bank account verification documents</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">1.5 Product Listings and Transactions</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Crop listings (photos, descriptions, prices, quantities)</li>
                <li>Contract details (proposals, accepted terms, delivery information)</li>
                <li>Location data related to listings</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">1.6 Communications</h3>
              <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 mb-4">
                <p className="text-amber-900 font-inter font-bold mb-2">⚠️ IMPORTANT</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter">
                  <li><strong>ALL messages</strong> sent through the in-app chat system</li>
                  <li>Support tickets and correspondence</li>
                  <li>Feedback and survey responses</li>
                  <li>Dispute reports and escalations</li>
                </ul>
              </div>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">1.7 Device and Usage Information</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>IP address, device type, operating system</li>
                <li>Browser type and version</li>
                <li>Device identifiers</li>
                <li>Pages visited, time spent on pages</li>
                <li>Click patterns, search queries</li>
                <li>Login times and session duration</li>
                <li>Approximate location (based on IP address)</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">1.8 Cookies and Tracking Technologies</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Session cookies (for authentication)</li>
                <li>Preference cookies (for user settings)</li>
                <li>Analytics cookies (Google Analytics, etc.)</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">1.9 Third-Party Information</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Payment processor data (Razorpay, Stripe, etc.)</li>
                <li>Identity verification services</li>
                <li>Social media profile information (if you link accounts)</li>
              </ul>
            </section>

            {/* 2. HOW WE USE YOUR INFORMATION */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                2. HOW WE USE YOUR INFORMATION
              </h2>
              
              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">2.1 Provide and Improve Services</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Create and manage user accounts</li>
                <li>Facilitate transactions between Farmers and Buyers</li>
                <li>Process payments and withdrawals</li>
                <li>Enable communication through in-app messaging</li>
                <li>Improve Platform features and user experience</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">2.2 Security and Fraud Prevention</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Verify user identities and bank accounts</li>
                <li>Detect and prevent fraudulent activities</li>
                <li>Monitor messages for policy violations</li>
                <li>Investigate suspicious transactions</li>
                <li>Enforce Terms of Service</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">2.3 Analytics and Research</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Analyze Platform usage patterns</li>
                <li>Understand user behavior and preferences</li>
                <li>Generate aggregated statistical reports</li>
                <li>Conduct market research</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">2.4 Communication</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Send transactional emails (order confirmations, delivery updates)</li>
                <li>Send notifications about account activity</li>
                <li>Respond to customer support inquiries</li>
                <li>Send marketing communications (with your consent, opt-out available)</li>
                <li>Announce Platform updates and new features</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">2.5 Legal Compliance</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Comply with legal obligations and regulations</li>
                <li>Respond to law enforcement requests</li>
                <li>Enforce our Terms of Service</li>
                <li>Resolve disputes and handle complaints</li>
              </ul>
            </section>

            {/* MESSAGE MONITORING - CRITICAL SECTION */}
            <section className="mb-8">
              <div className="bg-red-50 border-4 border-red-500 rounded-xl p-6">
                <h2 className="text-2xl font-poppins font-bold text-red-700 mb-4 flex items-center">
                  <span className="text-3xl mr-3">⚠️</span>
                  2.6 MESSAGE MONITORING - CRITICAL NOTICE
                </h2>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-gray-900 font-inter font-bold text-lg mb-2">
                    NO EXPECTATION OF PRIVACY
                  </p>
                  <p className="text-gray-700 font-inter leading-relaxed mb-3">
                    <strong>ALL messages sent through the KisanConnect platform are monitored, recorded, stored, and analyzed.</strong>
                  </p>
                </div>

                <h3 className="text-lg font-poppins font-bold text-red-700 mb-3">What This Means:</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                  <li><strong>Automated Monitoring:</strong> Messages are scanned in real-time for keywords and patterns that may indicate policy violations (e.g., phone numbers, email addresses, external payment requests).</li>
                  <li><strong>Manual Review:</strong> Flagged messages may be reviewed by Platform administrators.</li>
                  <li><strong>Permanent Storage:</strong> All messages are stored indefinitely for dispute resolution and compliance purposes.</li>
                  <li><strong>Evidence in Disputes:</strong> Messages can and will be used as evidence if disputes arise.</li>
                  <li><strong>Enforcement:</strong> Detected violations trigger automatic warnings, account suspensions, or bans as per our Terms of Service.</li>
                </ul>

                <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 mt-4">
                  <p className="text-amber-900 font-inter font-bold">
                    📋 BY USING THE MESSAGING SYSTEM, YOU ACKNOWLEDGE AND ACCEPT THAT YOUR COMMUNICATIONS ARE NOT PRIVATE.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. HOW WE SHARE YOUR INFORMATION */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                3. HOW WE SHARE YOUR INFORMATION
              </h2>
              
              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">3.1 With Other Users</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li><strong>Limited Profile Information:</strong> Name, profile photo, role, location (state/district), ratings are visible to potential trading partners.</li>
                <li><strong>Phone Numbers:</strong> Shared <strong>ONLY</strong> after escrow payment is made and <strong>ONLY</strong> for delivery coordination purposes.</li>
                <li><strong>Transaction Details:</strong> Contract terms, delivery status, and payment status are visible to parties involved in the transaction.</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">3.2 With Service Providers</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                We share information with trusted third-party service providers who assist us in operating the Platform:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li><strong>Payment Processors:</strong> Razorpay, Stripe, PayU (for payment processing)</li>
                <li><strong>Cloud Hosting:</strong> AWS, Google Cloud (for data storage and hosting)</li>
                <li><strong>Analytics:</strong> Google Analytics (for usage analytics)</li>
                <li><strong>Identity Verification:</strong> Aadhaar verification APIs, PAN verification services</li>
                <li><strong>Email Services:</strong> SendGrid, AWS SES (for transactional emails)</li>
              </ul>
              <p className="text-gray-700 font-inter leading-relaxed">
                These service providers are contractually obligated to protect your data and use it only for the specified purposes.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">3.3 Legal and Compliance</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                We may disclose your information to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Government authorities or law enforcement when legally required</li>
                <li>Courts pursuant to valid subpoenas or court orders</li>
                <li>Tax authorities for compliance with tax regulations</li>
                <li>Legal counsel in case of disputes or litigation</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">3.4 Business Transfers</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                In the event of a merger, acquisition, or asset sale, your information may be transferred to the acquiring entity. 
                We will notify you via email and/or Platform notification before your information is transferred.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">3.5 Aggregated Data</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                We may share aggregated, anonymized data (e.g., "40% of transactions are for rice crops") with partners, researchers, 
                or the public. This data cannot be traced back to individual users.
              </p>

              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mt-4">
                <p className="text-green-700 font-inter font-bold text-lg mb-2">
                  ✓ WE DO NOT SELL YOUR PERSONAL DATA
                </p>
                <p className="text-gray-700 font-inter">
                  KisanConnect does <strong>NOT</strong> sell, rent, or lease your personal information to third parties for marketing purposes.
                </p>
              </div>
            </section>

            {/* 4. DATA SECURITY */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                4. DATA SECURITY
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                We implement industry-standard security measures to protect your information:
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">4.1 Technical Measures</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li><strong>Encryption:</strong> SSL/TLS encryption for data in transit, AES-256 encryption for sensitive data at rest</li>
                <li><strong>Secure Authentication:</strong> Password hashing with bcrypt, multi-factor authentication for admin accounts</li>
                <li><strong>Access Controls:</strong> Role-based access control (RBAC), least privilege principle</li>
                <li><strong>Firewalls:</strong> Network firewalls and intrusion detection systems</li>
                <li><strong>Regular Audits:</strong> Security audits, vulnerability assessments, and penetration testing</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">4.2 Organizational Measures</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Employee training on data protection and security best practices</li>
                <li>Confidentiality agreements for all employees and contractors</li>
                <li>Incident response plan for data breaches</li>
                <li>Regular backup and disaster recovery procedures</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">4.3 Breach Notification</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                In the unlikely event of a data breach, we will notify affected users within <strong>72 hours</strong> via email and Platform notification, 
                along with steps to mitigate potential harm.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">4.4 Your Responsibility</h3>
              <p className="text-gray-700 font-inter leading-relaxed">
                You are responsible for maintaining the confidentiality of your password and account credentials. 
                Do not share your password with anyone. Immediately notify us if you suspect unauthorized access to your account.
              </p>
            </section>

            {/* 5. DATA RETENTION */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                5. DATA RETENTION
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy:
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">5.1 Active Accounts</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Account information: Retained while your account is active</li>
                <li>Messages and communications: Retained indefinitely for dispute resolution and compliance</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">5.2 Closed Accounts</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Personal information: Deleted within <strong>90 days</strong> of account closure (with exceptions below)</li>
                <li>Profile data: Anonymized or deleted</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">5.3 Legal Requirements</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li><strong>Transaction Records:</strong> Retained for <strong>7 years</strong> as required by Indian tax laws</li>
                <li><strong>Financial Data:</strong> Retained as required by the Income Tax Act, GST regulations</li>
                <li><strong>Communication Records:</strong> Retained for dispute resolution and legal compliance</li>
              </ul>

              <p className="text-gray-700 font-inter leading-relaxed mt-3">
                Even after account deletion, some data may be retained in anonymized form for analytics, or as required by law.
              </p>
            </section>

            {/* 6. YOUR PRIVACY RIGHTS */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                6. YOUR PRIVACY RIGHTS
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                You have the following rights regarding your personal information:
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">6.1 Access</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                You can request a copy of the personal information we hold about you. Contact us at privacy@kisanconnect.com.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">6.2 Correction</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                You can update or correct your account information through the Settings page or by contacting support.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">6.3 Deletion</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                You can request deletion of your account and personal information. Note that some data may be retained for legal compliance 
                (e.g., transaction records for 7 years). To delete your account, go to Settings {'>'} Account {'>'} Delete Account.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">6.4 Data Portability</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                You can request to export your data in a machine-readable format (CSV or JSON). Contact us at privacy@kisanconnect.com.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">6.5 Marketing Opt-Out</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                You can unsubscribe from marketing emails by clicking the "Unsubscribe" link in any marketing email, or by adjusting your 
                notification preferences in Settings. Note that you cannot opt-out of transactional emails (order confirmations, delivery updates, etc.).
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">6.6 Object to Processing</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                You can object to certain types of data processing (e.g., marketing analytics). Contact us at privacy@kisanconnect.com.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">6.7 File a Complaint</h3>
              <p className="text-gray-700 font-inter leading-relaxed">
                If you believe your privacy rights have been violated, you can file a complaint with us at privacy@kisanconnect.com or 
                with the appropriate data protection authority in India.
              </p>
            </section>

            {/* 7. COOKIES */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                7. COOKIES AND TRACKING TECHNOLOGIES
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                We use cookies and similar tracking technologies to improve your experience:
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">7.1 Types of Cookies</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality (cannot be disabled)</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Platform (Google Analytics)</li>
                <li><strong>Marketing Cookies:</strong> Track conversions from ads and marketing campaigns (if applicable)</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">7.2 Managing Cookies</h3>
              <p className="text-gray-700 font-inter leading-relaxed">
                You can manage cookies through your browser settings. Note that disabling essential cookies may affect Platform functionality.
              </p>
            </section>

            {/* 8. CHILDREN'S PRIVACY */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                8. CHILDREN'S PRIVACY
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed">
                KisanConnect is intended for users aged <strong>18 and above</strong> only. We do not knowingly collect personal information 
                from minors under 18. If we become aware that a user is under 18, we will immediately delete their account and information. 
                If you believe a minor has registered, please contact us at privacy@kisanconnect.com.
              </p>
            </section>

            {/* 9. INTERNATIONAL TRANSFERS */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                9. INTERNATIONAL DATA TRANSFERS
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed">
                Your data is stored on servers located in <strong>India</strong>. If you access the Platform from outside India, 
                by using the Platform you consent to the transfer and processing of your data in India under Indian law.
              </p>
            </section>

            {/* 10. CHANGES TO THIS PRIVACY POLICY */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                10. CHANGES TO THIS PRIVACY POLICY
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, 
                or other factors. We will notify you of significant changes via email or Platform notification. The "Last Updated" date 
                at the top of this page indicates when the policy was last revised. Continued use of the Platform after changes constitutes 
                acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* 11. CONTACT US */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                11. CONTACT US
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                If you have questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 font-inter"><strong>KisanConnect - Privacy Team</strong></p>
                <p className="text-gray-700 font-inter">📧 Privacy Email: privacy@kisanconnect.com</p>
                <p className="text-gray-700 font-inter">📧 General Support: support@kisanconnect.com</p>
                <p className="text-gray-700 font-inter">📞 Phone: +91-XXXXXXXXXX</p>
                <p className="text-gray-700 font-inter">📍 Address: [Your Business Address, City, State, Pincode]</p>
              </div>
            </section>

            {/* CONSENT */}
            <section className="mb-8">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-6">
                <h2 className="text-2xl font-poppins font-bold text-amber-900 mb-4">📋 CONSENT AND ACKNOWLEDGMENT</h2>
                <p className="text-gray-700 font-inter leading-relaxed mb-3">
                  By checking the acceptance box during registration, you acknowledge that:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter">
                  <li>You have read and understood this Privacy Policy in its entirety.</li>
                  <li>You consent to the collection, use, and disclosure of your information as described in this Privacy Policy.</li>
                  <li>You acknowledge that <strong>all platform messages are monitored</strong> and you have no expectation of privacy.</li>
                  <li>You understand that your data may be shared with service providers, other users (limited), and authorities as described.</li>
                  <li>You understand your privacy rights and how to exercise them.</li>
                  <li>You consent to the storage of your data in India.</li>
                </ul>
              </div>
            </section>

            {/* SPECIFIC PRIVACY NOTICES */}
            <section className="mb-8">
              <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6">
                <h2 className="text-2xl font-poppins font-bold text-blue-700 mb-4">🔒 SPECIFIC PRIVACY NOTICES</h2>
                
                <h3 className="text-lg font-poppins font-bold text-blue-700 mb-2">Message Privacy Notice</h3>
                <p className="text-gray-700 font-inter leading-relaxed mb-4">
                  <strong>REMINDER:</strong> All messages sent through KisanConnect are monitored, recorded, and analyzed. 
                  Messages are not private and may be reviewed by administrators. Do not share sensitive personal information 
                  (passwords, full bank details) through messages.
                </p>

                <h3 className="text-lg font-poppins font-bold text-blue-700 mb-2">Financial Privacy Notice</h3>
                <p className="text-gray-700 font-inter leading-relaxed mb-4">
                  Your financial data (bank details, transactions) is encrypted and stored securely. We comply with PCI-DSS standards 
                  for payment card data. Payment processing is handled by certified third-party processors (Razorpay, Stripe).
                </p>

                <h3 className="text-lg font-poppins font-bold text-blue-700 mb-2">Location Privacy Notice</h3>
                <p className="text-gray-700 font-inter leading-relaxed">
                  We collect approximate location based on IP address for security and fraud prevention. We do NOT collect precise 
                  GPS location unless you voluntarily provide address information in your profile or crop listings.
                </p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="mt-12 pt-6 border-t-2 border-gray-200 text-center">
              <p className="text-gray-600 font-inter text-sm">
                This Privacy Policy was last updated on <strong>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
              </p>
              <p className="text-gray-600 font-inter text-sm mt-2">
                © {new Date().getFullYear()} KisanConnect. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
