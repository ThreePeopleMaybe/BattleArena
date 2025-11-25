import { Link } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "@/styleguide/styles";
import COLORS from "@/styleguide/colors";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            activeOpacity={0.8}
          >
            <Text style={[styles.body, { color: COLORS.white, fontWeight: '600' }]}>
              Jeopardy!
            </Text>
          </TouchableOpacity>
    </View>
  );
}
