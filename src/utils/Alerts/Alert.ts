import { Alert, Platform } from "react-native";

export const showAlert = (
  message: string,
  onPressOK?: ((value?: string | undefined) => void) | undefined,
): void => {
  Alert.alert(
    Platform.OS === "ios" ? message : "",
    Platform.OS === "ios" ? "" : message,
    [{ text: "OK", onPress: onPressOK }],
    { cancelable: false },
  );
};
