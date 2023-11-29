import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { FC } from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { THEME_BOTTOM_MENUS, THEME_MENUS } from "../../styles/ThemeColors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProps } from "../../routes/types/typeStack";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface Menus {
  label: string;
  icon_name: string;
  color: string;
}

type Navigations = LoginScreenNavigationProps;

const menus: Menus[] = [
  { label: "ออกจากระบบ", icon_name: "logout", color: THEME_BOTTOM_MENUS.RED },
];

const SettingScreen: FC = () => {
  const navigation = useNavigation<Navigations>();

  const onPressMenu = (index: number) => {
    if (index === 0) {
      signOut();
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const signout = await GoogleSignin.signOut();
      console.log("signout: ", signout);
      navigation.navigate("Login");
    } catch (error) {
      console.log("error signOut: ", error);
    }
  };

  const renderMenu = ({ item, index }: { item: Menus; index: number }) => (
    <TouchableOpacity
      key={index}
      onPress={() => onPressMenu(index)}
      style={[styles.menu, { borderBottomColor: THEME_MENUS.GREY }]}
    >
      <Icon name={item.icon_name} size={wp("5%")} color={item.color} />
      <Text style={[styles.label, { paddingLeft: wp("2%") }]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={menus}
        renderItem={renderMenu}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_MENUS.LIGHTGREY,
  },
  label: {
    fontSize: wp("3.5%"),
    color: "#000",
  },
  menu: {
    backgroundColor: "#fff",
    paddingTop: wp("4%"),
    paddingLeft: wp("3%"),
    paddingRight: wp("3%"),
    paddingBottom: wp("4%"),
    marginTop: wp("1%"),
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default SettingScreen;
