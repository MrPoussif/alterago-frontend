import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function SocialScreen() {
  const user = useSelector((state) => state.user.value);

  const [usersBDD, setUsersBDD] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");

  // utilisateurs fictifs
  const usersFake = [
    { id: "f1", nickname: "Alice" },
    { id: "f2", nickname: "Bob" },
    { id: "f3", nickname: "Charlie" },
  ];

  // récupérer utilisateurs MongoDB
  useEffect(() => {
    fetch("http://TON_IP:3000/users")
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setUsersBDD(data.users);
        }
      });
  }, []);

  // fusion des listes
  const allUsers = [...usersFake, ...usersBDD];

  // filtrer avec recherche
  const filteredUsers = allUsers.filter((user) =>
    user.nickname.toLowerCase().includes(search.toLowerCase()),
  );

  // ajouter ami
  const addFriend = (friend) => {
    fetch("http://TON_IP:3000/users/addFriend", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.userId,
        friendId: friend._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setFriends([...friends, friend]);
        }
      });
  };

  // supprimer ami
  const removeFriend = (friend) => {
    fetch("http://TON_IP:3000/users/removeFriend", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.userId,
        friendId: friend._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setFriends(friends.filter((f) => f._id !== friend._id));
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher utilisateur</Text>

      <TextInput
        style={styles.input}
        placeholder="Rechercher..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id || item._id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.name}>{item.nickname}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => addFriend(item)}
            >
              <Text style={styles.buttonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.title}>Mes amis</Text>

      {friends.map((friend, index) => (
        <View key={index} style={styles.userCard}>
          <Text>{friend.nickname}</Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeFriend(friend)}
          >
            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },

  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#eee",
    marginBottom: 10,
    borderRadius: 10,
  },

  name: {
    fontSize: 16,
  },

  button: {
    backgroundColor: "#ec6e5b",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
  },

  deleteButton: {
    backgroundColor: "#333",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
  },

  buttonText: {
    color: "white",
  },
});
