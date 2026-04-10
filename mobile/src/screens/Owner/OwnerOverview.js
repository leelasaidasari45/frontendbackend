import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Theme, globalStyles } from '../../styles/theme';
import { useHostel } from '../../context/HostelContext';
import apiClient from '../../api/apiClient';
import StatCard from '../../components/Shared/StatCard';
import GlassPanel from '../../components/Shared/GlassPanel';
import AppButton from '../../components/Shared/AppButton';
import { LayoutDashboard, Bell, Home, TrendingUp } from 'lucide-react-native';

const OwnerOverview = () => {
  const { activeHostel, loadingHostels } = useHostel();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    if (!activeHostel) return;
    try {
      const res = await apiClient.get(`/owner/analytics?hostelId=${activeHostel.id || activeHostel._id}`);
      setAnalytics(res.data);
    } catch (err) {
      console.log('Error fetching analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeHostel]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  if (loadingHostels || loading) {
    return <View style={styles.centered}><Text style={{color: '#fff'}}>Loading Analytics...</Text></View>;
  }

  return (
    <ScrollView 
      style={globalStyles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Overview</Text>
        <Text style={styles.subtitle}>{activeHostel?.name || 'Managing Property'}</Text>
      </View>

      {/* Stats Grid - 1:1 Mirror of Web Stat Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard 
            title="Total Collection" 
            value={`₹${analytics?.metrics.totalCollection.toLocaleString()}`}
            trend={analytics?.metrics.collectionTrend}
            trendLabel="vs last month"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard 
            title="Total Tenants" 
            value={analytics?.metrics.totalTenants.toString()}
            subtitle="Active Residents"
          />
          <StatCard 
            title="Occupancy" 
            value={`${analytics?.metrics.occupancyRate}%`}
            subtitle={`${analytics?.metrics.availableRooms} Rooms left`}
          />
        </View>
      </View>

      {/* Action Widgets - 1:1 Mirror of Web Dashboard Widgets */}
      <View style={styles.widgets}>
        <GlassPanel style={styles.widget}>
          <View style={styles.widgetHeader}>
            <Bell size={20} color={Theme.colors.primary} />
            <Text style={styles.widgetTitle}>Post Notice</Text>
          </View>
          <Text style={styles.widgetDesc}>Broadcast an alert to all tenants instantly.</Text>
          <AppButton title="Open Notice Board" variant="secondary" style={styles.widgetBtn} />
        </GlassPanel>

        <GlassPanel style={[styles.widget, { borderLeftWidth: 4, borderLeftColor: '#22c55e' }]}>
          <View style={styles.widgetHeader}>
            <TrendingUp size={20} color="#22c55e" />
            <Text style={styles.widgetTitle}>Update Menu</Text>
          </View>
          <Text style={styles.widgetDesc}>Set the food menu for today or tomorrow.</Text>
          <AppButton title="Open Food Menu" variant="secondary" style={styles.widgetBtn} />
        </GlassPanel>

        <GlassPanel style={[styles.widget, { borderLeftWidth: 4, borderLeftColor: '#f97316' }]}>
          <View style={styles.widgetHeader}>
            <Home size={20} color="#f97316" />
            <Text style={styles.widgetTitle}>Share Property</Text>
          </View>
          <Text style={styles.widgetDesc}>Allow new tenants to join using your code.</Text>
          <View style={styles.codeContainer}>
             <Text style={styles.codeLabel}>HOSTEL CODE</Text>
             <Text style={styles.codeText}>{activeHostel?.pg_code || activeHostel?.code}</Text>
          </View>
          <AppButton title="Copy Share Link" variant="primary" style={styles.widgetBtn} />
        </GlassPanel>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background },
  header: { marginBottom: Theme.spacing.lg, marginTop: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: Theme.colors.primary, fontSize: 16, fontWeight: '600', textTransform: 'uppercase' },
  statsGrid: { gap: Theme.spacing.md, marginBottom: Theme.spacing.lg },
  statsRow: { flexDirection: 'row', gap: Theme.spacing.md },
  widgets: { gap: Theme.spacing.md, marginBottom: 40 },
  widget: { padding: 20 },
  widgetHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  widgetTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  widgetDesc: { color: Theme.colors.textMuted, fontSize: 14, marginBottom: 16 },
  widgetBtn: { height: 40 },
  codeContainer: { alignItems: 'center', marginVertical: 10 },
  codeLabel: { color: Theme.colors.textMuted, fontSize: 10, letterSpacing: 1 },
  codeText: { color: '#f97316', fontSize: 24, fontWeight: 'bold', letterSpacing: 4 }
});

export default OwnerOverview;
