import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';

const INITIAL_BUSINESS = {
  businessName: 'Girma Trading PLC',
  industry: 'Retail & Wholesale',
  tinNumber: '0032456789',
  address: 'Bole Road, Addis Ababa',
  city: 'Addis Ababa',
  country: 'Ethiopia',
  website: 'www.girmatrading.et',
  contactEmail: 'contact@girmatrading.et',
  contactPhone: '+251 11 234 5678',
  employeeCount: '12',
};

const INDUSTRY_OPTIONS = [
  'Retail & Wholesale',
  'Food & Beverage',
  'Construction',
  'Technology',
  'Healthcare',
  'Education',
  'Agriculture',
  'Manufacturing',
  'Services',
  'Other',
];

// ─────────────────────────────────────────
// Business logo uploader
// ─────────────────────────────────────────
function LogoUpload({ logoUri, businessName, onPress }) {
  const { colors = Colors } = useApp();
  const styles = createStyles(colors);
  const initial = businessName?.[0]?.toUpperCase() ?? 'B';
  return (
    <TouchableOpacity style={styles.logoWrapper} onPress={onPress} activeOpacity={0.85}>
      {logoUri ? (
        <Image source={{ uri: logoUri }} style={styles.logoImage} />
      ) : (
        <View style={styles.logoPlaceholder}>
          <MaterialCommunityIcons name="storefront-outline" size={36} color={colors.accentLight} />
          <Text style={styles.logoInitial}>{initial}</Text>
        </View>
      )}
      {/* Camera badge */}
      <View style={styles.logoCameraBadge}>
        <MaterialCommunityIcons name="camera" size={13} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────
// Text field
// ─────────────────────────────────────────
function Field({ label, value, onChangeText, keyboardType = 'default', autoCapitalize = 'words', icon, placeholder }) {
  const { colors = Colors } = useApp();
  const styles = createStyles(colors);
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={focused ? colors.accentLight : colors.textMute}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? ''}
          placeholderTextColor={colors.textMute}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────
// Industry picker dropdown
// ─────────────────────────────────────────
function IndustryPicker({ value, onChange }) {
  const { colors = Colors } = useApp();
  const styles = createStyles(colors);
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>Industry</Text>
      <TouchableOpacity
        style={[styles.inputRow, open && styles.inputRowFocused]}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="domain"
          size={20}
          color={open ? colors.accentLight : colors.textMute}
          style={styles.inputIcon}
        />
        <Text style={[styles.input, { color: value ? colors.textCore : colors.textMute }]}>
          {value || 'Select industry'}
        </Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textMute}
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownList}>
          {INDUSTRY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.dropdownItem, value === opt && styles.dropdownItemSelected]}
              onPress={() => { onChange(opt); setOpen(false); }}
            >
              {value === opt && (
                <MaterialCommunityIcons name="check" size={16} color={colors.accentLight} style={{ marginRight: 8 }} />
              )}
              <Text style={[styles.dropdownText, value === opt && styles.dropdownTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function InfoBanner() {
  const { colors = Colors } = useApp();
  const styles = createStyles(colors);
  return (
    <View style={styles.banner}>
      <MaterialCommunityIcons name="information-outline" size={18} color={colors.accentLight} />
      <Text style={styles.bannerText}>
        Your business details and logo appear on invoices and financial reports.
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────
export default function BusinessDetailsScreen() {
  const { colors = Colors } = useApp();
  const styles = createStyles(colors);
  const [biz, setBiz] = useState(INITIAL_BUSINESS);
  const [logoUri, setLogoUri] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (key) => (val) => setBiz((b) => ({ ...b, [key]: val }));

  // ── Logo picker ───────────────────────────────
  const handlePickLogo = () => {
    Alert.alert(
      'Business Logo',
      'Choose how to update your business logo',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Photo Library', onPress: openLibrary },
        { text: 'Remove Logo', onPress: () => setLogoUri(null), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Camera permission is required to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const openLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Photo library permission is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setLogoUri(result.assets[0].uri);
    }
  };

  // ── Save ──────────────────────────────────────
  const handleSave = () => {
    if (!biz.businessName.trim()) {
      Alert.alert('Required', 'Business name is required.');
      return;
    }
    if (!biz.tinNumber.trim()) {
      Alert.alert('Required', 'TIN number is required.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Saved', 'Business details have been updated.');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* ── Logo Header ── */}
          <View style={styles.logoSection}>
            <LogoUpload
              logoUri={logoUri}
              businessName={biz.businessName}
              onPress={handlePickLogo}
            />
            <Text style={styles.logoName}>{biz.businessName || 'Your Business'}</Text>
            <Text style={styles.logoSub}>{biz.industry}</Text>
            <TouchableOpacity style={styles.changeLogoBtn} onPress={handlePickLogo}>
              <MaterialCommunityIcons name="image-edit-outline" size={16} color={colors.accentLight} />
              <Text style={styles.changeLogoBtnText}>
                {logoUri ? 'Change Logo' : 'Upload Logo'}
              </Text>
            </TouchableOpacity>
          </View>

          <InfoBanner />

          {/* ── Identity ── */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="identifier" size={16} color={colors.accentLight} />
            <Text style={styles.sectionTitle}>Business Identity</Text>
          </View>
          <View style={styles.card}>
            <Field
              label="Business Name"
              value={biz.businessName}
              onChangeText={set('businessName')}
              icon="office-building-outline"
              placeholder="e.g. Abebe & Sons Trading"
            />
            <View style={styles.divider} />
            <IndustryPicker value={biz.industry} onChange={set('industry')} />
            <View style={styles.divider} />
            <Field
              label="TIN Number"
              value={biz.tinNumber}
              onChangeText={set('tinNumber')}
              icon="card-text-outline"
              keyboardType="number-pad"
              autoCapitalize="none"
              placeholder="Ethiopian TIN"
            />
            <View style={styles.divider} />
            <Field
              label="Number of Employees"
              value={biz.employeeCount}
              onChangeText={set('employeeCount')}
              icon="account-group-outline"
              keyboardType="number-pad"
              autoCapitalize="none"
              placeholder="e.g. 10"
            />
          </View>

          {/* ── Location ── */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.accentLight} />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <View style={styles.card}>
            <Field
              label="Street Address"
              value={biz.address}
              onChangeText={set('address')}
              icon="map-marker-outline"
              placeholder="e.g. Bole Road, Shop #5"
            />
            <View style={styles.divider} />
            <Field
              label="City"
              value={biz.city}
              onChangeText={set('city')}
              icon="city-variant-outline"
              placeholder="e.g. Addis Ababa"
            />
            <View style={styles.divider} />
            <Field
              label="Country"
              value={biz.country}
              onChangeText={set('country')}
              icon="earth"
              placeholder="e.g. Ethiopia"
            />
          </View>

          {/* ── Contact ── */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="contacts-outline" size={16} color={colors.accentLight} />
            <Text style={styles.sectionTitle}>Contact Info</Text>
          </View>
          <View style={styles.card}>
            <Field
              label="Business Email"
              value={biz.contactEmail}
              onChangeText={set('contactEmail')}
              icon="email-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="contact@yourbusiness.et"
            />
            <View style={styles.divider} />
            <Field
              label="Business Phone"
              value={biz.contactPhone}
              onChangeText={set('contactPhone')}
              icon="phone-outline"
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholder="+251 91 ..."
            />
            <View style={styles.divider} />
            <Field
              label="Website"
              value={biz.website}
              onChangeText={set('website')}
              icon="web"
              autoCapitalize="none"
              placeholder="www.yourbusiness.et"
            />
          </View>

          {/* ── Save ── */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnLoading]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={saving}
          >
            <MaterialCommunityIcons name={saving ? 'loading' : 'content-save-outline'} size={20} color="#FFF" />
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Business Details'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCore,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // ── Logo section ──
  logoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logoWrapper: {
    position: 'relative',
    width: 96,
    height: 96,
    borderRadius: 22,
    marginBottom: 12,
  },
  logoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: colors.bgPanel,
    borderWidth: 2,
    borderColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 96,
    height: 96,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.accentLight,
  },
  logoInitial: {
    color: colors.accentLight,
    fontSize: 28,
    fontWeight: '700',
    position: 'absolute',
    bottom: 6,
    right: 10,
    opacity: 0.3,
  },
  logoCameraBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bgCore,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoName: {
    color: colors.textCore,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  logoSub: {
    color: colors.accentLight,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
  },
  changeLogoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgPanel,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  changeLogoBtnText: {
    color: colors.accentLight,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },

  // ── Banner ──
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(100,181,246,0.2)',
  },
  bannerText: {
    color: colors.accentLight,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
    marginLeft: 8,
  },

  // ── Section headers ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 2,
  },
  sectionTitle: {
    color: colors.accentLight,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 6,
  },

  // ── Card ──
  card: {
    backgroundColor: colors.bgPanel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderCore,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
  },

  // ── Field ──
  fieldGroup: {
    paddingVertical: 14,
  },
  fieldLabel: {
    color: colors.textMute,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgPanelInner,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderCore,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  inputRowFocused: {
    borderColor: colors.accentLight,
    backgroundColor: 'rgba(100, 181, 246, 0.06)',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.textCore,
    fontSize: 16,
    paddingVertical: 0,
  },

  // ── Dropdown ──
  dropdownList: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderCore,
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  dropdownItemSelected: {
    backgroundColor: colors.accentSoft,
  },
  dropdownText: {
    color: colors.textSec,
    fontSize: 15,
  },
  dropdownTextSelected: {
    color: colors.accentLight,
    fontWeight: '600',
  },

  // ── Save ──
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },
  saveBtnLoading: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
