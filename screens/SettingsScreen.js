import {
  Image,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-expo";
import PwdInput from "../components/PwdInput";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import PwdInput from "../components/PwdInput";

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
    setPwdModalVisible(true);
  };
  const handleConfirmUpdatePwd = async () => {
    const updatedPwd = await user.updatePassword({
      currentPassword: currPwd,
      newPassword: newPwd,
    });
    updatedPwd && setPwdModalVisible(false);
    console.log("Confirm new password");
  };
  //* CHANGEMENT EMAIL  *****************************
  const handleUpdateEmail = () => {
    console.log("Update email");
    setEmailModalVisible(true);
  };
  const handleConfirmUpdateEmail = async () => {
    console.log("Confirm new email");
    //! ne fonctionne pas
    // await user.createEmailAddress({
    //   emailAddress: newEmail,
    // });
    // await emailAddress.attemptVerification({
    //   code: "123456",
    // });
    setNewEmail("");
    setEmailModalVisible(false);
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
          <View style={styles.behindModalBg}>
            <View style={styles.modalContainer}>
              <View style={{ alignItems: "flex-end", width: "80%" }}>
                <FontAwesome
                  name={"close"}
                  size={25}
                  color={"#FFA85C"}
                  onPress={() => setPwdModalVisible(false)}
                />
              </View>

              <Text style={styles.modalTitle}>Changer de mot de passe</Text>
              <KeyboardAvoidingView style={styles.inputContainer}>
                <PwdInput
                  placeholder={"Ancien mot de passe"}
                  autoComplete={"current-password"}
                  setPwd={setCurrPwd}
                  value={currPwd}
                ></PwdInput>
                <PwdInput
                  placeholder={"Nouveau mot de passe"}
                  autoComplete={"new-password"}
                  setPwd={setNewPwd}
                  value={newPwd}
                ></PwdInput>
              </KeyboardAvoidingView>
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={() => handleConfirmUpdatePwd()}
              >
                <Text style={styles.btnTxt}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleUpdateEmail()}
        >
          <Text style={styles.btnTxt}>Changer d'email</Text>
        </TouchableOpacity>
        <Modal visible={emailModalVisible} transparent animationType="none">
          <View style={styles.behindModalBg}>
            <View style={styles.modalContainer}>
              <View style={{ alignItems: "flex-end", width: "80%" }}>
                <FontAwesome
                  name={"close"}
                  size={25}
                  color={"#FFA85C"}
                  onPress={() => setEmailModalVisible(false)}
                />
              </View>
              <Text style={styles.modalTitle}>Changer d'email</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nouvelle adresse mail"
                  onChangeText={(value) => setNewEmail(value)}
                  value={newEmail}
                  autoComplete={"email"}
                  inputMode={"email"}
                ></TextInput>
              </View>
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={() => handleConfirmUpdateEmail()}
              >
                <Text style={styles.btnTxt}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    borderWidth: 5,
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
    height: 300,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 30,
  },
  modalTitle: {
    fontSize: 20,
    color: "#07905C",
    fontWeight: 600,
  },
  inputContainer: {
    justifyContent: "space-around",
    alignItems: "center",
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
