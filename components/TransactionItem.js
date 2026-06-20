import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function TransactionItem({ transaction }) {
  const isIncome = transaction.type === 'sale';
  
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: isIncome ? Colors.successBg : Colors.dangerBg }
        ]}>
          <MaterialCommunityIcons 
            name={isIncome ? "arrow-top-right" : "arrow-bottom-right"} 
            size={20} 
            color={isIncome ? Colors.success : Colors.danger} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.description} numberOfLines={1}>{transaction.description}</Text>
          <Text style={styles.date}>{transaction.date}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[
          styles.amount,
          { color: isIncome ? Colors.success : Colors.danger }
        ]}>
          {isIncome ? '+' : ''}
          {transaction.amount < 0 ? transaction.amount : `$${transaction.amount.toLocaleString()}`}
        </Text>
        <View style={[
          styles.dot,
          { backgroundColor: isIncome ? Colors.success : Colors.danger }
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
    borderBottomColor: Colors.borderSubtle,
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
    color: Colors.textCore,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    color: Colors.textSec,
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
