import {
  Alert,
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
import React, { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import GenderSelect from "../components/GenderSelect";
import { useAuth } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";

const avatars = [
  "https://res.cloudinary.com/dcnayzmst/image/upload/v1772639193/avatar-4_j5xnac.jpg",
  "https://res.cloudinary.com/dcnayzmst/image/upload/v1772639191/avatar-3_jmupfn.jpg",
  "https://res.cloudinary.com/dcnayzmst/image/upload/v1772639191/avatar-2_ouugyv.jpg",
  "https://res.cloudinary.com/dcnayzmst/image/upload/v1772639190/avatar-1_y52gge.jpg",
];
// const avatars = [
//   require("../assets/avatars/avatar-1.jpg"),
//   require("../assets/avatars/avatar-2.jpg"),
//   require("../assets/avatars/avatar-3.jpg"),
//   require("../assets/avatars/avatar-4.jpg"),
// ];

export default function CreationScreen({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [image, setImage] = useState(null);
  const { getToken } = useAuth();
  useEffect(() => {
    console.log("use effect");
  }, []);
  const handlePreviousPress = () => {
    avatarIndex === 0
      ? setAvatarIndex(avatars.length - 1)
      : setAvatarIndex(avatarIndex - 1);
  };
  const handleUploadPress = () => {
    console.log("UPLOAD");
    (async () => {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult) {
        Alert.alert(
          "Permission required",
          "Permission to access the media library is required.",
        );
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    })();
  };
  const handleNextPress = () => {
    avatarIndex === avatars.length - 1
      ? setAvatarIndex(0)
      : setAvatarIndex(avatarIndex + 1);
  };
  const handleConfirmationPress = () => {
    (async () => {
      try {
        //Récupère le token Clerk lié au user
        const token = await getToken();
        const res = await fetch("http://192.168.100.117:3000/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //Envoi le token dans le header pour vérification par middleware dans le backend
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nickname,
            firstname,
            lastname,
            age: Number(age),
            gender,
            picture: avatars[avatarIndex],
            // friends: null,
            // challenges: null,
          }),
        });
        const data = await res.json();
        console.log("data", data);
        // console.log("avatar", `${avatars[avatarIndex]}`);
        console.log(avatars);

        data ? alert(data.error) : console.log("Nouvel utilisateur enregistré");

        // console.log("Avatar:", avatars[avatarIndex]);

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
        source={{
          uri: `${avatars[avatarIndex]}`,
        }}
        style={{
          width: 150,
          height: 150,
          marginBottom: 5,
        }}
      />
      <View style={styles.arrowsBox}>
        <TouchableOpacity onPress={() => handlePreviousPress()}>
          <FontAwesome
            name={"arrow-left"}
            size={30}
            color={"#FFA85C"}
          ></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUploadPress()}>
          <FontAwesome
            name={"upload"}
            size={30}
            color={"#FFA85C"}
          ></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNextPress()}>
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
    width: "40%",
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
