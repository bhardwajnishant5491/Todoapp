import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiLoader,
  FiShield,
  FiSmartphone,
  FiWifi,
} from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getRoleTokens } from '../utils/designTokens';
import { depositFunds } from '../services/walletService';

const PaymentSimulation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleTokens = getRoleTokens(user?.role || 'farmer');

  const initialAmount = useMemo(() => {
    const raw = Number(searchParams.get('amount') || 0);
    return Number.isFinite(raw) && raw > 0 ? raw : 0;
  }, [searchParams]);

  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : '');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi | card
  const [upiApp, setUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('student@oksbi');
  const [formData, setFormData] = useState({
    cardName: user?.name || '',
    cardNumber: '4111111111111111',
    expiry: '12/30',
    cvv: '123',
  });
  const [step, setStep] = useState('input'); // input | processing | success
  const [progressPercent, setProgressPercent] = useState(8);
  const [processingText, setProcessingText] = useState('Initializing payment gateway...');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error('Enter a valid amount');
      return false;
    }
    if (numericAmount < 10) {
      toast.error('Minimum deposit amount is Rs 10');
      return false;
    }
    if (numericAmount > 100000) {
      toast.error('Maximum deposit amount is Rs 1,00,000');
      return false;
    }

    if (paymentMethod === 'card') {
      if (!formData.cardName.trim()) {
        toast.error('Card holder name is required');
        return false;
      }
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s+/g, ''))) {
        toast.error('Card number must be 16 digits');
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(formData.expiry)) {
        toast.error('Expiry format should be MM/YY');
        return false;
      }
      if (!/^\d{3}$/.test(formData.cvv)) {
        toast.error('CVV must be 3 digits');
        return false;
      }
    }

    if (paymentMethod === 'upi' && !/^.+@.+$/.test(upiId.trim())) {
      toast.error('Enter a valid UPI ID');
      return false;
    }

    return true;
  };

  const runSimulation = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setStep('processing');
    setProgressPercent(10);

    try {
      setProcessingText(paymentMethod === 'upi' ? `Opening ${upiApp.toUpperCase()} secure intent...` : 'Encrypting card details...');
      setProgressPercent(22);
      await new Promise((resolve) => setTimeout(resolve, 900));

      setProcessingText('Contacting acquiring bank...');
      setProgressPercent(46);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setProcessingText(paymentMethod === 'upi' ? 'Waiting for UPI collect approval...' : 'Running 3D Secure authentication...');
      setProgressPercent(70);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProcessingText('Processing transaction...');
      setProgressPercent(88);
      await new Promise((resolve) => setTimeout(resolve, 850));

      const response = await depositFunds(Number(amount));

      setProcessingText('Finalizing payment receipt...');
      setProgressPercent(100);
      await new Promise((resolve) => setTimeout(resolve, 700));

      setStep('success');
      toast.success(response.message || 'Funds added successfully');

      setTimeout(() => {
        navigate('/wallet');
      }, 1200);
    } catch (error) {
      toast.error(error || 'Payment failed in demo simulation');
      setStep('input');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <button
          onClick={() => navigate('/wallet')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <FiArrowLeft /> Back To Wallet
        </button>

        <div
          className="bg-white rounded-2xl p-6 border border-gray-100"
          style={{
            borderRadius: roleTokens.radius.card,
            boxShadow: '0 12px 30px rgba(14, 57, 80, 0.08)',
          }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #064E3B, #0EA5A2)' }}>
                <FiShield className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-poppins font-bold text-gray-900">KisanPay Secure Checkout</h1>
                <p className="text-xs text-gray-500 mt-1">Merchant: KisanConnect Private Limited</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">SSL Secured</span>
          </div>

          <p className="text-sm text-gray-600 mb-6">Simulation only for academic demonstration. No real money transfer occurs.</p>

          <div className="mb-5 bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Amount Payable</p>
            <p className="text-3xl font-bold text-gray-900">Rs {Number(amount || 0).toLocaleString('en-IN')}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <FiWifi />
              <span>Gateway Uptime: 99.98% (Demo)</span>
            </div>
          </div>

          {step === 'input' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${paymentMethod === 'upi' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-700'}`}
                >
                  <FiSmartphone className="inline mr-2" /> UPI Apps
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${paymentMethod === 'card' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 bg-white text-gray-700'}`}
                >
                  <FiCreditCard className="inline mr-2" /> Card
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs)</label>
                <input
                  type="number"
                  min="10"
                  max="100000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {paymentMethod === 'upi' && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Choose UPI App</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { key: 'gpay', label: 'Google Pay', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                      { key: 'phonepe', label: 'PhonePe', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                      { key: 'paytm', label: 'Paytm', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
                    ].map((app) => (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        key={app.key}
                        onClick={() => setUpiApp(app.key)}
                        className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${upiApp === app.key ? app.color : 'bg-white border-gray-200 text-gray-600'}`}
                      >
                        {app.label}
                      </motion.button>
                    ))}
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="name@oksbi"
                  />

                  <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-3 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-2">UPI QR Preview (Demo)</p>
                    <div className="w-24 h-24 bg-[linear-gradient(90deg,#000_10%,transparent_10%),linear-gradient(#000_10%,transparent_10%)] bg-[length:10px_10px] mx-auto opacity-80" />
                    <p className="text-[11px] text-gray-500 mt-2 text-center">Scan in selected app or continue with intent simulation</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                    <input
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cardName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength="16"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cardNumber: e.target.value.replace(/\D/g, '') }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength="5"
                        value={formData.expiry}
                        onChange={(e) => setFormData((prev) => ({ ...prev, expiry: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength="3"
                        value={formData.cvv}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-xs text-amber-700">
                This checkout is a demo simulation for project presentation. No real payment network is used.
              </div>

              <button
                onClick={runSimulation}
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-white font-semibold rounded-lg disabled:opacity-60"
                style={{ backgroundColor: roleTokens.primaryColor }}
              >
                {paymentMethod === 'upi' ? 'Pay With UPI (Demo)' : 'Pay With Card (Demo)'}
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center">
              <FiLoader className="mx-auto text-4xl animate-spin mb-4" style={{ color: roleTokens.primaryColor }} />
              <p className="text-gray-700 font-medium">{processingText}</p>
              <p className="text-sm text-gray-500 mt-2">Please do not close this screen...</p>
              <div className="mt-5 max-w-md mx-auto">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: roleTokens.primaryColor }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Transaction progress: {progressPercent}%</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 text-center">
              <FiCheckCircle className="mx-auto text-5xl text-emerald-600 mb-3" />
              <p className="text-xl font-bold text-gray-900">Payment Successful</p>
              <p className="text-sm text-gray-600 mt-2">Rs {Number(amount || 0).toLocaleString('en-IN')} added to your wallet.</p>
              <p className="text-xs text-gray-500 mt-1">Redirecting to wallet...</p>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PaymentSimulation;
