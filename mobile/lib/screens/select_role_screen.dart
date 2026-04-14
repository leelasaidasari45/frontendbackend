import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../api/api_client.dart';
import '../api/auth_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SelectRoleScreen extends StatefulWidget {
  const SelectRoleScreen({super.key});

  @override
  State<SelectRoleScreen> createState() => _SelectRoleScreenState();
}

class _SelectRoleScreenState extends State<SelectRoleScreen> {
  bool _loading = false;

  Future<void> _updateRole(String role) async {
    setState(() => _loading = true);
    try {
      final response = await apiClient.dio.put('/api/auth/update-role', data: {'role': role});
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_role', role);
      if (response.data['token'] != null) {
        await prefs.setString('access_token', response.data['token']);
      }

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Welcome aboard!'), backgroundColor: Colors.green),
      );

      // Navigate to Dashboard stub
      // For now, we stay here or show a 'Coming Soon' toast
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString()), backgroundColor: Colors.redAccent),
      );
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          // Mesh Background Simulation
          Positioned(
            top: -100,
            left: -100,
            child: Container(width: 300, height: 300, decoration: BoxDecoration(shape: BoxShape.circle, color: const Color(0xFFE0E7FF).withOpacity(0.4))),
          ),
          Positioned(
            bottom: -100,
            right: -100,
            child: Container(width: 300, height: 300, decoration: BoxDecoration(shape: BoxShape.circle, color: const Color(0xFFD1FAE5).withOpacity(0.4))),
          ),

          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Welcome!',
                    style: GoogleFonts.outfit(
                      fontSize: 48,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF1E293B),
                      letterSpacing: -2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Tell us how you\'ll be using the app',
                    style: TextStyle(color: Color(0xFF64748B), fontSize: 16),
                  ),
                  const SizedBox(height: 48),

                  _buildRoleItem(
                    title: 'I am a Hostel Owner',
                    desc: 'I want to manage rooms and tenants',
                    icon: LucideIcons.building2,
                    color: const Color(0xFF4F46E5),
                    onTap: () => _updateRole('owner'),
                  ),

                  const SizedBox(height: 16),
                  Container(height: 1, width: 200, color: Colors.grey.withOpacity(0.1)),
                  const SizedBox(height: 16),

                  _buildRoleItem(
                    title: 'I am a Resident',
                    desc: 'I am looking for or staying in a room',
                    icon: LucideIcons.user,
                    color: const Color(0xFF10B981),
                    onTap: () => _updateRole('tenant'),
                  ),
                ],
              ),
            ),
          ),

          if (_loading)
            Container(
              color: Colors.black26,
              child: const Center(child: CircularProgressIndicator(color: Colors.white)),
            ),
        ],
      ),
    );
  }

  Widget _buildRoleItem({
    required String title,
    required String desc,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.7),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white),
        ),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(shape: BoxShape.circle, color: color, boxShadow: [BoxShadow(color: color.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))]),
              child: Icon(icon, color: Colors.white, size: 28),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
                  const SizedBox(height: 4),
                  Text(desc, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                ],
              ),
            ),
            const Icon(LucideIcons.chevronRight, color: Color(0xFFCBD5E1), size: 20),
          ],
        ),
      ),
    );
  }
}
