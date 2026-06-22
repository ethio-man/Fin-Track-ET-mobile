import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

// Map item IDs to screen names for navigation
const LINK_ROUTES = {
  profile: 'Profile',
  business: 'BusinessDetails',
};

const SETTING_GROUPS = [
  {
    title: 'Account',
    items: [
      { id: 'profile', icon: 'account-outline', title: 'Profile Information', type: 'link' },
      { id: 'business', icon: 'storefront-outline', title: 'Business Details', type: 'link' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', icon: 'bell-outline', title: 'Push Notifications', type: 'toggle' },
      { id: 'darkmode', icon: 'theme-light-dark', title: 'Dark Mode', type: 'toggle' },
      { id: 'currency', icon: 'currency-usd', title: 'Currency', type: 'value', value: 'ETB' },
    ]
  },
  {
    title: 'Support',
    items: [
      { id: 'help', icon: 'help-circle-outline', title: 'Help Center', type: 'link' },
      { id: 'about', icon: 'information-outline', title: 'About FinTrack', type: 'link' },
    ]
  }
];

function ProfileHeader({ onPress }) {
  return (
    <TouchableOpacity style={styles.profileHeader} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.profileAvatar}>
        <Text style={styles.profileInitials}>AG</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>Abebe Girma</Text>
        <Text style={styles.profileEmail}>abebe.girma@fintrack.et</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMute} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const [toggles, setToggles] = React.useState({ notifications: true, darkmode: true });

  const handleToggle = (id) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleItemPress = (item) => {
    if (item.type !== 'link') return;
    const route = LINK_ROUTES[item.id];
    if (route) {
      navigation.navigate(route);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Profile header shortcut */}
        <ProfileHeader onPress={() => navigation.navigate('Profile')} />

        {SETTING_GROUPS.map((group, gIndex) => (
          <View key={gIndex} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.card}>
              {group.items.map((item, iIndex) => {
                const isLink = item.type === 'link';
                const Wrapper = isLink ? TouchableOpacity : View;
                const wrapperProps = isLink
                  ? { activeOpacity: 0.7, onPress: () => handleItemPress(item) }
                  : {};

                return (
                  <Wrapper
                    key={item.id}
                    {...wrapperProps}
                    style={[
                      styles.settingItem,
                      iIndex === group.items.length - 1 && styles.lastSettingItem,
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name={item.icon} size={22} color={Colors.accentLight} />
                      </View>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                    </View>

                    {item.type === 'link' && (
                      <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textMute} />
                    )}
                    {item.type === 'toggle' && (
                      <Switch
                        value={toggles[item.id]}
                        onValueChange={() => handleToggle(item.id)}
                        trackColor={{ false: Colors.bgPanelInner, true: Colors.accent }}
                        thumbColor="#FFF"
                      />
                    )}
                    {item.type === 'value' && (
                      <View style={styles.valueContainer}>
                        <Text style={styles.settingValue}>{item.value}</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textMute} />
                      </View>
                    )}
                  </Wrapper>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCore,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },

  // Profile header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgPanel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderCore,
    padding: 16,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accentLight,
    marginRight: 14,
  },
  profileInitials: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: Colors.textCore,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    color: Colors.textSec,
    fontSize: 13,
  },

  // Groups
  group: {
    marginBottom: 24,
  },
  groupTitle: {
    color: Colors.textSec,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.bgPanel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderCore,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgPanelInner,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    color: Colors.textCore,
    fontSize: 16,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    color: Colors.textSec,
    fontSize: 16,
    marginRight: 4,
  },
});
