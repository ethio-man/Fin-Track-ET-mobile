import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function FilterModal({ visible, onClose, onApply, title, filters, currentFilters }) {
  const [activeFilters, setActiveFilters] = useState(currentFilters || {});

  useEffect(() => {
    if (visible) {
      setActiveFilters(currentFilters || {});
    }
  }, [visible, currentFilters]);

  const toggleFilter = (filterName, optionValue) => {
    setActiveFilters(prev => {
      const currentSelection = prev[filterName];
      // For single select behavior (which fits 'sort' and 'status' best here)
      // If tapping the already selected item, deselect it. Otherwise select the new one.
      if (currentSelection === optionValue) {
        const newFilters = { ...prev };
        delete newFilters[filterName];
        return newFilters;
      }
      return { ...prev, [filterName]: optionValue };
    });
  };

  const handleClear = () => {
    setActiveFilters({});
  };

  const handleApply = () => {
    onApply(activeFilters);
    onClose();
  };

  const renderFilterOptions = (filter) => {
    return (
      <View key={filter.name} style={styles.filterSection}>
        <Text style={styles.filterLabel}>{filter.label}</Text>
        <View style={styles.optionsContainer}>
          {filter.options.map(option => {
            const isSelected = activeFilters[filter.name] === option;
            return (
              <TouchableOpacity
                key={option}
                style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                onPress={() => toggleFilter(filter.name, option)}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{title || 'Filter'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={24} color={Colors.textCore} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {filters.map(filter => renderFilterOptions(filter))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.bgCore,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '50%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderCore,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textCore,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textCore,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bgPanel,
    borderWidth: 1,
    borderColor: Colors.borderCore,
  },
  optionChipSelected: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },
  optionText: {
    fontSize: 14,
    color: Colors.textSec,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: Colors.accentLight,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderCore,
    backgroundColor: Colors.bgCore,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  clearBtnText: {
    color: Colors.textSec,
    fontSize: 16,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
