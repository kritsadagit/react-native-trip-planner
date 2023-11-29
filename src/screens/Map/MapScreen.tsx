import { View, StyleSheet, Text, Image } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Geolocation from "react-native-geolocation-service";
import { hasLocationPermission } from "../../utils/Permissions/Location";
import MapView, {
  LatLng,
  MapMarker,
  MapMarkerProps,
  MapPressEvent,
  Marker,
  MarkerPressEvent,
  PROVIDER_GOOGLE,
  PanDragEvent,
  PoiClickEvent,
  Polyline,
  Region,
  UserLocationChangeEvent,
} from "react-native-maps";
import Global from "../../services/Global";
import { httpClientGoogle } from "../../services/HttpClientGoogle";
import { showAlert } from "../../utils/Alerts/Alert";
import { ResponseGeocode } from "../types/geocode/geocode";
// import CustomSpinner from "../../components/Spinners/CustomSpinner";
import {
  DataPlaceDetailResult,
  ResponsePlaceDetail,
} from "../types/place/details";
import { ActionSheetRef } from "react-native-actions-sheet";
import CustomMapActionSheet from "../../components/ActionSheets/CustomMapActionSheet";
import polyline from "@mapbox/polyline";
import { httpClient } from "../../services/HttpClient";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";

const MapScreen: FC = () => {
  type MarkerType = MapMarkerProps & Partial<DataPlaceDetailResult>;
  const [currentLocation, setCurrentLocation] = useState<Region>();
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [friendsList, setFriendsList] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [followsUserLocation, setFollowerUserLocation] =
    useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPOI, setIsPOI] = useState<boolean>(false);
  const [photoURL, setPhotoURL] = useState<string[]>([]);
  const [pointsPolyline, setPointsPolyline] = useState<LatLng[]>([]);

  const userReducer: any = useSelector(
    (state: RootState) => state.userReducer.user_data,
  );

  const mapRef = useRef<MapView | null>(null);
  const markRef = useRef<MapMarker | null>(null);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  // const callBackFollowerUserLocation = useCallback(() => {
  //   setFollowerUserLocation(true);
  // }, []);

  useEffect(() => {
    setFollowerUserLocation(true);
    // fetchFriendsList();
    getCurrentLocation();
    const polylineData =
      "ctbsA{ztdRc@nBvBj@rA\\tKnCn@PdATxCz@lAXlEjADYL_@Ra@b@s@R]OKWQgB}AqEaDqF{D}CyB";

    const points = polyline.decode(polylineData);
    const latlng_points = [];
    for (let i = 0; i < points.length; i++) {
      const element = points[i];
      latlng_points.push({
        latitude: element[0],
        longitude: element[1],
      });
    }

    console.log("decode: ", latlng_points);

    setPointsPolyline(latlng_points);

    return () => {
      console.log("unmount");
      // Geolocation.clearWatch(watchId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (followsUserLocation) {
      autoFocusToCurrentPosition(currentLocation);
    }

    if (currentLocation) {
      console.log("cu-> ", currentLocation);
      fetchFriendsList();
      postLocation(currentLocation.latitude, currentLocation.longitude);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  const fetchFriendsList = async () => {
    try {
      //here
      const response = await httpClient.get(
        `/friends_list?user_id=${userReducer._id}`,
      );

      const { result, msg, data } = response.data;
      if (result) {
        console.log("-> ", data[0].friends_list);

        setFriendsList(data[0].friends_list);
      } else {
        showAlert(msg);
      }
    } catch (error: any) {
      showAlert(error.message);
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    const hasEnabled = await hasLocationPermission();
    if (hasEnabled) {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log("POSITION: ", position);
          postLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };

  const postLocation = async (lat: number, lon: number): Promise<void> => {
    const dataPost = { user_id: userReducer._id, lat, lon };
    console.log("dataPost: ", dataPost);

    try {
      const response = await httpClient.post("/geolocation", dataPost);
      const { result, data, msg } = response.data;
      if (result) {
        console.log("res: ", data);
      } else {
        showAlert(msg);
      }
    } catch (error: any) {
      showAlert(error.message);
    }
  };

  const autoFocusToCurrentPosition = (
    currentLocationArg: Region | undefined,
  ) => {
    if (currentLocationArg) {
      mapRef.current?.animateToRegion({
        latitude: currentLocationArg.latitude,
        longitude: currentLocationArg.longitude,
        latitudeDelta: Global.LAT_DELTA,
        longitudeDelta: Global.LNG_DELTA,
      });
    }
  };

  const fetchGeoCode = async (e: MapPressEvent): Promise<void> => {
    const coordinate = e.nativeEvent.coordinate;
    const latlng = `${coordinate.latitude},${coordinate.longitude}`;
    setLoading(true);
    await httpClientGoogle
      .get<ResponseGeocode>(
        `/geocode/json?key=${Global.GOOGLE_API_KEY}&latlng=${latlng}`,
      )
      .then((response) => {
        console.log("response: ", response.data);

        setLoading(false);
        const { status, results } = response.data;
        console.log("results: ", results[0].formatted_address);

        if (status === "OK" && results.length > 0) {
          const newMarker: MarkerType = {
            coordinate,
            title: "ปักหมุด",
            description: results[0].formatted_address,
          };
          setMarkers([newMarker]);
        }
      })
      .catch((error) => {
        setLoading(false);
        showAlert(error.message);
      });
  };

  const fetchPlaceDetail = async (e: PoiClickEvent): Promise<void> => {
    const { placeId, coordinate } = e.nativeEvent;
    console.log("e.native poi: ", e.nativeEvent);
    setLoading(true);

    await httpClientGoogle
      .get<ResponsePlaceDetail>(
        `place/details/json?place_id=${placeId}&key=${Global.GOOGLE_API_KEY}`,
      )
      .then((response) => {
        setLoading(false);
        const { result, status } = response.data;
        console.log("poi++ : ", result);

        if (status === "OK") {
          const newMarker: MarkerType = {
            coordinate: coordinate,
            title: result.name,
            description: "",
            rating: result.rating,
            user_ratings_total: result.user_ratings_total,
            types: result.types,
            current_opening_hours: result.current_opening_hours,
          };

          let urlArray: string[] = [];
          for (let i = 0; i < result.photos.length; i++) {
            const element = result.photos[i];
            const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=700&key=${Global.GOOGLE_API_KEY}&photo_reference=${element.photo_reference}`;
            urlArray.push(url);
          }

          setPhotoURL(urlArray);

          setMarkers([newMarker]);
        }
      })
      .catch((error) => {
        setLoading(false);
        showAlert(error);
      });
  };

  const handleMapPress = (e: MapPressEvent) => {
    if (markers.length > 0) {
      setMarkers([]);
    } else {
      fetchGeoCode(e);
      setIsPOI(false);
    }
  };

  const handlePOIPress = (e: PoiClickEvent) => {
    console.log("POI: ", e.nativeEvent);
    fetchPlaceDetail(e);
    setIsPOI(true);
  };

  const handleMarkerPress = (e: MarkerPressEvent) => {
    console.log("e: ", e.nativeEvent);
  };

  // transforms something like this geocFltrhVvDsEtA}ApSsVrDaEvAcBSYOS_@... to an array of coordinates

  const userLocationChanged = (event: UserLocationChangeEvent) => {
    // setFollowerUserLocation(false);
    const newRegion = event.nativeEvent.coordinate;

    setCurrentLocation({
      latitude: newRegion?.latitude
        ? newRegion.latitude
        : Global.THAI_REGION.latitude,
      longitude: newRegion?.longitude
        ? newRegion.longitude
        : Global.THAI_REGION.longitude,
      latitudeDelta: Global.LAT_DELTA,
      longitudeDelta: Global.LNG_DELTA,
    });
  };

  useEffect(() => {
    if (markers.length > 0) {
      setIsOpen(true);
      actionSheetRef.current?.show();
    } else {
      setIsOpen(false);
      setLoading(true);
      actionSheetRef.current?.hide();
    }
  }, [markers]);

  const onTriggerClose = (isClose: boolean) => {
    setLoading(isClose);
  };

  const handleOnDrag = (_e: PanDragEvent) => {
    if (followsUserLocation) {
      console.log("drag");
      setFollowerUserLocation(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text
        style={{
          color: "red",
          position: "absolute",
          zIndex: 99,
          fontSize: wp("5%"),
        }}
      >
        {JSON.stringify(friendsList)}
      </Text> */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={Global.THAI_REGION}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation={followsUserLocation}
        showsBuildings
        showsTraffic
        showsMyLocationButton
        zoomEnabled
        onUserLocationChange={(event) => userLocationChanged(event)}
        onPress={handleMapPress}
        onPanDrag={handleOnDrag}
        onPoiClick={handlePOIPress}
      >
        {markers.map((marker, index) => (
          <Marker
            ref={markRef}
            key={index}
            coordinate={marker.coordinate}
            // title={marker.title}
            description={marker.description}
            onPress={handleMarkerPress}
          />
        ))}

        {/* <Marker
          coordinate={{
            latitude: friendsList[0]?.lat,
            longitude: friendsList[0]?.lon,
          }}
          image={{
            uri: "https://lh3.googleusercontent.com/a/ACg8ocJYBSC9mF1iO_vUSH050Nl-YBqwBSQNu12zW49uFbbk=s96-c",
          }}
        /> */}

        {friendsList.map((item, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: item.lat,
              longitude: item.lon,
            }}
            // image={{
            //   uri: item.user_data.photo,
            // }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#fff", backgroundColor: "#000" }}>
                {item.user_data.name}
              </Text>
              <Image
                source={{ uri: item.user_data.photo }}
                style={{
                  width: wp("10%"),
                  height: wp("10%"),
                  borderRadius: wp("10%"),
                }}
              />
            </View>
          </Marker>
        ))}
        <Polyline
          coordinates={pointsPolyline}
          strokeWidth={5}
          strokeColor="blue"
        />
      </MapView>

      {/* <Portal> */}
      <CustomMapActionSheet
        actionSheetRef={actionSheetRef}
        isOpen={isOpen}
        isPOI={isPOI}
        markers={markers}
        onTriggerClose={onTriggerClose}
        photoURL={photoURL}
      />
      {/* </Portal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  label: {
    color: "#000",
    fontSize: wp("3.5%"),
  },
  callout_container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // alignSelf: "flex-start",
    flexDirection: "row",
    width: wp("100%"),
    position: "relative",
  },
  callout_view: {
    flexDirection: "row",
    width: wp("100%"),
    position: "relative",
  },
  callout_title: {
    fontSize: wp("4%"),
    alignSelf: "center",
    color: "#000",
  },
  callout_description: {
    alignSelf: "center",
    fontSize: wp("4%"),
    // marginTop: 5,
  },
  calloutOuterTriangle: {
    position: "absolute",
    bottom: -10,
    alignSelf: "center",
    width: 10,
    height: 10,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "180deg" }],
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderBottomColor: "black",
  },
  calloutInnerTriangle: {
    position: "absolute",
    bottom: -10,
    alignSelf: "center",
    width: 10,
    height: 10,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "180deg" }],
    borderRightWidth: 9.5,
    borderBottomWidth: 9.5,
    borderLeftWidth: 9.5,
    borderBottomColor: "white",
  },
});

export default MapScreen;
