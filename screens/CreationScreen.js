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
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import Dropdown from "react-native-input-select";

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
  // const newUser = {};

  const handlePreviousPress = () => {
    avatarIndex === 0 ? setAvatarIndex(3) : setAvatarIndex(avatarIndex - 1);
    console.log("previous");
    console.log(avatarIndex);
  };
  const handleNextPress = () => {
    avatarIndex === 3 ? setAvatarIndex(0) : setAvatarIndex(avatarIndex + 1);
    console.log("next");
    console.log(avatarIndex);
  };
  const handleConfirmationPress = () => {
    navigation.navigate("TabNavigator");
  };
  // let avatar = `../assets/avatars/avatar-${avatarIndex}.jpg`;
  return (
    <View style={styles.container}>
      <Image
        source={avatars[avatarIndex]}
        style={{ width: 150, height: 150, marginBottom: 40 }}
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
      <View style={styles.inputBisContainer}>
        {/* <Dropdown
          label="Country"
          placeholder="Select an option..."
          options={[
            { label: "Nigeria", value: "NG" },
            { label: "Åland Islands", value: "AX" },
            { label: "Algeria", value: "DZ" },
            { label: "American Samoa", value: "AS" },
            { label: "Andorra", value: "AD" },
          ]}
          selectedValue={country}
          onValueChange={(value) => setCountry(value)}
          primaryColor={"green"}
        /> */}
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
  arrowsBox: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    width: "70%",
    marginTop: 25,
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
    width: "30%",
    borderBottomColor: "#07905C",
    borderBottomWidth: 1,
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
