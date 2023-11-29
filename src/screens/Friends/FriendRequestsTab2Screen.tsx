import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { FC, useCallback, useState } from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import {
  DataFriendRequest,
  ResponseFriendRequest,
} from "../types/friend_request/friend_request";
import { useFocusEffect } from "@react-navigation/native";
import { RootState } from "../../redux/reducers";
import { useSelector } from "react-redux";
import { httpClient } from "../../services/HttpClient";
import { showAlert } from "../../utils/Alerts/Alert";
import CustomSpinner from "../../components/Spinners/CustomSpinner";
import { capitalizeFirstLetter } from "../../utils/Strings/FixWord";
import Icon from "react-native-vector-icons/MaterialIcons";
import { THEME_BUTTON } from "../../styles/ThemeColors";
import { ResponseFriendRequestsApprove } from "../types/friend_request/friend_requests_approve";

const FriendRequestsTab2Screen: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [requestData, setRequestData] = useState<DataFriendRequest[]>([]);

  const userReducer: any = useSelector(
    (state: RootState) => state.userReducer.user_data,
  );

  useFocusEffect(
    useCallback(() => {
      fetchFriendRequest(userReducer._id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const fetchFriendRequest = async (receiver_id: string): Promise<void> => {
    setLoading(true);
    await httpClient
      .get<ResponseFriendRequest>(`/friend_requests?receiver_id=${receiver_id}`)
      .then(async (response) => {
        setLoading(false);
        const { result, data, msg } = response.data;

        if (result) {
          setRequestData(data);
        } else {
          showAlert(msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        showAlert(error.message);
      });
  };

  const onAccept = async (
    requesterId: string,
    receiverId: string,
  ): Promise<void> => {
    try {
      setLoading(true);
      const dataPost = {
        requester_id: requesterId,
        receiver_id: receiverId,
      };
      const response = await httpClient.patch<ResponseFriendRequestsApprove>(
        "/friend_requests/approve",
        dataPost,
      );
      setLoading(false);

      const { result, msg } = response.data;
      if (result) {
        fetchFriendRequest(userReducer._id);
      } else {
        showAlert(msg);
      }
    } catch (error: any) {
      setLoading(false);
      showAlert(error.message);
    }
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

  const renderRequestList = ({
    item,
    index,
  }: {
    item: DataFriendRequest;
    index: number;
  }) => (
    <View key={index} style={styles.row}>
      <View style={styles.container_profile}>
        <Image
          source={{ uri: item?.requester_data?.photo }}
          resizeMode="contain"
          style={styles.receiver_img}
        />
        <View style={styles.section_detail}>
          <Text style={styles.label_bold}>
            {capitalizeFirstLetter(item?.requester_data?.givenName)}{" "}
            {capitalizeFirstLetter(item?.requester_data?.familyName)}
          </Text>
          <Text style={styles.label_bold}>{item?.requester_data?.email}</Text>
        </View>
      </View>

      <View style={styles.container_profile_right}>
        <TouchableOpacity
          style={styles.btn_status}
          onPress={() => onAccept(item.requester_id, item.receiver_id)}
        >
          <Text style={styles.label_accept}>Accept</Text>
        </TouchableOpacity>

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
    <View style={styles.container}>
      <CustomSpinner loading={loading} />
      <FlatList
        data={requestData}
        renderItem={renderRequestList}
        keyExtractor={(_item, index) => index.toString()}
        contentContainerStyle={styles.section_list}
      />
    </View>
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
  section_detail: {
    flexDirection: "column",
    paddingLeft: wp("5%"),
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
  section_list: {
    marginTop: wp("2%"),
    marginLeft: wp("3%"),
    marginRight: wp("3%"),
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: wp("3%"),
  },
  receiver_img: {
    width: wp("10%"),
    height: wp("10%"),
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

export default FriendRequestsTab2Screen;
