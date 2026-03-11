import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Screens
import ConnexionScreen from "./screens/ConnexionScreen";
import CreationScreen from "./screens/CreationScreen";
import SocialScreen from "./screens/SocialScreen";
import EventScreen from "./screens/EventScreen";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import SettingsScreen from "./screens/SettingsScreen";
import RecipeScreen from "./screens/RecipeScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import FavoriteDetailScreen from "./screens/FavoriteDetailScreen";

// Redux
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import defis from "./reducers/defis";

// Clerk
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

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

      <Tab.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{ tabBarButton: () => null }}
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
          <GestureHandlerRootView>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Connexion" component={ConnexionScreen} />
                <Stack.Screen name="Creation" component={CreationScreen} />
                <Stack.Screen name="TabNavigator" component={TabNavigator} />
                <Stack.Screen name="Game" component={GameScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen
                  name="FavoriteDetail"
                  component={FavoriteDetailScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </GestureHandlerRootView>
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
