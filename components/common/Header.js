import { StyleSheet, Text, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.textStyle}>Hello je suis le HEADER</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: { color: "#000000", height: 24 },
  header: {
    height: "20%",
    widht: "100%",
    borderColor: "red",
    borderWidth: 2,
  },
});
