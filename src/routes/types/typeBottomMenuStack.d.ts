import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type BottomMenuStack = {
  Friends: undefined;
  Map: undefined;
  Setting: undefined;
};

export type FriendsScreenRouteProp = RouteProp<BottomMenuStack, "Friends">;
export type FriendsScreenNavigationProp = NativeStackNavigationProp<
  BottomMenuStack,
  "Friends"
>;

export type MapScreenRouteProp = RouteProp<BottomMenuStack, "Map">;
export type MapScreenNavigationProp = NativeStackNavigationProp<
  BottomMenuStack,
  "Map"
>;
export type SettingScreenRouteProp = RouteProp<BottomMenuStack, "Setting">;
export type SettingScreenNavigationProp = NativeStackNavigationProp<
  BottomMenuStack,
  "Setting"
>;
