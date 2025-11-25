import { View } from "react-native";
import styles from "@/styleguide/styles";
import COLORS from "@/styleguide/colors";
import Button from "@/components/button";
import GameSelectionButton from "@/components/gameSelectionButton";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GameSelectionButton label="Trivia" onPress={()=> alert("test")}/>
    </View>
  );
}
