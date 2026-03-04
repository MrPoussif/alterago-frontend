import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      {/* <Button
        title="Go to Profile"
        onPress={() => navigation.navigate("Profile")}
      /> */}
      <View style={{ height: 10 }} />
      <Button
        title="Changer de mot de passe"
        onPress={() => navigation.navigate("")}
      />
      <View style={{ height: 10 }} />
      <Button title="Changer de mail" onPress={() => navigation.navigate("")} />
      <View style={{ height: 10 }} />
      <Button title="Déconnexion" onPress={() => navigation.navigate("")} />
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
