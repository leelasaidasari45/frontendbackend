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
    try {
      debugPrint('SPLASH: Starting Auth Check...');
      await Future.delayed(const Duration(seconds: 2));
      
      final loggedIn = await authService.isLoggedIn();
      debugPrint('SPLASH: Logged In = $loggedIn');
      
      if (!mounted) return;

      if (loggedIn) {
        final prefs = await SharedPreferences.getInstance();
        final role = prefs.getString('user_role') ?? 'unassigned';
        debugPrint('SPLASH: User Role = $role');
        
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const SelectRoleScreen()),
        );
      } else {
        debugPrint('SPLASH: Navigating to Login');
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      }
    } catch (e) {
      debugPrint('SPLASH ERROR: $e');
      if (!mounted) return;
      // Fallback to login on error
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
      backgroundColor: const Color(0xFFF8FAFC),
      body: Center(
        child: FadeTransition(
          opacity: _animation,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Temporarily using Container + Icon instead of SVG to avoid native crash
              Container(
                width: 120,
                height: 120,
                decoration: const BoxDecoration(
                  color: Color(0xFF4F46E5),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.home_work_rounded,
                  size: 60,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'easyPG',
                style: TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF1E293B),
                  letterSpacing: -1,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Connecting to Server...',
                style: TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
