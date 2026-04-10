import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../../styles/theme';

const GlassPanel = ({ children, style }) => {
  return (
    <View style={[styles.panel, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    // Add subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
});

export default GlassPanel;
