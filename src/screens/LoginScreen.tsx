import { View, StyleSheet, Text, Animated, Easing } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  GoogleSignin,
  GoogleSigninButton,
  User,
} from "@react-native-google-signin/google-signin";
import Global from "../services/Global";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProps } from "../routes/types/typeStack";
import { showAlert } from "../utils/Alerts/Alert";
import { ResponseOauthToken } from "./types/oauthToken";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpClient } from "../services/HttpClient";
import { ResponseUsers } from "./types/users/users";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { doSetUser } from "../redux/actions/userAction";
import { hasLocationPermission } from "../utils/Permissions/Location";
import Geolocation from "react-native-geolocation-service";

GoogleSignin.configure({
  webClientId: Global.GOOGLE_SIGNIN_CLIENT_ID_WEBCLIENT,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId: Global.GOOGLE_SIGNIN_CLIENT_ID_IOS,
  // profileImageSize: 480, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

type NavigationProps = LoginScreenNavigationProps;

const LoginScreen: FC = () => {
  const [userInfo, setUserInfo] = useState<User | undefined>(undefined);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();
  const animationProgress = useRef(new Animated.Value(0));
  const dispatch = useDispatch();
  const userReducer = useSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    configAnimateLottie();
    // getTokens();
    // getCurrentUser();
  }, []);

  useEffect(() => {
    if (userInfo) {
      console.log("userInfo2: ", userInfo);

      fetchOauth();
      fetchGoogleSignIn(userInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  useEffect(() => {
    if (Object.keys(userReducer.user_data).length > 0) {
      goMenuScreen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userReducer.user_data, navigation]);

  const goMenuScreen = async (): Promise<void> => {
    const hasEnabled = await hasLocationPermission();
    if (hasEnabled) {
      Geolocation.getCurrentPosition(
        (position) => {
          postGeolocation(position);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };

  const postGeolocation = async (
    position: Geolocation.GeoPosition,
  ): Promise<void> => {
    const dataPost = {
      user_id: userReducer.user_data._id,
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    try {
      const geolocation = await httpClient.post("/geolocation", dataPost);
      if (geolocation.status === 200) {
        navigation.navigate("Menus");
      }
    } catch (error: any) {
      showAlert(error.message);
    }
  };

  const fetchOauth = async (): Promise<void> => {
    const dataPost = {
      grant_type: Global.WS_GRANT_TYPE,
      client_id: Global.WS_CLIENT_ID,
      client_secret: Global.WS_CLIENT_SECRET,
    };

    try {
      const response = await axios.post<ResponseOauthToken>(
        Global.WS_OAUTH,
        dataPost,
      );
      const { result, msg, access_token } = response.data;
      if (result) {
        await AsyncStorage.setItem("authentication", access_token);
      } else {
        showAlert(msg);
      }
    } catch (error: any) {
      console.log("1: ", error.message);
      showAlert(error.message);
    }
  };

  const fetchGoogleSignIn = async (user_data: User): Promise<void> => {
    const dataPost = { user_data };
    try {
      const response = await httpClient.post<ResponseUsers>("/users", dataPost);
      const { data, msg, result } = response.data;
      if (result) {
        dispatch(doSetUser(data));
      } else {
        showAlert(msg);
      }
    } catch (error: any) {
      console.log("2: ", error.message);
      showAlert(error.message);
    }
  };

  const configAnimateLottie = (): void => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const LoginFirstTime = async () => {
    try {
      const userLoginFirstTime = await GoogleSignin.signIn();
      console.log("userLoginFirstTime: ", userLoginFirstTime);
      if (userLoginFirstTime) {
        setUserInfo(userLoginFirstTime);
      }
    } catch (error: any) {
      console.log("userLoginFirstTime error: ", error);
    }
  };

  const LoginCurrentUser = async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      console.log("currentUser: ", currentUser);
      if (currentUser) {
        setUserInfo(currentUser);
      }
    } catch (error: any) {
      console.log("currentUser error: ", error);
    }
  };

  const onHandlePressSignin = async (): Promise<void> => {
    await GoogleSignin.hasPlayServices();
    const isSignedIn = await GoogleSignin.isSignedIn();
    console.log("isSignedIn: ", isSignedIn);

    if (isSignedIn) {
      LoginCurrentUser();
    } else {
      LoginFirstTime();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content_logo}>
        <AnimatedLottieView
          source={require("../assets/lottie/login/animate_map_login.json")}
          style={styles.img_logo}
          resizeMode="contain"
          progress={animationProgress.current}
        />
        <Text style={styles.label_appname}>Trip Planner</Text>
      </View>

      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={onHandlePressSignin}
        style={{ marginTop: hp("10%") }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  content_logo: {
    paddingTop: hp("5%"),
    alignItems: "center",
  },
  img_logo: {
    width: wp("100%"),
    height: wp("90%"),
  },
  label_appname: {
    color: "#000",
    fontSize: wp("8%"),
  },
  label: {
    color: "#000",
  },
});

export default LoginScreen;
