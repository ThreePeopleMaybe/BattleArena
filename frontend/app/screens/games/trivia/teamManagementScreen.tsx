import { useTheme } from "@/app/ThemeProvider";
import Button from "@/components/button";
import { Team } from "@/models/team";
import { getTeams } from "@/services/teamService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TextInput, View, Text, FlatList, ActivityIndicator } from "react-native";

export default function TeamManagementScreen() {
  const router = useRouter();
  const { styles, theme } = useTheme();
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState<string>("");

  // Fetch teams data
  const { data: teams, isLoading, isError } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(0),
  });

  // Update state when teams data is fetched
  useEffect(() => {
    if (teams) {
      setMyTeams(teams);
    }
  }, [teams]);

  if (isLoading) {
    return (
      <View style={styles.screenContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.screenContainer}>
        <Text>Failed to load questions. Please try again.</Text>
      </View>
    );
  }

  const createTeam = () => {
    if (!teamName.trim()) {
      return;
    }

    const newTeam: Team = {
      id: Date.now(),
      name: teamName,
      players: [],
    };

    setMyTeams((prevTeams) => [...prevTeams, newTeam]);
    setTeamName("");
  };

  const editTeam = (team: Team) => {
    router.push({
      pathname: "/screens/games/trivia/editTeamScreen",
      params: { team: JSON.stringify(team) },
    });
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.infoContainer}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter team name"
            value={teamName}
            onChangeText={setTeamName}
          />
          <Button text="Create Team" onPress={createTeam} />
        </View>
      </View>

      <FlatList
        data={myTeams}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.optionContainer}>
            <Button text={item.name} onPress={() => editTeam(item)} />
          </View>
        )}
      />
    </View>
  );
}