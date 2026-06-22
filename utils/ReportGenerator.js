import { 
  profitLossData, monthlyProfitLoss, debtAgingData, debtCollectionSummary,
  taxSummary, taxBreakdown, expensesByCategory, cashFlowSummary, cashFlowData,
  topDebtors, topExpenseVendors
} from '../data/mockReports';

// Base CSS extracted from web application
const getReportCSS = (accent = '#2563eb') => `
  @page {
    size: A4 portrait;
    margin: 0;
  }
  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background: #fff;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  .report-page {
    width: 210mm;
    min-height: 297mm;
    background: #fff !important;
    page-break-after: always;
    break-after: page;
    position: relative;
    overflow: visible;
    box-sizing: border-box;
  }
  .report-page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* Cover Page */
  .cover-page { display: flex; flex-direction: column; background: #fff !important; font-family: Georgia, serif; }
  .cover-top-bar { height: 12mm; width: 100%; background-color: ${accent}; }
  .cover-accent-block { position: absolute; top: 0; right: 30mm; width: 28mm; height: 52mm; background-color: ${accent}; }
  .cover-accent-inner { position: absolute; top: 28mm; right: -8mm; width: 22mm; height: 22mm; border: 2px solid ${accent}; opacity: 0.3; }
  .cover-body { flex: 1; padding: 18mm 20mm 8mm 20mm; display: flex; flex-direction: column; gap: 14mm; }
  .cover-logo-area { display: flex; align-items: center; gap: 6mm; }
  .cover-logo-box { width: 18mm; height: 18mm; border: 2px solid ${accent}; border-radius: 3mm; display: flex; align-items: center; justify-content: center; font-size: 20pt; font-weight: 900; color: ${accent}; }
  .cover-logo-text { font-size: 8pt; font-style: italic; opacity: 0.6; color: ${accent}; }
  .cover-title-block { margin-top: 12mm; }
  .cover-title { font-size: 28pt; font-weight: 900; line-height: 1.1; margin: 0 0 4mm 0; color: ${accent}; }
  .cover-year { font-size: 14pt; font-weight: 700; margin-bottom: 10mm; color: ${accent}; }
  .cover-company-info { display: flex; flex-direction: column; gap: 2mm; }
  .cover-company-name { font-size: 12pt; font-weight: 700; color: #1a1a1a; }
  .cover-company-detail { font-size: 9pt; color: #555; line-height: 1.5; }
  
  .cover-footer { height: 38mm; padding: 8mm 20mm; display: flex; align-items: flex-start; gap: 20mm; margin-top: auto; background-color: ${accent}; box-sizing: border-box; }
  .cover-footer-col { display: flex; flex-direction: column; gap: 1.5mm; }
  .cover-footer-label { font-size: 8pt; color: rgba(255,255,255,0.75); margin-bottom: 1mm; }
  .cover-footer-name { font-size: 10pt; font-weight: 700; color: #fff; }
  .cover-footer-detail { font-size: 8pt; color: rgba(255,255,255,0.85); }

  /* PFS Statement Page */
  .pfs-page { padding: 0; display: flex; flex-direction: column; font-family: 'Inter', system-ui, sans-serif; }
  .pfs-header { background-color: #e6f0fa; padding: 6mm 0; text-align: center; margin-top: 15mm; margin-bottom: 6mm; }
  .pfs-header h1 { color: #2563eb; font-size: 16pt; font-weight: 700; margin: 0; letter-spacing: 0.05em; }
  
  .pfs-meta { display: flex; justify-content: space-between; padding: 0 15mm; font-size: 9pt; color: #1a1a1a; margin-bottom: 4mm; }
  .pfs-info-grid { display: flex; margin: 0 15mm 10mm; border: 1px solid #d1d5db; }
  .pfs-info-col { flex: 1; border-right: 1px solid #d1d5db; }
  .pfs-info-col:last-child { border-right: none; }
  .pfs-info-header { font-size: 9pt; font-weight: 600; color: #1e40af; padding: 3mm 4mm; border-bottom: 1px solid #d1d5db; background-color: #f8fafc; }
  .pfs-info-row { display: flex; padding: 2.5mm 4mm; border-bottom: 1px solid #e5e7eb; font-size: 8.5pt; }
  .pfs-info-row:last-child { border-bottom: none; }
  .pfs-info-row span:first-child { width: 35%; color: #4b5563; font-weight: 500; }
  .pfs-info-row span:last-child { flex: 1; color: #111827; }

  .pfs-data-table { margin: 0 15mm; border: 1px solid #d1d5db; }
  .pfs-data-header { display: flex; background-color: #3b82f6; color: #ffffff; font-size: 9pt; font-weight: 600; }
  .pfs-col-header { flex: 1; display: flex; padding: 3mm 4mm; border-right: 1px solid #60a5fa; }
  .pfs-col-header:last-child { border-right: none; }
  .pfs-amount-col { width: 35%; text-align: right; border-left: 1px solid #60a5fa; padding-left: 4mm; margin-left: auto; }
  
  .pfs-data-row { display: flex; background-color: #ffffff; border-bottom: 1px solid #e5e7eb; }
  .pfs-data-row:nth-child(even) { background-color: #f8fafc; }
  .pfs-cell-group { flex: 1; display: flex; border-right: 1px solid #d1d5db; }
  .pfs-cell-group:last-child { border-right: none; }
  .pfs-cell-label { flex: 1; padding: 2.5mm 4mm; font-size: 8.5pt; color: #374151; }
  .pfs-cell-value { width: 35%; padding: 2.5mm 4mm; text-align: right; font-size: 8.5pt; color: #111827; border-left: 1px solid #e5e7eb; }

  .pfs-data-footer { display: flex; background-color: #f1f5f9; font-weight: 700; }
  .pfs-footer-group { flex: 1; display: flex; border-right: 1px solid #d1d5db; }
  .pfs-footer-group:last-child { border-right: none; }
  .pfs-footer-label { flex: 1; padding: 3mm 4mm; font-size: 9pt; color: #0369a1; text-align: right; }
  .pfs-footer-value { width: 35%; padding: 3mm 4mm; text-align: right; font-size: 9pt; color: #0369a1; border-left: 1px solid #e5e7eb; }
`;

