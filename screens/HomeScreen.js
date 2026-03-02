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
