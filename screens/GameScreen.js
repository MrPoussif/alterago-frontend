import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import MemoryGame from "../components/MemoryGame";

export default function GameScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Game Screen</Text>
      {/* <Button
        title="Go to Profile"
        // onPress={() => navigation.navigate("Profile")}
      /> */}
      <MemoryGame />
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
