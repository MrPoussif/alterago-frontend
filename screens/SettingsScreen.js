import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-expo";

export default function SettingsScreen({ navigation }) {
  const utilisateur = useSelector((state) => state.user.value);
  const { signOut } = useAuth();
  // const handleSignoutPress = async () => {
  //   await signOut();
  //   navigation.navigate("Connexion");
  // };

  return (
    <View style={styles.container}>
      <View style={styles.bloc}>
        <Image
          source={{ uri: utilisateur.picture }}
          style={styles.imageProfile}
        />
        <Text style={styles.nomProfile}>
          {utilisateur.nickname || "Utilisateur"}
        </Text>
      </View>
      <View style={styles.bloc}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("")}
        >
          <Text style={styles.btnTxt}>Changer de mot de passe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("")}
        >
          <Text style={styles.btnTxt}>Changer de mail</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bloc}>
        <TouchableOpacity
          style={styles.buttonSignout}
          onPress={() => handleSignoutPress()}
        >
          <Text style={styles.btnTxt}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 80,
  },
  bloc: {
    width: "80%",
    alignItems: "center",
  },
  imageProfile: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: "#1a3a5c",
    borderWidth: 3,
    marginBottom: 20,
  },
  nomProfile: {
    fontSize: 30,
    fontWeight: "600",
    color: "#1a3a5c",
  },
  button: {
    backgroundColor: "#1a3a5c",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  buttonSignout: {
    backgroundColor: "#FFA85C",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  btnTxt: {
    color: "white",
    fontSize: 20,
    fontWeight: 500,
  },
});
