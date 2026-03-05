import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Screens
import ConnexionScreen from "./screens/ConnexionScreen";
import CreationScreen from "./screens/CreationScreen";
import SocialScreen from "./screens/SocialScreen";
import EventScreen from "./screens/EventScreen";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import SettingsScreen from "./screens/SettingsScreen";
import RecipeScreen from "./screens/RecipeScreen";

// Redux
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import defis from "./reducers/defis";

// Clerk
import { ClerkProvider, tokenCache } from "@clerk/clerk-expo";

// Création du store Redux
const store = configureStore({
  reducer: {
    user,
    defis,
  },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Event") iconName = "map";
          else if (route.name === "Social") iconName = "users";

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
      {/* Recipe garde la tab bar mais n'apparaît pas dans les onglets */}
      <Tab.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{
          tabBarButton: () => null, // ← cache l'onglet sans retirer l'écran
        }}
      />
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{
          tabBarButton: () => null, // ← cache l'onglet sans retirer l'écran
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarButton: () => null, // ← cache l'onglet sans retirer l'écran
        }}
      />
    </Tab.Navigator>
  );
};

// Composant principal App
export default function App() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <Provider store={store}>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* Utilisateur NON connecté */}
              <Stack.Screen name="Connexion" component={ConnexionScreen} />
              <Stack.Screen name="Creation" component={CreationScreen} />

              {/* Utilisateur connecté */}
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen name="Game" component={GameScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
