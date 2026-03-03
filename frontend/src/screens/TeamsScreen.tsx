import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { globalStyles } from '../styles/globalStyles';
import { RootStackParamList } from '../navigation/types';
import { getTeams, deleteTeam, type Team } from '../storage/teamsStorage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Teams'>;
};

export default function TeamsScreen({ navigation }: Props) {
  const [teams, setTeams] = useState<Team[]>([]);

  const loadTeams = useCallback(async () => {
    const list = await getTeams();
    setTeams(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTeams();
    }, [loadTeams])
  );

  const handleDelete = (team: Team) => {
    Alert.alert('Delete team', `Remove "${team.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          await deleteTeam(team.id);
          loadTeams();
        },
      },
    ]);
  };

  return (
    <View style={[globalStyles.screenContainer, globalStyles.screenContainerPadding]}>
      <TouchableOpacity
        style={[globalStyles.primaryButton, styles.createButton]}
        onPress={() => navigation.navigate('CreateTeam')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={22} color={theme.colors.text} style={styles.createButtonIcon} />
        <Text style={globalStyles.primaryButtonText}>Create team</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {teams.length === 0 ? (
          <Text style={globalStyles.emptyState}>No teams yet. Create one to group opponents.</Text>
        ) : (
          teams.map((team) => (
            <View key={team.id} style={styles.teamRow}>
              <TouchableOpacity
                style={styles.teamRowMain}
                onPress={() => navigation.navigate('CreateTeam', { teamId: team.id })}
                activeOpacity={0.8}
              >
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamMeta}>
                  {team.memberIds.length} member{team.memberIds.length !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('CreateTeam', { teamId: team.id })}
                activeOpacity={0.8}
              >
                <Ionicons name="pencil-outline" size={22} color={theme.colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => handleDelete(team)}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={22} color={theme.colors.accent} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  createButtonIcon: {
    marginRight: theme.spacing.sm,
  },
  list: {
    paddingBottom: theme.spacing.xl,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surfaceLight,
  },
  teamRowMain: {
    flex: 1,
  },
  teamName: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
  },
  teamMeta: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
});