import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';

import { weeklyProfitData } from '../data/mockDashboard';

const screenWidth = Dimensions.get('window').width;

const getReports = (colors) => [
  { id: '1', title: 'Sales Summary', desc: 'Daily, weekly, and monthly sales data', icon: 'trending-up', color: colors.success },
  { id: '2', title: 'Expense Breakdown', desc: 'Expenses by category and date', icon: 'trending-down', color: colors.danger },
  { id: '3', title: 'Profit & Loss', desc: 'Overall business profitability', icon: 'scale-balance', color: colors.accent },
  { id: '4', title: 'Tax Report', desc: 'Estimated tax liabilities', icon: 'file-percent', color: colors.warning },
];

export default function ReportsScreen() {
  const { colors = Colors, currencyPrefix } = useApp();
  const styles = createStyles(colors);
  const REPORTS = getReports(colors);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgCore }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.summaryCard, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}>
          <Text style={[styles.summaryTitle, { color: colors.textCore }]}>Monthly Overview</Text>
          <View style={{ alignItems: 'center' }}>
            <BarChart
              data={{
                labels: weeklyProfitData.map(d => d.day),
                datasets: [
                  {
                    data: weeklyProfitData.map(d => d.revenue)
                  }
                ]
              }}
              width={screenWidth - 72}
              height={220}
              yAxisLabel={currencyPrefix}
              chartConfig={{
                backgroundColor: colors.bgPanel,
                backgroundGradientFrom: colors.bgPanel,
                backgroundGradientTo: colors.bgPanel,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(165, 180, 252, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textCore }]}>Available Reports</Text>
        
        <View style={styles.grid}>
          {REPORTS.map(report => (
            <TouchableOpacity key={report.id} style={[styles.reportCard, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}>
              <View style={[styles.iconContainer, { backgroundColor: `${report.color}20` }]}>
                <MaterialCommunityIcons name={report.icon} size={28} color={report.color} />
              </View>
              <Text style={[styles.reportTitle, { color: colors.textCore }]}>{report.title}</Text>
              <Text style={[styles.reportDesc, { color: colors.textSec }]}>{report.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCore,
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: colors.bgPanel,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderCore,
    marginBottom: 24,
  },
  summaryTitle: {
    color: colors.textCore,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: colors.bgPanelInner,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderStyle: 'dashed',
  },
  chartText: {
    color: colors.textMute,
    marginTop: 8,
    fontSize: 14,
  },
  sectionTitle: {
    color: colors.textCore,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  reportCard: {
    width: '47%',
    backgroundColor: colors.bgPanel,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderCore,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportTitle: {
    color: colors.textCore,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reportDesc: {
    color: colors.textSec,
    fontSize: 12,
    lineHeight: 18,
  },
});
