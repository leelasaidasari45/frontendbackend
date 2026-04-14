import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static const String baseUrl = 'https://pg-backend-499c.onrender.com';
  
  late Dio _dio;
  
  ApiClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Interceptors for JWT and Logging
    _dio.interceptors.addAll([
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final prefs = await SharedPreferences.getInstance();
          final token = prefs.getString('access_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          debugPrint('APP_API: Sending ${options.method} to ${options.path}');
          return handler.next(options);
        },
        onResponse: (response, handler) {
          debugPrint('APP_API: Success [${response.statusCode}]');
          return handler.next(response);
        },
        onError: (DioException e, handler) {
          debugPrint('APP_API_ERROR: [${e.response?.statusCode}] ${e.response?.data}');
          debugPrint('APP_API_ERROR_FULL: ${e.message}');
          return handler.next(e);
        },
      ),
      LogInterceptor(requestBody: true, responseBody: true), // Verbose logs
    ]);
  }

  Dio get dio => _dio;
}

// Global instance for singleton-like usage
final apiClient = ApiClient();
