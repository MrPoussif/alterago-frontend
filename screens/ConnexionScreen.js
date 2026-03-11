import { useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Button,
} from "react-native";
import Header from "../components/common/Header";
import SignInModal from "../components/SignInModal";
import SignUpModal from "../components/SignUpModal";
import { useUser } from "@clerk/clerk-expo";

export default function ConnexionScreen({ navigation }) {
  const [signInVisible, setSignInVisible] = useState(false);
  const [signUpVisible, setSignUpVisible] = useState(false);

  // *** Check if user is already SignedIn
  // const { isSignedIn } = useUser();
  // useEffect(() => {
  //   if (isSignedIn) {
  //     navigation.replace("TabNavigator");
  //   }
  // }, [isSignedIn]);
  const sheetRef1 = useRef(null);
  const sheetRef2 = useRef(null);

  const snapPoints = useMemo(() => ["25%", "50%"], []);

  return (
    <View style={styles.container}>
      <Button
        title="Ouvrir Bottom Sheet 1"
        onPress={() => sheetRef1.current?.expand()}
      />
      <Button
        title="Ouvrir Bottom Sheet 2"
        onPress={() => sheetRef2.current?.expand()}
      />

      {/* Bottom Sheet 1 */}
      <BottomSheet
        ref={sheetRef1}
        index={-1} // -1 = fermé au départ
        snapPoints={snapPoints}
      >
        <View style={styles.content}>
          <Text>Contenu du Bottom Sheet 1</Text>
          <Button title="Fermer" onPress={() => sheetRef1.current?.close()} />
        </View>
      </BottomSheet>

      {/* Bottom Sheet 2 */}
      {/* <BottomSheet ref={sheetRef2} index={-1} snapPoints={snapPoints}>
        <View style={styles.content}>
          <Text>Contenu du Bottom Sheet 2</Text>
          <Button title="Fermer" onPress={() => sheetRef2.current?.close()} />
        </View>
      </BottomSheet> */}
    </View>
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
