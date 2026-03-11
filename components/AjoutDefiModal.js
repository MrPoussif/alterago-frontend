import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function AjoutDefiModal({
  visible,
  nom,
  setNom,
  onAjouter,
  onFermer,
  defisPersonnalises,
  onSupprimer,
}) {
  return (
    <Modal visible={visible} transparent animationType="none">
      {/* Fond grisé qui ferme la modal si on clique dessus */}
      <TouchableOpacity
        style={styles.fond}
        activeOpacity={1}
        onPress={onFermer}
      >
        {/* La carte blanche au centre, le stopPropagation évite de fermer quand on clique dedans */}
        <TouchableOpacity
          style={styles.contenu}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header : titre + croix */}
          <View style={styles.entete}>
            <Text style={styles.titre}>Mes défis</Text>
            <TouchableOpacity onPress={onFermer}>
              <Text style={styles.croix}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Liste des défis déjà ajoutés — visible seulement si y'en a */}
          {defisPersonnalises && defisPersonnalises.length > 0 && (
            <ScrollView style={styles.liste} nestedScrollEnabled>
              {defisPersonnalises.map((defi) => (
                <View key={defi.id} style={styles.ligneDefi}>
                  <Text style={styles.nomDefi}>{defi.nom}</Text>

                  {/* Bouton poubelle pour supprimer ce défi */}
                  <TouchableOpacity onPress={() => onSupprimer(defi.id)}>
                    <Text style={styles.poubelle}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Petit trait de séparation entre la liste et le formulaire */}
          {defisPersonnalises && defisPersonnalises.length > 0 && (
            <View style={styles.separateur} />
          )}

          {/* Champ pour taper le nom du nouveau défi */}
          <TextInput
            placeholder="Nom du nouveau défi"
            value={nom}
            onChangeText={setNom}
            style={styles.input}
          />

          {/* Bouton valider */}
          <TouchableOpacity style={styles.bouton} onPress={onAjouter}>
            <Text style={styles.boutonTexte}>Ajouter</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Le fond semi-transparent derrière la carte
  fond: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 36,
  },

  // La carte blanche
  contenu: {
    marginTop: -36,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    maxHeight: "85%", // évite que ça déborde si y'a plein de défis
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

  // La liste scrollable des défis existants
  liste: {
    maxHeight: 300,
  },

  // Chaque ligne de la liste : nom à gauche, poubelle à droite
  ligneDefi: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  nomDefi: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },

  poubelle: {
    fontSize: 18,
    paddingHorizontal: 8,
  },

  // Le trait entre la liste et le champ de saisie
  separateur: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },

  bouton: {
    backgroundColor: "#FFA85C",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  boutonTexte: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
