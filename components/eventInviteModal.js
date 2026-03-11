import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";

export default function InviteModal({
  utilisateurs,
  selectedFriends,
  onSelectFriend,
  onInvite,
  onClose,
}) {
  return (
    <View style={styles.invite}>
      <View style={styles.inviteContainer}>
        {/* Header */}
        <View style={styles.inviteHeader}>
          <Text style={styles.titre}>Amis</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <FontAwesome6 name="xmark" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Liste des amis */}
        <ScrollView style={styles.liste}>
          {utilisateurs.map((utilisateur) => (
            <TouchableOpacity
              key={utilisateur.id}
              style={
                selectedFriends.includes(utilisateur.id)
                  ? styles.carteSelected
                  : styles.carte
              }
              onPress={() => onSelectFriend(utilisateur.id)}
            >
              <View style={styles.infoAmi}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>{utilisateur.emoji}</Text>
                </View>
                <Text style={styles.nom}>{utilisateur.nickname}</Text>
              </View>
              <FontAwesome6 name="circle-plus" size={25} color="#FFA85C" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bouton inviter — visible seulement si au moins un ami sélectionné */}
        {selectedFriends.length > 0 && (
          <TouchableOpacity style={styles.boutonInviter} onPress={onInvite}>
            <Text style={styles.boutonInviterTexte}>INVITER</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  invite: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 8,
  },
  inviteContainer: {
    width: "100%",
  },
  inviteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titre: {
    fontSize: 20,
    fontWeight: "300",
  },
  closeBtn: {
    padding: 4,
  },
  liste: {
    width: "100%",
  },
  carte: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  carteSelected: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1B4965",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  infoAmi: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 15,
    color: "#1A1A1A",
  },
  boutonInviter: {
    backgroundColor: "#FFA85C",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  boutonInviterTexte: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
