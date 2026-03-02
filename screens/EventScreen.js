import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function EventScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Event Screen</Text>
      {/* <Button
        title="Go to Profile"
        // onPress={() => navigation.navigate("Profile")}
      /> */}
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
