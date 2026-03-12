// screens/SocialScreen.js

import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { UTILISATEURS_FICTIFS } from "../constants/utilisateursFictifs.js";

export default function SocialScreen() {
  // On garde en mémoire quels utilisateurs ont été ajoutés
  const [utilisateurs] = useState(UTILISATEURS_FICTIFS);

  return (
    <View style={styles.conteneur}>
      <Text style={styles.titre}>Social</Text>
      <Text style={styles.sousTitre}>Amis</Text>

      <ScrollView style={{ width: "100%" }}>
        {utilisateurs.map((utilisateur) => (
          <View key={utilisateur.id} style={styles.carte}>
            {/* Avatar avec l'emoji */}
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>{utilisateur.emoji}</Text>
            </View>

            {/* Nom de l'utilisateur */}
            <Text style={styles.nom}>{utilisateur.nickname}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  titre: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sousTitre: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  carte: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#dce8f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  nom: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
});
