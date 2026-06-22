import React, { createContext, useContext, useState, useCallback } from 'react';
import DarkColors from '../theme/colors';
import LightColors from '../theme/lightColors';

// ─── Currency metadata ───────────────────────────────────────────────────────
export const CURRENCIES = {
  ETB: { code: 'ETB', symbol: 'ETB', prefix: 'ETB ', label: 'Ethiopian Birr',  flag: '🇪🇹' },
  USD: { code: 'USD', symbol: '$',   prefix: '$',    label: 'US Dollar',        flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€',   prefix: '€',    label: 'Euro',             flag: '🇪🇺' },
};

// ─── Context ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [currency, setCurrency] = useState('ETB');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Resolved color palette based on current theme
  const colors = isDarkMode ? DarkColors : LightColors;

  // Format an amount with the selected currency prefix
  const formatCurrency = useCallback((amount) => {
    const meta = CURRENCIES[currency] ?? CURRENCIES.ETB;
    const absVal = Math.abs(Number(amount)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${meta.prefix}${absVal}`;
  }, [currency]);

  // Just the prefix string (e.g. "ETB ", "$", "€")
  const currencyPrefix = (CURRENCIES[currency] ?? CURRENCIES.ETB).prefix;
  const currencyMeta   = CURRENCIES[currency] ?? CURRENCIES.ETB;

  const toggleDarkMode = useCallback(() => setIsDarkMode(v => !v), []);
  const toggleNotifications = useCallback(() => setNotificationsEnabled(v => !v), []);

  return (
    <AppContext.Provider
      value={{
        // ── Currency ──
        currency,
        setCurrency,
        currencyPrefix,
        currencyMeta,
        formatCurrency,

        // ── Theme ──
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode,
        colors,

        // ── Notifications ──
        notificationsEnabled,
        toggleNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

export default AppContext;
