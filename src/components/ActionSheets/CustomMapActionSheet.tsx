import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, RefObject } from "react";
import ActionSheet, {
  ActionSheetRef,
  useScrollHandlers,
} from "react-native-actions-sheet";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { MapMarkerProps } from "react-native-maps";
import { removeNewLine } from "../../utils/Strings/FixWord";
import { DataPlaceDetailResult } from "../../screens/types/place/details";
import { Rating } from "react-native-ratings";
import { THEME_ACTIONSHEET } from "../../styles/ThemeColors";
import { CurrentOpeningHours } from "../../utils/Strings/Defination";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Portal } from "@gorhom/portal";

type MarkerType = MapMarkerProps & Partial<DataPlaceDetailResult>;

type Props = {
  actionSheetRef: RefObject<ActionSheetRef>;
  isOpen: boolean;
  isPOI: boolean;
  markers: MarkerType[];
  onTriggerClose: (isClose: boolean) => void;
  photoURL: string[];
};

const CustomMapActionSheet: FC<Props> = ({
  actionSheetRef,
  isOpen,
  isPOI,
  markers,
  onTriggerClose,
  photoURL,
}) => {
  const data = markers[0];
  const scrollHandlers = useScrollHandlers<ScrollView>(
    "scrollview-1",
    actionSheetRef,
  );

  const renderPhotoPlace = ({ item, index }: { item: any; index: number }) => (
    <View
      style={[
        styles.section_photo,
        {
          paddingRight: !(photoURL.length - 1 === index) ? wp("2%") : undefined,
        },
      ]}
    >
      <Image source={{ uri: item }} style={styles.photo} resizeMode="cover" />
    </View>
  );

  const renderActionSheetPOI = () => (
    <View>
      <Text style={styles.label}>{removeNewLine(data?.title)}</Text>
      <View style={styles.row}>
        <Text style={[styles.grey_label, { marginRight: wp("1%") }]}>
          {data?.rating}
        </Text>
        <Rating
          showRating={false}
          tintColor={THEME_ACTIONSHEET.BG}
          ratingCount={5}
          startingValue={data?.rating}
          imageSize={wp("4%")}
          readonly
        />
        <Text style={[styles.grey_label, { marginLeft: wp("2%") }]}>
          ({data?.user_ratings_total?.toString()})
        </Text>
      </View>
      {data?.types && data?.types[0] !== "point_of_interest" ? (
        <Text style={styles.grey_label}>
          {data?.types ? data?.types[0] : ""}
        </Text>
      ) : null}
      <Text
        style={
          data?.current_opening_hours?.open_now
            ? styles.green_label
            : styles.red_label
        }
      >
        {CurrentOpeningHours(data?.current_opening_hours?.open_now)}
      </Text>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.btn_route}>
          <Icon name="directions" size={wp("4%")} color="#000" />
          <Text style={styles.black_label}> เส้นทาง</Text>
        </TouchableOpacity>
      </View>

      {/* @ts-ignore */}
      <FlatList
        {...scrollHandlers}
        horizontal
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        directionalLockEnabled={true}
        data={photoURL}
        contentContainerStyle={{
          height: hp("40%"),
        }}
        renderItem={renderPhotoPlace}
        keyExtractor={(_item, index) => index.toString()}
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  const renderActionSheet = () => (
    <View>
      <Text style={styles.label}>{removeNewLine(data?.title)}</Text>
    </View>
  );

  const handleOnClose = () => {
    onTriggerClose(false);
  };

  return (
    <Portal>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.container}
        gestureEnabled
        headerAlwaysVisible={true}
        backgroundInteractionEnabled
        elevation={1}
        onClose={handleOnClose}
        initialSnapIndex={1}
        snapPoints={[30, 60, 100]}
      >
        {isOpen ? (isPOI ? renderActionSheetPOI() : renderActionSheet()) : null}
      </ActionSheet>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME_ACTIONSHEET.BG,
    height: hp("100%"),
    // maxHeight: hp("100%"),
    minHeight: hp("30%"),
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  section_photo: {
    paddingTop: wp("2%"),
    paddingBottom: wp("2%"),
  },
  photo: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: wp("2%"),
  },
  label: {
    color: "#fff",
    fontSize: wp("3.5%"),
  },
  black_label: {
    color: "#000",
    fontSize: wp("3%"),
  },
  grey_label: {
    color: THEME_ACTIONSHEET.GREY,
    fontSize: wp("3.5%"),
  },
  green_label: {
    color: THEME_ACTIONSHEET.GREEN,
    fontSize: wp("3.5%"),
  },
  red_label: {
    color: THEME_ACTIONSHEET.RED,
    fontSize: wp("3.5%"),
  },
  btn_route: {
    backgroundColor: THEME_ACTIONSHEET.BLUE,
    marginTop: wp("2%"),
    paddingTop: wp("2%"),
    paddingLeft: wp("2%"),
    paddingRight: wp("2%"),
    paddingBottom: wp("2%"),
    borderRadius: wp("10%"),
    flexDirection: "row",
  },
});

export default CustomMapActionSheet;
