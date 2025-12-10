import { Pressable, View, Image, ImageSourcePropType } from "react-native";
type Props = {
  iconName: ImageSourcePropType;
  size: number
  onPress: () => void;
}

export default function IconButton({ iconName, size, onPress }: Props) {
  return (
      <View>
        <Pressable
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
          onPress={onPress}
        >
          <View>
            <Image source={iconName} style={{ width: size, height: size }} />
          </View>
        </Pressable>
      </View>
    );
}