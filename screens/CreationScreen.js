import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
// import { useUser } from "@clerk/clerk-expo";
// const { user } = useUser();

export default function CreationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Creation Screen</Text>
      <Button
        title="Validation"
        onPress={() => navigation.navigate("TabNavigator")}
      />
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
