import { TouchableOpacity, View, Image } from "react-native";
import GameSelectionButton from "@/components/gameSelectionButton";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import COLORS from "@/styleguide/colors";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity 
          style={{position:"absolute", top: 10, right: 10}}
          onPress={() => router.push("/screens/user/login")}>
            <FontAwesome name="user-circle" size={24} color={COLORS.primary}/>
      </TouchableOpacity>
      <GameSelectionButton label="Trivia" onPress={()=> router.push("/screens/games/trivia/questionanswer")}/>
    </View>
  );
}
