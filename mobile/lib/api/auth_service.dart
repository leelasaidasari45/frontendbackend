import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../api/api_client.dart';

class AuthService {
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await apiClient.dio.post('/api/auth/login', data: {
        'email': email,
        'password': password,
      });

      final data = response.data;
      if (data['token'] != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('access_token', data['token']);
        await prefs.setString('user_id', data['id']?.toString() ?? '');
        await prefs.setString('user_role', data['role'] ?? 'unassigned');
        await prefs.setString('user_name', data['name'] ?? '');
        await prefs.setString('user_email', data['email'] ?? '');
      }
      return data;
    } on DioException catch (e) {
      throw e.response?.data['error'] ?? 'Login failed. Please try again.';
    }
  }

  Future<Map<String, dynamic>> register(String name, String email, String password, String phone) async {
    try {
      final response = await apiClient.dio.post('/api/auth/register', data: {
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
      });
      return response.data;
    } on DioException catch (e) {
      throw e.response?.data['error'] ?? 'Registration failed.';
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('user_role');
    await prefs.remove('user_name');
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token') != null;
  }
}

final authService = AuthService();
