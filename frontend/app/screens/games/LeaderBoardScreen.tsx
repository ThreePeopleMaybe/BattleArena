import React from "react";
import { FlatList, Text, View } from "react-native";
import styles from "@/styleguide/styles";

export default function LeaderBoardScreen() {
  // Example leaderboard data
  const leaderboardData = [
    { id: "1", name: "Player 1", wins: 15, totalGames: 20 },
    { id: "2", name: "Player 2", wins: 10, totalGames: 15 },
    { id: "3", name: "Player 3", wins: 8, totalGames: 12 },
    { id: "4", name: "Player 4", wins: 5, totalGames: 10 },
    { id: "5", name: "Player 5", wins: 2, totalGames: 8 },
  ];

  // Render each leaderboard item
  const renderItem = ({ item }: {item :typeof leaderboardData[0]}) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}:</Text>
          <Text style={styles.stats}>
            Wins: {item.wins} / Total: {item.totalGames}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}