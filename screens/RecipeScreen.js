import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Liste des régimes alimentaires disponibles
// "label" = ce qu'on affiche à l'utilisateur
// "valeur" = ce qu'on envoie à l'API Spoonacular
const REGIMES = [
  { label: "🌱 Vegan", valeur: "vegan" },
  { label: "🥗 Végétarien", valeur: "vegetarian" },
  { label: "🐟 Piscivore", valeur: "pescetarian" },
  { label: "🌾 Sans gluten", valeur: "gluten free" },
  { label: "🥩 Viande / Paléo", valeur: "primal" },
  { label: "🍮 Dessert", valeur: "dessert" },
];

export default function RecipeScreen({ navigation }) {
  const { isSignedIn, getToken } = useAuth();

  // La recette qu'on affiche
  const [recette, setRecette] = useState(null);

  // Est-ce qu'on est en train de charger ?
  const [loading, setLoading] = useState(false);

  // Est-ce que la recette est dans les favoris ?
  const [enFavori, setEnFavori] = useState(false);

  // Est-ce que la modal de choix de régime est ouverte ?
  const [modalRegimeVisible, setModalRegimeVisible] = useState(false);

  // Retourne la date du jour sous forme "2024-03-09"
  const getDateDuJour = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Vérifie si la recette est déjà dans la liste des favoris
  const verifierSiEnFavori = async (recetteAVerifier) => {
    try {
      const favorisSauvegardes = await AsyncStorage.getItem("favoris");
      const listeFavoris = favorisSauvegardes
        ? JSON.parse(favorisSauvegardes)
        : [];

      const dejaPresente = listeFavoris.some(
        (f) => f.title === recetteAVerifier.title,
      );
      setEnFavori(dejaPresente);
    } catch (err) {
      console.log("Erreur verifierSiEnFavori :", err);
    }
  };

  // Ajoute ou retire la recette des favoris
  const toggleFavori = async () => {
    if (!recette) return;

    try {
      const favorisSauvegardes = await AsyncStorage.getItem("favoris");
      const listeFavoris = favorisSauvegardes
        ? JSON.parse(favorisSauvegardes)
        : [];

      if (enFavori) {
        // Elle est déjà en favori → on la retire
        const listeMisAJour = listeFavoris.filter(
          (f) => f.title !== recette.title,
        );
        await AsyncStorage.setItem("favoris", JSON.stringify(listeMisAJour));
        setEnFavori(false);
        Alert.alert("Retiré", "Recette retirée des favoris");
      } else {
        // Pas encore en favori → on l'ajoute
        const listeMisAJour = [...listeFavoris, recette];
        await AsyncStorage.setItem("favoris", JSON.stringify(listeMisAJour));
        setEnFavori(true);
        Alert.alert("Ajouté !", "Recette ajoutée aux favoris ❤️");
      }
    } catch (err) {
      console.log("Erreur toggleFavori :", err);
    }
  };

  // Va chercher une recette aléatoire sans restriction
  const fetchRecette = async () => {
    if (!isSignedIn) {
      Alert.alert("Non connecté", "Connecte-toi pour voir les recettes.");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const reponse = await fetch(
        "http://192.168.100.64:3000/recettes/random",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await reponse.json();
      const nouvelleRecette = data.recette;

      // On sauvegarde la recette + la date du jour
      await AsyncStorage.setItem(
        "recette_data",
        JSON.stringify(nouvelleRecette),
      );
      await AsyncStorage.setItem("recette_date", getDateDuJour());

      setRecette(nouvelleRecette);
      verifierSiEnFavori(nouvelleRecette);
    } catch (err) {
      console.error("Erreur fetchRecette :", err);
      Alert.alert("Erreur", "Impossible de récupérer la recette");
    } finally {
      setLoading(false);
    }
  };

  // Va chercher une recette selon un régime alimentaire choisi
  // Cette fonction utilise la 2ème route du backend : /random/:diet
  const fetchRecetteParRegime = async (regime) => {
    if (!isSignedIn) {
      Alert.alert("Non connecté", "Connecte-toi pour voir les recettes.");
      return;
    }

    // On ferme la modal avant de lancer le chargement
    setModalRegimeVisible(false);

    try {
      setLoading(true);
      const token = await getToken();

      // On envoie le régime choisi dans l'URL
      const reponse = await fetch(
        `http://192.168.100.64:3000/recettes/random/${regime.valeur}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await reponse.json();
      const nouvelleRecette = data.recette;

      // On sauvegarde cette recette comme recette du jour
      await AsyncStorage.setItem(
        "recette_data",
        JSON.stringify(nouvelleRecette),
      );
      await AsyncStorage.setItem("recette_date", getDateDuJour());

      setRecette(nouvelleRecette);
      verifierSiEnFavori(nouvelleRecette);
    } catch (err) {
      console.error("Erreur fetchRecetteParRegime :", err);
      Alert.alert("Erreur", "Impossible de récupérer la recette");
    } finally {
      setLoading(false);
    }
  };

  // Au chargement de l'écran, on regarde si on a déjà une recette du jour
  useEffect(() => {
    const chargerRecetteDuJour = async () => {
      try {
        const dateSauvegardee = await AsyncStorage.getItem("recette_date");
        const recetteSauvegardee = await AsyncStorage.getItem("recette_data");

        if (dateSauvegardee === getDateDuJour() && recetteSauvegardee) {
          const recetteParsee = JSON.parse(recetteSauvegardee);
          setRecette(recetteParsee);
          verifierSiEnFavori(recetteParsee);
        } else {
          fetchRecette();
        }
      } catch (err) {
        console.log("Erreur chargerRecetteDuJour :", err);
        fetchRecette();
      }
    };

    if (isSignedIn) {
      chargerRecetteDuJour();
    }
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.conteneur}>
          <Text>Connecte-toi pour accéder aux recettes.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.conteneur}>
          <ActivityIndicator size="large" color="#FFA85C" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.conteneur}>
        {recette ? (
          <>
            {/* Titre + bouton cœur */}
            <View style={styles.headerRecette}>
              <Text style={styles.titre}>{recette.title}</Text>
              <TouchableOpacity onPress={toggleFavori}>
                <Text style={styles.coeur}>{enFavori ? "❤️" : "🤍"}</Text>
              </TouchableOpacity>
            </View>

            {/* Image de la recette */}
            {recette.image && (
              <Image source={{ uri: recette.image }} style={styles.image} />
            )}

            {/* Instructions */}
            {recette.instructions && recette.instructions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.titreSection}>Instructions :</Text>
                {recette.instructions[0].steps?.map((etape, i) => (
                  <Text key={i} style={styles.etape}>
                    {i + 1}. {etape.step}
                  </Text>
                ))}
              </View>
            )}

            {/* Boutons du bas */}
            <View style={styles.boutonsWrapper}>
              {/* Bouton nouvelle recette aléatoire */}
              <TouchableOpacity style={styles.bouton} onPress={fetchRecette}>
                <Text style={styles.boutonTexte}>🔀 Nouvelle recette</Text>
              </TouchableOpacity>

              {/* Bouton choisir un régime — ouvre la modal */}
              <TouchableOpacity
                style={[styles.bouton, styles.boutonRegime]}
                onPress={() => setModalRegimeVisible(true)}
              >
                <Text style={styles.boutonTexte}>🥗 Par régime</Text>
              </TouchableOpacity>

              {/* Bouton voir les favoris */}
              <TouchableOpacity
                style={[styles.bouton, styles.boutonFavoris]}
                onPress={() => navigation.navigate("Favorite")}
              >
                <Text style={styles.boutonTexte}>❤️ Mes favoris</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text>Aucune recette disponible</Text>
        )}
      </ScrollView>

      {/* Modal pour choisir un régime alimentaire */}
      <Modal visible={modalRegimeVisible} transparent animationType="slide">
        {/* Fond grisé — ferme la modal si on clique dessus */}
        <TouchableOpacity
          style={styles.modalFond}
          activeOpacity={1}
          onPress={() => setModalRegimeVisible(false)}
        >
          {/* Carte blanche */}
          <TouchableOpacity
            style={styles.modalCarte}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Titre + croix */}
            <View style={styles.modalEntete}>
              <Text style={styles.modalTitre}>Choisir un régime</Text>
              <TouchableOpacity onPress={() => setModalRegimeVisible(false)}>
                <Text style={styles.modalCroix}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Liste des régimes — un bouton par régime */}
            {REGIMES.map((regime) => (
              <TouchableOpacity
                key={regime.valeur}
                style={styles.ligneRegime}
                onPress={() => fetchRecetteParRegime(regime)}
              >
                <Text style={styles.ligneRegimeTexte}>{regime.label}</Text>
                <Text style={styles.ligneRegimefleche}>→</Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  conteneur: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },

  // Titre + cœur côte à côte
  headerRecette: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  titre: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  coeur: {
    fontSize: 28,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  section: {
    width: "100%",
    marginTop: 10,
  },
  titreSection: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFA85C",
    marginBottom: 5,
  },
  etape: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },

  // Les trois boutons en bas
  boutonsWrapper: {
    width: "100%",
    marginTop: 20,
    gap: 12,
  },
  bouton: {
    backgroundColor: "#FFA85C",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
  },
  boutonRegime: {
    backgroundColor: "#07905C",
  },
  boutonFavoris: {
    backgroundColor: "#ec6e5b",
  },
  boutonTexte: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  // Fond semi-transparent de la modal
  modalFond: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Carte blanche de la modal
  modalCarte: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  // En-tête de la modal : titre + croix
  modalEntete: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitre: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCroix: {
    fontSize: 18,
    color: "#999",
  },

  // Chaque ligne de régime dans la modal
  ligneRegime: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  ligneRegimeTexte: {
    fontSize: 16,
    color: "#333",
  },
  ligneRegimefleche: {
    fontSize: 16,
    color: "#FFA85C",
  },
});
