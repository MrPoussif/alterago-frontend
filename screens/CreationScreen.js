import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import GenderSelect from "../components/GenderSelect";
import { useAuth } from "@clerk/clerk-expo";

const avatars = [
  require("../assets/avatars/avatar-1.jpg"),
  require("../assets/avatars/avatar-2.jpg"),
  require("../assets/avatars/avatar-3.jpg"),
  require("../assets/avatars/avatar-4.jpg"),
];
export default function CreationScreen({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [avatarIndex, setAvatarIndex] = useState(0);

  const { getToken } = useAuth();

  const handlePreviousPress = () => {
    avatarIndex === 0
      ? setAvatarIndex(avatars.length - 1)
      : setAvatarIndex(avatarIndex - 1);
  };
  const handleNextPress = () => {
    avatarIndex === avatars.length - 1
      ? setAvatarIndex(0)
      : setAvatarIndex(avatarIndex + 1);
  };
  const handleConfirmationPress = () => {
    (async () => {
      try {
        const token = await getToken();

        const res = await fetch("http://192.168.100.117:3000/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nickname,
            firstname,
            lastname,
            age: Number(age),
            gender,
            picture: avatars[avatarIndex],
          }),
        });
        const data = await res.json();
        console.log("Utilisateur enregistré");
        // navigation.navigate("TabNavigator");
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={avatars[avatarIndex]}
        style={{
          width: 150,
          height: 150,
          marginBottom: 5,
        }}
      />
      <View style={styles.arrowsBox}>
        <TouchableOpacity
          onPress={() => handlePreviousPress()}
          // style={styles.button}
        >
          <FontAwesome
            name={"arrow-left"}
            size={30}
            color={"#FFA85C"}
          ></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleNextPress()}
          // style={styles.button}
        >
          <FontAwesome name={"arrow-right"} size={30} color={"#FFA85C"} />
        </TouchableOpacity>
      </View>
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
      <View style={styles.inputBisContainer}>
        <GenderSelect value={gender} onChange={setGender} />
        <TextInput
          placeholder="Age"
          onChangeText={(value) => setAge(value)}
          value={age}
          style={styles.inputBis}
        />
      </View>
      <TouchableOpacity
        onPress={() => handleConfirmationPress()}
        style={styles.button}
      >
        <Text style={styles.btnTxt}>Valider</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowsBox: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    width: "70%",
    marginTop: 20,
    paddingBottom: 5,
    borderBottomColor: "#07905C",
    borderBottomWidth: 1,
    fontSize: 18,
  },
  inputBisContainer: {
    width: "70%",
    justifyContent: "space-between",
    marginTop: 25,
    flexDirection: "row",
  },
  inputBis: {
    width: "20%",
    borderBottomColor: "#07905C",
    borderBottomWidth: 1,
    paddingBottom: 5,
    fontSize: 18,
  },
  button: {
    alignItems: "center",
    width: "40%",
    height: 40,
    marginTop: 30,
    backgroundColor: "#FFA85C",
    borderRadius: 10,
    marginBottom: 80,
    justifyContent: "center",
  },

  btnTxt: {
    color: "white",
    fontSize: 20,
    fontWeight: 500,
  },
  profilPic: {
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 2,
  },
});
