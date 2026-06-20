import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function ProductCard({ product, onPress }) {
  const isLowStock = product.status === 'Low Stock';
  
  return (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={styles.imagePlaceholder}>
          <MaterialCommunityIcons 
            name="package-variant-closed" 
            size={24} 
            color={Colors.textMute} 
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.sku}>{product.sku}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{product.category}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.right}>
        <Text style={styles.price}>${product.price.toLocaleString()}</Text>
        <View style={[
          styles.stockBadge, 
          { backgroundColor: isLowStock ? Colors.dangerBg : Colors.successBg }
        ]}>
          <Text style={[
            styles.stockText,
            { color: isLowStock ? Colors.danger : Colors.success }
          ]}>
            {product.stock} in stock
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgPanel,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderCore,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: Colors.bgPanelInner,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    color: Colors.textCore,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  sku: {
    color: Colors.textMute,
    fontSize: 12,
    marginBottom: 4,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgPanelInner,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  category: {
    color: Colors.textSec,
    fontSize: 11,
  },
  right: {
    alignItems: 'flex-end',
  },
  price: {
    color: Colors.textCore,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
