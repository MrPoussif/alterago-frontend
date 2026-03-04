import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BarreProgression from "./BarreProgression";

export default function DefiItem({
  defi,
  estPersonnalise,
  onIncrement,
  onDecrement,
  onDelete,
}) {
  return (
    <View style={styles.ligne}>
      <View style={styles.cercle}>
        <Text style={{ fontSize: 24 }}>{defi.icone ? defi.icone : "⬜"}</Text>
      </View>

      <View style={styles.contenu}>
        <Text style={styles.nom}>{defi.nom}</Text>
        <BarreProgression defi={defi} />
      </View>

      <TouchableOpacity style={styles.bouton} onPress={onDecrement}>
        <Text style={styles.texteBouton}>-</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bouton} onPress={onIncrement}>
        <Text style={styles.texteBouton}>+</Text>
      </TouchableOpacity>

      {estPersonnalise && (
        <TouchableOpacity style={styles.supprimer} onPress={onDelete}>
          <Text style={{ color: "#fff" }}>🗑️</Text>
        </TouchableOpacity>
      )}
    </View>
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
  nom: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  bouton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#b3d0ee",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  texteBouton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3578e5",
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
