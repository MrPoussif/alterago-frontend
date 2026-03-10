import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import Header from "../components/common/Header";

export default function RecipeScreen({ navigation }) {
  const { isSignedIn, getToken } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecipe = async () => {
    if (!isSignedIn) {
      Alert.alert(
        "Non connecté",
        "Veuillez vous connecter pour voir les recettes.",
      );
      return;
    }
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch("http://192.168.100.64:3000/recettes/random", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      setRecipe(json.recette);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de récupérer la recette");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Veuillez vous connecter pour accéder aux recettes.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#ec6e5b" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.safeArea}>
      <Header title="RECETTE" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        {recipe ? (
          <>
            <Text style={styles.title}>{recipe.title}</Text>
            {recipe.image && (
              <Image source={{ uri: recipe.image }} style={styles.image} />
            )}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instructions:</Text>
                {recipe.instructions[0].steps?.map((step, i) => (
                  <Text key={i} style={styles.step}>
                    {i + 1}. {step.step}
                  </Text>
                ))}
              </View>
            )}
            <View style={styles.buttonWrapper}>
              <Button
                title="Nouvelle recette"
                onPress={fetchRecipe}
                color="#FFA85C"
              />
            </View>
          </>
        ) : (
          <Text>Aucune recette disponible</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  section: {
    width: "100%",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ec6e5b",
    marginBottom: 5,
  },
  step: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 20,
  },
});
