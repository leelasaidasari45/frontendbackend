import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Theme, globalStyles } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import GlassPanel from '../../components/Shared/GlassPanel';
import AppButton from '../../components/Shared/AppButton';
import { QrCode, Clipboard, CheckCircle2 } from 'lucide-react-native';

const JoinHostel = ({ navigation }) => {
  const { user } = useAuth();
  const [hostelCode, setHostelCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleJoin = async () => {
    if (!hostelCode || hostelCode.length < 6) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-digit hostel code.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/tenant/join', { pgCode: hostelCode });
      setSuccess(true);
      setTimeout(() => {
        // In a real app, we might need to refresh user context or just go to dashboard
        // For now, we'll tell them it's pending approval
      }, 2000);
    } catch (err) {
      Alert.alert('Join Failed', err.response?.data?.error || 'Could not join hostel. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={[globalStyles.container, styles.centered]}>
        <CheckCircle2 size={80} color="#22c55e" />
        <Text style={styles.successTitle}>Request Sent!</Text>
        <Text style={styles.successText}>Your request to join has been sent to the owner. You will see your dashboard once they approve you.</Text>
        <AppButton 
          title="Back to Dashboard" 
          onPress={() => navigation.navigate('TenantDashboard')}
          style={{ marginTop: 30, width: '100%' }}
        />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Join a Hostel</Text>
        <Text style={styles.subtitle}>Connect with your property manager</Text>
      </View>

      <GlassPanel style={styles.card}>
        <Text style={styles.label}>Enter 6-Digit Code</Text>
        <View style={styles.inputWrapper}>
          <Clipboard size={20} color={Theme.colors.textMuted} />
          <TextInput 
            style={styles.input}
            placeholder="e.g. PG1234"
            placeholderTextColor={Theme.colors.textMuted}
            value={hostelCode}
            onChangeText={setHostelCode}
            autoCapitalize="characters"
            maxLength={10}
          />
        </View>
        <AppButton 
          title="Connect to Hostel" 
          onPress={handleJoin} 
          loading={loading}
          style={styles.joinBtn}
        />
      </GlassPanel>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.qrBanner}>
        <QrCode size={32} color={Theme.colors.primary} />
        <View style={styles.qrTextContainer}>
          <Text style={styles.qrTitle}>Scan QR Code</Text>
          <Text style={styles.qrSubtitle}>Fastest way to join your hostel</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.footerNote}>
        Ask your hostel owner for the unique join code or find it on the notice board.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: 40, marginBottom: 30 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: Theme.colors.textMuted, fontSize: 15, marginTop: 4 },
  card: { padding: 24 },
  label: { color: Theme.colors.text, fontSize: 16, fontWeight: '600', marginBottom: 12 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: Theme.colors.border, paddingHorizontal: 15, height: 56, marginBottom: 20 },
  input: { flex: 1, color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
  joinBtn: { width: '100%' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 40, opacity: 0.5 },
  line: { flex: 1, height: 1, backgroundColor: Theme.colors.border },
  orText: { color: Theme.colors.textMuted, marginHorizontal: 15, fontSize: 12, fontWeight: 'bold' },
  qrBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.2)' },
  qrTextContainer: { marginLeft: 15 },
  qrTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  qrSubtitle: { color: Theme.colors.textMuted, fontSize: 13 },
  footerNote: { color: Theme.colors.textMuted, textAlign: 'center', marginTop: 'auto', marginBottom: 20, fontSize: 12, lineHeight: 18 },
  successTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 20 },
  successText: { color: Theme.colors.textMuted, textAlign: 'center', marginTop: 10, fontSize: 15, lineHeight: 22, paddingHorizontal: 20 }
});

export default JoinHostel;
