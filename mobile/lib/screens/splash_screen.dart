import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../api/auth_service.dart';
import 'login_screen.dart';
import 'select_role_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeIn);
    _controller.forward();

    _checkAuth();
  }

  Future<void> _checkAuth() async {
    await Future.delayed(const Duration(seconds: 3)); // Minimum splash time
    final loggedIn = await authService.isLoggedIn();
    
    if (!mounted) return;

    if (loggedIn) {
      final prefs = await SharedPreferences.getInstance();
      final role = prefs.getString('user_role') ?? 'unassigned';
      
      if (role == 'unassigned') {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const SelectRoleScreen()),
        );
      } else {
        // Navigate to Dashboard (stubs for now)
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const SelectRoleScreen()),
        );
      }
    } else {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC), // Matching Premium Light Theme
      body: Center(
        child: FadeTransition(
          opacity: _animation,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SvgPicture.asset(
                'assets/logo.svg',
                width: 120,
                height: 120,
              ),
              const SizedBox(height: 24),
              const Text(
                'easyPG',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E293B),
                  letterSpacing: -1,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Loading your property...',
                style: TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
