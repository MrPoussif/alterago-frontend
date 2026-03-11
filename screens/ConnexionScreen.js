import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import Header from "../components/common/Header";
import SignInModal from "../components/SigninModal";
import SignUpModal from "../components/SignUpModal";
import { useUser } from "@clerk/clerk-expo";

export default function ConnexionScreen({ navigation }) {
  const [signInVisible, setSignInVisible] = useState(false);
  const [signUpVisible, setSignUpVisible] = useState(false);

  // *** Check if user is already SignedIn
  const { isSignedIn } = useUser();
  useEffect(() => {
    if (isSignedIn) {
      navigation.replace("TabNavigator");
    }
  }, [isSignedIn]);

  return (
    <>
      <Header
        title="ALTERAGO"
        navigation={navigation}
        showSettings={false}
        showVide={false}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Welcome to AlterAgo</Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setSignInVisible(true)}
        >
          <Text style={styles.textButton}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setSignUpVisible(true)}
        >
          <Text style={styles.textButton}>Sign Up</Text>
        </TouchableOpacity>

        {/* Sign In Modal */}
        <SignInModal
          visible={signInVisible}
          onClose={() => setSignInVisible(false)}
          onSuccess={() => navigation.replace("TabNavigator")}
        />

        {/* Sign Up Modal */}
        <SignUpModal
          visible={signUpVisible}
          onClose={() => setSignUpVisible(false)}
          onSuccess={() => navigation.replace("Creation")}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 70,
  },
  title: {
    fontSize: 38,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
    marginBottom: 40,
  },
  mainButton: {
    width: "60%",
    padding: 15,
    backgroundColor: "#FFA85C",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  textButton: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
