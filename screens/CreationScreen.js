import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
// import { useUser } from "@clerk/clerk-expo";
// const { user } = useUser();

export default function CreationScreen({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const newUser = {};

  const handleButtonPress = () => {
    navigation.navigate("TabNavigator");
  };
  return (
    <View style={styles.container}>
      <Text>Creation Screen</Text>
      <Image
        source={require("../assets/default-profil-pic.png")}
        style={{ width: 100, height: 100 }}
      />
      {/* // TODO Ajouter les champs pour créer l'utilisateur sur mongoDB */}
      <TextInput
        placeholder="Pseudo"
        onChangeText={(value) => setNickname(value)}
        value={nickname}
        style={styles.input}
      />
      <TextInput
        placeholder="Prénom"
        onChangeText={(value) => setFirstname(value)}
        value={firstname}
        style={styles.input}
      />
      <TextInput
        placeholder="Nom"
        onChangeText={(value) => setLastname(value)}
        value={lastname}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => handleButtonPress()}
        style={styles.button}
      >
        <Text style={styles.btnTxt}>Validation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "70%",
    marginTop: 25,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 18,
  },
  button: {
    alignItems: "center",

    width: "50%",
    height: 40,
    marginTop: 30,
    backgroundColor: "#ec6e5b",
    borderRadius: 10,
    marginBottom: 80,
    justifyContent: "center",
  },

  btnTxt: {
    color: "white",
  },
  profilPic: {
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 2,
  },
});
