/**
 * Export Utilities
 * Functions for exporting data to CSV and PDF formats
 */

/**
 * Convert array of objects to CSV string
 */
export const arrayToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';

  const headerRow = headers.join(',');
  const rows = data.map(item => 
    headers.map(header => {
      const value = item[header] !== undefined ? item[header] : '';
      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value).replace(/"/g, '""');
      return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
    }).join(',')
  );

  return [headerRow, ...rows].join('\n');
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Export crops data to CSV
 */
export const exportCropsToCSV = (crops) => {
  const headers = [
    'cropType',
    'quantity',
    'unit',
    'pricePerUnit',
    'totalValue',
    'quality',
    'harvestDate',
    'status',
    'village',
    'district',
    'state',
    'pincode'
  ];

  const formattedData = crops.map(crop => ({
    cropType: crop.cropType,
    quantity: crop.quantity,
    unit: crop.unit,
    pricePerUnit: crop.pricePerUnit,
    totalValue: crop.quantity * crop.pricePerUnit,
    quality: crop.quality,
    harvestDate: new Date(crop.harvestDate).toLocaleDateString(),
    status: crop.status,
    village: crop.location?.village || '',
    district: crop.location?.district || '',
    state: crop.location?.state || '',
    pincode: crop.location?.pincode || ''
  }));

  const csvContent = arrayToCSV(formattedData, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `crops-${timestamp}.csv`);
};

/**
 * Export contracts data to CSV
 */
export const exportContractsToCSV = (contracts) => {
  const headers = [
    'contractId',
    'cropType',
    'quantity',
    'unit',
    'pricePerUnit',
    'totalAmount',
    'status',
    'deliveryDate',
    'paymentTerms',
    'farmerName',
    'buyerName',
    'createdDate',
    'acceptedDate'
  ];

  const formattedData = contracts.map(contract => ({
    contractId: contract._id || contract.id,
    cropType: contract.cropId?.cropType || contract.cropType || 'N/A',
    quantity: contract.quantity,
    unit: contract.unit,
    pricePerUnit: contract.pricePerUnit,
    totalAmount: contract.totalAmount,
    status: contract.status,
    deliveryDate: new Date(contract.deliveryDate).toLocaleDateString(),
    paymentTerms: contract.paymentTerms || 'N/A',
    farmerName: contract.farmerId?.name || 'N/A',
    buyerName: contract.buyerId?.name || 'N/A',
    createdDate: new Date(contract.createdAt).toLocaleDateString(),
    acceptedDate: contract.acceptedAt ? new Date(contract.acceptedAt).toLocaleDateString() : 'N/A'
  }));

  const csvContent = arrayToCSV(formattedData, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `contracts-${timestamp}.csv`);
};

/**
 * Generate Contract PDF content (HTML string for printing)
 */
