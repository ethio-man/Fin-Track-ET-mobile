import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';

const INITIAL_PROFILE = {
  firstName: 'Abebe',
  lastName: 'Girma',
  email: 'abebe.girma@fintrack.et',
  phone: '+251 91 234 5678',
  role: 'Business Owner',
};

function AvatarUpload({ imageUri, initials, onPress }) {
  const { colors = Colors } = useApp();
  const styles = createStyles(colors);
  return (
    <TouchableOpacity style={styles.avatarWrapper} onPress={onPress} activeOpacity={0.85}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
      )}
      {/* Camera badge */}
      <View style={styles.cameraBadge}>
        <MaterialCommunityIcons name="camera" size={15} color="#FFF" />
      </View>
      {/* Overlay hint */}
      <View style={styles.avatarOverlay}>
        <MaterialCommunityIcons name="image-edit-outline" size={22} color="#FFF" />
        <Text style={styles.overlayText}>Change</Text>
      </View>
    </TouchableOpacity>
  );
}

function Field({ label, value, onChangeText, keyboardType = 'default', autoCapitalize = 'words', icon }) {
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

export default function ProfileScreen() {
  const { colors = Colors } = useApp();
  const styles = createStyles(colors);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [avatarUri, setAvatarUri] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('@profile');
        const storedAvatar = await AsyncStorage.getItem('@avatarUri');
        if (storedProfile) setProfile(JSON.parse(storedProfile));
        if (storedAvatar) setAvatarUri(storedAvatar);
      } catch (error) {
        console.error('Failed to load profile data', error);
      }
    };
    loadProfile();
  }, []);

  const set = (key) => (val) => setProfile((p) => ({ ...p, [key]: val }));

  const initials = `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase();

  const handlePickImage = () => {
    Alert.alert(
      'Profile Photo',
      'Choose how to update your photo',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Photo Library', onPress: openLibrary },
        { text: 'Remove Photo', onPress: () => setAvatarUri(null), style: 'destructive' },
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
      setAvatarUri(result.assets[0].uri);
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
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      Alert.alert('Required', 'First and last name are required.');
      return;
    }
    if (!profile.email.trim()) {
      Alert.alert('Required', 'Email is required.');
      return;
    }
    setSaving(true);
    
    try {
      await AsyncStorage.setItem('@profile', JSON.stringify(profile));
      if (avatarUri) {
        await AsyncStorage.setItem('@avatarUri', avatarUri);
      } else {
        await AsyncStorage.removeItem('@avatarUri');
      }
      setTimeout(() => {
        setSaving(false);
        Alert.alert('Saved', 'Your profile has been updated.');
      }, 800);
    } catch (error) {
      setSaving(false);
      Alert.alert('Error', 'Failed to save profile data.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* ── Avatar Section ── */}
          <View style={styles.avatarSection}>
            <AvatarUpload imageUri={avatarUri} initials={initials} onPress={handlePickImage} />
            <Text style={styles.avatarName}>{profile.firstName} {profile.lastName}</Text>
            <View style={styles.rolePill}>
              <MaterialCommunityIcons name="briefcase-outline" size={12} color={colors.accentLight} />
              <Text style={styles.roleText}>{profile.role}</Text>
            </View>
            <TouchableOpacity style={styles.changePhotoBtn} onPress={handlePickImage}>
              <MaterialCommunityIcons name="camera-outline" size={16} color={colors.accentLight} />
              <Text style={styles.changePhotoBtnText}>
                {avatarUri ? 'Change Photo' : 'Upload Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Personal Info ── */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-outline" size={16} color={colors.accentLight} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <View style={styles.card}>
            <Field label="First Name" value={profile.firstName} onChangeText={set('firstName')} icon="account-outline" />
            <View style={styles.divider} />
            <Field label="Last Name" value={profile.lastName} onChangeText={set('lastName')} icon="account-outline" />
          </View>

          {/* ── Contact Details ── */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="card-account-details-outline" size={16} color={colors.accentLight} />
            <Text style={styles.sectionTitle}>Contact Details</Text>
          </View>
          <View style={styles.card}>
            <Field
              label="Email Address"
              value={profile.email}
              onChangeText={set('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="email-outline"
            />
            <View style={styles.divider} />
            <Field
              label="Phone Number"
              value={profile.phone}
              onChangeText={set('phone')}
              keyboardType="phone-pad"
              autoCapitalize="none"
              icon="phone-outline"
            />
          </View>

          {/* ── Role ── */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="shield-account-outline" size={16} color={colors.accentLight} />
            <Text style={styles.sectionTitle}>Role</Text>
          </View>
          <View style={styles.card}>
            <Field label="Role / Position" value={profile.role} onChangeText={set('role')} icon="briefcase-outline" />
          </View>

          {/* ── Save Button ── */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnLoading]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={saving}
          >
            <MaterialCommunityIcons name={saving ? 'loading' : 'content-save-outline'} size={20} color="#FFF" />
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
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

  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    position: 'relative',
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.accentLight,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: colors.accentLight,
  },
  avatarInitials: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bgCore,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 48,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,     // shown via press feedback; badge handles visibility cue
  },
  overlayText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  avatarName: {
    color: colors.textCore,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  roleText: {
    color: colors.accentLight,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgPanel,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  changePhotoBtnText: {
    color: colors.accentLight,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

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
    height: 46,
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
