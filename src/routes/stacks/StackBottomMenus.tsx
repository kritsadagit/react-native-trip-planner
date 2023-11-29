import React, { FC } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import MapScreen from "../../screens/Map/MapScreen";
import SettingScreen from "../../screens/Setting/SettingScreen";
import { BottomMenuStack } from "../types/typeBottomMenuStack";
import FriendsScreen from "../../screens/Friends/FriendsScreen";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { THEME_BOTTOM_MENUS } from "../../styles/ThemeColors";
import { StyleSheet, Text } from "react-native";

const BottomTab = createBottomTabNavigator<BottomMenuStack>();

const CustomIcon = (focused: boolean, name: string) => (
  <Icon
    name={name}
    size={wp("6%")}
    color={focused ? THEME_BOTTOM_MENUS.BLUE : "grey"}
  />
);

const CustomLabel = (focused: boolean, label: string) => (
  <Text
    style={[
      styles.label,
      // eslint-disable-next-line react-native/no-inline-styles
      { color: focused ? THEME_BOTTOM_MENUS.BLUE : "grey" },
    ]}
  >
    {label}
  </Text>
);

const StackBottomMenus: FC = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Friends"
      screenOptions={{
        // tabBarHideOnKeyboard: true,
        unmountOnBlur: true,
      }}
    >
      <BottomTab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ focused }) => CustomIcon(focused, "people"),
          tabBarLabel: ({ focused }) => CustomLabel(focused, "Friends"),
          headerStyle: styles.borderShadow,
          headerTitle: "Profile & Friends",
        }}
      />
      <BottomTab.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => CustomIcon(focused, "map"),
          tabBarLabel: ({ focused }) => CustomLabel(focused, "Map"),
        }}
      />
      <BottomTab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ focused }) => CustomIcon(focused, "settings"),
          tabBarLabel: ({ focused }) => CustomLabel(focused, "Setting"),
          headerStyle: styles.borderShadow,
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  borderShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderBottomWidth: 0.5,
  },
  label: {
    fontSize: wp("3%"),
  },
});

export default StackBottomMenus;
