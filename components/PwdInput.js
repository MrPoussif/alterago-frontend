import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function PwdInput(props) {
  const [iconName, setIconName] = useState("eye-slash");
  const [hidden, setHidden] = useState(true);
  const handleHidePress = () => {
    iconName === "eye-slash" ? setIconName("eye") : setIconName("eye-slash");
    hidden === true ? setHidden(false) : setHidden(true);
  };
  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder={props.placeholder}
        onChangeText={(value) => props.setPwd(value)}
        value={props.value}
        autoComplete={props.autoComplete}
        secureTextEntry={hidden}
      ></TextInput>
      <TouchableOpacity onPress={() => handleHidePress()}>
        <FontAwesome name={iconName} size={20} color={"#07905C"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginRight: 30,
  },
});
