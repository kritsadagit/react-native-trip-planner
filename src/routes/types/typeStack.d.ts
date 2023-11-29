import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStack = {
  Login: undefined;
  Menus: undefined;
};

export type LoginScreenRouteProps = RouteProp<RootStack, "Login">;
export type LoginScreenNavigationProps = NativeStackNavigationProp<
  RootStack,
  "Login"
>;
