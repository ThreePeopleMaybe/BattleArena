import AsyncStorage from '@react-native-async-storage/async-storage';

const TEAMS_STORAGE_KEY = '@trivia_battle_teams';

export interface Team {
  id: string;
  name: string;
  memberIds: string[];
}

export async function getTeams(): Promise<Team[]> {
  try {
    const value = await AsyncStorage.getItem(TEAMS_STORAGE_KEY);
    if (value !== null) {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (t): t is Team =>
            t != null &&
            typeof t === 'object' &&
            typeof (t as Team).id === 'string' &&
            typeof (t as Team).name === 'string' &&
            Array.isArray((t as Team).memberIds)
        );
      }
    }
  } catch (_) {}
  return [];
}

async function saveTeams(teams: Team[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  } catch (_) {}
}

export async function addTeam(team: Omit<Team, 'id'>): Promise<Team> {
  const teams = await getTeams();
  const id = `team_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const newTeam: Team = { ...team, id };
  teams.push(newTeam);
  await saveTeams(teams);
  return newTeam;
}

export async function updateTeam(id: string, updates: Partial<Omit<Team, 'id'>>): Promise<void> {
  const teams = await getTeams();
  const i = teams.findIndex((t) => t.id === id);
  if (i === -1) return;
  teams[i] = { ...teams[i], ...updates };
  await saveTeams(teams);
}

export async function deleteTeam(id: string): Promise<void> {
  const teams = (await getTeams()).filter((t) => t.id !== id);
  await saveTeams(teams);
}