import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

import { weeklyProfitData } from '../data/mockDashboard';

const screenWidth = Dimensions.get('window').width;

const REPORTS = [
  { id: '1', title: 'Sales Summary', desc: 'Daily, weekly, and monthly sales data', icon: 'trending-up', color: Colors.success },
  { id: '2', title: 'Expense Breakdown', desc: 'Expenses by category and date', icon: 'trending-down', color: Colors.danger },
  { id: '3', title: 'Profit & Loss', desc: 'Overall business profitability', icon: 'scale-balance', color: Colors.accent },
  { id: '4', title: 'Tax Report', desc: 'Estimated tax liabilities', icon: 'file-percent', color: Colors.warning },
];

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Monthly Overview</Text>
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
              yAxisLabel="ETB "
              chartConfig={{
                backgroundColor: Colors.bgPanel,
                backgroundGradientFrom: Colors.bgPanel,
                backgroundGradientTo: Colors.bgPanel,
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

        <Text style={styles.sectionTitle}>Available Reports</Text>
        
        <View style={styles.grid}>
          {REPORTS.map(report => (
            <TouchableOpacity key={report.id} style={styles.reportCard}>
              <View style={[styles.iconContainer, { backgroundColor: `${report.color}20` }]}>
                <MaterialCommunityIcons name={report.icon} size={28} color={report.color} />
              </View>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDesc}>{report.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCore,
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: Colors.bgPanel,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderCore,
    marginBottom: 24,
  },
  summaryTitle: {
    color: Colors.textCore,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: Colors.bgPanelInner,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderStyle: 'dashed',
  },
  chartText: {
    color: Colors.textMute,
    marginTop: 8,
    fontSize: 14,
  },
  sectionTitle: {
    color: Colors.textCore,
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
    backgroundColor: Colors.bgPanel,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderCore,
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
    color: Colors.textCore,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reportDesc: {
    color: Colors.textSec,
    fontSize: 12,
    lineHeight: 18,
  },
});
