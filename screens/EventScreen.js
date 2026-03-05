import {
  StyleSheet,
  View,
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome6 } from "@expo/vector-icons";

export default function EventScreen() {
  const [currentPosition, setCurrentPosition] = useState(null); //état position actuelle
  const [fichesVisible, setFichesVisible] = useState(false); //état visibilité de la liste des adresses
  const [ficheVisible, setFicheVisible] = useState(false); //état visibilité de la fiche de l'adresse selectionnée
  const [filters, setFilters] = useState([]); //état des filtres récupérés depuis backend
  const [selectedFilter, setSelectedFilter] = useState("manger"); //état du filtre sélectionné dans la Modal
  const [places, setPlaces] = useState([]);
  const [radius, setRadius] = useState(100); //état du rayon de recherche
  const { getToken } = useAuth();

  //position actuelle
  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        location && setCurrentPosition(location.coords);

        const token = await getToken();

        //récupération des filtres pour Modal
        const rawQuery = await fetch(
          "http://192.168.100.230:3000/events/categories",
          {
            headers: {
              "Content-Type": "application/json",
              //Envoi le token dans le header pour vérification par middleware dans le backend
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await rawQuery.json();
        setFilters(data);
      }
    })();
  }, []);

  //chargement avant re-render composant sinon currentLocation null
  if (!currentPosition)
    return (
      <View style={styles.loading}>
        <ActivityIndicator style={{ size: "large" }} />
      </View>
    );

  //lancer la recherche
  const handleClickSearch = async () => {
    const token = await getToken();
    const response = await fetch("http://192.168.100.230:3000/events/nearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        category: selectedFilter,
        radius: radius,
      }),
    });
    const data = await response.json();
    setPlaces(data);
    setFichesVisible(true);
  };

  //fermer la modal de recherche
  const handleClickRestList = () => {
    setFichesVisible(false);
    setPlaces([]);
  };

  //ouvrir la modal de recherche
  const handleClickOpenFiche = () => {
    setFichesVisible(false);
    setFicheVisible(true);
  };

  const handleClickCloseFiche = () => {
    setFichesVisible(true);
    setFicheVisible(false);
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
  const markers = places?.map((data, i) => {
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
  const filtersList = filters?.map((filter, i) => {
    return (
      <Picker.Item
        key={i}
        label={filter.toUpperCase()}
        value={filter}
        style={styles.pickerItem}
      />
    );
  });

  const fiches = places?.map((data, i) => {
    return (
      <TouchableOpacity
        visible={fichesVisible}
        key={i}
        style={styles.fiche}
        onPress={() => handleClickOpenFiche()}
      >
        <View>
          <Text style={{ fontWeight: "bold" }}>{data.name}</Text>
        </View>
        <View>
          <Text style={{ color: "#808080" }}>{data.address}</Text>
        </View>
        <View>
          <Text style={{ color: "#808080" }}>{data.phone}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  // a revoir car toutes les fiches s'affichent lors du clic sur la fiche
  const fiche = places?.map((data, i) => {
    return (
      <>
        <View
          visible={fichesVisible}
          key={i}
          style={styles.fiche}
          onPress={() => handleClickOpenFiche()}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>{data.name}</Text>
          </View>
          <View>
            <Text style={{ color: "#808080" }}>{data.address}</Text>
          </View>
          <View>
            <Text style={{ color: "#808080" }}>{data.phone}</Text>
          </View>
          <FontAwesome6
            name="circle-xmark"
            size={30}
            color="#FFA85C"
            onPress={() => handleClickCloseFiche()}
          />
        </View>
      </>
    );
  });

  return (
    <View style={styles.container}>
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
      {/* {modalVisible && ( */}
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          {fichesVisible && (
            <>
              <FontAwesome6
                name="circle-xmark"
                size={30}
                color="#FFA85C"
                onPress={() => handleClickRestList()}
              />
              <ScrollView style={styles.fiches}>{fiches}</ScrollView>
            </>
          )}
          {ficheVisible && fiche}
          <View style={styles.pickerView}>
            <Picker
              style={styles.picker}
              mode="dropdown"
              selectedValue={selectedFilter}
              onValueChange={(value) => setSelectedFilter(value)}
            >
              {filtersList}
            </Picker>
          </View>
          <View style={styles.modalFooter}>
            <Text>{radius / 1000}km</Text>
            <Slider
              style={styles.slider}
              minimumValue={100}
              maximumValue={2000}
              step={100}
              value={radius}
              onValueChange={(value) => setRadius(value)}
            />
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => handleClickSearch()}
            >
              <FontAwesome6 name="magnifying-glass" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalOverlay: {
    position: "absolute",
    // top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 5,
    zIndex: 10,
  },
  modalView: {
    width: "95%",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 10,
    padding: 20,
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 0,
  },
  modalHeader: {
    width: 200,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontWeight: "bold",
  },
  pickerView: {
    display: "flex",
    borderWidth: 1,
    borderColor: "#FFA85C",
    borderRadius: 20,
    width: "100%",
  },
  picker: {
    height: 45,
    paddingBottom: 20,
  },
  pickerItem: {
    fontSize: 10,
    height: 30,
  },
  modalFooter: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slider: {
    width: 200,
    heigth: 40,
  },
  mapView: {
    flex: 1,
  },
  searchBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFA85C",
    zIndex: 3,
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
  fiches: {
    width: "100%",
    height: 200,
  },
  fiche: {
    borderWidth: 1,
    borderColor: "#FFA85C",
    borderRadius: 10,
    width: "100%",
    padding: 5,
  },
});
