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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

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
        `http://${process.env.EXPO_PUBLIC_MY_IP}:3000/recettes/random`,
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
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {recette ? (
          <>
            {/* Image hero pleine largeur */}
            <View style={styles.heroWrapper}>
              {recette.image ? (
                <Image
                  source={{ uri: recette.image }}
                  style={styles.heroImage}
                />
              ) : (
                <View style={styles.heroPlaceholder} />
              )}

              {/* Overlay sombre en bas de l'image */}
              <View style={styles.heroOverlay} />

              {/* Titre flottant sur l'image */}
              <View style={styles.heroContenu}>
                <Text style={styles.heroTitre}>{recette.title}</Text>
              </View>

              {/* Bouton favori en haut à droite */}
              <TouchableOpacity
                style={styles.boutonFavori}
                onPress={toggleFavori}
              >
                <FontAwesome6
                  name="heart"
                  size={32}
                  color={enFavori ? "#ec6e5b" : "#fff"}
                  solid={enFavori}
                />
              </TouchableOpacity>
            </View>

            {/* Carte blanche arrondie qui remonte sur l'image */}
            <View style={styles.carte}>
              {/* Section instructions */}
              <Text style={styles.labelSection}>INSTRUCTIONS</Text>

              {recette.instructions && recette.instructions.length > 0 ? (
                recette.instructions[0].steps?.map((etape, i) => (
                  <View key={i} style={styles.etapeWrapper}>
                    {/* Ligne verticale + cercle numéro */}
                    <View style={styles.etapeGauche}>
                      <View style={styles.etapeNumero}>
                        <Text style={styles.etapeNumeroTexte}>{i + 1}</Text>
                      </View>
                      {/* Ligne verticale sous le numéro sauf dernier */}
                      {i < (recette.instructions[0].steps?.length ?? 0) - 1 && (
                        <View style={styles.etapeLigne} />
                      )}
                    </View>
                    <Text style={styles.etapeTexte}>{etape.step}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.vide}>Instructions non disponibles</Text>
              )}

              {/* Boutons du bas */}
              <View style={styles.boutonsWrapper}>
                <TouchableOpacity
                  style={styles.boutonPrimaire}
                  onPress={fetchRecette}
                >
                  <View style={styles.boutonContenu}>
                    <FontAwesome6 name="rotate" size={14} color="#fff" />
                    <Text style={styles.boutonPrimaireTexte}>
                      Nouvelle recette
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.boutonSecondaire}
                  onPress={() => navigation.navigate("Favorite")}
                >
                  <Text style={styles.boutonSecondaireTexte}>
                    ❤️ Mes favoris
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.vide}>Aucune recette disponible</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F4F0",
  },
  conteneur: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    paddingBottom: 48,
  },

  // ── Hero image ─────────────────────────────────────
  heroWrapper: {
    width: "100%",
    height: 340,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 340,
  },
  heroPlaceholder: {
    width: "100%",
    height: 340,
    backgroundColor: "#E8E0D5",
  },

  // Dégradé sombre en bas de l'image pour le titre
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 125,
    backgroundColor: "transparent",
    // Simulé avec une opacité progressive
    background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
    // Pour React Native on utilise un fond semi-transparent
    backgroundColor: "rgba(0,0,0,0.28)",
    // Masque seulement le bas
    top: "auto",
  },

  // Titre blanc en bas de l'image
  heroContenu: {
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 70,
  },
  heroTitre: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
    lineHeight: 32,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Bouton favori flottant en haut à droite
  boutonFavori: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  boutonFavoriTexte: {
    fontSize: 20,
  },

  // ── Carte blanche qui remonte sur l'image ──────────
  carte: {
    backgroundColor: "#F7F4F0",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    minHeight: 400,
  },

  // Petit trait de "poignée" en haut de la carte
  poignee: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 28,
  },

  titreCarte: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: 20,
  },

  labelSection: {
    fontSize: 10,
    fontWeight: "800",
    color: "#C4BAB0",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 20,
  },

  // ── Étapes avec ligne verticale ────────────────────
  etapeWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 16,
  },
  etapeGauche: {
    alignItems: "center",
    width: 28,
  },
  etapeNumero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFA85C",
    alignItems: "center",
    justifyContent: "center",
  },
  etapeNumeroTexte: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
  },
  // Ligne verticale qui relie les étapes entre elles
  etapeLigne: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: "#F0EAE0",
    marginVertical: 4,
  },
  etapeTexte: {
    flex: 1,
    fontSize: 15,
    color: "#555",
    lineHeight: 23,
    paddingBottom: 24,
    paddingTop: 3,
  },

  // ── Boutons ────────────────────────────────────────
  boutonsWrapper: {
    marginTop: 16,
    gap: 12,
  },
  boutonPrimaire: {
    backgroundColor: "#FFA85C",
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: "#FFA85C",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  boutonContenu: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  boutonPrimaireTexte: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  boutonSecondaire: {
    backgroundColor: "#ec6e5b",
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: "#ec6e5b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  boutonSecondaireTexte: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  vide: {
    color: "#bbb",
    fontSize: 15,
    marginTop: 40,
    textAlign: "center",
  },
});
