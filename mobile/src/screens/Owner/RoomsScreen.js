import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Theme, globalStyles } from '../../styles/theme';
import { useHostel } from '../../context/HostelContext';
import apiClient from '../../api/apiClient';
import GlassPanel from '../../components/Shared/GlassPanel';
import { ChevronRight, Plus, Layers, Home } from 'lucide-react-native';

const RoomsScreen = () => {
  const { activeHostel } = useHostel();
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    if (!activeHostel) return;
    try {
      const res = await apiClient.get(`/owner/rooms?hostelId=${activeHostel.id || activeHostel._id}`);
      setFloors(res.data);
    } catch (err) {
      console.log('Error fetching rooms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [activeHostel]);

  if (loading) return <View style={styles.centered}><ActivityIndicator color={Theme.colors.primary} /></View>;

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Property Layout</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add Floor</Text>
        </TouchableOpacity>
      </View>

      {floors.length > 0 ? (
        floors.map((floor, fIdx) => (
          <GlassPanel key={fIdx} style={styles.floorCard}>
            <View style={styles.floorHeader}>
              <View style={styles.floorInfo}>
                <Layers size={20} color={Theme.colors.primary} />
                <Text style={styles.floorNo}>Floor {floor.floor_number}</Text>
              </View>
              <Text style={styles.roomCount}>{floor.rooms?.length || 0} Rooms</Text>
            </View>

            <View style={styles.roomGrid}>
              {floor.rooms?.map((room, rIdx) => (
                <TouchableOpacity key={rIdx} style={styles.roomItem}>
                  <Home size={18} color={Theme.colors.textMuted} />
                  <Text style={styles.roomNo}>Room {room.room_number}</Text>
                  <ChevronRight size={16} color={Theme.colors.textMuted} />
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addRoomBtn}>
                <Plus size={16} color={Theme.colors.primary} />
                <Text style={styles.addRoomText}>Add Room</Text>
              </TouchableOpacity>
            </View>
          </GlassPanel>
        ))
      ) : (
        <Text style={styles.emptyText}>No floors added yet. Start by adding your first floor!</Text>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  addBtn: { backgroundColor: Theme.colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  floorCard: { marginBottom: 16, padding: 0, overflow: 'hidden' },
  floorHeader: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  floorInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  floorNo: { color: '#fff', fontSize: 16, fontWeight: '700' },
  roomCount: { color: Theme.colors.textMuted, fontSize: 12 },
  roomGrid: { padding: 8 },
  roomItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', marginBottom: 8, padding: 12, borderRadius: 10, gap: 10 },
  roomNo: { color: '#fff', flex: 1, fontSize: 15 },
  addRoomBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 10, marginTop: 4, gap: 6 },
  addRoomText: { color: Theme.colors.primary, fontWeight: '600' },
  emptyText: { color: Theme.colors.textMuted, textAlign: 'center', marginTop: 40, fontSize: 16 },
});

export default RoomsScreen;
