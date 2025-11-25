import styles from "@/styleguide/styles";
import { Pressable, View, Text } from "react-native";

type Props = {
    label: string;
    onPress: () => void;
}

export default function GameSelectionButton({ label, onPress }: Props) {
    return (
        <View>
            <Pressable style={styles.gameSelectionButton}
            onPress={ onPress }
            >
            <Text style={styles.label}>{label}</Text>
            </Pressable>
        </View>
    );
}