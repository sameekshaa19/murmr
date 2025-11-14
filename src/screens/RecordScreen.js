// src/screens/RecordScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../utils/theme';
import { SCREENS } from '../utils/constants';
import AudioRecorder from '../components/AudioRecorder';
import { hapticSuccess } from '../utils/helpers';

const RecordScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [audioDetails, setAudioDetails] = useState(null);

  const handleRecordingComplete = (details) => {
    hapticSuccess();
    setAudioDetails(details);
    
    // Navigate to tag screen with audio details
    navigation.navigate(SCREENS.TAG, {
      audioDetails: details,
      title: title.trim() || null,
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Recording',
      'Are you sure you want to go back?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>
            Record Your Voice Note
          </Text>
          <Text style={styles.instructionsText}>
            Give it a title (optional) and record your message
          </Text>
        </View>

        {/* Title Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Give your note a title (optional)"
            placeholderTextColor={COLORS.darkGray}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Audio Recorder */}
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          onCancel={handleCancel}
        />

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <Text style={styles.tipText}>• Keep it short and clear</Text>
          <Text style={styles.tipText}>• Speak in a quiet environment</Text>
          <Text style={styles.tipText}>• Maximum 3 minutes</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  instructionsContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  instructionsTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  instructionsText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  tipsContainer: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.xl,
  },
  tipsTitle: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.sm,
  },
});

export default RecordScreen;