import AsyncStorage from '@react-native-async-storage/async-storage';

const ARENAS_STORAGE_KEY = '@trivia_battle_arenas';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes confusing chars (0,O,1,I)

export function generateArenaCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}

export interface ArenaMember {
  id: string;
  name: string;
  joinedAt: number;
}

export interface Arena {
  id: string;
  name: string;
  joinCode: string;
  createdAt: number;
  members: ArenaMember[];
  wagerAmount: number;
}

function normalizeArena(a: unknown): Arena | null {
  if (a == null || typeof a !== 'object') return null;
  const raw = a as Record<string, unknown>;
  if (typeof raw.id !== 'string' || typeof raw.name !== 'string' || typeof raw.joinCode !== 'string' || typeof raw.createdAt !== 'number') return null;
  
  const members: ArenaMember[] = Array.isArray(raw.members)
    ? (raw.members as unknown[]).filter((m): m is ArenaMember => {
        if (m == null || typeof m !== 'object') return false;
        const r = m as Record<string, unknown>;
        return typeof r.id === 'string' && typeof r.name === 'string' && typeof r.joinedAt === 'number';
      })
    : [];

  const wagerAmount = typeof raw.wagerAmount === 'number' && raw.wagerAmount >= 0 ? raw.wagerAmount : 0;
  return { ...raw, members, wagerAmount } as Arena;
}

export async function getArenas(): Promise<Arena[]> {
  try {
    const value = await AsyncStorage.getItem(ARENAS_STORAGE_KEY);
    if (value !== null) {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((a) => normalizeArena(a)).filter((a): a is Arena => a !== null);
      }
    }
  } catch (_) {}
  return [];
}

async function saveArenas(arenas: Arena[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ARENAS_STORAGE_KEY, JSON.stringify(arenas));
  } catch (_) {}
}

export async function createArena(name?: string): Promise<Arena> {
  const arenas = await getArenas();
  const id = `arena_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const joinCode = generateArenaCode();
  const newArena: Arena = {
    id,
    name: (name ?? 'Arena').trim() || 'Arena',
    joinCode,
    createdAt: Date.now(),
    members: [],
    wagerAmount: 0,
  };
  arenas.push(newArena);
  await saveArenas(arenas);
  return newArena;
}

export async function getArenaByJoinCode(code: string): Promise<Arena | null> {
  const arenas = await getArenas();
  const normalized = code.trim().toUpperCase();
  return arenas.find((a) => a.joinCode.toUpperCase() === normalized) ?? null;
}

export async function getArenaById(id: string): Promise<Arena | null> {
  const arenas = await getArenas();
  return arenas.find((a) => a.id === id) ?? null;
}

export async function updateArenaWager(arenaId: string, wagerAmount: number): Promise<void> {
  const arenas = await getArenas();
  const i = arenas.findIndex((a) => a.id === arenaId);
  if (i >= 0) {
    arenas[i] = { ...arenas[i], wagerAmount: Math.max(0, wagerAmount) };
    await saveArenas(arenas);
  }
}

export async function joinArena(code: string, memberId: string, memberName: string): Promise<Arena | null> {
  const arena = await getArenaByJoinCode(code);
  if (!arena) return null;

  const trimmedName = memberName.trim() || 'Player';
  
  if (arena.members.some((m) => m.id === memberId)) return arena;

  arena.members.push({ id: memberId, name: trimmedName, joinedAt: Date.now() });

  const arenas = await getArenas();
  const i = arenas.findIndex((a) => a.id === arena.id);
  if (i >= 0) arenas[i] = arena;

  await saveArenas(arenas);
  return arena;
}