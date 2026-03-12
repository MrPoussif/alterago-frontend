import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import PwdInput from "../components/PwdInput";

export default function SignInModal({ visible, onClose, onSuccess }) {
  const {
    isLoaded: signInLoaded,
    signIn,
    setActive: setActiveSignIn,
  } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!signInLoaded) return;
    try {
      setLoading(true);
      const result = await signIn.create({ identifier: email, password });
      await setActiveSignIn({ session: result.createdSessionId });
      onSuccess();
      onClose();
    } catch (err) {
      Alert.alert("Sign In Error", err.errors?.[0]?.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  if (!signInLoaded) {
    return (
      <Modal visible={visible} transparent>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ec6e5b" />
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modal} onStartShouldSetResponder={() => true}>
            <Text style={styles.title}>Sign In</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoComplete="email"
              inputMode="email"
            />
            {/* <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              autoComplete="current-password"
              secureTextEntry
            /> */}
            <PwdInput
              placeholder={"Mot de passe"}
              autoComplete={"current-password"}
              setPwd={setPassword}
              value={password}
            ></PwdInput>
            <TouchableOpacity onPress={onSignInPress} style={styles.button}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textButton}>Sign In</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 36,
  },
  modal: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 15 },
  input: {
    width: "90%",
    borderBottomColor: "#07905C",
    borderBottomWidth: 1,
    fontSize: 18,
    marginTop: 15,
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#FFA85C",
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  textButton: { color: "#fff", fontWeight: "600" },
  closeButton: { marginTop: 15 },
  closeText: { color: "#07905C", fontWeight: "600" },
});
