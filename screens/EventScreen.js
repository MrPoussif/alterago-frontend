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
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome6 } from "@expo/vector-icons";
import Header from "../components/common/Header";
import FicheDetail from "../components/eventFicheDetaillee";
import InviteModal from "../components/eventInviteModal";
import useLocation from "../hooks/useLocation";
import useCategories from "../hooks/useCategories";
import { UTILISATEURS_FICTIFS } from "../constants/utilisateursFictifs";

export default function EventScreen({ navigation }) {
  const [fichesListVisible, setFichesListVisible] = useState(false); //état visibilité de la liste des adresses
  const [ficheDetail, setFicheDetail] = useState(null); //état visibilité de la fiche de l'adresse selectionnée
  const [selectedFilter, setSelectedFilter] = useState("manger"); //état du filtre sélectionné dans la Modal
  const [places, setPlaces] = useState([]); // état récupération des places via fetch google places lors de la recherche
  const [radius, setRadius] = useState(100); //état du rayon de recherche
  const [collapsed, setCollapsed] = useState(false); // état réduction de la fenêtre de recherche
  const [ShowTheRoad, setShowTheRoad] = useState(false); // état d'affichage de l'itinéraire
  const [distance, setDistance] = useState(null); // état de la distance de l'adresse sélectionnée
  const [duration, setDuration] = useState(null); // état de la durée estimée pour aller à l'adresse sélectionnée
  const [inviteModal, setInviteModal] = useState(false); // modal d'invitation
  const [selectedFriends, setSelectedFriends] = useState([]); // amis selectionnés à inviter
  const [inviteMess, setInviteMessModal] = useState(false); // modal message invitation envoyée
  const [utilisateurs] = useState(UTILISATEURS_FICTIFS); // list d'amis

  const { currentPosition, locationError } = useLocation(); // hook position actuelle
  const { filters, filtersError } = useCategories(); // hook catégories
  const { getToken } = useAuth(); // hook authorisation Clerk

  //chargement avant re-render composant sinon currentLocation null
  if (!currentPosition)
    return (
      <View style={styles.loading}>
        {locationError ? (
          <Text>{locationError}</Text>
        ) : (
          <ActivityIndicator size="large" color="#FFA85C" />
        )}
      </View>
    );

  //lancer la recherche
  const handleClickSearch = async () => {
    const token = await getToken();
    const response = await fetch(
      `http://${process.env.EXPO_PUBLIC_MY_IP}:3000/events/nearby`,
      {
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
      },
    );
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

  // bouton ouverture modal invitation
  const handleClickOpenInvite = () => {
    setInviteModal(true);
    setCollapsed(true);
  };

  // bouton pour fermer le modal invitation
  const handleClickCloseInvite = () => {
    setInviteModal(false);
    setCollapsed(false);
    setSelectedFriends([]);
  };

  // envoyer invitation aux amis selectionnés
  const handleClickInvite = () => {
    setSelectedFriends([]);
    setInviteModal(false);
    setInviteMessModal(true);
    setTimeout(() => {
      setInviteMessModal(false);
      setInviteMessModal(false);
      setCollapsed(false);
      handleClickCloseInvite(); // ferme aussi la modal
    }, 2000);
  };

  // bouton itinéraire
  const handleClickGo = () => {
    setShowTheRoad(true);
    setCollapsed(true);
  };

  // bouton appeler
  const handleClickCall = async () => {
    const cleaned = ficheDetail?.phone?.replace(/[\s\-().]/g, "");
    if (cleaned) await Linking.openURL(`tel:${cleaned}`);
  };

  // ajout et suppression des amis à inviter
  const handleClickSelectFriend = (utilisateurId) => {
    if (selectedFriends.includes(utilisateurId)) {
      // Déjà sélectionné → on le retire
      setSelectedFriends(selectedFriends.filter((id) => id !== utilisateurId));
    } else {
      // Pas encore sélectionné → on l'ajoute
      setSelectedFriends([...selectedFriends, utilisateurId]);
    }
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

  // fiche détaillée de l'adresse selectionnée
  const fiche = (
    <FicheDetail
      ficheDetail={ficheDetail}
      distance={distance}
      duration={duration}
      onClose={handleClickCloseFiche}
      onInvite={handleClickOpenInvite}
      onGo={handleClickGo}
      onCall={handleClickCall}
    />
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
      {inviteMess && (
        <View style={styles.inviteMess}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 30 }}>🎉</Text>
            <Text style={{ color: "#fff", fontSize: 30 }}>
              Invitation envoyée!
            </Text>
          </View>
        </View>
      )}
      {inviteModal && (
        <InviteModal
          utilisateurs={utilisateurs}
          selectedFriends={selectedFriends}
          onSelectFriend={handleClickSelectFriend}
          onInvite={handleClickInvite}
          onClose={handleClickCloseInvite}
        />
      )}
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
  closeBtn: {
    padding: 4,
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
  boutonsBasRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    alignItems: "center",
  },
  inviteMess: {
    position: "absolute",
    left: 40,
    right: 40,
    bottom: 350,
    backgroundColor: "#1B4965",
    borderRadius: 20,
    padding: 15,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 8,
  },
});