const generateCoverPage = (settings) => `
  <div class="report-page cover-page">
    <div class="cover-top-bar">
      <div class="cover-accent-block">
        <div class="cover-accent-inner"></div>
      </div>
    </div>
    <div class="cover-body">
      <div class="cover-logo-area">
        <div class="cover-logo-box">${settings.companyName.charAt(0).toUpperCase()}</div>
        <span class="cover-logo-text">[COMPANY'S LOGO]</span>
      </div>
      <div class="cover-title-block">
        <h1 class="cover-title">${settings.reportTitle.toUpperCase()}</h1>
        <div class="cover-year">[${settings.year}]</div>
        <div class="cover-company-info">
          <div class="cover-company-name">${settings.companyName}</div>
          <div class="cover-company-detail">${settings.companyAddress}</div>
          <div class="cover-company-detail">${settings.companyContact}</div>
          <div class="cover-company-detail">${settings.companyEmail}</div>
        </div>
      </div>
    </div>
    <div class="cover-footer">
      <div class="cover-footer-col">
        <div class="cover-footer-label">Prepared by:</div>
        <div class="cover-footer-name">[${settings.preparedByName}]</div>
        <div class="cover-footer-detail">${settings.preparedByTitle}</div>
        <div class="cover-footer-detail">${settings.preparedByContact}</div>
      </div>
      <div class="cover-footer-col">
        <div class="cover-footer-label">Prepared for:</div>
        <div class="cover-footer-name">[${settings.preparedForName}]</div>
        <div class="cover-footer-detail">${settings.preparedForTitle}</div>
        <div class="cover-footer-detail">${settings.preparedForContact}</div>
      </div>
    </div>
  </div>
`;

