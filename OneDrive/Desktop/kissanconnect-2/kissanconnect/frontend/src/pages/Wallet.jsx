import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiCreditCard,
  FiArrowLeft,
  FiArrowUp,
  FiArrowDown,
  FiLock,
  FiDollarSign,
  FiRefreshCw,
} from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getRoleTokens } from '../utils/designTokens';
import {
  getWallet,
  requestWithdrawal,
  getTransactions,
  getWalletStats,
} from '../services/walletService';
import { Button, Card, Spinner, Badge, Modal, Input } from '../components/ui';

const Wallet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const roleTokens = getRoleTokens(user?.role || 'farmer');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [walletRes, transactionsRes, statsRes] = await Promise.all([
        getWallet(),
        getTransactions({ page: 1, limit: 10 }),
        getWalletStats(),
      ]);

      setWallet(walletRes.wallet);
      setTransactions(transactionsRes.transactions);
      setStats(statsRes.stats);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error(error || 'Failed to load wallet data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const handleProceedToPayment = () => {
    const amount = parseFloat(depositAmount);

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < 10) {
      toast.error('Minimum deposit amount is ₹10');
      return;
    }

    if (amount > 100000) {
      toast.error('Maximum deposit amount is ₹1,00,000');
      return;
    }

    setShowDepositModal(false);
    setDepositAmount('');
    navigate(`/wallet/add-funds?amount=${amount}`);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < 100) {
      toast.error('Minimum withdrawal amount is ₹100');
      return;
    }

    if (amount > wallet.availableBalance) {
      toast.error(`Insufficient balance. Available: ₹${wallet.availableBalance}`);
      return;
    }

    setProcessing(true);

    try {
      const response = await requestWithdrawal(amount);
      toast.success(response.message || 'Withdrawal requested successfully!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      fetchWalletData();
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error(error || 'Withdrawal failed');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getTypeIcon = (type) => {
    if (['deposit', 'contract_payment', 'refund'].includes(type)) {
      return <FiArrowDown className="text-green-600" />;
    }
    return <FiArrowUp className="text-red-600" />;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <FiArrowLeft /> Back
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiCreditCard className="text-3xl" style={{ color: roleTokens.primaryColor }} />
            <div>
              <h1 className="text-2xl font-poppins font-bold text-gray-900">My Wallet</h1>
              <p className="text-gray-600 font-inter">Manage your funds and transactions</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Balance</span>
              <FiCreditCard className="text-xl" style={{ color: roleTokens.primaryColor }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: roleTokens.primaryColor }}>
              ₹{wallet?.balance?.toLocaleString('en-IN') || 0}
            </p>
          </Card>
        </motion.div>

        {/* Available Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Available</span>
              <FiDollarSign className="text-xl text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₹{wallet?.availableBalance?.toLocaleString('en-IN') || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Can withdraw</p>
          </Card>
        </motion.div>

        {/* Locked Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Locked</span>
              <FiLock className="text-xl text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">
              ₹{wallet?.lockedAmount?.toLocaleString('en-IN') || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">In pending withdrawals</p>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="flex gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={() => setShowDepositModal(true)}
          variant="primary"
          icon={<FiArrowDown />}
          style={{ backgroundColor: roleTokens.primaryColor }}
        >
          Add Funds
        </Button>
        <Button
          onClick={() => {
            if (!wallet?.canWithdraw) {
              if (!user.bankDetails?.isVerified) {
                toast.error('Please add and verify bank details first');
                navigate('/settings');
              } else if (wallet?.availableBalance < 100) {
                toast.error('Minimum withdrawal amount is ₹100. You have ₹' + wallet.availableBalance + ' available');
              }
            } else {
              setShowWithdrawModal(true);
            }
          }}
          variant="secondary"
          icon={<FiArrowUp />}
          disabled={!wallet?.canWithdraw}
        >
          Withdraw
        </Button>
      </motion.div>
      
      {/* Withdrawal Help Text */}
      {!wallet?.canWithdraw && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Withdrawal disabled:</strong> 
            {!user.bankDetails?.isVerified && ' Please add and verify bank details in Settings.'}
            {user.bankDetails?.isVerified && wallet?.availableBalance < 100 && 
              ` Minimum withdrawal is ₹100. Available balance: ₹${wallet.availableBalance}`}
            {wallet?.lockedAmount > 0 && 
              ` (₹${wallet.lockedAmount} locked in active orders)`}
          </p>
        </motion.div>
      )}

      {/* Statistics */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card>
            <h3 className="text-lg font-bold mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-xl font-bold text-green-600">
                  ₹{stats.totalDeposits?.toLocaleString('en-IN') || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Withdrawals</p>
                <p className="text-xl font-bold text-red-600">
                  ₹{stats.totalWithdrawals?.toLocaleString('en-IN') || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-xl font-bold text-blue-600">
                  ₹{stats.totalEarnings?.toLocaleString('en-IN') || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Commission Paid</p>
                <p className="text-xl font-bold text-orange-600">
                  ₹{stats.totalCommission?.toLocaleString('en-IN') || 0}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(tx.type)}
                          <span className="text-sm capitalize">
                            {tx.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{tx.description}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            ['deposit', 'contract_payment', 'refund'].includes(tx.type)
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {['deposit', 'contract_payment', 'refund'].includes(tx.type) ? '+' : '-'}₹
                          {tx.amount?.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge color={getStatusColor(tx.status)}>{tx.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Deposit Modal */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => !processing && setShowDepositModal(false)}
        title="Add Funds"
        icon={<FiCreditCard />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹)
            </label>
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
              min="10"
              max="100000"
              disabled={processing}
            />
            <p className="text-xs text-gray-500 mt-1">Min: ₹10 | Max: ₹1,00,000</p>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Payment Gateway</strong>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              You will be redirected to a simulated payment page.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleProceedToPayment}
              variant="primary"
              disabled={processing || !depositAmount}
              className="flex-1"
              style={{ backgroundColor: roleTokens.primaryColor }}
            >
              Proceed To Payment
            </Button>
            <Button
              onClick={() => setShowDepositModal(false)}
              variant="secondary"
              disabled={processing}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => !processing && setShowWithdrawModal(false)}
        title="Withdraw Funds"
        icon={<FiArrowUp />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹)
            </label>
            <Input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              min="100"
              max={wallet?.availableBalance || 0}
              disabled={processing}
            />
            <p className="text-xs text-gray-500 mt-1">
              Available: ₹{wallet?.availableBalance?.toLocaleString('en-IN') || 0} | Min: ₹100
            </p>
          </div>

          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Withdrawal Process</strong>
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Withdrawals require admin approval and typically take 1-2 business days.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleWithdraw}
              variant="primary"
              disabled={processing || !withdrawAmount}
              className="flex-1"
              style={{ backgroundColor: roleTokens.primaryColor }}
            >
              {processing ? 'Processing...' : 'Request Withdrawal'}
            </Button>
            <Button
              onClick={() => setShowWithdrawModal(false)}
              variant="secondary"
              disabled={processing}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Wallet;
