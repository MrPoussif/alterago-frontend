import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  updateUserId,
  updateFirstname,
  updateLastname,
  updateNickname,
  updatePicture,
} from "../reducers/user";

import DefiItem from "../components/DefiItem";
import AjoutDefiModal from "../components/AjoutDefiModal";
import Header from "../components/common/Header";

import {
  modifierValeur,
  ajouterDefi,
  supprimerDefi,
  modifierMax,
} from "../reducers/defis";

export default function HomeScreen({ navigation }) {
  const utilisateur = useSelector((state) => state.user.value);
  const defisFixes = useSelector((state) => state.defis.fixes);
  const defisPersonnalises = useSelector((state) => state.defis.personnalises);

  const tousLesDefis = [...defisFixes, ...defisPersonnalises];

  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [nomNouveauDefi, setNomNouveauDefi] = useState("");

  const [modalObjectifVisible, setModalObjectifVisible] = useState(false);
  const [defiSelectionne, setDefiSelectionne] = useState(null);
  const [nouvelObjectif, setNouvelObjectif] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigation.navigate("Connexion");
      return;
    }
    // récupération des informations user depuis la DB
    (async () => {
      try {
        const token = await getToken();
        const userRes = await fetch(
          `http://${process.env.EXPO_PUBLIC_MY_IP}:3000/users/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              //Envoi le token dans le header pour vérification par middleware dans le backend
              authorization: `Bearer ${token}`,
            },
          },
        );
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

  const ouvrirModalObjectif = (defi) => {
    setDefiSelectionne(defi);
    setNouvelObjectif(String(defi.max));
    setModalObjectifVisible(true);
  };

  const validerObjectif = () => {
    const valeurNumerique = parseInt(nouvelObjectif);
    if (isNaN(valeurNumerique) || valeurNumerique <= 0) {
      Alert.alert("Erreur", "Saisis un nombre valide et supérieur à 0");
      return;
    }

    dispatch(
      modifierMax({ id: defiSelectionne.id, nouveauMax: valeurNumerique }),
    );

    setModalObjectifVisible(false);
    setDefiSelectionne(null);
    setNouvelObjectif("");
  };

  const defisCompletes = tousLesDefis.filter((d) => d.valeur >= d.max).length;
  const totalDefis = tousLesDefis.length;

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
      <Header title="HOME" navigation={navigation} />
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

        <View style={styles.progressionGlobaleFond}>
          <View
            style={[
              styles.progressionGlobaleRemplissage,
              { width: `${progressionGlobale * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.progressionTexte}>
          {defisCompletes}/{totalDefis} défis complétés
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, width: "90%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {tousLesDefis.map((defi) => {
          const pas = defi.pas ? defi.pas : 10;
          const estFixe = defi.pas !== undefined;

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
              onModifierObjectif={() => ouvrirModalObjectif(defi)}
            />
          );
        })}
      </ScrollView>

      <View style={styles.sectionBas}>
        <TouchableOpacity
          style={styles.boutonAjouter}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.boutonAjouterTexte}>Ajouter un défi</Text>
        </TouchableOpacity>

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

      {/* Modal pour modifier l'objectif */}
      <Modal visible={modalObjectifVisible} transparent animationType="none">
        <TouchableOpacity
          style={styles.modalFond}
          activeOpacity={1}
          onPress={() => setModalObjectifVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalCarte}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitre}>Modifier l'objectif</Text>
            {defiSelectionne && (
              <Text style={styles.modalSousTitre}>{defiSelectionne.nom}</Text>
            )}

            <TextInput
              style={styles.modalInput}
              value={nouvelObjectif}
              onChangeText={setNouvelObjectif}
              keyboardType="numeric"
              placeholder={
                defiSelectionne?.id === "hydratation"
                  ? "Nouvel objectif (ml)"
                  : "Nouvel objectif"
              }
            />

            {/* Affichage bonus UX Hydratation */}
            {defiSelectionne?.id === "hydratation" && (
              <Text style={styles.modalInfo}>
                La valeur est en millilitres (ml) (
                {parseInt(nouvelObjectif) / 1000} L)
              </Text>
            )}

            <View style={styles.modalBoutons}>
              <TouchableOpacity
                style={[styles.modalBouton, styles.modalBoutonAnnuler]}
                onPress={() => setModalObjectifVisible(false)}
              >
                <Text style={styles.modalBoutonTexteGris}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBouton, styles.modalBoutonValider]}
                onPress={validerObjectif}
              >
                <Text style={styles.modalBoutonTexte}>Valider</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <AjoutDefiModal
        visible={modalVisible}
        nom={nomNouveauDefi}
        setDefi={setNomNouveauDefi}
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
    // gap: 0,
    // paddingHorizontal: 10,
  },

  // Carte profil fixe avec photo + barre globale
  carteProfile: {
    width: "90%",
    backgroundColor: "#dce8f5",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 40,
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
  imageProfile: { width: 80, height: 80, borderRadius: 40 },
  initialeProfile: { fontSize: 32, fontWeight: "bold", color: "#1a3a5c" },
  nomProfile: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a3a5c",
    marginBottom: 10,
  },
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
  progressionTexte: { fontSize: 12, color: "#1a3a5c" },
  sectionBas: {
    width: "90%",
    gap: 12,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: "#fff",
  },
  boutonAjouter: {
    backgroundColor: "#FFA85C",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  boutonAjouterTexte: { color: "#fff", fontWeight: "bold", fontSize: 15 },
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
  boutonSecondaireGris: { backgroundColor: "#fff", borderColor: "#ccc" },
  boutonSecondaireTexte: { fontSize: 15, fontWeight: "600", color: "#333" },
  modalFond: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 36,
  },
  modalCarte: {
    marginTop: -36,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitre: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  modalSousTitre: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  modalInfo: {
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    marginBottom: 10,
  },
  modalBoutons: { flexDirection: "row", gap: 10 },
  modalBouton: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalBoutonAnnuler: { backgroundColor: "#f0f0f0" },
  modalBoutonValider: { backgroundColor: "#FFA85C" },
  modalBoutonTexteGris: { color: "#888", fontWeight: "600" },
  modalBoutonTexte: { color: "#fff", fontWeight: "bold" },
});
