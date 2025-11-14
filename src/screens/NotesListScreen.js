// src/screens/NotesListScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../utils/theme';
import { TAG_TYPES, SCREENS } from '../utils/constants';
import { hapticLight } from '../utils/helpers';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import LoadingSpinner from '../components/LoadingSpinner';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All', icon: '📝' },
  { id: TAG_TYPES.LOCATION, label: 'Location', icon: '📍' },
  { id: TAG_TYPES.TIME, label: 'Time', icon: '⏰' },
  { id: TAG_TYPES.MOOD, label: 'Mood', icon: '😌' },
];

const NotesListScreen = ({ navigation }) => {
  const { notes, loading, deleteNote, refreshNotes } = useNotes();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredNotes = selectedFilter === 'all'
    ? notes
    : notes.filter(note => note.tagType === selectedFilter);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshNotes();
    setRefreshing(false);
  };

  const handlePlayNote = (note) => {
    hapticLight();
    navigation.navigate(SCREENS.PLAYBACK, { note });
  };

  const handleDeleteNote = async (note) => {
    await deleteNote(note._id, note.audioUri);
  };

  const handleNotePress = (note) => {
    handlePlayNote(note);
  };

  const renderFilterButton = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        hapticLight();
        setSelectedFilter(item.id);
      }}
      style={[
        styles.filterButton,
        selectedFilter === item.id && styles.filterButtonActive,
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.filterIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.filterLabel,
          selectedFilter === item.id && styles.filterLabelActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderNote = ({ item }) => (
    <NoteCard
      note={item}
      onPress={handleNotePress}
      onDelete={handleDeleteNote}
      onPlay={handlePlayNote}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎙️</Text>
      <Text style={styles.emptyTitle}>No notes yet</Text>
      <Text style={styles.emptyText}>
        {selectedFilter === 'all'
          ? 'Start recording your first voice note!'
          : `No ${selectedFilter} notes found`}
      </Text>
    </View>
  );

  if (loading && notes.length === 0) {
    return <LoadingSpinner message="Loading notes..." />;
  }

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={FILTER_OPTIONS}
          renderItem={renderFilterButton}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.notesList}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filtersContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  filtersList: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.lightGray,
    marginRight: SPACING.sm,
  },
  filterButtonActive: {
    backgroundColor: COLORS.accent,
  },
  filterIcon: {
    fontSize: 18,
    marginRight: SPACING.xs,
  },
  filterLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  filterLabelActive: {
    color: COLORS.white,
  },
  notesList: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});

export default NotesListScreen;