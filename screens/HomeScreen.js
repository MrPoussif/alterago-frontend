import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { userSlice } from "../reducers/user";
import { useSelector } from "react-redux";

export default function HomeScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>Welcome {user.nickname}</Text>
      <View style={styles.buttons}>
        <Button title="Jouer" onPress={() => navigation.navigate("Game")} />
        <View style={{ height: 10 }} />
        <Button
          title="Paramètres"
          onPress={() => navigation.navigate("Settings")}
        />
        <View style={{ height: 10 }} />
        <Button
          title="Recette du jour"
          onPress={() => navigation.navigate("Recipe")}
        />
        <View style={{ height: 10 }} />
        <Button
          title="Ajouter un défi"
          onPress={() => navigation.navigate("")}
        />
      </View>
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
  buttons: {
    marginTop: 20,
    width: "60%",
    justifyContent: "center",
  },
});
