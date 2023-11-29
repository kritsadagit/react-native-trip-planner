import { StyleSheet } from "react-native";
import React, { FC } from "react";
import Spinner from "react-native-loading-spinner-overlay/lib";

type Props = {
  loading: boolean;
};

const CustomSpinner: FC<Props> = ({ loading }) => {
  return (
    <Spinner
      visible={loading}
      textContent={"Loading..."}
      textStyle={styles.spinner}
    />
  );
};

const styles = StyleSheet.create({
  spinner: {
    color: "#fff",
  },
});

export default CustomSpinner;
