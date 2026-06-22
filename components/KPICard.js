import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function KPICard({ title, value, change, isPositive, icon, color, vsLabel }) {
  const { colors = Colors, formatCurrency } = useApp();
  const styles = createStyles(colors);
  return (
    <View style={styles.card}>
      <View style={[styles.content, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore, borderRadius: 16, padding: 20 }]}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.textSec }]}>{title}</Text>
          <Text style={[styles.value, { color: colors.textCore }]}>{formatCurrency(value)}</Text>
          <View style={styles.changeRow}>
            <MaterialCommunityIcons 
              name={isPositive ? "trending-up" : "trending-down"} 
              size={16} 
              color={isPositive ? colors.success : colors.danger} 
            />
            <Text style={[
              styles.changeText, 
              { color: isPositive ? colors.success : colors.danger }
            ]}>
              {isPositive ? '+' : '-'}{Math.abs(change)}%
            </Text>
            <Text style={styles.vsLabel}>{vsLabel || 'vs yesterday'}</Text>
          </View>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <MaterialCommunityIcons name={icon} size={24} color="#FFF" />
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  vsLabel: {
    color: colors.textMute,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
