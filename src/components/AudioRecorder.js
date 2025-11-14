// src/components/AudioRecorder.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { formatDuration, hapticMedium, hapticSuccess, hapticError } from '../utils/helpers';
import audioService from '../services/audioService';
import { AUDIO_CONFIG } from '../utils/constants';

const { width } = Dimensions.get('window');

const AudioRecorder = ({ onRecordingComplete, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnims = useRef(
    Array.from({ length: 20 }, () => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    if (isRecording && !isPaused) {
      startPulseAnimation();
      startWaveAnimation();
    }
    return () => {
      pulseAnim.stopAnimation();
      waveAnims.forEach(anim => anim.stopAnimation());
    };
  }, [isRecording, isPaused]);

  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 100;
          if (newDuration >= AUDIO_CONFIG.MAX_DURATION) {
            handleStopRecording();
            return AUDIO_CONFIG.MAX_DURATION;
          }
          return newDuration;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startWaveAnimation = () => {
    waveAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const handleStartRecording = async () => {
    try {
      hapticMedium();
      await audioService.startRecording();
      setIsRecording(true);
      setDuration(0);
    } catch (error) {
      hapticError();
      console.error('Recording error:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      hapticSuccess();
      const audioDetails = await audioService.stopRecording();
      setIsRecording(false);
      setDuration(0);
      onRecordingComplete(audioDetails);
    } catch (error) {
      hapticError();
      console.error('Stop recording error:', error);
    }
  };

  const handleCancelRecording = async () => {
    try {
      hapticMedium();
      await audioService.cancelRecording();
      setIsRecording(false);
      setDuration(0);
      onCancel();
    } catch (error) {
      console.error('Cancel recording error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Waveform Visualization */}
      {isRecording && (
        <View style={styles.waveformContainer}>
          {waveAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.waveBar,
                {
                  transform: [{ scaleY: anim }],
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Duration Display */}
      <View style={styles.durationContainer}>
        <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        <Text style={styles.durationLabel}>
          {isRecording ? 'Recording...' : 'Press to record'}
        </Text>
      </View>

      {/* Record Button */}
      <View style={styles.buttonContainer}>
        {!isRecording ? (
          <TouchableOpacity
            onPress={handleStartRecording}
            style={styles.recordButton}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.recordButtonInner,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.recordDot} />
            </Animated.View>
          </TouchableOpacity>
        ) : (
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              onPress={handleCancelRecording}
              style={[styles.controlButton, styles.cancelButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.controlIcon}>✕</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleStopRecording}
              style={[styles.controlButton, styles.stopButton]}
              activeOpacity={0.8}
            >
              <View style={styles.stopIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Max Duration Warning */}
      {duration > AUDIO_CONFIG.MAX_DURATION * 0.9 && (
        <Text style={styles.warningText}>
          Approaching maximum duration
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginBottom: SPACING.lg,
  },
  waveBar: {
    width: 4,
    height: 80,
    backgroundColor: COLORS.accent,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  durationContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  durationText: {
    fontSize: FONT_SIZES.xxxl,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  durationLabel: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.accent,
    marginTop: SPACING.xs,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  recordButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.accent,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
  },
  stopButton: {
    backgroundColor: COLORS.accent,
  },
  controlIcon: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  stopIcon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
  warningText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: SPACING.md,
  },
});

export default AudioRecorder;