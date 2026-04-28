import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiSettings, FiSave, FiRotateCcw } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import { getAdminSettings, updateAdminSettings } from '../../services/adminService';

const defaultSettings = {
  platformFeePercent: 2,
  disputeSlaHours: 48,
  maxWithdrawalPerDay: 500000,
  supportEmail: 'support@kissanconnect.com',
  supportPhone: '+91-90000-00000',
  autoCloseResolvedDisputes: false,
};

const AdminSettings = () => {
  const roleTokens = getRoleTokens('admin');
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getAdminSettings();
        if (response?.settings) {
          setSettings({ ...defaultSettings, ...response.settings });
        }
      } catch (error) {
        console.error('Failed to load admin settings:', error);
        toast.error(typeof error === 'string' ? error : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (settings.platformFeePercent < 0 || settings.platformFeePercent > 15) {
      toast.error('Platform fee must be between 0 and 15%');
      return;
    }

    if (!settings.supportEmail.trim()) {
      toast.error('Support email is required');
      return;
    }

    setSaving(true);
    try {
      await updateAdminSettings(settings);
      toast.success('Admin settings saved successfully');
    } catch (error) {
      console.error('Failed to save admin settings:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults. Save to apply changes.');
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading settings...</div>
      ) : (
        <>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <FiSettings className="text-2xl" style={{ color: roleTokens.primaryColor }} />
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        </div>
        <p className="text-gray-600">Configure platform-level operational settings</p>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Fee (%)</label>
            <input
              type="number"
              min="0"
              max="15"
              value={settings.platformFeePercent}
              onChange={(e) => handleChange('platformFeePercent', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dispute SLA (hours)</label>
            <input
              type="number"
              min="1"
              value={settings.disputeSlaHours}
              onChange={(e) => handleChange('disputeSlaHours', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Withdrawal / Day (INR)</label>
            <input
              type="number"
              min="1000"
              value={settings.maxWithdrawalPerDay}
              onChange={(e) => handleChange('maxWithdrawalPerDay', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => handleChange('supportPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-3 mt-7">
            <input
              id="autoCloseResolvedDisputes"
              type="checkbox"
              checked={settings.autoCloseResolvedDisputes}
              onChange={(e) => handleChange('autoCloseResolvedDisputes', e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="autoCloseResolvedDisputes" className="text-sm text-gray-700">
              Auto-close resolved disputes after SLA period
            </label>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-white font-medium disabled:opacity-60 flex items-center gap-2"
            style={{ backgroundColor: roleTokens.primaryColor }}
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium flex items-center gap-2"
          >
            <FiRotateCcw /> Reset Defaults
          </button>
        </div>
      </motion.div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminSettings;
