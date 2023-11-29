import axios from "axios";
import join from "url-join";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Global from "./Global";

var isAbsoluteURLRegex = /^(?:\w+:)\/\//;

axios.interceptors.request.use(async (config: any) => {
  if (!isAbsoluteURLRegex.test(config.url ? config.url : "")) {
    const jwtToken = await AsyncStorage.getItem("token");
    if (jwtToken != null) {
      config.headers = { "x-access-token": jwtToken };
    }
    const authen = await AsyncStorage.getItem("authentication");

    if (authen != null) {
      config.headers = {
        "x-access-token": jwtToken,
        Authorization: "Bearer " + authen,
        Accept: "*/*",
        "content-type": "application/json",
      };
    }
    config.url = join(Global.WS_URL, config.url);
  }
  return config;
});

export const httpClient = axios;
