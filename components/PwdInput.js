import { StyleSheet, Text, View, TextInput } from "react-native";

export default function PwdInput(props) {
  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
        onChangeText={(value) => setNewPwd(value)}
        value={newPwd}
        autoComplete={"new-password"}
        secureTextEntry={true}
      ></TextInput>
      <FontAwesome name={"eye-slash"} size={20} color={"#07905C"} />
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
  inputRow: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "70%",
    paddingBottom: 5,
    borderBottomColor: "#07905C",
    borderBottomWidth: 1,
    fontSize: 15,
    marginRight: 10,
  },
});
