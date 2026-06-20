import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function AuthScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="finance" size={64} color={Colors.accentLight} />
          <Text style={styles.title}>FinTrack ET</Text>
          <Text style={styles.subtitle}>Smart Finance. Ethiopian Roots.</Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity 
            style={styles.btnPrimary}
            onPress={() => navigation.replace('Main')}
          >
            <Text style={styles.btnPrimaryText}>Continue for Demo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCore,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    color: Colors.textCore,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 16,
  },
  subtitle: {
    color: Colors.textSec,
    fontSize: 16,
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  btnPrimary: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
