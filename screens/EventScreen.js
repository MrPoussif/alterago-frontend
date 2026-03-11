import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome6 } from "@expo/vector-icons";
import Header from "../components/common/Header";

export default function EventScreen({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null); //état position actuelle
  const [fichesListVisible, setFichesListVisible] = useState(false); //état visibilité de la liste des adresses
  const [ficheDetail, setFicheDetail] = useState(null); //état visibilité de la fiche de l'adresse selectionnée
  const [filters, setFilters] = useState([]); //état des filtres récupérés depuis backend
  const [selectedFilter, setSelectedFilter] = useState("manger"); //état du filtre sélectionné dans la Modal
  const [places, setPlaces] = useState([]); // état récupération des places via fetch google places lors de la recherche
  const [radius, setRadius] = useState(100); //état du rayon de recherche
  const [collapsed, setCollapsed] = useState(false);
  const [ShowTheRoad, setShowTheRoad] = useState(false); // état d'affichage de l'itinéraire
  const [distance, setDistance] = useState(null); // état de la distance de l'adresse sélectionnée
  const [duration, setDuration] = useState(null); // état de la durée estimée pour aller à l'adresse sélectionnée
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
        <ActivityIndicator size="large" color="#FFA85C" />
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
    setFichesListVisible(true);
  };

  //fermer et reinitialiser la modale de recherche
  const handleClickRestList = () => {
    setFichesListVisible(false);
    setPlaces([]);
    setFicheDetail(null);
    setRadius(100);
    setShowTheRoad(false);
    setDistance(null);
    setDuration(null);
  };

  // bouton pour fermer le détail de la fiche
  const handleClickCloseFiche = () => {
    setFicheDetail(null);
    setShowTheRoad(false);
  };

  // bouton partager
  const handleClickShare = () => {
    console.log("Share");
  };

  // bouton itinéraire
  const handleClickGo = () => {
    setShowTheRoad(true);
  };

  // bouton appeler
  const handleClickCall = async () => {
    const cleaned = ficheDetail?.phone?.replace(/[\s\-().]/g, "");
    if (cleaned) await Linking.openURL(`tel:${cleaned}`);
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

  // formatage de la distance de l'adresse selectionnée
  const formatDistance = () => {
    if (!distance) return "";
    if (distance < 1) {
      return `${parseFloat((distance * 1000).toFixed(1))} m`;
    }
    return `${parseFloat(distance.toFixed(1))} km`;
  };

  // formatage de la durée à l'adresse sélectionnée
  const formatDuration = () => {
    if (!duration) return "";
    return Math.ceil(duration);
  };

  //markers des places selon filtre
  const markers = places?.map((data, i) => (
    <Marker
      key={i}
      coordinate={{ latitude: data.latitude, longitude: data.longitude }}
      title={data.name}
      pinColor="#FFA85C"
      onPress={() => setFicheDetail(data)}
    />
  ));

  //liste des filtres
  const filtersList = filters?.map((filter, i) => (
    <Picker.Item
      key={i}
      label={filter.toUpperCase()}
      value={filter}
      style={styles.pickerItem}
    />
  ));

  // liste des adresses trouvées
  const fichesList = places?.map((data, i) => (
    <TouchableOpacity
      key={i}
      style={styles.ficheListItem}
      onPress={() => setFicheDetail(data)}
      activeOpacity={0.7}
    >
      <Text style={styles.ficheListName}>{data.name}</Text>
      <Text style={styles.ficheListAddress}>{data.address}</Text>
      <View style={styles.ficheListTag}>
        <Text style={styles.ficheListTagText}>{data.type}</Text>
      </View>
    </TouchableOpacity>
  ));

  // horaires de l'adresse choisie
  const horaires = ficheDetail?.hours?.map((data, i) => (
    <Text key={i} style={styles.ficheHoraire}>
      {data}
    </Text>
  ));

  const ActionButton = ({ icon, onPress, label }) => (
    <TouchableOpacity
      style={styles.actionBtn}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <FontAwesome6 name={icon} size={16} color="#FFA85C" />
      {label && <Text style={styles.actionBtnLabel}>{label}</Text>}
    </TouchableOpacity>
  );

  // fiche détaillée de l'adresse selectionnée
  const fiche = (
    <View style={styles.ficheContainer}>
      <View style={styles.ficheHeader}>
        <View style={styles.ficheTitleBlock}>
          <Text style={styles.ficheName}>{ficheDetail?.name}</Text>
          {ficheDetail?.rating && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{ficheDetail?.rating}</Text>
              <Text style={styles.ratingMax}>/5</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={handleClickCloseFiche}
          style={styles.closeBtn}
        >
          <FontAwesome6 name="xmark" size={18} color="#999" />
        </TouchableOpacity>
      </View>
      {(distance || duration) && (
        <View style={styles.ficheMetrics}>
          {distance && (
            <View style={styles.metricItem}>
              <FontAwesome6 name="location-dot" size={12} color="#FFA85C" />
              <Text style={styles.metricText}>{formatDistance()}</Text>
            </View>
          )}
          {duration && (
            <View style={styles.metricItem}>
              <FontAwesome6 name="clock" size={12} color="#FFA85C" />
              <Text style={styles.metricText}>{formatDuration()} min</Text>
            </View>
          )}
        </View>
      )}
      {ficheDetail?.hours?.length > 0 && (
        <View style={styles.ficheHoraires}>{horaires}</View>
      )}
      <View style={styles.ficheActions}>
        <ActionButton
          icon="user-group"
          onPress={handleClickShare}
          label="Partager"
        />
        <ActionButton
          icon="diamond-turn-right"
          onPress={handleClickGo}
          label="Y aller"
        />
        <ActionButton icon="phone" onPress={handleClickCall} label="Appeler" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="EVENEMENT" navigation={navigation} />
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
        {ShowTheRoad && ficheDetail && (
          <MapViewDirections
            origin={{
              latitude: currentPosition.latitude,
              longitude: currentPosition.longitude,
            }}
            destination={{
              latitude: ficheDetail.latitude,
              longitude: ficheDetail.longitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_DIRECTIONS_API_Key}
            mode="WALKING"
            onReady={(data) => {
              setDistance(data.distance);
              setDuration(data.duration);
            }}
            strokeWidth={3}
            strokeColor="#FFA85C"
          />
        )}
      </MapView>
      <View style={styles.panel}>
        {/* Bouton réduire/agrandir */}
        <TouchableOpacity
          style={styles.collapseBtn}
          onPress={() => setCollapsed(!collapsed)}
          activeOpacity={0.7}
        >
          <View style={styles.collapseHandle} />
          <FontAwesome6
            name={collapsed ? "chevron-up" : "chevron-down"}
            size={12}
            color="#CCC"
          />
        </TouchableOpacity>

        {!collapsed && (
          <>
            {/* Bouton reset */}
            {places.length > 0 && ficheDetail === null && (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleClickRestList}
              >
                <FontAwesome6 name="xmark" size={14} color="#999" />
                <Text style={styles.resetBtnText}>Effacer la recherche</Text>
              </TouchableOpacity>
            )}

            {/* Liste ou fiche détail */}
            {places.length > 0 &&
              (ficheDetail === null ? (
                <ScrollView
                  style={styles.fichesList}
                  showsVerticalScrollIndicator={false}
                >
                  {fichesList}
                </ScrollView>
              ) : (
                fiche
              ))}

            {/* Séparateur */}
            {places.length > 0 && <View style={styles.divider} />}

            {/* Filtre */}
            {ficheDetail === null ? (
              <>
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>Catégorie</Text>
                  <View style={styles.pickerInner}>
                    <Picker
                      style={styles.picker}
                      mode="dropdown"
                      selectedValue={selectedFilter}
                      onValueChange={(value) => setSelectedFilter(value)}
                    >
                      {filtersList}
                    </Picker>
                  </View>
                </View>
                <View style={styles.panelFooter}>
                  <View style={styles.sliderBlock}>
                    <Text style={styles.radiusLabel}>
                      {(radius / 1000).toFixed(1)} km
                    </Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={100}
                      maximumValue={2000}
                      step={100}
                      value={radius}
                      onValueChange={(value) => setRadius(value)}
                      minimumTrackTintColor="#FFA85C"
                      maximumTrackTintColor="#e8e4df"
                      thumbTintColor="#FFA85C"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.searchBtn}
                    onPress={handleClickSearch}
                    activeOpacity={0.85}
                  >
                    <FontAwesome6
                      name="magnifying-glass"
                      size={16}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAF8",
  },
  container: {
    flex: 1,
    backgroundColor: "#FAFAF8",
  },
  mapView: {
    flex: 1,
  },

  panel: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0EDE8",
    marginVertical: 2,
  },

  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
  },
  resetBtnText: {
    fontSize: 12,
    color: "#999",
    letterSpacing: 0.3,
  },

  fichesList: {
    maxHeight: 200,
  },
  ficheListItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
    gap: 3,
  },
  ficheListName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: -0.2,
  },
  ficheListAddress: {
    fontSize: 12,
    color: "#AAAAAA",
    letterSpacing: 0.1,
  },
  ficheListTag: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF4EA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginTop: 2,
  },
  ficheListTagText: {
    fontSize: 10,
    color: "#FFA85C",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  ficheContainer: {
    gap: 10,
  },
  ficheHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  ficheTitleBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  ficheName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.3,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#FFF4EA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFA85C",
  },
  ratingMax: {
    fontSize: 11,
    color: "#FFA85C",
    marginLeft: 1,
  },
  closeBtn: {
    padding: 4,
  },
  ficheMetrics: {
    flexDirection: "row",
    gap: 16,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metricText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  ficheHoraires: {
    gap: 2,
  },
  ficheHoraire: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  ficheActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#FFA85C",
    borderRadius: 12,
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFA85C",
    letterSpacing: 0.2,
  },

  pickerWrapper: {
    gap: 4,
  },
  pickerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#AAAAAA",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginLeft: 4,
  },
  pickerInner: {
    borderWidth: 1.5,
    borderColor: "#F0EDE8",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 45,
  },
  pickerItem: {
    fontSize: 13,
  },

  panelFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sliderBlock: {
    flex: 1,
    gap: 2,
  },
  radiusLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#AAAAAA",
    letterSpacing: 0.5,
    marginLeft: 2,
  },
  slider: {
    height: 36,
    marginHorizontal: -4,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFA85C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFA85C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
