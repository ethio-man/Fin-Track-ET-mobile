import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';
import { generateHTMLReport } from '../utils/ReportGenerator';
import {
  profitLossData, monthlyProfitLoss, debtCollectionSummary, debtAgingData,
  taxSummary, taxBreakdown, expensesByCategory, topExpenseVendors
} from '../data/mockReports';

const ReportSummaryModal = ({ visible, reportType, onClose }) => {
  const { colors = Colors, currencyPrefix } = useApp();
  const styles = createStyles(colors);

  if (!visible) return null;

  const handleExportPdf = async () => {
    try {
      const settings = {
        companyName: 'Girma Trading PLC',
        companyAddress: 'Bole Road, Addis Ababa, Ethiopia',
        companyContact: '+251 11 234 5678',
        companyEmail: 'contact@girmatrading.et',
        reportTitle: reportType === 'ALL' ? 'Financial Report' : `${reportType} Report`,
        year: '2025',
        preparedByName: 'Abebe Girma',
        preparedByTitle: 'Business Owner',
        preparedByContact: '+251 91 234 5678',
        preparedForName: 'Internal Management',
        preparedForTitle: 'Executive Team',
        preparedForContact: 'N/A',
        accentColor: colors.accent,
      };

      const htmlContent = generateHTMLReport(reportType, settings, currencyPrefix);

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Share ${reportType} PDF`,
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const renderSummaryContent = () => {
    if (reportType === 'Profit & Loss') {
      return (
        <View>
          <SummaryRow label="Total Revenue" value={`${currencyPrefix}${profitLossData.revenue}`} />
          <SummaryRow label="Total Expenses" value={`${currencyPrefix}${profitLossData.expenses}`} />
          <SummaryRow label="Net Profit" value={`${currencyPrefix}${profitLossData.netProfit}`} isPositive={true} />
          <SummaryRow label="Profit Margin" value={`${profitLossData.profitMargin}%`} />
        </View>
      );
    }
    if (reportType === 'Sales Summary') {
      return (
        <View>
          <SummaryRow label="Total Receivables" value={`${currencyPrefix}${debtCollectionSummary.totalReceivables}`} />
          <SummaryRow label="Net Position" value={`${currencyPrefix}${debtCollectionSummary.netPosition}`} />
          <SummaryRow label="Collection Rate" value={`${debtCollectionSummary.collectionRate}%`} />
          <SummaryRow label="Current Debt" value={`${currencyPrefix}${debtAgingData[0].amount}`} />
        </View>
      );
    }
    if (reportType === 'Tax Report') {
      return (
        <View>
          <SummaryRow label="Gross Sales" value={`${currencyPrefix}${taxSummary.totalSales}`} />
          <SummaryRow label="Net Taxable Amount" value={`${currencyPrefix}${taxSummary.taxableAmount}`} />
          <SummaryRow label="VAT Collected" value={`${currencyPrefix}${taxSummary.vatCollected}`} />
          <SummaryRow label="Total Tax Liability" value={`${currencyPrefix}${taxSummary.totalTaxLiability}`} />
        </View>
      );
    }
    if (reportType === 'Expense Breakdown') {
      const totalExpenses = expensesByCategory.reduce((sum, e) => sum + e.amount, 0);
      return (
        <View>
          <SummaryRow label="Total Categorized Expenses" value={`${currencyPrefix}${totalExpenses}`} />
          {expensesByCategory.slice(0, 3).map((e, idx) => (
            <SummaryRow key={idx} label={`Top: ${e.name}`} value={`${currencyPrefix}${e.amount}`} />
          ))}
        </View>
      );
    }
    return <Text style={styles.placeholderText}>Summary data for {reportType} will appear here.</Text>;
  };

  const SummaryRow = ({ label, value, isPositive }) => (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, isPositive && { color: colors.success }]}>{value}</Text>
    </View>
  );

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
            <MaterialCommunityIcons name="close" size={24} color={colors.textCore} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{reportType} Summary</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Overview</Text>
            {renderSummaryContent()}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleExportPdf} style={styles.exportBtn}>
            <MaterialCommunityIcons name="printer" size={20} color="#FFF" />
            <Text style={styles.exportBtnText}>Export PDF</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCore,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderCore,
    backgroundColor: colors.bgPanel,
  },
  closeBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textCore,
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: colors.bgPanel,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderCore,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textCore,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSec,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textCore,
  },
  placeholderText: {
    color: colors.textMute,
    fontStyle: 'italic',
  },
  footer: {
    padding: 16,
    backgroundColor: colors.bgPanel,
    borderTopWidth: 1,
    borderTopColor: colors.borderCore,
  },
  exportBtn: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  exportBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportSummaryModal;
