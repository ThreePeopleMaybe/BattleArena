import styles from "@/styleguide/styles";
import { Pressable, View, Text } from "react-native";

type Props = {
    label: string;
    onPress: () => void;
}

export default function Button({ label, onPress }: Props) {
    return (
        <View>
            <Pressable style={styles.button}
            onPress={ onPress }
            >
            <Text style={styles.label}>{label}</Text>
            </Pressable>
        </View>
    );
}