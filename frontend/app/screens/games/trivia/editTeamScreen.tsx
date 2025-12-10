import { useTheme } from "@/app/ThemeProvider";
import Button from "@/components/button";
import DangerButton from "@/components/dangerButton";
import IconButton from "@/components/iconButton";
import { Player } from "@/models/player";
import { useSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import { Alert, TextInput, View, Text, FlatList, StyleSheet } from "react-native";

export default function EditTeamScreen() {
  const { styles, theme } = useTheme();
  const [playerName, setPlayerName] = useState("");
  const searchParams = useSearchParams();
  const teamString = searchParams.get("team"); // Parse the team string back into an object
  const myTeam = teamString ? JSON.parse(teamString) : {}; 
  const [players, addPlayer] = useState<Player[]>(myTeam.players || []); // Initialize with team players

  const handleAddPlayer = () => {
    if (playerName.trim() === "") {
      Alert.alert("Error", "Player name cannot be empty.");
      return;
    }

    const newPlayer: Player = {
      id: Date.now(),
      name: playerName,
      isPending: true,
    };

    addPlayer((prevPlayers) => [...prevPlayers, newPlayer]);
    setPlayerName("");
  };

  const handleRemovePlayer = (playerId: number) => {
    Alert.alert("Confirm Removal", "Are you sure you want to remove this player?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removePlayer(myTeam.id, playerId) },
      ]
    );
  };

  const removePlayer = (teamId: number, playerId: number) => {
    addPlayer((prevPlayers) =>
      prevPlayers.filter((player) => player.id !== playerId)
    );
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>{myTeam.name}</Text>

      <View style={localStyles.section}>
        <TextInput
          style={styles.input}
          placeholder="Enter player name"
          value={playerName}
          onChangeText={setPlayerName}
        />
        <Button text="Invite Player" onPress={handleAddPlayer} />
      </View>

      <View style={localStyles.section}>
        <Text style={styles.label}>Players in Team</Text>
        <FlatList
          data={players}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={localStyles.playerContainer}>
              <Text style={item.isPending ? styles.disabledText : styles.text}>
                {item.name} {item.isPending ? '(pending)' : ''}
              </Text>
              <IconButton size={30} iconName={require("@/assets/images/icons/trivia.png")} onPress={() => handleRemovePlayer(item.id)} />
            </View>
          )}
          ListEmptyComponent={
            <Text style={localStyles.emptyText}>No players in this team.</Text>
          }
        />
      </View>

      <DangerButton text="Delete Team" onPress={handleAddPlayer} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  playerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    marginBottom: 10,
  },
  playerName: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: 10,
  },
});