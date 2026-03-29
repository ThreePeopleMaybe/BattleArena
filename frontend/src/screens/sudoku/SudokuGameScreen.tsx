import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import { globalStyles } from '../../styles/globalStyles';
import { theme } from '../../theme';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Sudoku'> };

type PuzzlePack = {
  initial: number[][];
  solution: number[][];
};

const PUZZLES: PuzzlePack[] = [
  {
    initial: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
  },
];

function cloneGrid(g: number[][]): number[][] {
  return g.map((row) => [...row]);
}

function getBoxStart(row: number, col: number) {
  return { br: Math.floor(row / 3) * 3, bc: Math.floor(col / 3) * 3 };
}

function isValidMove(grid: number[][], row: number, col: number, num: number): boolean {
  if (num === 0) return true;
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c] === num) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col] === num) return false;
  }
  const { br, bc } = getBoxStart(row, col);
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c] === num) return false;
    }
  }
  return true;
}

function gridsMatchSolution(grid: number[][], solution: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export default function SudokuGameScreen({ navigation }: Props) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const pack = PUZZLES[puzzleIndex % PUZZLES.length]!;
  const [grid, setGrid] = useState(() => cloneGrid(pack.initial));
  const [fixed, setFixed] = useState(() =>
    pack.initial.map((row) => row.map((v) => v !== 0))
  );
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  const loadPuzzle = useCallback((index: number) => {
    const p = PUZZLES[index % PUZZLES.length]!;
    setPuzzleIndex(index % PUZZLES.length);
    setGrid(cloneGrid(p.initial));
    setFixed(p.initial.map((row) => row.map((v) => v !== 0)));
    setSelected(null);
    setStatus(null);
    setWon(false);
  }, []);

  const placeDigit = useCallback(
    (num: number) => {
      if (won || !selected) return;
      const { r, c } = selected;
      if (fixed[r]![c]) return;
      const next = cloneGrid(grid);
      next[r]![c] = num;
      if (num !== 0 && !isValidMove(next, r, c, num)) {
        setStatus('That digit conflicts with row, column, or box.');
        return;
      }
      setGrid(next);
      setStatus(null);
      if (num !== 0 && gridsMatchSolution(next, pack.solution)) {
        setWon(true);
        setStatus('Solved!');
      }
    },
    [fixed, grid, pack, selected, won]
  );

  const cellStyle = useCallback(
    (r: number, c: number) => {
      const thickRight = (c + 1) % 3 === 0 && c < 8;
      const thickBottom = (r + 1) % 3 === 0 && r < 8;
      const sel = selected?.r === r && selected?.c === c;
      return [
        styles.cell,
        thickRight && styles.cellThickRight,
        thickBottom && styles.cellThickBottom,
        fixed[r]![c] && styles.cellGiven,
        sel && styles.cellSelected,
      ];
    },
    [fixed, selected]
  );

  const rows = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map((r) => (
        <View key={r} style={styles.row}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
            <Pressable
              key={`${r}-${c}`}
              style={cellStyle(r, c)}
              onPress={() => !won && setSelected({ r, c })}
              disabled={won}
            >
              <Text
                style={[
                  styles.cellText,
                  fixed[r]![c] ? styles.cellTextGiven : styles.cellTextPlayer,
                ]}
              >
                {grid[r]![c] === 0 ? '' : String(grid[r]![c])}
              </Text>
            </Pressable>
          ))}
        </View>
      )),
    [cellStyle, fixed, grid, won]
  );

  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.board}>{rows}</View>

      {status ? <Text style={styles.status}>{status}</Text> : null}

      <View style={styles.padRow}>
        {DIGITS.map((d) => (
          <Pressable
            key={d}
            style={styles.digitBtn}
            onPress={() => placeDigit(d)}
            disabled={!selected}
          >
            <Text style={styles.digitBtnText}>{d}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[globalStyles.secondaryButton, styles.clearBtn]}
        onPress={() => placeDigit(0)}
        disabled={!selected || (selected && fixed[selected.r]![selected.c])}
      >
        <Text style={globalStyles.secondaryButtonText}>Clear cell</Text>
      </Pressable>
    </ScrollView>
  );
}

const CELL_SIZE = 34;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  board: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  cellThickRight: {
    borderRightWidth: 2,
    borderRightColor: theme.colors.text,
  },
  cellThickBottom: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.text,
  },
  cellGiven: {
    backgroundColor: theme.colors.surfaceLight,
  },
  cellSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.35)',
  },
  cellText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cellTextGiven: {
    color: theme.colors.text,
  },
  cellTextPlayer: {
    color: theme.colors.primaryLight,
  },
  status: {
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    color: theme.colors.accent,
    marginBottom: theme.spacing.md,
  },
  padRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  digitBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitBtnText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  clearBtn: {
    marginBottom: theme.spacing.lg,
    alignSelf: 'center',
    minWidth: 200,
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
});