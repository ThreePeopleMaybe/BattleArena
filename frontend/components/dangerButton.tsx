import { useTheme } from "@/app/ThemeProvider";
import { Pressable, Text, View } from "react-native";
type Props = {
  text: string;
  onPress: () => void;
}

export default function DangerButton({ text, onPress }: Props) {
  const { styles, theme } = useTheme();

  return (
    <View>
      <Pressable style={styles.dangerButton}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </View>
  );
}