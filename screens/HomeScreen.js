import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  updateUserId,
  updateEmail,
  updateFirstname,
  updateLastname,
  updateNickname,
  updatePicture,
} from "../reducers/user";

import DefiItem from "../components/DefiItem";
import AjoutDefiModal from "../components/AjoutDefiModal";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { modifierValeur, ajouterDefi, supprimerDefi } from "../reducers/defis";

export default function HomeScreen({ navigation }) {
  const utilisateur = useSelector((state) => state.user.value);
  const defisFixes = useSelector((state) => state.defis.fixes);
  const defisPersonnalises = useSelector((state) => state.defis.personnalises);

  // On combine les deux listes pour afficher tout d'un coup
  const tousLesDefis = [...defisFixes, ...defisPersonnalises];

  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [nomNouveauDefi, setNomNouveauDefi] = useState("");

  // const [nickname, setNickname] = useState("");
  // const [firstname, setFirstname] = useState("");
  // const [lastname, setLastname] = useState("");
  // const [image, setImage] = useState("");

  useEffect(() => {
    if (!isLoaded) return null;
    if (!isSignedIn) {
      navigation.navigate("Connexion");
      return null;
    }
    // récupération des informations user depuis la DB
    (async () => {
      try {
        const token = await getToken();
        const userRes = await fetch(
          `http://192.168.100.117:3000/users/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              //Envoi le token dans le header pour vérification par middleware dans le backend
              authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("coucou2");
        const userData = await userRes.json();
        // Enregistrement utilisateur dans redux
        userData && console.log("userData", userData.user);

        if (userData) {
          dispatch(updateUserId(userData.user.userId));
          dispatch(updateNickname(userData.user.nickname));
          dispatch(updateFirstname(userData.user.firstname));
          dispatch(updateLastname(userData.user.lastname));
          dispatch(updatePicture(userData.user.picture));
        }
        console.log("utilisateur", utilisateur);
      } catch (error) {
        console.error("Erreur:", error);
      }
    })();
  }, []);

  // On calcule combien de défis sont complétés (valeur == max)
  const defisCompletes = tousLesDefis.filter((d) => d.valeur >= d.max).length;
  const totalDefis = tousLesDefis.length;

  // Pourcentage global de progression sur tous les défis
  const progressionGlobale =
    totalDefis === 0
      ? 0
      : tousLesDefis.reduce((acc, d) => acc + d.valeur / d.max, 0) / totalDefis;

  const handleAjouter = () => {
    if (nomNouveauDefi.trim() === "") return;
    dispatch(ajouterDefi({ nom: nomNouveauDefi }));
    setNomNouveauDefi("");
  };
  return (
    <View style={styles.conteneur}>
      {/* Icône settings alignée à droite, juste au dessus de la carte profil */}
      <TouchableOpacity
        style={styles.boutonIconeHaut}
        onPress={() => navigation.navigate("Settings")}
      >
        <FontAwesome name="gear" size={30} color="#FFA85C" />
      </TouchableOpacity>

      {/* Carte profil fixe — elle ne scroll pas avec les défis */}
      <View style={styles.carteProfile}>
        <View style={styles.photoProfile}>
          {utilisateur.picture ? (
            <Image
              source={{ uri: utilisateur.picture }}
              style={styles.imageProfile}
            />
          ) : (
            <Text style={styles.initialeProfile}>
              {utilisateur.nickname
                ? utilisateur.nickname[0].toUpperCase()
                : "?"}
            </Text>
          )}
        </View>

        <Text style={styles.nomProfile}>
          {utilisateur.nickname || "Utilisateur"}
        </Text>

        {/* Barre de progression globale basée sur tous les défis */}
        <View style={styles.progressionGlobaleFond}>
          <View
            style={[
              styles.progressionGlobaleRemplissage,
              { width: `${progressionGlobale * 100}%` },
            ]}
          />
        </View>

        {/* X/Y défis complétés */}
        <Text style={styles.progressionTexte}>
          {defisCompletes}/{totalDefis} défis complétés
        </Text>
      </View>

      {/* Seuls les défis scrollent */}
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {tousLesDefis.map((defi) => {
          const pas = defi.pas ? defi.pas : 10;

          return (
            <DefiItem
              key={defi.id}
              defi={defi}
              onIncrement={() =>
                dispatch(modifierValeur({ id: defi.id, delta: pas }))
              }
              onDecrement={() =>
                dispatch(modifierValeur({ id: defi.id, delta: -pas }))
              }
            />
          );
        })}
      </ScrollView>

      {/* Boutons toujours visibles en bas — ils ne scrollent pas */}
      <View style={styles.sectionBas}>
        {/* Bouton ajouter un défi */}
        <TouchableOpacity
          style={styles.boutonAjouter}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.boutonAjouterTexte}>Ajouter un défi</Text>
        </TouchableOpacity>

        {/* Recette + Jeu côte à côte */}
        <View style={styles.boutonsBasRow}>
          <TouchableOpacity
            style={styles.boutonSecondaire}
            onPress={() => navigation.navigate("Recipe")}
          >
            <Text style={styles.boutonSecondaireTexte}>Recette</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boutonSecondaire, styles.boutonSecondaireGris]}
            onPress={() => navigation.navigate("Game")}
          >
            <Text style={styles.boutonSecondaireTexte}>Jeu</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* La modal — on lui passe tout ce dont elle a besoin */}
      <AjoutDefiModal
        visible={modalVisible}
        nom={nomNouveauDefi}
        setNom={setNomNouveauDefi}
        onAjouter={handleAjouter}
        onFermer={() => setModalVisible(false)}
        defisPersonnalises={defisPersonnalises}
        onSupprimer={(id) => dispatch(supprimerDefi({ id }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 90,
    paddingHorizontal: 10,
  },

  // Icône gear en haut à droite au dessus de la carte
  boutonIconeHaut: {
    alignSelf: "flex-end",
    marginBottom: 8,
    padding: 6,
  },

  // Carte profil fixe avec photo + barre globale
  carteProfile: {
    width: "100%",
    backgroundColor: "#dce8f5",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  photoProfile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#7ab8e8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  imageProfile: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  // Si pas de photo on affiche la première lettre du pseudo
  initialeProfile: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a3a5c",
  },
  nomProfile: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a3a5c",
    marginBottom: 10,
  },

  // Barre de progression globale
  progressionGlobaleFond: {
    width: "100%",
    height: 12,
    backgroundColor: "#b0cfe8",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressionGlobaleRemplissage: {
    height: 12,
    backgroundColor: "#07905C",
    borderRadius: 6,
  },
  progressionTexte: {
    fontSize: 12,
    color: "#1a3a5c",
  },

  // Boutons fixes en bas — jamais dans le scroll
  sectionBas: {
    width: "100%",
    gap: 12,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: "#fff",
  },

  // Bouton orange "Ajouter un défi"
  boutonAjouter: {
    backgroundColor: "#FFA85C",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  boutonAjouterTexte: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  // Recette + Jeu côte à côte
  boutonsBasRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    alignItems: "center",
  },
  boutonSecondaire: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  boutonSecondaireGris: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  boutonSecondaireTexte: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});
