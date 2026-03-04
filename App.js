import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import ConnexionScreen from "./screens/ConnexionScreen";
import CreationScreen from "./screens/CreationScreen";
import SocialScreen from "./screens/SocialScreen";
import EventScreen from "./screens/EventScreen";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import SettingsScreen from "./screens/SettingsScreen";
import RecipeScreen from "./screens/RecipeScreen";

// *** Store redux
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
const store = configureStore({
  reducer: { user },
});

// // *** IMPORT CLERK */
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import * as SecureStore from "expo-secure-store";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// // *** Ajout du token cache
// const tokenCache = {
//   async getToken(key) {
//     try {
//       return await SecureStore.getItemAsync(key);
//     } catch {
//       return null;
//     }
//   },
//   async saveToken(key, value) {
//     try {
//       await SecureStore.setItemAsync(key, value);
//     } catch {}
//   },
// };

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Event") {
            iconName = "map";
          } else if (route.name === "Social") {
            iconName = "users";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ec6e5b",
        tabBarInactiveTintColor: "#335561",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Event" component={EventScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    // <SafeAreaView style={styles.container}>
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Utilisateur NON connecté */}
            <Stack.Screen name="Connexion" component={ConnexionScreen} />
            <Stack.Screen name="Creation" component={CreationScreen} />

            {/* Utilisateur connecté */}
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Recipe" component={RecipeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ClerkProvider>
    // </SafeAreaView>
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
