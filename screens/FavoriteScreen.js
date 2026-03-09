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

export default function FavoriteScreen({ navigation }) {
  // La liste des recettes en favoris
  const [listeFavoris, setListeFavoris] = useState([]);

  // useFocusEffect se relance chaque fois qu'on revient sur cet écran
  // c'est mieux que useEffect ici — si on vient d'ajouter un favori et qu'on revient, la liste est à jour
  useFocusEffect(
    useCallback(() => {
      const chargerFavoris = async () => {
        try {
          const favorisSauvegardes = await AsyncStorage.getItem("favoris");

          // Si y'a des favoris sauvegardés on les parse, sinon on met un tableau vide
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
      // Bouton annuler — ne fait rien
      { text: "Annuler", style: "cancel" },

      // Bouton supprimer — retire de la liste et met à jour AsyncStorage
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
          <TouchableOpacity onPress={() => navigation.navigate("Recipe")}>
            <Text style={styles.retour}>← Retour</Text>
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
          <ScrollView style={{ width: "100%" }}>
            {listeFavoris.map((recette, index) => (
              // TouchableOpacity rend la carte cliquable
              // On envoie la recette complète à l'écran de détail via route.params
              <TouchableOpacity
                key={index}
                style={styles.carte}
                onPress={() =>
                  navigation.navigate("FavoriteDetail", { recette: recette })
                }
              >
                {/* Image de la recette */}
                {recette.image && (
                  <Image source={{ uri: recette.image }} style={styles.image} />
                )}

                {/* Titre + bouton poubelle */}
                <View style={styles.carteHeader}>
                  <Text style={styles.carteTitre}>{recette.title}</Text>
                  <TouchableOpacity
                    onPress={() => supprimerFavori(recette.title)}
                  >
                    <Text style={styles.poubelle}>🗑️</Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: "#fff",
  },
  conteneur: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: "center",
  },

  // Ligne retour + titre
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  retour: {
    fontSize: 16,
    color: "#FFA85C",
    fontWeight: "600",
  },
  titre: {
    fontSize: 22,
    fontWeight: "bold",
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
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
  },
  carteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  carteTitre: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  poubelle: {
    fontSize: 20,
  },
});
