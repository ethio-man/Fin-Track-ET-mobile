import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function SaleCard({ sale, onPress }) {
  const { colors = Colors, formatCurrency } = useApp();
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'complete': return colors.success;
      case 'pending': return colors.warning;
      case 'canceled': return colors.danger;
      default: return colors.textSec;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'complete': return colors.successBg;
      case 'pending': return colors.warningBg;
      case 'canceled': return colors.dangerBg;
      default: return colors.bgPanelInner;
    }
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'cash': return 'wallet';
      case 'telebirr': return 'cellphone';
      case 'bank': return 'bank';
      case 'credit': return 'credit-card';
      default: return 'cash';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.customerInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>{getInitials(sale.customer)}</Text>
          </View>
          <View>
            <Text style={[styles.customerName, { color: colors.textCore }]}>{sale.customer}</Text>
            <Text style={[styles.saleId, { color: colors.textSec }]}>{sale.id} • {sale.date}</Text>
          </View>
        </View>
        <Text style={[styles.total, { color: colors.textCore }]}>{formatCurrency(sale.total)}</Text>
      </View>
      
      <View style={[styles.footer, { borderTopColor: colors.borderSubtle }]}>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: colors.bgPanelInner }]}>
            <MaterialCommunityIcons name={getMethodIcon(sale.paymentMethod)} size={14} color={colors.textSec} />
            <Text style={[styles.tagText, { color: colors.textSec }]}>{sale.paymentMethod}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.bgPanelInner }]}>
            <MaterialCommunityIcons name="package-variant" size={14} color={colors.textSec} />
            <Text style={[styles.tagText, { color: colors.textSec }]}>{sale.items.length} items</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBg(sale.status) }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(sale.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(sale.status) }]}>
            {sale.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  saleId: {
    fontSize: 12,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
