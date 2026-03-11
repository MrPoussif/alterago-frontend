import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { useUser, useSignUp, useSignIn } from "@clerk/clerk-expo";
import Header from "../components/common/Header";
import BottomSheet from "@gorhom/bottom-sheet";

export default function ConnexionScreen({ navigation }) {
  const dispatch = useDispatch();

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
    backgroundColor: "#ffffff",
    alignItems: "center",
    // justifyContent: "space-between",
  },
  title: {
    width: "80%",
    fontSize: 38,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
    marginTop: 30,
  },
  connexion: {
    width: "100%",
    alignItems: "center",
  },
  inscription: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "80%",
    marginTop: 25,
    borderBottomColor: "#FFA85C",
    borderBottomWidth: 1,
    fontSize: 18,
  },
  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    marginTop: 30,
    backgroundColor: "#FFA85C",
    borderRadius: 10,
    marginBottom: 80,
  },
  textButton: {
    color: "#ffffff",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  line: {
    borderTopWidth: 2,
    borderTopColor: "#07905C",
    width: "70%",
  },
});
