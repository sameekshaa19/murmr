import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from '../utils/theme';

import { TAG_TYPES, MOODS, SCREENS } from '../utils/constants';
import {
  hapticSuccess,
  hapticLight,
  showErrorAlert,
} from '../utils/helpers';

import { useNotes } from '../context/NotesContext';
import TagSelector from '../components/TagSelector';
import LoadingSpinner from '../components/LoadingSpinner';

const TagScreen = ({ navigation, route }) => {
  const { audioDetails, title } = route.params;
  const { createNote } = useNotes();

  const [selectedTagType, setSelectedTagType] = useState(null);
  const [loading, setLoading] = useState(false);

  // Location state
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState('');

  // Time state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Mood state
  const [selectedMood, setSelectedMood] = useState(null);

  // Receive returned location from picker screen
  useEffect(() => {
    if (route.params?.pickedLocation) {
      const coords = route.params.pickedLocation;
      setCurrentLocation(coords);
      setAddress("Custom Location");
      hapticSuccess();
    }
  }, [route.params?.pickedLocation]);

  const openLocationPicker = () => {
    hapticLight();
    navigation.navigate("LocationPicker");
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) setSelectedDate(date);
  };

  const handleTimeChange = (event, date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (date) setSelectedDate(date);
  };

  const handleSaveNote = async () => {
    try {
      setLoading(true);

      let tagValue;

      switch (selectedTagType) {
        case TAG_TYPES.LOCATION:
          if (!currentLocation) {
            showErrorAlert('Please pick a location first');
            setLoading(false);
            return;
          }

          tagValue = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            radius: 150,
            address: address || "Custom Location",
          };
          break;

        case TAG_TYPES.TIME:
          if (!selectedDate) {
            showErrorAlert('Please select a date & time');
            setLoading(false);
            return;
          }

          tagValue = {
            timestamp: selectedDate.toISOString(),
            date: selectedDate.toLocaleDateString(),
            time: selectedDate.toLocaleTimeString(),
          };
          break;

        case TAG_TYPES.MOOD:
          if (!selectedMood) {
            showErrorAlert('Please select a mood');
            setLoading(false);
            return;
          }

          const mood = MOODS.find(m => m.id === selectedMood);
          tagValue = {
            moodId: selectedMood,
            moodLabel: mood.label,
            moodEmoji: mood.emoji,
          };
          break;

        default:
          showErrorAlert('Please select a tag type');
          setLoading(false);
          return;
      }

      const noteData = {
        title,
        audioUri: audioDetails.uri,
        duration: audioDetails.duration,
        tagType: selectedTagType,
        tagValue,
      };

      await createNote(noteData);
      hapticSuccess();
      navigation.navigate(SCREENS.HOME);
    } catch (error) {
      console.error(error);
      showErrorAlert('Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Saving your note..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TagSelector
          selectedTag={selectedTagType}
          onSelectTag={setSelectedTagType}
        />

        {/* LOCATION */}
        {selectedTagType === TAG_TYPES.LOCATION && (
          <View style={styles.configContainer}>
            <Text style={styles.configTitle}>Select Location</Text>

            {currentLocation ? (
              <View style={styles.locationCard}>
                <Text style={styles.locationIcon}>📍</Text>

                <View style={styles.locationInfo}>
                  <Text style={styles.locationAddress}>
                    {address || "Custom Location"}
                  </Text>
                  <Text style={styles.locationCoords}>
                    {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={openLocationPicker}
                style={styles.getLocationButton}
              >
                <Text style={styles.getLocationIcon}>📍</Text>
                <Text style={styles.getLocationText}>Pick Location on Map</Text>
              </TouchableOpacity>
            )}

            {currentLocation && (
              <TouchableOpacity
                onPress={openLocationPicker}
                style={styles.changeLocationButton}
              >
                <Text style={styles.changeLocationText}>Change Location</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* TIME */}
        {selectedTagType === TAG_TYPES.TIME && (
          <View style={styles.configContainer}>
            <Text style={styles.configTitle}>Schedule Reminder</Text>

            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateTimeButton}
              >
                <Text style={styles.dateTimeIcon}>📅</Text>
                <View style={styles.dateTimeInfo}>
                  <Text style={styles.dateTimeLabel}>Date</Text>
                  <Text style={styles.dateTimeValue}>
                    {selectedDate.toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={styles.dateTimeButton}
              >
                <Text style={styles.dateTimeIcon}>⏰</Text>
                <View style={styles.dateTimeInfo}>
                  <Text style={styles.dateTimeLabel}>Time</Text>
                  <Text style={styles.dateTimeValue}>
                    {selectedDate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={handleDateChange}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
        )}

        {/* MOOD */}
        {selectedTagType === TAG_TYPES.MOOD && (
          <View style={styles.configContainer}>
            <Text style={styles.configTitle}>Select your mood</Text>

            <View style={styles.moodsGrid}>
              {MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  onPress={() => {
                    hapticLight();
                    setSelectedMood(mood.id);
                  }}
                  style={[
                    styles.moodCard,
                    selectedMood === mood.id && styles.moodCardSelected,
                    { borderColor: mood.color },
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedTagType && (
          <TouchableOpacity
            onPress={handleSaveNote}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save Note 🎉</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },

  configContainer: { marginTop: SPACING.xl },
  configTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },

  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },

  locationIcon: { fontSize: 32, marginRight: SPACING.md },
  locationInfo: { flex: 1 },
  locationAddress: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },

  locationCoords: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.labelRegular,
    color: COLORS.darkGray,
  },

  getLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.soft,
  },

  getLocationIcon: { fontSize: 24, marginRight: SPACING.sm },

  getLocationText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },

  changeLocationButton: { marginTop: SPACING.md, alignItems: 'center' },
  changeLocationText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.bold,
    color: COLORS.accent,
  },

  dateTimeContainer: { gap: SPACING.md },

  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },

  dateTimeIcon: { fontSize: 32, marginRight: SPACING.md },

  dateTimeInfo: { flex: 1 },

  dateTimeLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.labelRegular,
    color: COLORS.darkGray,
    marginBottom: SPACING.xs,
  },

  dateTimeValue: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },

  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  moodCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },

  moodCardSelected: {
    borderWidth: 3,
    backgroundColor: COLORS.accentLight,
    ...SHADOWS.medium,
  },

  moodEmoji: { fontSize: 36, marginBottom: SPACING.xs },

  moodLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.labelBold,
    color: COLORS.dark,
    textAlign: 'center',
  },

  saveButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
    ...SHADOWS.medium,
  },

  saveButtonText: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default TagScreen;
