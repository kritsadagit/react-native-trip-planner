import React, { FC } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FriendsListTab1Screen from "../../screens/Friends/FriendsListTab1Screen";
import SendingRequestsTab3Screen from "../../screens/Friends/SendingRequestsTab3Screen";
import { StyleSheet, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { THEME_PROFILE } from "../../styles/ThemeColors";
import FriendRequestsTab2Screen from "../../screens/Friends/FriendRequestsTab2Screen";

const Tab = createMaterialTopTabNavigator();

const StackTopTabsFriend: FC = () => {
  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomLabel = (label: string) => (
    <Text style={[styles.label]}>{label}</Text>
  );

  return (
    <Tab.Navigator
      initialRouteName="ListFriends"
      screenOptions={{
        swipeEnabled: false,
        tabBarAllowFontScaling: false,
        tabBarBounces: false,
        tabBarPressColor: THEME_PROFILE.BLUE,
        tabBarAndroidRipple: { borderless: false },
      }}
    >
      <Tab.Screen
        name="FriendsList"
        component={FriendsListTab1Screen}
        options={{
          tabBarLabel: () => CustomLabel("Friends List"),
        }}
      />
      <Tab.Screen
        name="FriendRequests"
        component={FriendRequestsTab2Screen}
        options={{
          tabBarLabel: () => CustomLabel("Friend Requests"),
        }}
      />
      <Tab.Screen
        name="SendingRequests"
        component={SendingRequestsTab3Screen}
        options={{
          tabBarLabel: () => CustomLabel("Sending Requests"),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: wp("3%"),
    color: "#000",
  },
});

export default StackTopTabsFriend;
