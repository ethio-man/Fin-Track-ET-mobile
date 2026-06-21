import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Colors from '../theme/colors';

const InvoiceDetailModal = ({ visible, invoice, onClose }) => {
  if (!invoice) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return Colors.success;
      case 'Pending': return Colors.warning;
      case 'Overdue': return Colors.danger;
      default: return Colors.textMute;
    }
  };

  const statusColor = getStatusColor(invoice.status);

  const generateHTML = () => {
    const watermarkColor = invoice.status === 'Paid' ? '#bbf7d0' : invoice.status === 'Overdue' ? '#fecaca' : '#fef08a';
    const statusClassColor = invoice.status === 'Paid' ? '#22c55e' : invoice.status === 'Overdue' ? '#ef4444' : '#f59e0b';
    
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', 'Helvetica', sans-serif; color: #111; margin: 0; padding: 40px; }
            .watermark { position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 100px; color: ${watermarkColor}; opacity: 0.35; font-weight: 900; letter-spacing: 4px; z-index: -1; text-transform: uppercase; user-select: none; }
            .header { display: flex; justify-content: space-between; border-bottom: 1px solid #f3f4f6; padding-bottom: 24px; margin-bottom: 24px; }
            .logo-placeholder { width: 32px; height: 32px; background: linear-gradient(135deg, #4f46e5, #9333ea); border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; margin-right: 8px; vertical-align: middle; }
            .company-name { font-size: 16px; font-weight: 600; color: #111; display: inline-block; vertical-align: middle; }
            .company-info { font-size: 11px; color: #6b7280; margin-top: 4px; line-height: 1.5; }
            .title { color: #4f46e5; font-size: 30px; font-weight: bold; letter-spacing: 2px; margin: 0; text-transform: uppercase; }
            .invoice-number { font-size: 14px; color: #4b5563; margin-top: 4px; }
            .status-badge { display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 500; margin-top: 8px; background-color: ${statusClassColor}20; color: ${statusClassColor}; }
            
            .dates-section { display: flex; justify-content: flex-end; gap: 24px; margin-bottom: 24px; }
            .date-block { text-align: right; }
            .date-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px; margin-bottom: 4px; }
            .date-val { font-size: 14px; font-weight: 500; color: #1f2937; }
            
            .bill-to-section { display: flex; background-color: #f9fafb; padding: 16px 24px; margin-bottom: 24px; }
            .bill-to-block { width: 50%; }
            .bill-to-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px; margin-bottom: 4px; }
            .bill-to-name { font-size: 14px; font-weight: 600; color: #1f2937; }
            .bill-to-info { font-size: 11px; color: #6b7280; margin-top: 2px; }
            
            .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            .table th { text-align: left; padding-bottom: 8px; border-bottom: 2px solid #4f46e5; color: #4338ca; font-size: 11px; font-weight: 600; }
            .table th.right { text-align: right; }
            .table td { padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 12px; color: #374151; font-weight: 500; }
            .table td.right { text-align: right; }
            
            .totals-section { display: flex; justify-content: flex-end; }
            .totals-block { width: 224px; }
            .totals-row { display: flex; justify-content: space-between; padding-bottom: 8px; font-size: 12px; color: #4b5563; }
            .totals-row.final { font-size: 14px; font-weight: bold; color: #4338ca; border-top: 2px solid #4f46e5; padding-top: 8px; margin-top: 4px; }
            
            .footer { position: fixed; bottom: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #6366f1, #a855f7); }
          </style>
        </head>
        <body>
          <div class="watermark">${invoice.status}</div>
          
          <div class="header">
            <div>
              <div style="margin-bottom: 4px;">
                <div class="logo-placeholder">FT</div>
                <div class="company-name">FinanceTrack Business</div>
              </div>
              <div class="company-info">business@financetrack.co &middot; +251 900 000 000<br/>Bole Sub-city, Addis Ababa, Ethiopia</div>
            </div>
            <div style="text-align: right;">
              <div class="title">INVOICE</div>
              <div class="invoice-number">${invoice.id}</div>
              <div class="status-badge">${invoice.status}</div>
            </div>
          </div>
          
          <div class="dates-section">
            <div class="date-block">
              <div class="date-label">Invoice Date</div>
              <div class="date-val">${invoice.date}</div>
            </div>
            <div class="date-block">
              <div class="date-label">Due Date</div>
              <div class="date-val">${invoice.date}</div>
            </div>
          </div>
          
          <div class="bill-to-section">
            <div class="bill-to-block">
              <div class="bill-to-label">From</div>
              <div class="bill-to-name">FinanceTrack Business</div>
              <div class="bill-to-info">Bole Sub-city, Addis Ababa<br/>TIN: 1234567890</div>
            </div>
            <div class="bill-to-block">
              <div class="bill-to-label">Bill To</div>
              <div class="bill-to-name">${invoice.client}</div>
              <div class="bill-to-info">Addis Ababa, Ethiopia</div>
            </div>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th style="width: 24px;">#</th>
                <th>PRODUCT NAME</th>
                <th class="right">QTY</th>
                <th class="right">UNIT PRICE</th>
                <th class="right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="color: #9ca3af;">1</td>
                <td>Services Rendered</td>
                <td class="right">1</td>
                <td class="right">${invoice.amount}</td>
                <td class="right" style="color: #111; font-weight: 600;">${invoice.amount}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="totals-section">
            <div class="totals-block">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>${invoice.amount}</span>
              </div>
              <div class="totals-row final">
                <span>TOTAL (ETB)</span>
                <span>${invoice.amount}</span>
              </div>
            </div>
          </div>
          
          <div class="footer"></div>
        </body>
      </html>
    `;
  };

  const handleExportPdf = async () => {
    try {
      const html = generateHTML();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error generating or sharing PDF', error);
      alert('Failed to export PDF');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={24} color={Colors.textCore} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invoice Details</Text>
          <TouchableOpacity onPress={handleExportPdf} style={styles.exportBtn}>
            <MaterialCommunityIcons name="printer" size={20} color="#FFF" />
            <Text style={styles.exportBtnText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.paper}>
            {/* Paper Top Design Line */}
            <View style={styles.paperTopLine} />
            
            <View style={styles.paperHeader}>
              <View>
                <View style={styles.brandContainer}>
                  <View style={styles.logoPlaceholder}><Text style={styles.logoText}>FT</Text></View>
                  <Text style={styles.companyName}>FinanceTrack Business</Text>
                </View>
              </View>
              <View style={styles.alignRight}>
                <Text style={styles.paperTitle}>INVOICE</Text>
                <Text style={styles.paperInvoiceId}>{invoice.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                  <Text style={[styles.statusText, { color: statusColor }]}>{invoice.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.datesRow}>
              <View style={styles.dateBlock}>
                <Text style={styles.dateLabel}>Invoice Date</Text>
                <Text style={styles.dateVal}>{invoice.date}</Text>
              </View>
              <View style={styles.dateBlock}>
                <Text style={styles.dateLabel}>Due Date</Text>
                <Text style={styles.dateVal}>{invoice.date}</Text>
              </View>
            </View>

            <View style={styles.billToSection}>
              <View style={styles.billToBlock}>
                <Text style={styles.billToLabel}>From</Text>
                <Text style={styles.billToName}>FinanceTrack Business</Text>
                <Text style={styles.billToInfo}>Bole Sub-city, Addis Ababa</Text>
              </View>
              <View style={styles.billToBlock}>
                <Text style={styles.billToLabel}>Bill To</Text>
                <Text style={styles.billToName}>{invoice.client}</Text>
                <Text style={styles.billToInfo}>Addis Ababa, Ethiopia</Text>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.thItem}>PRODUCT NAME</Text>
              <Text style={styles.thTotal}>TOTAL</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tdItem}>Services Rendered</Text>
              <Text style={styles.tdTotal}>{invoice.amount}</Text>
            </View>

            <View style={styles.totalsSection}>
              <View style={styles.totalsBlock}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalVal}>{invoice.amount}</Text>
                </View>
                <View style={styles.finalTotalRow}>
                  <Text style={styles.finalTotalLabel}>TOTAL (ETB)</Text>
                  <Text style={styles.finalTotalVal}>{invoice.amount}</Text>
                </View>
              </View>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCore,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderCore,
    backgroundColor: Colors.bgPanel,
  },
  closeBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textCore,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  exportBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  paper: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
    overflow: 'hidden',
  },
  paperTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: Colors.accent,
  },
  paperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 24,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 28,
    height: 28,
    backgroundColor: Colors.accent,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  paperTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent,
    letterSpacing: 1,
  },
  paperInvoiceId: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
    marginBottom: 24,
  },
  dateBlock: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  dateVal: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    marginTop: 2,
  },
  billToSection: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  billToBlock: {
    flex: 1,
  },
  billToLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: 4,
  },
  billToName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  billToInfo: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
    paddingBottom: 8,
    marginBottom: 8,
  },
  thItem: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.accent,
  },
  thTotal: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.accent,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tdItem: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  tdTotal: {
    fontSize: 12,
    color: '#111',
    fontWeight: '600',
    textAlign: 'right',
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  totalsBlock: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  totalVal: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: Colors.accent,
    marginTop: 4,
  },
  finalTotalLabel: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: 'bold',
  },
  finalTotalVal: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: 'bold',
  },
});

export default InvoiceDetailModal;
