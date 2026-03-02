import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function CreationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Creation Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
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
