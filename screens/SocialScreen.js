import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../components/common/Header";

export default function SocialScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header
        title="AMIS"
        navigation={navigation}
        showAddFriends={true}
        showVide={false}
      />
      <Text>Social Screen</Text>
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
