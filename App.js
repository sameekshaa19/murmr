// App.js

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { NotesProvider } from './src/context/NotesContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingSpinner from './src/components/LoadingSpinner';
import { COLORS } from './src/utils/theme';
import { requestAllPermissions } from './src/utils/permissions';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      // Load fonts
      await Font.loadAsync({
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins-Black.ttf'),
        'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
      });
      setFontsLoaded(true);

      // Request permissions
      const permissions = await requestAllPermissions();
      setPermissionsGranted(permissions.allGranted);
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <LoadingSpinner message="Loading Murmr..." />
      </View>
    );
  }

  return (
    <NotesProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </NotesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});