export const generateContractPDF = (contract) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Contract - ${contract._id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0;
          font-size: 28px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          background: #f3f4f6;
          padding: 10px 15px;
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 15px;
          border-left: 4px solid #2563eb;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px 30px;
        }
        .info-item {
          padding: 8px 0;
        }
        .label {
          font-weight: 600;
          color: #666;
          margin-right: 8px;
        }
        .value {
          color: #111;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-accepted { background: #d1fae5; color: #065f46; }
        .status-in-progress { background: #dbeafe; color: #1e40af; }
        .status-completed { background: #e5e7eb; color: #374151; }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .signature-section {
          margin-top: 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        }
        .signature-box {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid #333;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CONTRACT AGREEMENT</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px;">Contract ID: ${contract._id || 'N/A'}</p>
      </div>

      <div class="section">
        <div class="section-title">Contract Status</div>
        <div style="text-align: center; padding: 15px;">
          <span class="status-badge status-${contract.status.toLowerCase().replace(' ', '-')}">
            ${contract.status}
          </span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Parties Involved</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Farmer:</span>
            <span class="value">${contract.farmerId?.name || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="label">Buyer:</span>
            <span class="value">${contract.buyerId?.name || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="label">Farmer Phone:</span>
            <span class="value">${contract.farmerId?.phone || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="label">Buyer Phone:</span>
            <span class="value">${contract.buyerId?.phone || 'N/A'}</span>
          </div>
          ${contract.buyerId?.companyName ? `
          <div class="info-item" style="grid-column: span 2;">
            <span class="label">Company:</span>
            <span class="value">${contract.buyerId.companyName}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Contract Details</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Crop Type:</span>
            <span class="value">${contract.cropId?.cropType || contract.cropType || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="label">Quality:</span>
            <span class="value">${contract.cropId?.quality || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="label">Quantity:</span>
            <span class="value">${contract.quantity} ${contract.unit}</span>
          </div>
          <div class="info-item">
            <span class="label">Price per Unit:</span>
            <span class="value">₹${contract.pricePerUnit}/${contract.unit}</span>
          </div>
          <div class="info-item" style="grid-column: span 2; font-size: 18px; padding: 15px 0;">
            <span class="label">Total Amount:</span>
            <span class="value" style="font-weight: bold; color: #2563eb;">₹${contract.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Terms & Conditions</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Delivery Date:</span>
            <span class="value">${new Date(contract.deliveryDate).toLocaleDateString()}</span>
          </div>
          <div class="info-item">
            <span class="label">Payment Terms:</span>
            <span class="value">${contract.paymentTerms || 'N/A'}</span>
          </div>
          ${contract.deliveryAddress ? `
          <div class="info-item" style="grid-column: span 2;">
            <span class="label">Delivery Address:</span>
            <span class="value">
              ${contract.deliveryAddress.address}, ${contract.deliveryAddress.city}, 
              ${contract.deliveryAddress.state} - ${contract.deliveryAddress.pincode}
            </span>
          </div>
          ` : ''}
          ${contract.buyerNotes ? `
          <div class="info-item" style="grid-column: span 2;">
            <span class="label">Buyer Notes:</span>
            <span class="value">${contract.buyerNotes}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Timeline</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Created:</span>
            <span class="value">${new Date(contract.createdAt).toLocaleString()}</span>
          </div>
          ${contract.acceptedAt ? `
          <div class="info-item">
            <span class="label">Accepted:</span>
            <span class="value">${new Date(contract.acceptedAt).toLocaleString()}</span>
          </div>
          ` : ''}
          ${contract.completedAt ? `
          <div class="info-item">
            <span class="label">Completed:</span>
            <span class="value">${new Date(contract.completedAt).toLocaleString()}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div class="label">Farmer Signature</div>
          <div class="value">${contract.farmerId?.name || '_________________'}</div>
        </div>
        <div class="signature-box">
          <div class="label">Buyer Signature</div>
          <div class="value">${contract.buyerId?.name || '_________________'}</div>
        </div>
      </div>

      <div class="footer">
        <p>This is a legally binding contract. Both parties agree to the terms mentioned above.</p>
        <p style="margin-top: 10px;">Generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};

/**
 * Print Contract as PDF (opens print dialog)
 */
export const printContractPDF = (contract) => {
  const htmlContent = generateContractPDF(contract);
  
  // Create a new window with the content
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  } else {
    alert('Please allow popups to download PDF');
  }
};

/**
 * Export analytics data to CSV
 */
export const exportAnalyticsToCSV = (analyticsData) => {
  const headers = ['metric', 'value', 'period'];
  
  const formattedData = [
    { metric: 'Total Users', value: analyticsData.totalUsers || 0, period: analyticsData.period },
    { metric: 'Active Farmers', value: analyticsData.farmers || 0, period: analyticsData.period },
    { metric: 'Active Buyers', value: analyticsData.buyers || 0, period: analyticsData.period },
    { metric: 'Total Crops Listed', value: analyticsData.totalCrops || 0, period: analyticsData.period },
    { metric: 'Active Contracts', value: analyticsData.activeContracts || 0, period: analyticsData.period },
    { metric: 'Completed Contracts', value: analyticsData.completedContracts || 0, period: analyticsData.period },
    { metric: 'Total Revenue', value: analyticsData.totalRevenue || 0, period: analyticsData.period },
  ];

  const csvContent = arrayToCSV(formattedData, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `analytics-${timestamp}.csv`);
};

/**
 * Export disputes data to CSV
 */
export const exportDisputesToCSV = (disputes = []) => {
  const headers = [
    'disputeId',
    'title',
    'type',
    'status',
    'priority',
    'raisedBy',
    'raisedByRole',
    'against',
    'againstRole',
    'assignedTo',
    'messageCount',
    'resolution',
    'createdAt',
    'updatedAt',
    'resolvedAt'
  ];

  const formattedData = disputes.map((dispute) => ({
    disputeId: dispute._id || 'N/A',
    title: dispute.title || 'N/A',
    type: dispute.type || 'other',
    status: dispute.status || 'open',
    priority: dispute.priority || 'low',
    raisedBy: dispute.raisedBy?.name || 'N/A',
    raisedByRole: dispute.raisedBy?.role || 'N/A',
    against: dispute.against?.name || 'N/A',
    againstRole: dispute.against?.role || 'N/A',
    assignedTo: dispute.assignedTo?.name || 'Unassigned',
    messageCount: dispute.messages?.length || 0,
    resolution: dispute.resolution || '',
    createdAt: dispute.createdAt ? new Date(dispute.createdAt).toLocaleString() : '',
    updatedAt: dispute.updatedAt ? new Date(dispute.updatedAt).toLocaleString() : '',
    resolvedAt: dispute.resolvedAt ? new Date(dispute.resolvedAt).toLocaleString() : '',
  }));

  const csvContent = arrayToCSV(formattedData, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `disputes-report-${timestamp}.csv`);
};

/**
 * Export withdrawals data to CSV
 */
export const exportWithdrawalsToCSV = (withdrawals = []) => {
  const headers = [
    'withdrawalId',
    'userName',
    'userEmail',
    'amount',
    'status',
    'accountNumber',
    'bankName',
    'ifscCode',
    'createdAt',
    'updatedAt'
  ];

  const formattedData = withdrawals.map((withdrawal) => ({
    withdrawalId: withdrawal._id || 'N/A',
    userName: withdrawal.user?.name || withdrawal.relatedUser?.name || 'Unknown',
    userEmail: withdrawal.user?.email || withdrawal.relatedUser?.email || '',
    amount: withdrawal.amount || 0,
    status: withdrawal.status || 'pending',
    accountNumber: withdrawal.metadata?.bankDetails?.accountNumber || '',
    bankName: withdrawal.metadata?.bankDetails?.bankName || '',
    ifscCode: withdrawal.metadata?.bankDetails?.ifscCode || '',
    createdAt: withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleString() : '',
    updatedAt: withdrawal.updatedAt ? new Date(withdrawal.updatedAt).toLocaleString() : '',
  }));

  const csvContent = arrayToCSV(formattedData, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `withdrawals-report-${timestamp}.csv`);
};
