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
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";

export default function EventScreen() {
  const [currentPosition, setCurrentPosition] = useState(null); //état position actuelle
  const [modalVisible, setModalVisible] = useState(false); //état visibilité de la Modal
  const [filters, setFilters] = useState([]); //état des filtres récupérés depuis backend
  const [selectedFilter, setSelectedFilter] = useState(""); //état du filtre sélectionné dans la Modal
  const [places, setPlaces] = useState([]);
  const [radius, setRadius] = useState(1000); //état du rayon de recherche

  //position actuelle
  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;
      console.log(status);

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        location && setCurrentPosition(location.coords);
        //récupération des filtres pour Modal
        fetch("http://192.168.100.230:3000/events/categories")
          .then((res) => res.json())
          .then((data) => {
            console.log(data);

            setFilters(data.token);
          });
        setModalVisible(true);
      }
    })();
  }, []);
  console.log(currentPosition);

  //chargement avant re-render composant sinon currentLocation null
  if (!currentPosition)
    return (
      <View style={styles.loading}>
        <ActivityIndicator style={styles.actIndic} />
      </View>
    );

  //lancer la recherche
  const handleClickSearch = async () => {
    setModalVisible(false);
    const response = await fetch("http://192.168.100.230:3000/events/nearby", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        category: selectedFilter,
        radius: radius,
      }),
    });
    const data = await response.json();
    // console.log("data => ", data.length);
    setPlaces(data.token);
  };

  const handleClickClose = () => {
    setModalVisible(false);
  };

  const handleClickOpen = () => {
    setModalVisible(true);
  };

  //style minimaliste de la carte
  const ultraMinimal = [
    {
      featureType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      stylers: [{ visibility: "on" }],
    },
  ];

  //markers des places selon filtre
  const markers = places.map((data, i) => {
    return (
      <Marker
        key={i}
        coordinate={{ latitude: data.latitude, longitude: data.longitude }}
        title={data.name}
        pinColor="#FFA85C"
      />
    );
  });

  //liste des filtres
  const filtersList = filters.map((filter, i) => {
    return (
      <Picker.Item
        key={i}
        label={filter.toUpperCase()}
        value={filter}
        style={styles.pickerItem}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Autour de moi</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => handleClickClose()}
              >
                <Text style={styles.textCloseBtn}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.picker}>
              <Picker
                mode="dropdown"
                selectedValue={selectedFilter}
                onValueChange={(value) => setSelectedFilter(value)}
                itemStyle={{ height: "100%" }}
              >
                {filtersList}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => handleClickSearch()}
            >
              <Text style={styles.searchTextBtn}>SEARCH</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <MapView
        initialRegion={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        }}
        style={styles.mapView}
        showsUserLocation={true}
        showsPointsOfInterest={false}
        customMapStyle={ultraMinimal}
      >
        {markers}
      </MapView>
      {/* <View>
        <Modal style={styles.eventsList}>
          <TouchableOpacity
            style={styles.openModalBtn}
            onPress={() => handleClickOpen()}
          >
            <Text style={styles.textOpenModal}>Rechercher</Text>
          </TouchableOpacity>
        </Modal>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actIndic: {
    size: "large",
  },
  container: {
    flex: 1,
  },
  modalHeader: {
    width: 200,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    height: "25%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontWeight: "bold",
  },
  closeBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
    borderRadius: "50%",
    backgroundColor: "#FFA85C",
  },
  textCloseBtn: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  picker: {
    display: "flex",
    borderWidth: 1,
    borderColor: "#FFA85C",
    borderRadius: 20,
    width: 200,
    height: 40,
    paddingBottom: 20,
  },
  pickerItem: {
    fontSize: 10,
    // height: 30,
    // backgroundColor: "red",
  },
  mapView: {
    width: "100%",
    height: "65%",
  },
  searchBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#FFA85C",
  },
  searchTextBtn: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  openModalBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#FFA85C",
  },
  textOpenModal: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  eventsList: {
    flex: 1,
  },
});
