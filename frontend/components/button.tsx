import styles from "@/styleguide/styles";
import { Pressable, View, Text } from "react-native";
import COLORS from "@/styleguide/colors";

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
            <Text style={[{ color: COLORS.white, fontWeight: '600' }]}>{label}</Text>
            </Pressable>
        </View>
    );
}