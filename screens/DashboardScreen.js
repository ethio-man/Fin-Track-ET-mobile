import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import KPICard from '../components/KPICard';
import TransactionItem from '../components/TransactionItem';
import { kpiData, recentTransactions, weeklyProfitData, expenseBreakdown } from '../data/mockDashboard';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accentLight} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey Mariana - here's what's happening today</Text>
          <Text style={styles.title}>Financial Overview</Text>
        </View>

        <View style={styles.kpiGrid}>
          <KPICard 
            title="TODAY'S SALES" 
            value={kpiData.todaysSales.value} 
            change={kpiData.todaysSales.change} 
            isPositive={kpiData.todaysSales.isPositive} 
            icon="cart-outline" 
            color={Colors.chart.indigo} 
          />
          <KPICard 
            title="PROFIT" 
            value={kpiData.profit.value} 
            change={kpiData.profit.change} 
            isPositive={kpiData.profit.isPositive} 
            icon="trending-up" 
            color={Colors.chart.green} 
          />
          <KPICard 
            title="EXPENSES" 
            value={kpiData.expenses.value} 
            change={kpiData.expenses.change} 
            isPositive={kpiData.expenses.isPositive} 
            icon="credit-card-outline" 
            color={Colors.chart.orange} 
          />
          <KPICard 
            title="CASH BALANCE" 
            value={kpiData.cashBalance.value} 
            change={kpiData.cashBalance.change} 
            isPositive={kpiData.cashBalance.isPositive} 
            icon="wallet-outline" 
            color={Colors.chart.blue} 
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Text style={styles.seeAll}>SEE ALL</Text>
          </View>
          <View style={styles.card}>
            {recentTransactions.map((tx, index) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Performance</Text>
          <View style={[styles.card, { padding: 0, paddingVertical: 16, alignItems: 'center' }]}>
            <LineChart
              data={{
                labels: weeklyProfitData.map(d => d.day),
                datasets: [
                  {
                    data: weeklyProfitData.map(d => d.revenue),
                    color: (opacity = 1) => `rgba(165, 180, 252, ${opacity})`, // Indigo
                    strokeWidth: 2
                  },
                  {
                    data: weeklyProfitData.map(d => d.profit),
                    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green
                    strokeWidth: 2
                  }
                ],
                legend: ["Revenue", "Profit"]
              }}
              width={screenWidth - 32} // from react-native
              height={220}
              yAxisLabel="ETB "
              chartConfig={{
                backgroundColor: Colors.bgPanel,
                backgroundGradientFrom: Colors.bgPanel,
                backgroundGradientTo: Colors.bgPanel,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`, // Muted text for grid/labels
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expense Breakdown</Text>
          <View style={styles.card}>
            <PieChart
              data={expenseBreakdown.map(item => ({
                name: item.name,
                population: item.value,
                color: item.color,
                legendFontColor: Colors.textSec,
                legendFontSize: 12
              }))}
              width={screenWidth - 64}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: Colors.chart.indigo }]}
              onPress={() => navigation.navigate('SalesTab', { openAddModal: true })}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
              <Text style={styles.actionText}>Quick Sale</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: Colors.chart.orange }]}
              onPress={() => navigation.navigate('ExpensesTab', { openAddModal: true })}
            >
              <MaterialCommunityIcons name="credit-card" size={24} color="#FFF" />
              <Text style={styles.actionText}>Record Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: Colors.chart.green }]}
              onPress={() => navigation.navigate('MoreTab', { screen: 'Debts', params: { openAddModal: true } })}
            >
              <MaterialCommunityIcons name="currency-usd" size={24} color="#FFF" />
              <Text style={styles.actionText}>Add Debt</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: Colors.chart.blue }]}
              onPress={() => navigation.navigate('MoreTab', { screen: 'Reports' })}
            >
              <MaterialCommunityIcons name="file-document-outline" size={24} color="#FFF" />
              <Text style={styles.actionText}>View Reports</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    color: Colors.textSec,
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    color: Colors.textCore,
    fontSize: 24,
    fontWeight: 'bold',
  },
  kpiGrid: {
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.textCore,
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: Colors.accentLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: Colors.bgPanel,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderCore,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
