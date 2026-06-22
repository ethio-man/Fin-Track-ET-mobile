import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function TransactionItem({ transaction }) {
  const { colors = Colors, formatCurrency } = useApp();
  const isIncome = transaction.type === 'sale';
  
  return (
    <View style={[styles.container, { borderBottomColor: colors.borderSubtle }]}>
      <View style={styles.left}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: isIncome ? colors.successBg : colors.dangerBg }
        ]}>
          <MaterialCommunityIcons 
            name={isIncome ? "arrow-top-right" : "arrow-bottom-right"} 
            size={20} 
            color={isIncome ? colors.success : colors.danger} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.description, { color: colors.textCore }]} numberOfLines={1}>{transaction.description}</Text>
          <Text style={[styles.date, { color: colors.textSec }]}>{transaction.date}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[
          styles.amount,
          { color: isIncome ? colors.success : colors.danger }
        ]}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </Text>
        <View style={[
          styles.dot,
          { backgroundColor: isIncome ? colors.success : colors.danger }
        ]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
