// src/navigation/AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { COLORS, FONTS, FONT_SIZES } from '../utils/theme';
import { SCREENS } from '../utils/constants';

// Screens
import HomeScreen from '../screens/HomeScreen';
import RecordScreen from '../screens/RecordScreen';
import TagScreen from '../screens/TagScreen';
import NotesListScreen from '../screens/NotesListScreen';
import PlaybackScreen from '../screens/PlaybackScreen';
import LocationPickerScreen from '../screens/LocationPickerScreen';   // ✅ NEW SCREEN

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SCREENS.HOME}
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.dark,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontFamily: FONTS.bold,
            fontSize: FONT_SIZES.lg,
          },
          headerBackTitleVisible: false,
          cardStyle: {
            backgroundColor: COLORS.background,
          },
          animationEnabled: true,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen
          name={SCREENS.HOME}
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name={SCREENS.RECORD}
          component={RecordScreen}
          options={{
            title: 'Record Note',
            headerStyle: { backgroundColor: COLORS.dark },
          }}
        />

        <Stack.Screen
          name={SCREENS.TAG}
          component={TagScreen}
          options={{
            title: 'Tag Your Note',
            headerStyle: { backgroundColor: COLORS.dark },
          }}
        />

        <Stack.Screen
          name={SCREENS.NOTES_LIST}
          component={NotesListScreen}
          options={{
            title: 'My Notes',
            headerStyle: { backgroundColor: COLORS.dark },
          }}
        />

        <Stack.Screen
          name={SCREENS.PLAYBACK}
          component={PlaybackScreen}
          options={{
            title: 'Play Note',
            headerStyle: { backgroundColor: COLORS.dark },
          }}
        />

        <Stack.Screen
          name="LocationPicker"
          component={LocationPickerScreen}
          options={{
            title: 'Pick Location',
            headerStyle: { backgroundColor: COLORS.dark },
            headerTintColor: COLORS.primary,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
