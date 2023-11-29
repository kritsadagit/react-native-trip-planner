import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Switch,
  Image,
} from "react-native";
import React, { FC, useCallback, useState } from "react";
import { THEME_BUTTON, THEME_PROFILE } from "../../styles/ThemeColors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { KeyboardDissmiss } from "../../utils/Etc/Etc";
import { httpClient } from "../../services/HttpClient";
import { showAlert } from "../../utils/Alerts/Alert";
import CustomSpinner from "../../components/Spinners/CustomSpinner";
import { useFocusEffect } from "@react-navigation/native";
import { RootState } from "../../redux/reducers";
import { useSelector } from "react-redux";
import {
  DataFriendList,
  DataFriendsList,
  ResponseFriendList,
} from "../types/friend_list/friend_list";
import { capitalizeFirstLetter } from "../../utils/Strings/FixWord";

const FriendsListTab1Screen: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [friend_lists, setFriendLists] = useState<DataFriendList[]>([]);
  const [isEnabled, setIsEnable] = useState<boolean>(true);

  const userReducer: any = useSelector(
    (state: RootState) => state.userReducer.user_data,
  );

  useFocusEffect(
    useCallback(() => {
      fetchFriendList(userReducer._id);
    }, [userReducer._id]),
  );

  const fetchFriendList = async (user_id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await httpClient.get<ResponseFriendList>(
        `friends_list?user_id=${user_id}`,
      );
      setLoading(false);

      const { result, data, msg } = response.data;
      if (result) {
        console.log("data: ", data);
        setFriendLists(data);
      } else {
        showAlert(msg);
      }
    } catch (error: any) {
      setLoading(false);
      showAlert(error.message);
    }
  };

  const toggleSwitch = (friend_id: string, toggle: boolean) => {
    setIsEnable(toggle);
    const updatedData = friend_lists[0]?.friends_list?.map((item) =>
      item.friend_id === friend_id ? { ...item, toggle } : item,
    );
    console.log("updatedData: ", updatedData);

    // setFriendLists(updatedData);

    // setIsEnable(updatedData);
  };

  const renderFriendsList = ({
    item,
    index,
  }: {
    item: DataFriendsList;
    index: number;
  }) => (
    <View key={index} style={styles.row}>
      <View style={styles.container_profile}>
        <Image
          source={{ uri: item?.user_data?.photo }}
          resizeMode="contain"
          style={styles.receiver_img}
        />
        <View style={styles.section_detail}>
          <Text style={styles.label_bold}>
            {capitalizeFirstLetter(item?.user_data.givenName)}{" "}
            {capitalizeFirstLetter(item?.user_data.familyName)}
          </Text>
          <Text style={styles.label_bold}>{item?.user_data.email}</Text>
        </View>
      </View>

      <View style={styles.container_profile_right}>
        {/* <TouchableOpacity
          style={styles.btn_status}
          // onPress={() => onAccept(item.requester_id, item.receiver_id)}
        >
          <Text style={styles.label_accept}>Accept</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          // onPress={() => onDelete(item._id)}
          style={{ marginLeft: wp("3%") }}
        >
          <Icon name="close" color={"#000"} size={wp("6%")} />
        </TouchableOpacity> */}
        <Switch
          trackColor={{ false: "#767577", true: "#b8d8be" }}
          thumbColor={isEnabled ? "#028900" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={(value) => toggleSwitch(item?.friend_id, value)}
          value={isEnabled}
        />
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={KeyboardDissmiss}>
      <View style={styles.container}>
        <CustomSpinner loading={loading} />
        {/* <View style={styles.section_list}>
          <Text style={[styles.label]}>{friend_lists[0]?.user_id}</Text>
        </View> */}
        <FlatList
          data={friend_lists[0]?.friends_list}
          renderItem={renderFriendsList}
          keyExtractor={(_item, index) => index.toString()}
          contentContainerStyle={styles.section_list}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container_profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  container_profile_right: {
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: wp("3%"),
  },
  section_input: {
    flex: 1,
  },
  section_list: {
    paddingTop: wp("2%"),
    paddingLeft: wp("3%"),
    paddingRight: wp("3%"),
  },
  section_detail: {
    flexDirection: "column",
    paddingLeft: wp("5%"),
  },
  receiver_img: {
    width: wp("10%"),
    height: wp("10%"),
  },
  label: {
    fontSize: wp("3.5%"),
    color: "#000",
  },
  label_bold: {
    fontSize: wp("3.5%"),
    color: "#000",
    fontWeight: "bold",
  },
  label_accept: {
    fontSize: wp("3.5%"),
    color: "#fff",
    fontWeight: "bold",
  },
  white_label: {
    fontSize: wp("3.5%"),
    color: "#fff",
  },
  input: {
    color: "#000",
    marginLeft: wp("3%"),
    paddingTop: wp("3%"),
    paddingLeft: wp("2%"),
    paddingRight: wp("2%"),
    paddingBottom: wp("3%"),
    borderRadius: wp("3%"),
    backgroundColor: THEME_PROFILE.LIGHTGREY,
  },
  btn_add: {
    backgroundColor: THEME_PROFILE.BLUE,
    padding: wp("2%"),
    marginLeft: wp("3%"),
    marginRight: wp("3%"),
    borderRadius: wp("10%"),
  },
  btn_status: {
    paddingTop: wp("1.5%"),
    paddingLeft: wp("2%"),
    paddingRight: wp("2%"),
    paddingBottom: wp("1.5%"),
    backgroundColor: THEME_BUTTON.BLUE,
    borderRadius: wp("2%"),
  },
});

export default FriendsListTab1Screen;
