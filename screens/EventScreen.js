import {
  StyleSheet,
  View,
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";

export default function EventScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});

        location && setCurrentPosition(location.coords);
      }
    })();
  }, []);

  if (!currentPosition) return <ActivityIndicator size="large" />; //chargement avant re-render composant sinon currentLocation null

  const handleClickSearch = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} animationType="fade" transparent={false}>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => handleClickSearch()}
        >
          <Text style={StyleSheet.searchTextBtn}>SEARCH</Text>
        </TouchableOpacity>
      </Modal>
      <MapView
        initialRegion={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType="hybrid"
        style={styles.mapView}
        showsUserLocation={true}
        showsPointsOfInterest={false}
      ></MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    width: "100%",
    height: "100%",
  },
});
