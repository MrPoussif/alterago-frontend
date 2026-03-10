import {
  Alert,
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
import { Picker } from "@react-native-picker/picker";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import Header from "../components/common/Header";

//Avatars issus du dossier AlterAgo/avatars sur cloudinary
const avatars = [
  "https://res.cloudinary.com/dcnayzmst/image/upload/v1772639193/avatar-4_j5xnac.jpg",
  "https://res.cloudinary.com/dcnayzmst/image/upload/v1772639191/avatar-3_jmupfn.jpg",
  "https://res.cloudinary.com/dcnayzmst/image/upload/v1772639191/avatar-2_ouugyv.jpg",
  "https://res.cloudinary.com/dcnayzmst/image/upload/v1772639190/avatar-1_y52gge.jpg",
];
const agesArray = Array.from({ length: 91 }, (_, i) => i + 9);
agesArray.unshift("Age");

const genderArray = ["Genre", "Femme", "Homme", "Autre"];
export default function CreationScreen({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState("Age");
  const [gender, setGender] = useState(null);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [image, setImage] = useState(avatars[avatarIndex]);
  const { getToken } = useAuth();
  const user = useUser();

  useEffect(() => {
    console.log("user", user.user.id);
  }, []);

  const handlePreviousPress = () => {
    avatarIndex === 0
      ? setAvatarIndex(avatars.length - 1)
      : setAvatarIndex(avatarIndex - 1);
    setImage(avatars[avatarIndex]);
  };
  const handleNextPress = () => {
    avatarIndex === avatars.length - 1
      ? setAvatarIndex(0)
      : setAvatarIndex(avatarIndex + 1);
    setImage(avatars[avatarIndex]);
  };
  //Importer une photo depuis le téléphone
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
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    })();
  };
  // Prendre une photo
  const handleCameraPress = () => {
    console.log("CAMERA");
    (async () => {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult) {
        Alert.alert(
          "Permission required",
          "Permission to access the media library is required.",
        );
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    })();
  };
  const handleConfirmationPress = () => {
    (async () => {
      try {
        //Récupère le token Clerk lié au user
        const token = await getToken();
        const signatureRes = await fetch(
          "http://192.168.100.117:3000/users/signature",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              //Envoi le token dans le header pour vérification par middleware dans le backend
              authorization: `Bearer ${token}`,
            },
          },
        );
        const signatureData = await signatureRes.json();
        if (signatureData) {
          console.log("signature valid");
          // console.log(signatureData);
          console.log("image", image);
          //upload vers cloudinary et récupération URL (fetch route post api cloudinary)
          //création formdata pour envoyer image à cloudinary
          const formData = new FormData();

          formData.append("file", {
            uri: image,
            type: "image/jpeg",
            name: `profile_${nickname}.jpg`,
          });
          formData.append("api_key", signatureData.apiKey);
          formData.append("timestamp", signatureData.timestamp);
          formData.append("signature", signatureData.signature);
          formData.append("folder", signatureData.folder);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
            {
              method: "POST",
              body: formData,
            },
          );
          const cloudData = await response.json();
          console.log("cloudData:", cloudData.url);
          if (cloudData) {
            setImage(cloudData.url);
            // Appel route enregistrement de user sur mongoDB
            const signupRes = await fetch(
              "http://192.168.100.117:3000/users/signup",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  //Envoi le token dans le header pour vérification par middleware dans le backend
                  authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  userId: user.user.id,
                  nickname,
                  firstname,
                  lastname,
                  age: Number(age),
                  gender,
                  picture: cloudData.url,
                }),
              },
            );
            const signupData = await signupRes.json();
            // console.log("data", signupData);
            signupData && alert(signupData.error);
            // redirige vers le dashboard
            navigation.navigate("TabNavigator");
          }
        }
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
      <Header
        title="CREATION DE PROFIL"
        navigation={navigation}
        showSettings={false}
        showVide={false}
      />
      <View style={styles.profilePic}>
        <Image
          source={{
            uri: `${image}`,
            // uri: `${avatars[avatarIndex]}`,
          }}
          style={{
            width: 150,
            height: 150,
            marginBottom: 5,
            borderRadius: 100,
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
              size={25}
              color={"#FFA85C"}
            ></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCameraPress()}>
            <FontAwesome
              name={"camera"}
              size={25}
              color={"#FFA85C"}
            ></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNextPress()}>
            <FontAwesome name={"arrow-right"} size={30} color={"#FFA85C"} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.informations}>
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
          <View style={styles.pickerView}>
            <Picker
              style={styles.picker}
              mode="dropdown"
              selectedValue={gender}
              onValueChange={(value) => setGender(value)}
            >
              {genderArray.map((gender) => {
                return (
                  <Picker.Item
                    label={gender}
                    value={gender}
                    style={styles.pickerItem}
                  />
                );
              })}
            </Picker>
          </View>
          <View style={styles.pickerView}>
            <Picker
              style={styles.picker}
              mode="dropdown"
              numberOfLines={5}
              selectedValue={age}
              onValueChange={(value) => setAge(value)}
            >
              {agesArray.map((age) => {
                return (
                  <Picker.Item
                    label={age}
                    value={age}
                    style={styles.pickerItem}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleConfirmationPress()}
          style={styles.button}
        >
          <Text style={styles.btnTxt}>Valider</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
  },
  profilePic: {
    alignItems: "center",
    width: "100%",
    marginVertical: 30,
  },
  iconsBox: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  informations: {
    alignItems: "center",
    width: "100%",
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
  pickerView: {
    borderWidth: 1,
    borderColor: "#07905C",
    borderRadius: 20,
    width: "45%",
    height: 50,
  },
  picker: {
    width: "100%",
    fontSize: 20,
  },
  pickerItem: {
    fontSize: 15,
    height: 30,
    witdh: 120,
  },
});
