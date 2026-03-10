import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-expo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import PwdInput from "../components/PwdInput";
import Header from "../components/common/Header";

export default function SettingsScreen({ navigation }) {
  const utilisateur = useSelector((state) => state.user.value);
  const { signOut } = useAuth();
  const { user } = useUser();
  const [currPwd, setCurrPwd] = useState();
  const [newPwd, setNewPwd] = useState();
  const [newEmail, setNewEmail] = useState();
  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  //* CHANGEMENT MOT DE PASSE  ******************
  const handleUpdatePassword = async () => {
    console.log("Update password");
    //TODO Modale pour changer de mot de passe
    setPwdModalVisible(true);
    // await user.updatePassword({
    //   currentPassword: currPwd,
    //   newPassword: newPwd,
    // });
  };
  const handleConfirmUpdatePwd = async () => {
    setPwdModalVisible(false);
    console.log("Confirm new password");
  };
  //* CHANGEMENT EMAIL  *****************************
  const handleUpdateEmail = async () => {
    console.log("Update email");
    setEmailModalVisible(true);
    //TODO Modale pour changer d'email
    // await user.updatePassword({
    //   currentPassword: "currentPassword",
    //   newPassword: "newPassword",
    // });
  };
  const handleConfirmUpdateEmail = async () => {
    setEmailModalVisible(false);
    console.log("Confirm new email");
    await user.createEmailAddress({ emailAddress: newEmail });
  };

  //TODO Changer d'image
  //TODO changer de pseudo

  //* DECONNEXION  *****************************
  const handleSignoutPress = async () => {
    await signOut();
    navigation.navigate("Connexion");
  };
  return (
    <View style={styles.container}>
      <Header title="PARAMETRES" navigation={navigation} showSettings={false} />
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
          onPress={() => handleUpdatePassword()}
        >
          <Text style={styles.btnTxt}>Changer de mot de passe</Text>
        </TouchableOpacity>
        <Modal visible={pwdModalVisible} transparent animationType="none">
          <TouchableOpacity
            style={styles.behindModalBg}
            onPress={() => setPwdModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalContainer}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Changer de mot de passe</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputRow}>
                  <PwdInput newPwd={newPwd} setNewPwd={setNewPwd}></PwdInput>
                  <TextInput
                    style={styles.input}
                    placeholder="Ancien mot de passe"
                    onChangeText={(value) => setCurrPwd(value)}
                    value={currPwd}
                    autoComplete={"current-password"}
                    secureTextEntry={true}
                  ></TextInput>
                  <FontAwesome
                    name={"eye-slash"}
                    size={20}
                    color={"#07905C"}
                    onPres={() => handleIconPress()}
                  />
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nouveau mot de passe"
                    onChangeText={(value) => setNewPwd(value)}
                    value={newPwd}
                    autoComplete={"new-password"}
                    secureTextEntry={true}
                  ></TextInput>
                  <FontAwesome name={"eye-slash"} size={20} color={"#07905C"} />
                </View>
              </View>
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={() => handleConfirmUpdatePwd()}
              >
                <Text style={styles.btnTxt}>Confirmer</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleUpdateEmail()}
        >
          <Text style={styles.btnTxt}>Changer d'email</Text>
        </TouchableOpacity>
        <Modal visible={emailModalVisible} transparent animationType="none">
          <TouchableOpacity
            style={styles.behindModalBg}
            onPress={() => setEmailModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalContainer}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Changer de d'email</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nouvelle adresse mail"
                  onChangeText={(value) => setNewEmail(value)}
                  value={newEmail}
                ></TextInput>
              </View>
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={() => handleConfirmUpdateEmail()}
              >
                <Text style={styles.btnTxt}>Confirmer</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
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
    paddingBottom: 80,
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
  behindModalBg: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    height: "40%",
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 30,
  },
  modalTitle: {
    fontSize: 20,
    color: "#1a3a5c",
    fontWeight: 600,
  },
  inputContainer: {
    justifyContent: "space-around",
    height: "50%",
  },

  buttonConfirm: {
    backgroundColor: "#FFA85C",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    width: "80%",
  },
});
