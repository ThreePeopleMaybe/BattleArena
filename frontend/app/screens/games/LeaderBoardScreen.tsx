import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/app/ThemeProvider";

export default function LeaderboardScreen() {
  const { styles, theme } = useTheme();
  const leaderboardData = [
    { id: "1", name: "Player 1", wins: 15, totalGames: 20 },
    { id: "2", name: "Player 2", wins: 10, totalGames: 15 },
    { id: "3", name: "Player 3", wins: 6, totalGames: 12 },
    { id: "4", name: "Player 4", wins: 4, totalGames: 10 },
    { id: "5", name: "Player 5", wins: 2, totalGames: 8 },
  ];

  // Render each leaderboard item
  const renderItem = ({ item }: { item: typeof leaderboardData[0] }) => {
    return (
      <View style={localStyles.itemContainer}>
        <View style={localStyles.row}>
          <Text style={styles.label}>{item.name}:</Text>
          <Text style={localStyles.stats}>
            Wins: {item.wins} / Total: {item.totalGames}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={localStyles.listContainer}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  listContainer: {
    // Add any container style here if needed
  },
  itemContainer: {
    // Add item container styles
    borderRadius: 8,
  },
  stats: {
    fontSize: 14,
  },
});