import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoriteDetailScreen({ navigation, route }) {
  // On récupère la recette passée en paramètre depuis FavoriteScreen
  // C'est comme passer une valeur d'un écran à l'autre
  const recette = route.params.recette;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.conteneur}>
        {/* Bouton retour */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>← Retour</Text>
        </TouchableOpacity>

        {/* Titre de la recette */}
        <Text style={styles.titre}>{recette.title}</Text>

        {/* Image de la recette */}
        {recette.image && (
          <Image source={{ uri: recette.image }} style={styles.image} />
        )}

        {/* Instructions étape par étape */}
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
      </ScrollView>
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
    padding: 20,
  },
  retour: {
    fontSize: 16,
    color: "#FFA85C",
    fontWeight: "600",
    marginBottom: 16,
  },
  titre: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
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
    marginBottom: 8,
  },
  etape: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});
