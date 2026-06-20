import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D2E6B" />
      <LinearGradient
        colors={['#0A1628', '#0D2E6B']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.appName}>
            FinTrack <Text style={styles.accent}>ET</Text>
          </Text>
          <Text style={styles.subtitle}>Your Ethiopian Finance Manager</Text>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Balance</Text>
            <Text style={styles.cardValue}>ብር 12,450</Text>
          </View>
          <View style={[styles.card, styles.cardAccent]}>
            <Text style={styles.cardLabel}>Expenses</Text>
            <Text style={styles.cardValue}>ብር 3,200</Text>
          </View>
        </View>

        <View style={styles.centerNote}>
          <Text style={styles.noteText}>🚀 App is ready for development</Text>
          <Text style={styles.noteSubText}>More screens coming soon...</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, padding: 24, paddingTop: 60 },
  header: { marginBottom: 32 },
  greeting: { color: 'rgba(255,255,255,0.6)', fontSize: 16 },
  appName: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', marginTop: 4 },
  accent: { color: '#64B5F6' },
  subtitle: { color: 'rgba(100, 181, 246, 0.8)', fontSize: 14, marginTop: 6 },
  cardRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cardAccent: { backgroundColor: 'rgba(100, 181, 246, 0.12)' },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8 },
  cardValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  centerNote: { alignItems: 'center', marginTop: 40 },
  noteText: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 8 },
  noteSubText: { color: 'rgba(100, 181, 246, 0.6)', fontSize: 13 },
});
