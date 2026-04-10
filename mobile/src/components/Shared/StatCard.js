import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../styles/theme';
import GlassPanel from './GlassPanel';

const StatCard = ({ title, value, trend, trendLabel, subtitle }) => {
  return (
    <GlassPanel style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      
      {trend !== undefined && (
        <View style={styles.trendRow}>
          <Text style={[styles.trend, { color: trend >= 0 ? '#22c55e' : '#ef4444' }]}>
            {trend >= 0 ? '+' : ''}{trend}%
          </Text>
          {trendLabel && <Text style={styles.trendLabel}>{trendLabel}</Text>}
        </View>
      )}
      
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </GlassPanel>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, paddingVertical: 18 },
  title: { color: Theme.colors.textMuted, fontSize: 13, marginBottom: 6 },
  value: { color: '#fff', fontSize: 24, fontWeight: '800' },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  trend: { fontSize: 13, fontWeight: '700' },
  trendLabel: { color: Theme.colors.textMuted, fontSize: 11 },
  subtitle: { color: Theme.colors.textMuted, fontSize: 12, marginTop: 4 },
});

export default StatCard;
