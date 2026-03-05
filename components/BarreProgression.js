import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BarreProgression({ defi }) {
  const { valeur, max } = defi;

  const pourcentage = (valeur / max) * 100;

  const afficherValeur = () => {
    if (defi.id === "hydratation") {
      return `${(valeur / 1000).toFixed(1)}/${defi.maxAffiche}L`;
    }

    if (defi.id === "pas") {
      return `${valeur}/${defi.maxAffiche} pas`;
    }

    return `${valeur}/${max}`;
  };

  return (
    <View>
      <Text style={styles.texteValeur}>{afficherValeur()}</Text>

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
