import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Header({
  title,
  navigation,
  showSettings = true,
  showAddFriends = false,
  showVide = true,
}) {
  return (
    <View style={styles.header}>
      {showVide && <View style={{ width: 30 }} />}
      {showAddFriends && (
        <TouchableOpacity onPress={() => navigation.navigate("addFriends")}>
          <FontAwesome6 name="square-plus" size={30} color="#FFA85C" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {showSettings && (
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <FontAwesome6 name="gear" size={30} color="#79ADDC" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 30,
    paddingBottom: 5,
    // marginBottom: 30,
    backgroundColor: "#1B4965",
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
    height: 70,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "700",
    color: "#79ADDC",
  },
});
