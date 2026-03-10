import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BarreProgression from "./BarreProgression";

export default function DefiItem({
  defi,
  estPersonnalise,
  onIncrement,
  onDecrement,
  onDelete,
  onModifierObjectif,
}) {
  // estFixe = le défi a un champ "pas" → c'est un défi fixe (eau ou pas)
  const estFixe = defi.pas !== undefined;

  return (
    <TouchableOpacity
      style={styles.ligne}
      activeOpacity={estFixe ? 0.7 : 1}
      onPress={estFixe && onModifierObjectif ? onModifierObjectif : undefined}
    >
      {/* Icône du défi dans un cercle */}
      <View style={styles.cercle}>
        <Text style={{ fontSize: 24 }}>{defi.icone ? defi.icone : "⬜"}</Text>
      </View>

      {/* Nom + barre de progression (la barre affiche déjà la valeur) */}
      <View style={styles.contenu}>
        <Text style={styles.nom}>{defi.nom}</Text>

        {/* BarreProgression affiche la valeur ET la barre — le max est toujours à jour */}
        <BarreProgression defi={defi} />

        {/* Petit indice orange pour les défis fixes */}
        {estFixe && (
          <Text style={styles.indiceCliquable}>
            Appuie pour modifier l'objectif
          </Text>
        )}
      </View>

      {/* Bouton moins — on arrête la propagation pour ne pas déclencher onModifierObjectif */}
      <TouchableOpacity
        style={styles.bouton}
        onPress={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
      >
        <Text style={styles.texteBouton}>-</Text>
      </TouchableOpacity>

      {/* Bouton plus — idem */}
      <TouchableOpacity
        style={styles.bouton}
        onPress={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
      >
        <Text style={styles.texteBouton}>+</Text>
      </TouchableOpacity>

      {/* Bouton poubelle — seulement sur les défis personnalisés */}
      {estPersonnalise && (
        <TouchableOpacity
          style={styles.supprimer}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Text style={{ color: "#fff" }}>🗑️</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    width: "100%",
  },
  cercle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  contenu: {
    flex: 1,
    marginLeft: 10,
  },
  nomLigne: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  nom: {
    fontSize: 16,
    fontWeight: "500",
  },
  valeur: {
    fontSize: 12,
    color: "#888",
  },
  indiceCliquable: {
    fontSize: 10,
    color: "#FFA85C",
    marginTop: 3,
  },
  bouton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#79ADDC",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  texteBouton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  supprimer: {
    marginLeft: 6,
    backgroundColor: "#ec6e5b",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
