import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function SocialScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {" "}
      <Text>Social Screen</Text>{" "}
      {/* <Button title="Go to Profile" // onPress={() => navigation.navigate("Profile")} /> */}{" "}
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
});
