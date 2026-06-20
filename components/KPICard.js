import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function KPICard({ title, value, change, isPositive, icon, color, vsLabel }) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>${value.toLocaleString()}</Text>
          <View style={styles.changeRow}>
            <MaterialCommunityIcons 
              name={isPositive ? "trending-up" : "trending-down"} 
              size={16} 
              color={isPositive ? Colors.success : Colors.danger} 
            />
            <Text style={[
              styles.changeText, 
              { color: isPositive ? Colors.success : Colors.danger }
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgPanel,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderCore,
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
    color: Colors.textSec,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    color: Colors.textCore,
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
    color: Colors.textMute,
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
