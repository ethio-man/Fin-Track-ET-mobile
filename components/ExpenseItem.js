import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';

const getCategoryMeta = (category, colors) => {
  const metaMap = {
    Rent:      { color: colors.category.Rent,      icon: 'home',               bg: 'rgba(124, 58, 237, 0.12)' },
    Salary:    { color: colors.category.Salary,    icon: 'account-group',      bg: 'rgba(249, 115, 22, 0.12)' },
    Transport: { color: colors.category.Transport, icon: 'car',                bg: 'rgba(20, 184, 166, 0.12)' },
    Utilities: { color: colors.category.Utilities, icon: 'lightning-bolt',     bg: 'rgba(59, 130, 246, 0.12)' },
    Other:     { color: colors.category.Other,     icon: 'dots-horizontal',    bg: 'rgba(236, 72, 153, 0.12)' },
  };
  return metaMap[category] || metaMap.Other;
};

export default function ExpenseItem({ expense }) {
  const { colors = Colors, formatCurrency } = useApp();
  const meta = getCategoryMeta(expense.category, colors);

  return (
    <View style={[styles.container, { borderBottomColor: colors.borderSubtle }]}>
      <View style={styles.left}>
        <View style={[styles.iconContainer, { backgroundColor: meta.bg }]}>
          <MaterialCommunityIcons name={meta.icon} size={20} color={meta.color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.description, { color: colors.textCore }]} numberOfLines={1}>{expense.description}</Text>
          <View style={styles.subTextContainer}>
            <Text style={[styles.category, { color: colors.textSec }]}>{expense.category}</Text>
            <Text style={[styles.dot, { color: colors.textMute }]}>•</Text>
            <Text style={[styles.date, { color: colors.textSec }]}>{expense.date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: colors.danger }]}>- {formatCurrency(expense.amount)}</Text>
        <Text style={[styles.id, { color: colors.textMute }]}>{expense.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  subTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 13,
  },
  dot: {
    marginHorizontal: 6,
    fontSize: 12,
  },
  date: {
    fontSize: 13,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  id: {
    fontSize: 12,
  },
});
