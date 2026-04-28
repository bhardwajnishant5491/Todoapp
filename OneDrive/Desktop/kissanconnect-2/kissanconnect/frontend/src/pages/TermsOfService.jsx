import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';

const TermsOfService = () => {
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
            <FiFileText className="text-5xl mr-4" />
            <div>
              <h1 className="text-4xl font-poppins font-bold mb-2">Terms of Service</h1>
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
                Welcome to <strong>KisanConnect</strong>. By accessing or using our Platform, you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, please do not use the Platform.
              </p>
            </section>

            {/* 1. ACCEPTANCE OF TERMS */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                1. ACCEPTANCE OF TERMS
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed">
                By creating an account, accessing, or using KisanConnect ("Platform," "we," "us," "our"), you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service, our Privacy Policy, and any additional terms and conditions that may apply to specific 
                services or features offered on or through the Platform.
              </p>
            </section>

            {/* 2. DEFINITIONS */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                2. DEFINITIONS
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter">
                <li><strong>"Platform"</strong> refers to the KisanConnect web application and all associated services.</li>
                <li><strong>"User"</strong> refers to any person accessing or using the Platform, including Farmers and Buyers.</li>
                <li><strong>"Farmer"</strong> refers to a User who lists agricultural products (crops) for sale on the Platform.</li>
                <li><strong>"Buyer"</strong> refers to a User who purchases agricultural products from Farmers through the Platform.</li>
                <li><strong>"Contract"</strong> refers to a binding agreement between a Farmer and Buyer for the sale and purchase of crops.</li>
                <li><strong>"Escrow"</strong> refers to the Platform's payment holding system where Buyer funds are held until delivery confirmation.</li>
                <li><strong>"Commission"</strong> refers to the 4% fee charged by the Platform on completed transactions.</li>
              </ul>
            </section>

            {/* 3. ELIGIBILITY */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                3. ELIGIBILITY
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                To use KisanConnect, you must meet the following eligibility requirements:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter">
                <li>You must be at least <strong>18 years of age</strong>.</li>
                <li>You must have the legal capacity to enter into binding contracts under Indian law.</li>
                <li>You must be a resident of <strong>India</strong>.</li>
                <li>You must not have previously been banned or suspended from the Platform for violating these Terms.</li>
                <li>You must provide accurate and truthful information during registration and throughout your use of the Platform.</li>
              </ul>
              <p className="text-gray-700 font-inter leading-relaxed mt-3">
                By registering, you represent and warrant that you meet all these eligibility requirements.
              </p>
            </section>

            {/* 4. ACCOUNT REGISTRATION */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                4. ACCOUNT REGISTRATION
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                To access certain features of the Platform, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter">
                <li>Provide accurate, current, and complete information during registration.</li>
                <li>Maintain and promptly update your account information to keep it accurate and complete.</li>
                <li>Maintain the security and confidentiality of your account credentials.</li>
                <li>Immediately notify us of any unauthorized use of your account or any security breach.</li>
                <li>Accept responsibility for all activities that occur under your account.</li>
                <li>Not share your account with others or allow others to access your account.</li>
              </ul>
              <p className="text-gray-700 font-inter leading-relaxed mt-3">
                We reserve the right to suspend or terminate your account if we suspect any breach of security or misuse.
              </p>
            </section>

            {/* 5. PLATFORM USAGE - EXCLUSIVE TRANSACTION POLICY */}
            <section className="mb-8">
              <div className="bg-red-50 border-4 border-red-500 rounded-xl p-6">
                <h2 className="text-2xl font-poppins font-bold text-red-700 mb-4 flex items-center">
                  <span className="text-3xl mr-3">⚠️</span>
                  5. PLATFORM USAGE - EXCLUSIVE TRANSACTION POLICY
                </h2>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-gray-900 font-inter font-bold text-lg mb-2">
                    CRITICAL REQUIREMENT - READ CAREFULLY
                  </p>
                  <p className="text-gray-700 font-inter leading-relaxed mb-3">
                    <strong>ALL transactions MUST be conducted exclusively through KisanConnect.</strong> This is a mandatory requirement for using the Platform.
                  </p>
                </div>

                <h3 className="text-xl font-poppins font-bold text-red-700 mb-3">5.1 PROHIBITED ACTIVITIES</h3>
                <p className="text-gray-700 font-inter mb-3">You explicitly agree that you will NOT:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                  <li>Share phone numbers, WhatsApp numbers, email addresses, or any other contact information with the intent to conduct transactions outside the Platform.</li>
                  <li>Request or provide contact information for the purpose of bypassing the Platform's escrow and payment system.</li>
                  <li>Conduct any transaction, negotiation, payment, or delivery arrangement outside of the Platform.</li>
                  <li>Attempt to circumvent the Platform's commission or fee structure.</li>
                  <li>Use the Platform solely to establish contact and then continue business relationships externally.</li>
                </ul>

                <h3 className="text-xl font-poppins font-bold text-red-700 mb-3">5.2 PERMITTED CONTACT SHARING</h3>
                <p className="text-gray-700 font-inter mb-3">
                  Contact information (phone numbers) is <strong>ONLY</strong> shared between parties:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                  <li>AFTER full payment has been made through the Platform's escrow system.</li>
                  <li>SOLELY for the purpose of coordinating delivery logistics.</li>
                  <li>NOT for negotiating prices, terms, or future transactions outside the Platform.</li>
                </ul>

                <h3 className="text-xl font-poppins font-bold text-red-700 mb-3">5.3 MESSAGE MONITORING</h3>
                <p className="text-gray-700 font-inter mb-3">
                  You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                  <li>ALL messages sent through the Platform are monitored, recorded, and analyzed.</li>
                  <li>Automated and manual reviews are conducted to detect policy violations.</li>
                  <li>You have NO expectation of privacy in communications conducted through the Platform.</li>
                  <li>Detected violations will result in immediate enforcement actions.</li>
                </ul>

                <h3 className="text-xl font-poppins font-bold text-red-700 mb-3">5.4 ENFORCEMENT AND PENALTIES</h3>
                <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 mb-3">
                  <p className="font-bold text-amber-900 mb-2">First Violation:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 font-inter">
                    <li>Written warning issued</li>
                    <li>Account suspended for <strong>15 days</strong></li>
                    <li>Violation recorded in account history</li>
                  </ul>
                </div>
                <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4">
                  <p className="font-bold text-red-900 mb-2">Second Violation:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 font-inter">
                    <li><strong>PERMANENT ACCOUNT BAN</strong></li>
                    <li>All locked funds and pending transactions <strong>FORFEITED</strong></li>
                    <li>No refunds or appeals</li>
                    <li>Legal action may be pursued for damages</li>
                  </ul>
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-red-400">
                  <p className="text-red-700 font-inter font-bold">
                    ⚠️ By accepting these Terms, you acknowledge that you understand the Exclusive Transaction Policy and agree to comply fully. 
                    Violations will result in the penalties described above without exception.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. TRANSACTIONS AND CONTRACTS */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                6. TRANSACTIONS AND CONTRACTS
              </h2>
              
              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">6.1 Contract Formation</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>A Contract is formed when a Buyer accepts a Farmer's crop listing and pays through escrow.</li>
                <li>Once formed, Contracts are <strong>legally binding</strong> on both parties.</li>
                <li>Contracts cannot be cancelled unilaterally except through the dispute resolution process.</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">6.2 Escrow System</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>All payments are made through the Platform's secure escrow system.</li>
                <li>Buyer funds are held in escrow until delivery is confirmed.</li>
                <li>Platform charges a <strong>4% commission</strong> on the total transaction amount.</li>
                <li>Funds are released to the Farmer after successful delivery confirmation.</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">6.3 Delivery and Confirmation</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Farmers must deliver products as described in the listing and Contract.</li>
                <li>Buyers must confirm delivery within 7 days of receiving the products.</li>
                <li>Failure to confirm within 7 days will result in automatic confirmation and fund release.</li>
              </ul>
            </section>

            {/* 7. FEES AND PAYMENTS */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                7. FEES AND PAYMENTS
              </h2>
              
              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">7.1 Platform Commission</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>KisanConnect charges a <strong>4% commission</strong> on all completed transactions.</li>
                <li>Commission is automatically deducted from the transaction amount before funds are released to the Farmer.</li>
                <li>Commission rates are subject to change with 30 days' notice.</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">7.2 Wallet and Withdrawals</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Farmers can withdraw funds from their wallet to their verified bank account.</li>
                <li>Minimum withdrawal amount: <strong>₹100</strong>.</li>
                <li>Funds in active Contracts are locked and cannot be withdrawn until delivery confirmation.</li>
                <li>Withdrawal processing time: 1-2 business days.</li>
                <li>Bank account must be verified before withdrawal requests can be processed.</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">7.3 Payment Methods</h3>
              <p className="text-gray-700 font-inter leading-relaxed">
                The Platform supports various payment methods including credit/debit cards, UPI, net banking, and wallets through 
                secure third-party payment gateways. All payment processing is subject to the terms of the payment service providers.
              </p>
            </section>

            {/* 8. USER RESPONSIBILITIES */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                8. USER RESPONSIBILITIES
              </h2>
              
              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">8.1 Farmer Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Provide accurate descriptions, photos, and pricing of listed products.</li>
                <li>Ensure product quality matches the description.</li>
                <li>Deliver products on time and in the condition agreed upon.</li>
                <li>Maintain proper permits and licenses for agricultural operations.</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">8.2 Buyer Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Make timely payments through the Platform's escrow system.</li>
                <li>Confirm delivery within 7 days of receiving products.</li>
                <li>Raise disputes promptly if there are issues with the delivery.</li>
                <li>Not abuse the dispute resolution system.</li>
              </ul>
            </section>

            {/* 9. DISPUTES AND RESOLUTION */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                9. DISPUTES AND RESOLUTION
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter">
                <li>Disputes must be raised within <strong>7 days</strong> of delivery.</li>
                <li>Both parties must provide evidence (photos, messages, delivery proof) to support their case.</li>
                <li>Platform administrators will review all evidence and make a final decision.</li>
                <li>Admin decisions are <strong>final and binding</strong> on both parties.</li>
                <li>Repeated frivolous disputes may result in account penalties.</li>
                <li>Serious disputes may be escalated to legal arbitration under Indian law.</li>
              </ul>
            </section>

            {/* 10. DISCLAIMERS AND LIMITATIONS OF LIABILITY */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                10. DISCLAIMERS AND LIMITATIONS OF LIABILITY
              </h2>
              
              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">10.1 Platform "As Is"</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                The Platform is provided "as is" and "as available" without warranties of any kind, either express or implied, 
                including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">10.2 No Liability for User Actions</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                KisanConnect is not a party to transactions between Farmers and Buyers. We do not guarantee the quality, safety, 
                legality, or accuracy of products listed. We are not liable for any damages arising from:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Product quality, delivery issues, or Farmer/Buyer conduct.</li>
                <li>Losses incurred due to reliance on Platform information.</li>
                <li>Unauthorized access to your account due to your failure to maintain security.</li>
                <li>Interruptions or errors in Platform functionality.</li>
              </ul>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">10.3 Indemnification</h3>
              <p className="text-gray-700 font-inter leading-relaxed">
                You agree to indemnify, defend, and hold harmless KisanConnect, its officers, directors, employees, and agents 
                from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your violation 
                of these Terms or your use of the Platform.
              </p>
            </section>

            {/* 11. INTELLECTUAL PROPERTY */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                11. INTELLECTUAL PROPERTY
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                All content on the Platform, including text, graphics, logos, icons, images, and software, is the property of 
                KisanConnect or its content suppliers and is protected by Indian and international copyright laws.
              </p>
              <p className="text-gray-700 font-inter leading-relaxed">
                You retain ownership of content you upload (crop listings, photos, messages), but grant us a non-exclusive, 
                worldwide, royalty-free license to use, display, and distribute this content as necessary to provide Platform services.
              </p>
            </section>

            {/* 12. TERMINATION */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                12. TERMINATION
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                We reserve the right to suspend or terminate your account at any time, with or without notice, for:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter mb-4">
                <li>Violation of these Terms of Service.</li>
                <li>Fraudulent or illegal activities.</li>
                <li>Repeated disputes or policy violations.</li>
                <li>Abuse of other Users or Platform staff.</li>
              </ul>
              <p className="text-gray-700 font-inter leading-relaxed">
                Upon termination, your account will be deactivated, and you will lose access to Platform features. 
                Funds in locked Contracts may be forfeited depending on the reason for termination.
              </p>
            </section>

            {/* 13. MODIFICATIONS TO TERMS */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                13. MODIFICATIONS TO TERMS
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of significant changes via email 
                or Platform notification. Continued use of the Platform after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* 14. GOVERNING LAW AND JURISDICTION */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                14. GOVERNING LAW AND JURISDICTION
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                These Terms are governed by and construed in accordance with the <strong>laws of India</strong>. 
                Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction 
                of the courts in <strong>[Your City, State], India</strong>.
              </p>
              <p className="text-gray-700 font-inter leading-relaxed">
                You agree that any legal action or proceeding may be brought in these courts, and you consent to the jurisdiction 
                of such courts.
              </p>
            </section>

            {/* 15. GENERAL PROVISIONS */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                15. GENERAL PROVISIONS
              </h2>
              
              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">15.1 Entire Agreement</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                These Terms, together with the Privacy Policy, constitute the entire agreement between you and KisanConnect.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">15.2 Severability</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">15.3 Waiver</h3>
              <p className="text-gray-700 font-inter leading-relaxed mb-4">
                Our failure to enforce any provision of these Terms does not constitute a waiver of that provision or any other right.
              </p>

              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">15.4 Assignment</h3>
              <p className="text-gray-700 font-inter leading-relaxed">
                You may not assign or transfer these Terms or your account without our prior written consent. 
                We may assign these Terms without restriction.
              </p>
            </section>

            {/* 16. CONTACT INFORMATION */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4 border-b-2 border-primary-500 pb-2">
                16. CONTACT INFORMATION
              </h2>
              <p className="text-gray-700 font-inter leading-relaxed mb-3">
                If you have questions, concerns, or complaints about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 font-inter"><strong>KisanConnect</strong></p>
                <p className="text-gray-700 font-inter">📧 Email: legal@kisanconnect.com</p>
                <p className="text-gray-700 font-inter">📧 Support: support@kisanconnect.com</p>
                <p className="text-gray-700 font-inter">📞 Phone: +91-XXXXXXXXXX</p>
                <p className="text-gray-700 font-inter">📍 Address: [Your Business Address, City, State, Pincode]</p>
              </div>
            </section>

            {/* ACKNOWLEDGMENT */}
            <section className="mb-8">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-6">
                <h2 className="text-2xl font-poppins font-bold text-amber-900 mb-4">📋 ACKNOWLEDGMENT</h2>
                <p className="text-gray-700 font-inter leading-relaxed mb-3">
                  By checking the acceptance box during registration, you acknowledge that:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 font-inter">
                  <li>You have read and understood these Terms of Service in their entirety.</li>
                  <li>You agree to be bound by these Terms and all policies referenced herein.</li>
                  <li>You understand the Exclusive Transaction Policy and agree to conduct ALL transactions through the Platform.</li>
                  <li>You acknowledge that all Platform communications are monitored for policy compliance.</li>
                  <li>You understand the penalties for violations, including account suspension and permanent ban.</li>
                  <li>You accept that admin decisions in disputes are final and binding.</li>
                </ul>
              </div>
            </section>

            {/* SPECIFIC WARNINGS */}
            <section className="mb-8">
              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6">
                <h2 className="text-2xl font-poppins font-bold text-red-700 mb-4">⚠️ SPECIFIC WARNINGS</h2>
                
                <h3 className="text-lg font-poppins font-bold text-red-700 mb-2">Platform Circumvention</h3>
                <p className="text-gray-700 font-inter leading-relaxed mb-4">
                  Attempting to bypass the Platform for transactions will result in immediate account suspension or permanent ban. 
                  All locked funds may be forfeited. We take this policy extremely seriously to protect the integrity of our marketplace.
                </p>

                <h3 className="text-lg font-poppins font-bold text-red-700 mb-2">Fraud Prevention</h3>
                <p className="text-gray-700 font-inter leading-relaxed mb-4">
                  Any fraudulent activity, including false product listings, fake delivery confirmations, or payment fraud, 
                  will result in immediate account termination and may lead to legal action and reporting to authorities.
                </p>

                <h3 className="text-lg font-poppins font-bold text-red-700 mb-2">Financial Risk</h3>
                <p className="text-gray-700 font-inter leading-relaxed">
                  Agricultural transactions involve inherent risks. While we provide a secure platform, we cannot guarantee 
                  financial outcomes. Users are responsible for conducting due diligence before entering into Contracts.
                </p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="mt-12 pt-6 border-t-2 border-gray-200 text-center">
              <p className="text-gray-600 font-inter text-sm">
                These Terms of Service were last updated on <strong>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
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

export default TermsOfService;
