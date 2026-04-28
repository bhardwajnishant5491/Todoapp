import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config' // Initialize i18n
import App from './App.jsx'

// Digital Fingerprint - Developer Signature (Hidden)
const _dev_signature = btoa('ShivrajSinghChundawat_LPU_2022-2026_singhshivraj1408@gmail.com');
const _project_hash = 'KisanConnect_Digital_Farming_Platform_2026';

// Console Watermark - Visible only in Browser DevTools (F12)
console.log(
  '%c╔══════════════════════════════════════════════════════════════╗',
  'color: #10B981; font-weight: bold; font-size: 12px;'
);
console.log(
  '%c║         🌾 KISANCONNECT - Digital Farming Platform         ║',
  'color: #10B981; font-weight: bold; font-size: 14px;'
);
console.log(
  '%c╠══════════════════════════════════════════════════════════════╣',
  'color: #10B981; font-weight: bold; font-size: 12px;'
);
console.log(
  '%c║  Developer: Shivraj Singh Chundawat                         ║',
  'color: #3B82F6; font-size: 12px;'
);
console.log(
  '%c║  Email: singhshivraj1408@gmail.com                          ║',
  'color: #3B82F6; font-size: 12px;'
);
console.log(
  '%c║  Institution: Lovely Professional University                ║',
  'color: #3B82F6; font-size: 12px;'
);
console.log(
  '%c║  Batch: 2022-2026                                           ║',
  'color: #3B82F6; font-size: 12px;'
);
console.log(
  '%c║  Project: Capstone - Smart Contract Farming Platform       ║',
  'color: #3B82F6; font-size: 12px;'
);
console.log(
  '%c║  Version: 1.0.0 | Built: February 2026                     ║',
  'color: #F59E0B; font-size: 12px;'
);
console.log(
  '%c╠══════════════════════════════════════════════════════════════╣',
  'color: #10B981; font-weight: bold; font-size: 12px;'
);
console.log(
  '%c║  © 2026 All Rights Reserved                                 ║',
  'color: #EF4444; font-weight: bold; font-size: 12px;'
);
console.log(
  '%c║  ⚠️  Unauthorized use or reproduction is prohibited          ║',
  'color: #EF4444; font-size: 11px;'
);
console.log(
  '%c╚══════════════════════════════════════════════════════════════╝',
  'color: #10B981; font-weight: bold; font-size: 12px;'
);
console.log('\n');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
