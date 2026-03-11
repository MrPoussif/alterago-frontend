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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import Header from "../components/common/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RecipeScreen({ navigation }) {
  const { isSignedIn, getToken } = useAuth();

  // La recette qu'on affiche
  const [recette, setRecette] = useState(null);

  // Est-ce qu'on est en train de charger ?
  const [loading, setLoading] = useState(false);

  // Est-ce que la recette est dans les favoris ?
  const [enFavori, setEnFavori] = useState(false);

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
    <View style={styles.safeArea}>
      <Header title="RECETTE" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
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
    </View>
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

  // Les boutons en bas
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
  boutonFavoris: {
    backgroundColor: "#ec6e5b",
  },
  boutonTexte: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
