import styles from "@/styleguide/styles";
import { Pressable, View, Image, ImageSourcePropType } from "react-native";

type Props = {
    onPress: () => void;
    imageName: ImageSourcePropType
}

export default function GameSelectionButton({ imageName, onPress }: Props) {
    return (
        <View>
            <Pressable style={styles.gameSelectionButton}
            onPress={ onPress }
            >
                <Image source={imageName} style={{ width:100, height:100, borderRadius: 15 }}/>
            </Pressable>
        </View>
    );
}