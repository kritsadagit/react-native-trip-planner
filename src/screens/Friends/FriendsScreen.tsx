import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  BackHandler,
} from "react-native";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { capitalizeFirstLetter } from "../../utils/Strings/FixWord";
import { THEME_PROFILE } from "../../styles/ThemeColors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/MaterialIcons";
import StackTopTabsFriend from "../../routes/stacks/StackTopTabsFriend";
import { showAlert } from "../../utils/Alerts/Alert";

const FriendsScreen: FC = () => {
  const userReducer: any = useSelector(
    (state: RootState) => state.userReducer.user_data,
  );

  const { user_data } = userReducer;

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Logout", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Yes", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const onShare = async (user_id: string): Promise<void> => {
    try {
      const result = await Share.share({
        message: `${user_id}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("result.activityType: ", result.activityType);

          // shared with activity type of result.activityType
        } else {
          console.log("shared");

          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("dismissed");
      }
    } catch (error: any) {
      showAlert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_profile}>
        <Image source={{ uri: user_data.user.photo }} style={styles.profile} />
        <View style={styles.section_details}>
          <View style={styles.row}>
            <Text style={styles.label}>
              <Text style={styles.label_bold}>Reference Id: </Text>{" "}
              {userReducer._id}
            </Text>
            <TouchableOpacity
              onPress={() => onShare(userReducer._id)}
              style={{ marginLeft: wp("3%") }}
            >
              <Icon name="share" size={wp("4.5%")} color={"#000"} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            <Text style={styles.label_bold}>Name: </Text>{" "}
            {capitalizeFirstLetter(user_data.user.givenName)}{" "}
            {capitalizeFirstLetter(user_data.user.familyName)}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.label_bold}>Email: </Text>{" "}
            {user_data.user.email}
          </Text>
        </View>
      </View>

      <StackTopTabsFriend />

      {/* <Text style={styles.label}>{JSON.stringify(userReducer.user_data)}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_PROFILE.LIGHTGREY,
  },
  container_profile: {
    flexDirection: "row",
    backgroundColor: THEME_PROFILE.BLUE,
    alignItems: "center",
    paddingTop: wp("5%"),
    paddingLeft: wp("3%"),
    paddingRight: wp("3%"),
    paddingBottom: wp("5%"),

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  section_details: {
    flexDirection: "column",
    paddingLeft: wp("5%"),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    color: "#000",
  },
  label_bold: {
    fontSize: wp("3.5%"),
    color: "#000",
    fontWeight: "bold",
  },
  profile: {
    width: wp("15%"),
    height: wp("15%"),
    borderRadius: wp("20%"),
  },
});

export default FriendsScreen;
