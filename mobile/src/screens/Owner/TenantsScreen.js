import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Theme, globalStyles } from '../../styles/theme';
import { useHostel } from '../../context/HostelContext';
import apiClient from '../../api/apiClient';
import GlassPanel from '../../components/Shared/GlassPanel';
import { Search, UserPlus, Phone, MessageSquare, ChevronRight } from 'lucide-react-native';

const TenantsScreen = () => {
  const { activeHostel } = useHostel();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // active | pending

  const fetchTenants = async () => {
    if (!activeHostel) return;
    try {
      const res = await apiClient.get(`/owner/tenants?hostelId=${activeHostel.id || activeHostel._id}`);
      setTenants(res.data);
    } catch (err) {
      console.log('Error fetching tenants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [activeHostel]);

  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      const matchesSearch = t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.room_number?.includes(searchTerm);
      const matchesTab = activeTab === 'active' ? t.status === 'active' : t.status === 'pending';
      return matchesSearch && matchesTab;
    });
  }, [tenants, searchTerm, activeTab]);

  if (loading) return <View style={styles.centered}><ActivityIndicator color={Theme.colors.primary} /></View>;

  return (
    <View style={globalStyles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search size={18} color={Theme.colors.textMuted} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search name or room..."
            placeholderTextColor={Theme.colors.textMuted}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <View style={styles.tabWithBadge}>
            <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Requests</Text>
            {tenants.filter(t => t.status === 'pending').length > 0 && (
              <View style={styles.badge} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filteredTenants.length > 0 ? (
          filteredTenants.map((tenant, idx) => (
            <GlassPanel key={idx} style={styles.tenantCard}>
              <View style={styles.tenantInfo}>
                <View style={[styles.avatar, { backgroundColor: activeTab === 'active' ? Theme.colors.primary : '#f97316' }]}>
                  <Text style={styles.avatarText}>{tenant.name?.charAt(0)}</Text>
                </View>
                <View style={styles.tenantText}>
                  <Text style={styles.tenantName}>{tenant.name}</Text>
                  <Text style={styles.tenantSub}>{activeTab === 'active' ? `Room ${tenant.room_number || 'N/A'}` : 'Requested to join'}</Text>
                </View>
                <ChevronRight size={20} color={Theme.colors.textMuted} />
              </View>

              {activeTab === 'active' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.iconBtn}>
                    <Phone size={18} color="#22c55e" />
                    <Text style={[styles.iconBtnText, { color: '#22c55e' }]}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn}>
                    <MessageSquare size={18} color={Theme.colors.primary} />
                    <Text style={[styles.iconBtnText, { color: Theme.colors.primary }]}>SMS</Text>
                  </TouchableOpacity>
                </View>
              )}
            </GlassPanel>
          ))
        ) : (
          <View style={styles.emptyView}>
            <UserPlus size={48} color={Theme.colors.border} />
            <Text style={styles.emptyText}>No {activeTab} tenants found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background },
  searchContainer: { marginBottom: 16 },
  searchInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: Theme.colors.border },
  searchInput: { flex: 1, color: '#fff', marginLeft: 10, fontSize: 15 },
  tabs: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: 'rgba(255,255,255,0.1)' },
  tabText: { color: Theme.colors.textMuted, fontWeight: '600' },
  activeTabText: { color: '#fff' },
  tabWithBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f97316' },
  list: { paddingBottom: 40 },
  tenantCard: { marginBottom: 12 },
  tenantInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  tenantText: { flex: 1 },
  tenantName: { color: '#fff', fontSize: 17, fontWeight: '600' },
  tenantSub: { color: Theme.colors.textMuted, fontSize: 13, marginTop: 2 },
  actionRow: { flexDirection: 'row', marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', gap: 12 },
  iconBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.03)', paddingVertical: 8, borderRadius: 8 },
  iconBtnText: { fontWeight: '600', fontSize: 13 },
  emptyView: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: Theme.colors.textMuted, marginTop: 15, fontSize: 16 },
});

export default TenantsScreen;
