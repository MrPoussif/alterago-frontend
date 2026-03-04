import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";

export default function AjoutDefiModal({
  visible,
  nom,
  setNom,
  onAjouter,
  onFermer,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.fond}
        activeOpacity={1}
        onPress={onFermer}
      >
        <TouchableOpacity
          style={styles.contenu}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.entete}>
            <Text style={styles.titre}>Nouveau défi</Text>

            <TouchableOpacity onPress={onFermer}>
              <Text style={styles.croix}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Nom du défi"
            value={nom}
            onChangeText={setNom}
            style={styles.input}
          />

          <Button title="Ajouter" onPress={onAjouter} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fond: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contenu: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  entete: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titre: {
    fontWeight: "bold",
    fontSize: 18,
  },
  croix: {
    fontSize: 18,
    color: "#999",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
});
