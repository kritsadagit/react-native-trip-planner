import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";
import React, { FC, useCallback, useState } from "react";
import { httpClient } from "../../services/HttpClient";
import { showAlert } from "../../utils/Alerts/Alert";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { useFocusEffect } from "@react-navigation/native";
import {
  DataFriendRequest,
  ResponseFriendRequest,
} from "../types/friend_request/friend_request";
import CustomSpinner from "../../components/Spinners/CustomSpinner";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { capitalizeFirstLetter } from "../../utils/Strings/FixWord";
import Icon from "react-native-vector-icons/MaterialIcons";
import { KeyboardDissmiss } from "../../utils/Etc/Etc";
import { THEME_PROFILE } from "../../styles/ThemeColors";

const SendingRequestsTab3Screen: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [refFriendId, setRefFriendId] = useState<string>("");
  const [receiveData, setReceiveData] = useState<DataFriendRequest[]>([]);

  const userReducer: any = useSelector(
    (state: RootState) => state.userReducer.user_data,
  );

  useFocusEffect(
    useCallback(() => {
      console.log("--> ", userReducer);
      fetchFriendRequest(userReducer._id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const onChangeRefId = (text: string): void => {
    setRefFriendId(text);
  };

  const onRequestFriend = async (): Promise<void> => {
    const dataPost = {
      requester_id: userReducer._id,
      receiver_id: refFriendId,
    };
    setLoading(true);
    await httpClient
      .post<ResponseFriendRequest>("friend_requests/create", dataPost)
      .then((response) => {
        setLoading(false);
        const { result, msg, data } = response.data;

        console.log("res: ", data);

        if (result) {
          fetchFriendRequest(userReducer._id);
        } else {
          showAlert(msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (
          error.response.data.msg ===
          "Both users have sent friend requests to each other simultaneously"
        ) {
          Alert.alert(
            "Already friend request",
            "This reference id has already been sent request to you, Do you want to accept now?",
            [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel",
              },
              { text: "Accept", onPress: () => {} },
            ],
          );
        } else {
          showAlert(error.response.data.msg);
        }
      });
  };

  const fetchFriendRequest = async (requester_id: string): Promise<void> => {
    setLoading(true);
    await httpClient
      .get<ResponseFriendRequest>(
        `/friend_requests/sending_request?requester_id=${requester_id}`,
      )
      .then(async (response) => {
        setLoading(false);
        const { result, data, msg } = response.data;
        if (result) {
          setReceiveData(data);
          console.log("data: ", data);
        } else {
          showAlert(msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        showAlert(error.message);
      });
  };

  const onDelete = async (objectId: string): Promise<void> => {
    Alert.alert(
      "Cancel Request",
      "Are you sure to cancel this request?",
      [
        {
          text: "Cancel",
          onPress: () => {},
        },
        {
          text: "Ok",
          onPress: async () => {
            setLoading(true);
            await httpClient
              .delete(`friend_requests/cancel/${objectId}`)
              .then((response) => {
                setLoading(false);
                if (response.status === 204) {
                  fetchFriendRequest(userReducer._id);
                }
              })
              .catch((error) => {
                setLoading(false);
                showAlert(error.message);
              });
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const renderReceiveList = ({
    item,
    index,
  }: {
    item: DataFriendRequest;
    index: number;
  }) => (
    <View key={index} style={styles.row}>
      {/* <Text style={styles.label}>{JSON.stringify(item.user_receiver)}</Text> */}
      <View style={styles.container_profile}>
        <Image
          source={{ uri: item?.receiver_data?.photo }}
          resizeMode="contain"
          style={styles.receiver_img}
        />
        <View style={styles.section_detail}>
          <Text style={styles.label_bold}>
            {capitalizeFirstLetter(item?.receiver_data?.givenName)}{" "}
            {capitalizeFirstLetter(item?.receiver_data?.familyName)}
          </Text>
          <Text style={styles.label_bold}>{item?.receiver_data?.email}</Text>
        </View>
      </View>

      <View style={styles.container_profile_right}>
        <View style={styles.btn_status}>
          <Text style={styles.label_pending}>Pending</Text>
        </View>

        <TouchableOpacity
          onPress={() => onDelete(item._id)}
          style={{ marginLeft: wp("3%") }}
        >
          <Icon name="close" color={"#000"} size={wp("6%")} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={KeyboardDissmiss}>
      <View style={styles.container}>
        <CustomSpinner loading={loading} />
        <View style={styles.container_input}>
          <View style={styles.section_input}>
            <TextInput
              onChangeText={onChangeRefId}
              value={refFriendId}
              placeholder="Reference Friend Id"
              placeholderTextColor={"grey"}
              keyboardType="numeric"
              style={styles.input}
              maxLength={21}
            />
          </View>
          <TouchableOpacity onPress={onRequestFriend} style={styles.btn_add}>
            <Text style={styles.white_label}>Add Friend</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={receiveData}
          renderItem={renderReceiveList}
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
  container_input: {
    marginTop: wp("2%"),
    flexDirection: "row",
    alignItems: "center",
  },
  section_list: {
    marginTop: wp("2%"),
    marginLeft: wp("3%"),
    marginRight: wp("3%"),
  },
  section_detail: {
    flexDirection: "column",
    paddingLeft: wp("5%"),
  },
  section_input: {
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: wp("3%"),
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
  label_pending: {
    fontSize: wp("3.5%"),
    color: "#000",
    fontWeight: "bold",
  },
  btn_status: {
    paddingTop: wp("1%"),
    paddingLeft: wp("2%"),
    paddingRight: wp("2%"),
    paddingBottom: wp("1%"),
    backgroundColor: "yellow",
    borderRadius: wp("20%"),
  },
  receiver_img: {
    width: wp("10%"),
    height: wp("10%"),
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
  white_label: {
    fontSize: wp("3.5%"),
    color: "#fff",
  },
});

export default SendingRequestsTab3Screen;
