import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color emeraldPrimary = Color(0xFF0D5C46);
  static const Color angkorGold = Color(0xFFB8860B);
  static const Color sandstoneBg = Color(0xFFF8F7F4);
  static const Color surfaceCard = Color(0xFFFFFFFF);
  static const Color inkDark = Color(0xFF17211C);

  static ThemeData lightTheme(Locale locale) {
    final bool isKhmer = locale.languageCode == 'km';
    final baseText = isKhmer
        ? GoogleFonts.notoSansKhmerTextTheme()
        : GoogleFonts.plusJakartaSansTextTheme();

    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: emeraldPrimary,
        primary: emeraldPrimary,
        secondary: angkorGold,
        surface: surfaceCard,
      ),
      scaffoldBackgroundColor: sandstoneBg,
      textTheme: baseText.apply(
        bodyColor: inkDark,
        displayColor: inkDark,
      ),
      cardTheme: CardThemeData(
        color: surfaceCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: Color(0xFFE5E0D8)),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: surfaceCard,
        indicatorColor: emeraldPrimary.withValues(alpha: 0.12),
        labelTextStyle: WidgetStateProperty.all(
          TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            fontFamily: isKhmer ? GoogleFonts.notoSansKhmer().fontFamily : null,
          ),
        ),
      ),
    );
  }
}
