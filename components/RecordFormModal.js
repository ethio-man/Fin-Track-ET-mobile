import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function RecordFormModal({ visible, onClose, onSubmit, title, fields }) {
  const { colors = Colors } = useApp();
  const styles = createStyles(colors);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);

  // Initialize form data when modal opens
  useEffect(() => {
    if (visible && fields) {
      const initialData = {};
      fields.forEach(field => {
        initialData[field.name] = field.defaultValue || '';
        // If it's a select field and no default is provided, default to the first option
        if (field.type === 'select' && field.options && field.options.length > 0 && !field.defaultValue) {
          initialData[field.name] = field.options[0].value || field.options[0];
        }
      });
      setFormData(initialData);
      setIsSubmitting(false);
    }
  }, [visible, fields]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'set' && selectedDate && activeDateField) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleChange(activeDateField, formattedDate);
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
    if (Platform.OS !== 'ios') {
      setActiveDateField(null);
    }
  };

  const handleSubmit = async () => {
    // In a real scenario, you'd integrate your Node/Express API here.
    // e.g., const response = await fetch('YOUR_API_URL', { ... })
    
    setIsSubmitting(true);
    
    // Simulating network request for better UX
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <View style={styles.fieldContainer} key={field.name}>
            <Text style={styles.label}>{field.label}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
              {field.options.map((option, index) => {
                const optLabel = option.label || option;
                const optValue = option.value || option;
                const isSelected = formData[field.name] === optValue;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.chip, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }, isSelected && { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}
                    onPress={() => handleChange(field.name, optValue)}
                  >
                    <Text style={[styles.chipText, { color: colors.textSec }, isSelected && { color: colors.accent }]}>
                      {optLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        );
      
      case 'number':
        return (
          <View style={styles.fieldContainer} key={field.name}>
            <Text style={[styles.label, { color: colors.textSec }]}>{field.label}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore, color: colors.textCore }]}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              placeholderTextColor={colors.textMute}
              keyboardType="decimal-pad"
              value={formData[field.name] ? String(formData[field.name]) : ''}
              onChangeText={(val) => handleChange(field.name, val)}
            />
          </View>
        );

      case 'date':
        return (
          <View style={styles.fieldContainer} key={field.name}>
            <Text style={[styles.label, { color: colors.textSec }]}>{field.label}</Text>
            <TouchableOpacity 
              style={[styles.input, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]} 
              onPress={() => {
                setActiveDateField(field.name);
                setShowDatePicker(true);
              }}
            >
              <Text style={{ color: formData[field.name] ? colors.textCore : colors.textMute }}>
                {formData[field.name] || field.placeholder || 'Select Date'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'text':
      default:
        return (
          <View style={styles.fieldContainer} key={field.name}>
            <Text style={[styles.label, { color: colors.textSec }]}>{field.label}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore, color: colors.textCore }]}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              placeholderTextColor={colors.textMute}
              value={formData[field.name]}
              onChangeText={(val) => handleChange(field.name, val)}
            />
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.bgCore, borderColor: colors.borderSubtle }]}>
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textCore }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={colors.textSec} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {fields && fields.map(renderField)}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.borderCore }]} onPress={onClose} disabled={isSubmitting}>
              <Text style={[styles.cancelBtnText, { color: colors.textCore }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.accent }]} onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.submitBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={
                activeDateField && formData[activeDateField]
                  ? new Date(formData[activeDateField])
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)', // Dark blur effect
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bgCore,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textCore,
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colors.textSec,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.borderCore,
    borderRadius: 12,
    padding: 14,
    color: colors.textCore,
    fontSize: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderCore,
    marginRight: 10,
    backgroundColor: colors.bgPanel,
  },
  chipSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)', // Light indigo
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.textSec,
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: colors.accent,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderCore,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: colors.textCore,
    fontSize: 16,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
