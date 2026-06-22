import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, Switch, Modal, Pressable, Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp, CURRENCIES } from '../context/AppContext';
import DarkColors from '../theme/colors';

// Map link IDs to navigator routes
const LINK_ROUTES = {
  profile: 'Profile',
  business: 'BusinessDetails',
};

function CurrencyModal({ visible, onClose, current, onSelect }) {
  const C = DarkColors; // modal always dark for consistency
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={mdStyles.overlay} onPress={onClose}>
        <Pressable style={mdStyles.sheet} onPress={e => e.stopPropagation()}>
          <View style={mdStyles.handle} />
          <Text style={mdStyles.title}>Select Currency</Text>

          {Object.values(CURRENCIES).map(cur => {
            const selected = cur.code === current;
            return (
              <TouchableOpacity
                key={cur.code}
                style={[mdStyles.option, selected && mdStyles.optionSelected]}
                onPress={() => { onSelect(cur.code); onClose(); }}
                activeOpacity={0.75}
              >
                <Text style={mdStyles.flag}>{cur.flag}</Text>
                <View style={mdStyles.optionInfo}>
                  <Text style={[mdStyles.optionCode, selected && mdStyles.optionCodeSelected]}>
                    {cur.code}
                  </Text>
                  <Text style={mdStyles.optionLabel}>{cur.label}</Text>
                </View>
                {selected && (
                  <MaterialCommunityIcons name="check-circle" size={22} color={C.accentLight} />
                )}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={mdStyles.cancelBtn} onPress={onClose}>
            <Text style={mdStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ProfileHeader({ colors, onPress, profile, avatarUri }) {
  const initials = `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase();
  return (
    <TouchableOpacity
      style={[styles.profileHeader, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.profileAvatar, { backgroundColor: colors.accent, borderColor: colors.accentLight }]}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={{ width: 52, height: 52, borderRadius: 26 }} />
        ) : (
          <Text style={styles.profileInitials}>{initials}</Text>
        )}
      </View>
      <View style={styles.profileInfo}>
        <Text style={[styles.profileName, { color: colors.textCore }]}>{profile.firstName} {profile.lastName}</Text>
        <Text style={[styles.profileEmail, { color: colors.textSec }]}>{profile.email}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMute} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const {
    currency, setCurrency,
    isDarkMode, toggleDarkMode,
    notificationsEnabled, toggleNotifications,
    colors,
  } = useApp();

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [profile, setProfile] = useState({ firstName: 'Abebe', lastName: 'Girma', email: 'abebe.girma@fintrack.et' });
  const [avatarUri, setAvatarUri] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        try {
          const storedProfile = await AsyncStorage.getItem('@profile');
          const storedAvatar = await AsyncStorage.getItem('@avatarUri');
          if (storedProfile) setProfile(JSON.parse(storedProfile));
          if (storedAvatar) setAvatarUri(storedAvatar);
        } catch (error) {
          console.error(error);
        }
      };
      loadProfile();
    }, [])
  );

  const handleItemPress = (item) => {
    if (item.type !== 'link') return;
    if (item.id === 'currency') { setCurrencyModalVisible(true); return; }
    const route = LINK_ROUTES[item.id];
    if (route) navigation.navigate(route);
  };

  const SETTING_GROUPS = [
    {
      title: 'Account',
      items: [
        { id: 'profile',  icon: 'account-outline',    title: 'Profile Information', type: 'link' },
        { id: 'business', icon: 'storefront-outline',  title: 'Business Details',    type: 'link' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', icon: 'bell-outline',      title: 'Push Notifications', type: 'toggle' },
        { id: 'darkmode',      icon: 'theme-light-dark',   title: 'Dark Mode',          type: 'toggle' },
        { id: 'currency',      icon: 'currency-usd',       title: 'Currency',           type: 'currency' },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'help',  icon: 'help-circle-outline',  title: 'Help Center',        type: 'link' },
        { id: 'about', icon: 'information-outline',  title: 'About FinTrack',     type: 'link' },
      ],
    },
  ];

  const toggleValue = (id) => {
    if (id === 'notifications') toggleNotifications();
    if (id === 'darkmode') toggleDarkMode();
  };

  const getToggleValue = (id) => {
    if (id === 'notifications') return notificationsEnabled;
    if (id === 'darkmode') return isDarkMode;
    return false;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgCore }]}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Profile header */}
        <ProfileHeader colors={colors} onPress={() => navigation.navigate('Profile')} profile={profile} avatarUri={avatarUri} />

        {SETTING_GROUPS.map((group, gIndex) => (
          <View key={gIndex} style={styles.group}>
            <Text style={[styles.groupTitle, { color: colors.textSec }]}>{group.title}</Text>
            <View style={[styles.card, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}>
              {group.items.map((item, iIndex) => {
                const isActionable = item.type === 'link' || item.type === 'currency';
                const Wrapper = isActionable ? TouchableOpacity : View;
                const wrapperProps = isActionable
                  ? { activeOpacity: 0.7, onPress: () => handleItemPress(item) }
                  : {};

                return (
                  <Wrapper
                    key={item.id}
                    {...wrapperProps}
                    style={[
                      styles.settingItem,
                      { borderBottomColor: colors.borderSubtle },
                      iIndex === group.items.length - 1 && styles.lastSettingItem,
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: colors.bgPanelInner }]}>
                        <MaterialCommunityIcons name={item.icon} size={22} color={colors.accentLight} />
                      </View>
                      <Text style={[styles.settingTitle, { color: colors.textCore }]}>{item.title}</Text>
                    </View>

                    {/* Link arrow */}
                    {item.type === 'link' && (
                      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMute} />
                    )}

                    {/* Toggle */}
                    {item.type === 'toggle' && (
                      <Switch
                        value={getToggleValue(item.id)}
                        onValueChange={() => toggleValue(item.id)}
                        trackColor={{ false: colors.bgPanelInner, true: colors.accent }}
                        thumbColor="#FFF"
                      />
                    )}

                    {/* Currency picker row */}
                    {item.type === 'currency' && (
                      <View style={styles.currencyRight}>
                        <View style={[styles.currencyBadge, { backgroundColor: colors.accentSoft }]}>
                          <Text style={[styles.currencyFlag]}>{CURRENCIES[currency]?.flag}</Text>
                          <Text style={[styles.currencyCode, { color: colors.accentLight }]}>{currency}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMute} />
                      </View>
                    )}
                  </Wrapper>
                );
              })}
            </View>
          </View>
        ))}

        {/* Theme indicator */}
        <View style={[styles.themeBanner, { backgroundColor: colors.accentSoft, borderColor: colors.borderCore }]}>
          <MaterialCommunityIcons
            name={isDarkMode ? 'weather-night' : 'weather-sunny'}
            size={20}
            color={colors.accentLight}
          />
          <Text style={[styles.themeBannerText, { color: colors.accentLight }]}>
            {isDarkMode ? 'Dark mode is active' : 'Light mode is active'}
          </Text>
        </View>
      </ScrollView>

      {/* Currency Modal */}
      <CurrencyModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
        current={currency}
        onSelect={setCurrency}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: 14,
  },
  profileInitials: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  profileEmail: { fontSize: 13 },

  group: { marginBottom: 24 },
  groupTitle: {
    fontSize: 13, fontWeight: '600', textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 8, marginLeft: 4,
  },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  lastSettingItem: { borderBottomWidth: 0 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  settingTitle: { fontSize: 16 },

  currencyRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currencyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  currencyFlag: { fontSize: 16 },
  currencyCode: { fontSize: 14, fontWeight: '700' },

  themeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 12, padding: 14,
    borderWidth: 1, marginTop: 8,
  },
  themeBannerText: { fontSize: 14, fontWeight: '600' },
});

// Currency modal styles
const mdStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0F2040',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center', marginBottom: 20,
  },
  title: {
    color: '#FFF', fontSize: 18, fontWeight: '700',
    marginBottom: 16, textAlign: 'center',
  },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderRadius: 14, marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  optionSelected: {
    backgroundColor: 'rgba(100,181,246,0.12)',
    borderWidth: 1, borderColor: 'rgba(100,181,246,0.3)',
  },
  flag: { fontSize: 28 },
  optionInfo: { flex: 1 },
  optionCode: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  optionCodeSelected: { color: '#64B5F6' },
  optionLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 },
  cancelBtn: {
    marginTop: 8, padding: 16, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
  },
  cancelText: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '600' },
});
