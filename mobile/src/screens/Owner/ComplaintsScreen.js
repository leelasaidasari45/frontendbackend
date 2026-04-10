import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Theme, globalStyles } from '../../styles/theme';
import { useHostel } from '../../context/HostelContext';
import apiClient from '../../api/apiClient';
import GlassPanel from '../../components/Shared/GlassPanel';
import { MessageSquare, AlertCircle, CheckCircle2, Clock } from 'lucide-react-native';

const ComplaintsScreen = () => {
  const { activeHostel } = useHostel();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('open'); // open | resolved

  const fetchComplaints = async () => {
    if (!activeHostel) return;
    try {
      const res = await apiClient.get(`/owner/complaints?hostelId=${activeHostel.id || activeHostel._id}`);
      setComplaints(res.data);
    } catch (err) {
      console.log('Error fetching complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [activeHostel]);

  const filteredComplaints = complaints.filter(c => 
    activeFilter === 'open' ? c.status !== 'resolved' : c.status === 'resolved'
  );

  if (loading) return <View style={styles.centered}><ActivityIndicator color={Theme.colors.primary} /></View>;

  return (
    <View style={globalStyles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeFilter === 'open' && styles.activeTab]}
          onPress={() => setActiveFilter('open')}
        >
          <Text style={[styles.tabText, activeFilter === 'open' && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeFilter === 'resolved' && styles.activeTab]}
          onPress={() => setActiveFilter('resolved')}
        >
          <Text style={[styles.tabText, activeFilter === 'resolved' && styles.activeTabText]}>Resolved</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint, idx) => (
            <GlassPanel key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.statusIcon, { backgroundColor: complaint.status === 'open' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)' }]}>
                  {complaint.status === 'open' ? 
                    <AlertCircle size={20} color="#ef4444" /> : 
                    <CheckCircle2 size={20} color="#22c55e" />
                  }
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.tenantName}>{complaint.users?.name || 'Unknown Tenant'}</Text>
                  <Text style={styles.roomNo}>Room {complaint.users?.room_number || 'N/A'}</Text>
                </View>
                <Text style={styles.date}>{new Date(complaint.created_at).toLocaleDateString()}</Text>
              </View>

              <Text style={styles.title}>{complaint.title || 'General Issue'}</Text>
              <Text style={styles.desc}>{complaint.description}</Text>

              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.resolveBtn}>
                  <Text style={styles.resolveBtnText}>{complaint.status === 'open' ? 'Mark as Resolved' : 'View History'}</Text>
                </TouchableOpacity>
              </View>
            </GlassPanel>
          ))
        ) : (
          <View style={styles.emptyView}>
            <MessageSquare size={48} color={Theme.colors.border} />
            <Text style={styles.emptyText}>No {activeFilter} complaints.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background },
  tabs: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: 'rgba(255,255,255,0.1)' },
  tabText: { color: Theme.colors.textMuted, fontWeight: '600' },
  activeTabText: { color: '#fff' },
  list: { paddingBottom: 40 },
  card: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 12 },
  statusIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  tenantName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  roomNo: { color: Theme.colors.textMuted, fontSize: 12 },
  date: { color: Theme.colors.textMuted, fontSize: 11 },
  title: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  desc: { color: Theme.colors.textMuted, fontSize: 14, lineHeight: 20, marginBottom: 15 },
  cardFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  resolveBtn: { backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  resolveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  emptyView: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: Theme.colors.textMuted, marginTop: 15, fontSize: 16 },
});

export default ComplaintsScreen;
