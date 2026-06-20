import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function SaleCard({ sale, onPress }) {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'complete': return Colors.success;
      case 'pending': return Colors.warning;
      case 'canceled': return Colors.danger;
      default: return Colors.textSec;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'complete': return Colors.successBg;
      case 'pending': return Colors.warningBg;
      case 'canceled': return Colors.dangerBg;
      default: return Colors.bgPanelInner;
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
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.customerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(sale.customer)}</Text>
          </View>
          <View>
            <Text style={styles.customerName}>{sale.customer}</Text>
            <Text style={styles.saleId}>{sale.id} • {sale.date}</Text>
          </View>
        </View>
        <Text style={styles.total}>${sale.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <MaterialCommunityIcons name={getMethodIcon(sale.paymentMethod)} size={14} color={Colors.textSec} />
            <Text style={styles.tagText}>{sale.paymentMethod}</Text>
          </View>
          <View style={styles.tag}>
            <MaterialCommunityIcons name="package-variant" size={14} color={Colors.textSec} />
            <Text style={styles.tagText}>{sale.items.length} items</Text>
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
    backgroundColor: Colors.bgPanel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderCore,
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
    backgroundColor: Colors.accent,
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
    color: Colors.textCore,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  saleId: {
    color: Colors.textSec,
    fontSize: 12,
  },
  total: {
    color: Colors.textCore,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgPanelInner,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  tagText: {
    color: Colors.textSec,
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