const generatePfsTemplate = (opts) => {
  const {
    settings, title, leftTitle, leftRows, leftTotalLabel, leftTotal,
    rightTitle, rightRows, rightTotalLabel, rightTotal, showMetaGrid = false
  } = opts;

  const maxRows = Math.max(leftRows.length, rightRows.length);
  const normalizedLeft = [...leftRows];
  const normalizedRight = [...rightRows];

  while (normalizedLeft.length < maxRows) normalizedLeft.push({ label: '', value: '' });
  while (normalizedRight.length < maxRows) normalizedRight.push({ label: '', value: '' });

  const rowsHtml = Array.from({ length: maxRows }).map((_, i) => `
    <div class="pfs-data-row">
      <div class="pfs-cell-group">
        <div class="pfs-cell-label">${normalizedLeft[i].label}</div>
        <div class="pfs-cell-value">${normalizedLeft[i].value}</div>
      </div>
      <div class="pfs-cell-group">
        <div class="pfs-cell-label">${normalizedRight[i].label}</div>
        <div class="pfs-cell-value">${normalizedRight[i].value}</div>
      </div>
    </div>
  `).join('');

  const metaHtml = showMetaGrid ? `
    <div class="pfs-meta">
      <div><span>Submitted To:</span> <strong>${settings.preparedForName}</strong></div>
      <div><span>Date:</span> <strong>${new Date().toLocaleDateString()}</strong></div>
    </div>
    <div class="pfs-info-grid">
      <div class="pfs-info-col">
        <div class="pfs-info-header">Company Details</div>
        <div class="pfs-info-row"><span>Name :</span> <span>${settings.companyName}</span></div>
        <div class="pfs-info-row"><span>Address :</span> <span>${settings.companyAddress}</span></div>
        <div class="pfs-info-row"><span>Contact No :</span> <span>${settings.companyContact}</span></div>
        <div class="pfs-info-row"><span>Email :</span> <span>${settings.companyEmail}</span></div>
        <div class="pfs-info-row"><span>Period :</span> <span>${settings.year}</span></div>
        <div class="pfs-info-row"><span>Type :</span> <span>Business Profile</span></div>
      </div>
      <div class="pfs-info-col">
        <div class="pfs-info-header">Prepared By</div>
        <div class="pfs-info-row"><span>Name :</span> <span>${settings.preparedByName}</span></div>
        <div class="pfs-info-row"><span>Title :</span> <span>${settings.preparedByTitle}</span></div>
        <div class="pfs-info-row"><span>Contact No :</span> <span>${settings.preparedByContact}</span></div>
        <div class="pfs-info-row"><span>Client/For :</span> <span>${settings.preparedForName}</span></div>
        <div class="pfs-info-row"><span>Date Generated :</span> <span>${new Date().toLocaleDateString()}</span></div>
        <div class="pfs-info-row"><span>Signature :</span> <span style="border-bottom: 1px solid #000; width: 80px; display: inline-block;"></span></div>
      </div>
    </div>
  ` : '';

  return `
    <div class="report-page pfs-page">
      <div class="pfs-header">
        <h1>${title.toUpperCase()}</h1>
      </div>
      ${metaHtml}
      <div class="pfs-data-table">
        <div class="pfs-data-header">
          <div class="pfs-col-header"><span>${leftTitle}</span> <span class="pfs-amount-col">Amount</span></div>
          <div class="pfs-col-header"><span>${rightTitle}</span> <span class="pfs-amount-col">Amount</span></div>
        </div>
        ${rowsHtml}
        <div class="pfs-data-footer">
          <div class="pfs-footer-group">
            <span class="pfs-footer-label">${leftTotalLabel}</span>
            <span class="pfs-footer-value">${leftTotal}</span>
          </div>
          <div class="pfs-footer-group">
            <span class="pfs-footer-label">${rightTotalLabel}</span>
            <span class="pfs-footer-value">${rightTotal}</span>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Data Formatter
const fmt = (n, currencyPrefix) => `${currencyPrefix}${Number(n).toLocaleString()}`;

// Report Generators
export const getProfitLossData = (settings, currencyPrefix) => {
  const leftRows = monthlyProfitLoss.map(m => ({ label: `${m.month} Revenue`, value: fmt(m.revenue, currencyPrefix) }));
  const rightRows = expensesByCategory.map(e => ({ label: e.name, value: fmt(e.amount, currencyPrefix) }));
  
  return generatePfsTemplate({
    settings,
    title: "PROFIT & LOSS STATEMENT",
    leftTitle: "Revenue Breakdown",
    leftRows,
    leftTotalLabel: "Total Revenue",
    leftTotal: fmt(profitLossData.revenue, currencyPrefix),
    rightTitle: "Operating Expenses",
    rightRows,
    rightTotalLabel: "Total Expenses",
    rightTotal: fmt(profitLossData.expenses, currencyPrefix),
    showMetaGrid: true
  });
};

export const getDebtData = (settings, currencyPrefix) => {
  const leftRows = debtAgingData.map(d => ({ label: `Receivables: ${d.category}`, value: fmt(d.amount, currencyPrefix) }));
  const rightRows = topDebtors.map(d => ({ label: `${d.name} (${d.daysOverdue} days)`, value: fmt(d.amount, currencyPrefix) }));
  
  return generatePfsTemplate({
    settings,
    title: "DEBT & RECEIVABLES STATEMENT",
    leftTitle: "Aging Schedule",
    leftRows,
    leftTotalLabel: "Total Receivables",
    leftTotal: fmt(debtCollectionSummary.totalReceivables, currencyPrefix),
    rightTitle: "Top Outstanding Debtors",
    rightRows,
    rightTotalLabel: "Net Position",
    rightTotal: fmt(debtCollectionSummary.netPosition, currencyPrefix)
  });
};

export const getTaxData = (settings, currencyPrefix) => {
  const leftRows = [
    { label: 'Gross Sales / Revenue', value: fmt(taxSummary.totalSales, currencyPrefix) },
    { label: 'Less: Exemptions', value: fmt(taxSummary.totalSales - taxSummary.taxableAmount, currencyPrefix) },
    { label: 'Net Taxable Amount', value: fmt(taxSummary.taxableAmount, currencyPrefix) }
  ];
  const rightRows = taxBreakdown.map(t => ({ label: t.category, value: fmt(t.amount, currencyPrefix) }));
  
  return generatePfsTemplate({
    settings,
    title: "TAX & LIABILITY STATEMENT",
    leftTitle: "Income Assessment",
    leftRows,
    leftTotalLabel: "Total Taxable",
    leftTotal: fmt(taxSummary.taxableAmount, currencyPrefix),
    rightTitle: "Tax Obligations",
    rightRows,
    rightTotalLabel: "Total Tax Liability",
    rightTotal: fmt(taxSummary.totalTaxLiability, currencyPrefix)
  });
};

export const getExpenseData = (settings, currencyPrefix) => {
  const leftRows = expensesByCategory.map(e => ({ label: e.name, value: fmt(e.amount, currencyPrefix) }));
  const rightRows = topExpenseVendors.map(v => ({ label: `${v.name} (${v.category})`, value: fmt(v.amount, currencyPrefix) }));
  const totalExpenses = expensesByCategory.reduce((sum, e) => sum + e.amount, 0);

  return generatePfsTemplate({
    settings,
    title: "OPERATING EXPENSE STATEMENT",
    leftTitle: "Expenses by Category",
    leftRows,
    leftTotalLabel: "Total Categorized",
    leftTotal: fmt(totalExpenses, currencyPrefix),
    rightTitle: "Top Vendors/Suppliers",
    rightRows,
    rightTotalLabel: "Total Vendor Spend",
    rightTotal: fmt(topExpenseVendors.reduce((sum, v) => sum + v.amount, 0), currencyPrefix)
  });
};

export const getCashFlowData = (settings, currencyPrefix) => {
  const leftRows = cashFlowData.map(c => ({ label: `${c.day} Cash Inflow`, value: fmt(c.cashIn, currencyPrefix) }));
  const rightRows = cashFlowData.map(c => ({ label: `${c.day} Cash Outflow`, value: fmt(c.cashOut, currencyPrefix) }));

  return generatePfsTemplate({
    settings,
    title: "CASH FLOW STATEMENT",
    leftTitle: "Cash Inflows",
    leftRows,
    leftTotalLabel: "Total Cash In",
    leftTotal: fmt(cashFlowSummary.totalCashIn, currencyPrefix),
    rightTitle: "Cash Outflows",
    rightRows,
    rightTotalLabel: "Total Cash Out",
    rightTotal: fmt(cashFlowSummary.totalCashOut, currencyPrefix)
  });
};

export const generateHTMLReport = (reportType, settings, currencyPrefix) => {
  const baseHtml = (content) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${getReportCSS(settings.accentColor)}</style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;

  let contentHtml = '';

  if (reportType === 'ALL') {
    contentHtml = `
      ${generateCoverPage(settings)}
      ${getProfitLossData(settings, currencyPrefix)}
      ${getDebtData(settings, currencyPrefix)}
      ${getTaxData(settings, currencyPrefix)}
      ${getExpenseData(settings, currencyPrefix)}
      ${getCashFlowData(settings, currencyPrefix)}
    `;
  } else {
    // Determine which single report to generate
    contentHtml += generateCoverPage(settings);
    if (reportType === 'Profit & Loss') contentHtml += getProfitLossData(settings, currencyPrefix);
    if (reportType === 'Sales Summary' || reportType === 'Debt & Receivables') contentHtml += getDebtData(settings, currencyPrefix);
    if (reportType === 'Tax Report') contentHtml += getTaxData(settings, currencyPrefix);
    if (reportType === 'Expense Breakdown') contentHtml += getExpenseData(settings, currencyPrefix);
    if (reportType === 'Cash Flow') contentHtml += getCashFlowData(settings, currencyPrefix);
  }

  return baseHtml(contentHtml);
};
