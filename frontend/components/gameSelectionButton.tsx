import { Pressable, View, Image, ImageSourcePropType } from "react-native";

type Props = {
  onPress: () => void;
  iconName: ImageSourcePropType;
};

export default function GameSelectionButton({ iconName, onPress }: Props) {
  return (
    <View>
      <Pressable
        style={{
          width: 100,
          height: 100,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
        onPress={onPress}
      >
        <View>
          <Image source={iconName} style={{ width: 100, height: 100 }} />
        </View>
      </Pressable>
    </View>
  );
}