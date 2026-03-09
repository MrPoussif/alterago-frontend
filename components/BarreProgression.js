import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BarreProgression({ defi }) {
  const { valeur, max } = defi;

  // Calcul du pourcentage de remplissage de la barre
  const pourcentage = (valeur / max) * 100;

  const afficherValeur = () => {
    if (defi.id === "hydratation") {
      // On divise valeur ET max par 1000 pour avoir des litres
      // Comme ça si le max change à 3000ml, ça affiche bien 3L
      const valeurEnLitres = (valeur / 1000).toFixed(1);
      const maxEnLitres = (max / 1000).toFixed(1);
      return `${valeurEnLitres}L / ${maxEnLitres}L`;
    }

    if (defi.id === "pas") {
      // On utilise max directement — si l'objectif change, l'affichage suit
      return `${valeur} / ${max} pas`;
    }

    // Défis personnalisés — affichage simple
    return `${valeur} / ${max}`;
  };

  return (
    <View>
      {/* Valeur affichée en dessous du nom du défi */}
      <Text style={styles.texteValeur}>{afficherValeur()}</Text>

      {/* Barre de progression */}
      <View style={styles.fond}>
        <View style={[styles.remplissage, { width: pourcentage + "%" }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  texteValeur: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
  fond: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  remplissage: {
    height: 10,
    backgroundColor: "#07905C",
  },
});
