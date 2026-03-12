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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function FavoriteDetailScreen({ navigation, route }) {
  // On récupère la recette passée en paramètre depuis FavoriteScreen
  const recette = route.params.recette;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Image hero pleine largeur */}
        <View style={styles.heroWrapper}>
          {recette.image ? (
            <Image source={{ uri: recette.image }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder} />
          )}

          {/* Overlay sombre en bas de l'image */}
          <View style={styles.heroOverlay} />

          {/* Titre flottant sur l'image */}
          <View style={styles.heroContenu}>
            <Text style={styles.heroTitre}>{recette.title}</Text>
          </View>

          {/* Bouton retour icône en haut à gauche */}
          <TouchableOpacity
            style={styles.boutonRetour}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome6
              name="circle-arrow-left"
              size={28}
              color="#ffffffff"
            />
          </TouchableOpacity>
        </View>

        {/* Carte blanche arrondie qui remonte sur l'image */}
        <View style={styles.carte}>
          {/* Petit trait décoratif centré */}
          <View style={styles.poignee} />

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F4F0",
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
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 125,
    backgroundColor: "rgba(0,0,0,0.28)",
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

  // Bouton retour texte
  boutonRetour: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  boutonRetourTexte: {
    fontSize: 16,
    color: "#FFA85C",
    fontWeight: "600",
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

  vide: {
    color: "#bbb",
    fontSize: 15,
    marginTop: 40,
    textAlign: "center",
  },
});
