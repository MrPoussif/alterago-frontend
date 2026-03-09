import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { useUser, useSignUp, useSignIn } from "@clerk/clerk-expo";

export default function ConnexionScreen({ navigation }) {
  const dispatch = useDispatch();

  // *** Check if user is already SignedIn
  const { isSignedIn } = useUser();
  useEffect(() => {
    if (isSignedIn) {
      navigation.replace("TabNavigator");
    }
  }, [isSignedIn]);

  const [loading, setLoading] = useState(false);
  // *** Set SignUp function ************************************
  const {
    isLoaded: signUpLoaded,
    signUp,
    setActive: setActiveSignUp,
  } = useSignUp();
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  // HANDLE SIGNUP PRESS
  const onSignUpPress = async () => {
    if (!signUpLoaded) return;

    try {
      setLoading(true);

      const result = await signUp.create({
        emailAddress: signUpEmail,
        password: signUpPassword,
      });
      console.log("RESULTAAAAAT", result);

      await setActiveSignUp({ session: result.createdSessionId });

      navigation.replace("Creation");
    } catch (err) {
      Alert.alert("Sign Up Error", err.errors?.[0]?.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  // *** Set SignIn function ************************************
  const {
    isLoaded: signInLoaded,
    signIn,
    setActive: setActiveSignIn,
  } = useSignIn();
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // HANDLE SIGNIN PRESS
  const onSignInPress = async () => {
    if (!signInLoaded) return;

    try {
      setLoading(true);

      const result = await signIn.create({
        identifier: signInEmail,
        password: signInPassword,
      });

      await setActiveSignIn({ session: result.createdSessionId });

      navigation.replace("TabNavigator");
    } catch (err) {
      Alert.alert("Sign In Error", err.errors?.[0]?.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  if (!signUpLoaded || !signInLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ec6e5b" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Welcome to AlterAgo</Text>
      {/* BLOC DE CONNEXION */}
      <TextInput
        placeholder="Email"
        onChangeText={(value) => setSignInEmail(value)}
        value={signInEmail}
        style={styles.input}
        autoComplete={"email"}
        inputMode={"email"}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(value) => setSignInPassword(value)}
        value={signInPassword}
        style={styles.input}
        autoComplete={"current-password"}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={() => onSignInPress()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
      {/* BLOC DE CREATION DE COMPTE */}
      <TextInput
        placeholder="Email"
        onChangeText={(value) => setSignUpEmail(value)}
        value={signUpEmail}
        style={styles.input}
        autoComplete={"email"}
        inputMode={"email"}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(value) => setSignUpPassword(value)}
        value={signUpPassword}
        style={styles.input}
        autoComplete={"new-password"}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={() => onSignUpPress()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Sign Up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "50%",
  },
  title: {
    width: "80%",
    fontSize: 38,
    fontWeight: "600",
    color: "black",
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
