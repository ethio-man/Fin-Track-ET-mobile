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
import { useApp } from '../context/AppContext';

export default function FilterModal({ visible, onClose, onApply, title, filters, currentFilters }) {
  const { colors = Colors } = useApp();
  const styles = createStyles(colors);
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
        <Text style={[styles.filterLabel, { color: colors.textCore }]}>{filter.label}</Text>
        <View style={styles.optionsContainer}>
          {filter.options.map(option => {
            const isSelected = activeFilters[filter.name] === option;
            return (
              <TouchableOpacity
                key={option}
                style={[styles.optionChip, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }, isSelected && { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}
                onPress={() => toggleFilter(filter.name, option)}
              >
                <Text style={[styles.optionText, { color: colors.textSec }, isSelected && { color: colors.accentLight }]}>
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
        <View style={[styles.modalContent, { backgroundColor: colors.bgCore }]}>
          <View style={[styles.header, { borderBottomColor: colors.borderCore }]}>
            <Text style={[styles.title, { color: colors.textCore }]}>{title || 'Filter'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={24} color={colors.textCore} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {filters.map(filter => renderFilterOptions(filter))}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.borderCore, backgroundColor: colors.bgCore }]}>
            <TouchableOpacity style={[styles.clearBtn, { borderColor: colors.borderSubtle }]} onPress={handleClear}>
              <Text style={[styles.clearBtnText, { color: colors.textSec }]}>Clear All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.applyBtn, { backgroundColor: colors.accent }]} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bgCore,
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
    borderBottomColor: colors.borderCore,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textCore,
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
    color: colors.textCore,
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
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.borderCore,
  },
  optionChipSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  optionText: {
    fontSize: 14,
    color: colors.textSec,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.accentLight,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderCore,
    backgroundColor: colors.bgCore,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  clearBtnText: {
    color: colors.textSec,
    fontSize: 16,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    backgroundColor: colors.accent,
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
