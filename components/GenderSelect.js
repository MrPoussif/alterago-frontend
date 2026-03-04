import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

const GENDERS = ["Homme", "Femme", "Autre"];

export default function GenderSelect({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      {/* Champ principal */}
      <TouchableOpacity
        style={styles.input}
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
      >
        <Text style={value ? styles.text : styles.placeholder}>
          {value || "Genre"}
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          {/* Overlay cliquable pour fermer */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setVisible(false)}
          />

          <View style={styles.modalContent}>
            <FlatList
              data={GENDERS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  activeOpacity={0.7}
                  onPress={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  placeholder: {
    fontSize: 16,
    color: "#999",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
  },
  option: {
    padding: 15,
  },
  optionText: {
    fontSize: 16,
  },
});
