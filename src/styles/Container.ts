import { StyleProp, ViewStyle } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const CONTAINER: StyleProp<ViewStyle> = {
  paddingLeft: wp("3%"),
  paddingRight: wp("3%"),
};
