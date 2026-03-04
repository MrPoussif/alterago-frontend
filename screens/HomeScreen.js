import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-expo";

import DefiItem from "../components/DefiItem";
import AjoutDefiModal from "../components/AjoutDefiModal";

import {
  modifierValeur,
  ajouterDefi,
  supprimerDefi,
  selectTousLesDefis,
} from "../reducers/defis";

export default function HomeScreen({ navigation }) {
  const utilisateur = useSelector((state) => state.user.value);
  const defisFixes = useSelector((state) => state.defis.fixes);
  const tousLesDefis = useSelector(selectTousLesDefis);

  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [nomNouveauDefi, setNomNouveauDefi] = useState("");

  useEffect(() => {
    async function recupererToken() {
      const token = await getToken();
      console.log("Token Clerk :", token);
    }
    recupererToken();
  }, []);

  const handleAjouter = () => {
    if (nomNouveauDefi.trim() === "") return;

    dispatch(ajouterDefi({ nom: nomNouveauDefi }));

    setNomNouveauDefi("");
    setModalVisible(false);
  };

  return (
    <View style={styles.conteneur}>
      <Text style={styles.titre}>Accueil</Text>
      <Text>Bienvenue {utilisateur.nickname}</Text>

      <ScrollView style={{ flex: 1, width: "100%" }}>
        {tousLesDefis.map((defi, index) => {
          const estPersonnalise = index >= defisFixes.length;
          const pas = defi.pas ? defi.pas : 10;

          return (
            <DefiItem
              key={defi.id}
              defi={defi}
              estPersonnalise={estPersonnalise}
              onIncrement={() =>
                dispatch(modifierValeur({ id: defi.id, delta: pas }))
              }
              onDecrement={() =>
                dispatch(modifierValeur({ id: defi.id, delta: -pas }))
              }
              onDelete={() => dispatch(supprimerDefi({ id: defi.id }))}
            />
          );
        })}
      </ScrollView>

      <View style={styles.boutonsBas}>
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
        <Button title="Ajouter un défi" onPress={() => setModalVisible(true)} />
      </View>

      <AjoutDefiModal
        visible={modalVisible}
        nom={nomNouveauDefi}
        setNom={setNomNouveauDefi}
        onAjouter={handleAjouter}
        onFermer={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  titre: {
    fontSize: 20,
    fontWeight: "bold",
  },
  boutonsBas: {
    marginTop: 20,
    width: "60%",
    justifyContent: "center",
  },
});
