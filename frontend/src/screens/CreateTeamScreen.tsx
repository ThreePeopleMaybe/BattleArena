import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { theme } from '../theme';
import { globalStyles } from '../styles/globalStyles';
import { RootStackParamList } from '../navigation/types';
import { fetchOpponents } from '../api/opponents';
import { addTeam, updateTeam, getTeams } from '../storage/teamsStorage';
import type { Opponent } from '../data/opponents';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateTeam'>;
  route: RouteProp<RootStackParamList, 'CreateTeam'>;
};

export default function CreateTeamScreen({ navigation, route }: Props) {
  const teamId = route.params?.teamId;
  const isEditing = !!teamId;

  const [name, setName] = useState('');
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchOpponents(), getTeams()])
      .then(([list, teams]) => {
        if (cancelled) return;
        setOpponents(Array.isArray(list) ? list : []);
        if (isEditing && teamId) {
          const team = teams.find((t) => t.id === teamId);
          if (team) {
            setName(team.name);
            setSelectedIds(new Set(team.memberIds));
          }
        }
      })
      .catch(() => {
        if (!cancelled) setOpponents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [teamId, isEditing]);

  const toggleMember = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setError('');
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Enter a team name.');
      return;
    }

    const memberIds = Array.from(selectedIds);
    if (isEditing && teamId) {
      await updateTeam(teamId, { name: trimmed, memberIds });
    } else {
      await addTeam({ name: trimmed, memberIds });
    }
    navigation.goBack();
  };

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <Text style={styles.label}>Team name</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="e.g. Weekend crew"
        placeholderTextColor={theme.colors.textMuted}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Add members (opponents)</Text>
      {loading ? (
        <Text style={styles.muted}>Loading opponents...</Text>
      ) : (
        <ScrollView style={styles.memberList} contentContainerStyle={styles.memberListContent}>
          {opponents.map((o) => {
            const isSelected = selectedIds.has(o.id);
            return (
              <TouchableOpacity
                key={o.id}
                style={[styles.memberRow, isSelected && styles.memberRowSelected]}
                onPress={() => toggleMember(o.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isSelected ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={isSelected ? theme.colors.primary : theme.colors.textMuted}
                />
                <Text style={styles.memberName}>{o.name}</Text>
                <Text style={styles.memberRecord}>{o.wins}W-{o.losses}L</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <TouchableOpacity 
        style={globalStyles.primaryButton} 
        onPress={handleSave} 
        activeOpacity={0.8}
      >
        <Text style={globalStyles.primaryButtonText}>
          {isEditing ? 'Save changes' : 'Create team'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  muted: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  memberList: {
    maxHeight: 280,
    marginBottom: theme.spacing.lg,
  },
  memberListContent: {
    paddingBottom: theme.spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.surfaceLight,
  },
  memberRowSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  memberName: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  memberRecord: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
});