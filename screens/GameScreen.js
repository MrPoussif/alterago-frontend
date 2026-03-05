import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import MemoryGame from "../components/MemoryGame";

export default function GameScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MemoryGame />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#060d1f", // même couleur que le fond du jeu
  },
  container: {
    flex: 1,
  },
});
