import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function FavoriteScreen({ navigation }) {
  // La liste des recettes en favoris
  const [listeFavoris, setListeFavoris] = useState([]);

  // useFocusEffect se relance chaque fois qu'on revient sur cet écran
  useFocusEffect(
    useCallback(() => {
      const chargerFavoris = async () => {
        try {
          const favorisSauvegardes = await AsyncStorage.getItem("favoris");
          const liste = favorisSauvegardes
            ? JSON.parse(favorisSauvegardes)
            : [];
          setListeFavoris(liste);
        } catch (err) {
          console.log("Erreur chargement favoris :", err);
        }
      };
      chargerFavoris();
    }, []),
  );

  // Demande confirmation puis supprime un favori par son titre
  const supprimerFavori = (titre) => {
    Alert.alert("Supprimer", "Retirer cette recette des favoris ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const listeMisAJour = listeFavoris.filter((f) => f.title !== titre);
            await AsyncStorage.setItem(
              "favoris",
              JSON.stringify(listeMisAJour),
            );
            setListeFavoris(listeMisAJour);
          } catch (err) {
            console.log("Erreur suppression favori :", err);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.conteneur}>
        {/* Header : flèche retour + titre */}
        <View style={styles.header}>
          <TouchableOpacity
            style={{ zIndex: 1 }}
            onPress={() => navigation.navigate("Recipe")}
          >
            <FontAwesome6 name="circle-arrow-left" size={28} color="#FFA85C" />
          </TouchableOpacity>
          <Text style={styles.titre}>Mes favoris ❤️</Text>
        </View>

        {/* Si la liste est vide on affiche un message */}
        {listeFavoris.length === 0 ? (
          <View style={styles.vide}>
            <Text style={styles.videEmoji}>🍽️</Text>
            <Text style={styles.videTexte}>Pas encore de favoris</Text>
            <Text style={styles.videInfo}>
              Appuie sur le 🤍 sur une recette pour la sauvegarder ici
            </Text>
          </View>
        ) : (
          // Sinon on affiche toutes les recettes sauvegardées
          <ScrollView
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            {listeFavoris.map((recette, index) => (
              <TouchableOpacity
                key={index}
                style={styles.carte}
                onPress={() =>
                  navigation.navigate("FavoriteDetail", { recette: recette })
                }
              >
                {/* Image de la recette */}
                {recette.image && (
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: recette.image }}
                      style={styles.image}
                    />
                    {/* Bouton poubelle flottant sur l'image */}
                    <TouchableOpacity
                      style={styles.boutonSupprimer}
                      onPress={() => supprimerFavori(recette.title)}
                    >
                      <FontAwesome6 name="xmark" size={14} color="#888" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Titre + bouton poubelle si pas d'image */}
                <View style={styles.carteHeader}>
                  <Text style={styles.carteTitre}>{recette.title}</Text>
                  {!recette.image && (
                    <TouchableOpacity
                      onPress={() => supprimerFavori(recette.title)}
                    >
                      <FontAwesome6 name="xmark" size={16} color="#aaa" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Petite ligne orange décorative */}
                <View style={styles.separateur} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAF8",
  },
  conteneur: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: "center",
  },

  // Ligne retour + titre
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  retour: {
    fontSize: 16,
    color: "#FFA85C",
    fontWeight: "600",
  },
  titre: {
    position: "absolute",
    left: 0,
    right: 0,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Quand y'a pas encore de favoris
  vide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  videEmoji: {
    fontSize: 48,
  },
  videTexte: {
    fontSize: 18,
    fontWeight: "600",
    color: "#888",
  },
  videInfo: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    paddingHorizontal: 30,
  },

  // Chaque carte de recette favori
  carte: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Image avec bouton ✕ flottant
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 160,
  },
  boutonSupprimer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boutonSupprimerTexte: {
    fontSize: 14,
    color: "#888",
    fontWeight: "600",
  },

  carteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  carteTitre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 8,
  },
  poubelle: {
    fontSize: 16,
    color: "#aaa",
  },

  // Ligne orange décorative en bas de chaque carte
  separateur: {
    marginHorizontal: 16,
    marginBottom: 14,
    height: 2,
    width: 32,
    backgroundColor: "#FFA85C",
    borderRadius: 2,
  },
});
