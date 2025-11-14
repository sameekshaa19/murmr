import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';   // Correct import
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { formatDuration, hapticLight } from '../utils/helpers';
import audioService from '../services/audioService';

const AudioPlayer = ({ audioUri, onPlaybackEnd }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startPositionTracking = () => {
    intervalRef.current = setInterval(async () => {
      const status = await audioService.getPlaybackStatus();
      if (status) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis);

        if (status.didJustFinish) {
          setIsPlaying(false);
          setPosition(0);
          if (onPlaybackEnd) onPlaybackEnd();
          clearInterval(intervalRef.current);
        }
      }
    }, 100);
  };

  const handlePlayPause = async () => {
    try {
      hapticLight();

      if (!isPlaying) {
        setIsLoading(true);
        await audioService.playAudio(audioUri);
        setIsPlaying(true);
        startPositionTracking();
      } else {
        await audioService.pauseAudio();
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    } catch (error) {
      console.error('Playback error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopPlayback = async () => {
    try {
      await audioService.stopAudio();
      setIsPlaying(false);
      setPosition(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } catch (error) {
      console.error('Stop playback error:', error);
    }
  };

  const handleSliderChange = async (value) => {
    try {
      await audioService.setPositionAsync(value);
      setPosition(value);
    } catch (error) {
      console.error('Seek error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatDuration(position)}</Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={Number(duration)}
          value={Number(position)}
          onSlidingComplete={handleSliderChange}
          minimumTrackTintColor={COLORS.accent}
          maximumTrackTintColor={COLORS.gray}
          thumbTintColor={COLORS.accent}
        />

        <Text style={styles.timeText}>{formatDuration(duration)}</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={handlePlayPause}
          style={[styles.playButton, isLoading && styles.playButtonDisabled]}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.playIcon}>
            {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>

        {isPlaying && (
          <TouchableOpacity
            onPress={stopPlayback}
            style={styles.stopButton}
            activeOpacity={0.8}
          >
            <View style={styles.stopIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.soft,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  slider: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  timeText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.labelRegular,
    color: COLORS.darkGray,
    minWidth: 45,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  playIcon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
  },
  stopButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    width: 18,
    height: 18,
    backgroundColor: COLORS.white,
    borderRadius: 3,
  },
});

export default AudioPlayer;
