/* eslint-disable */
import React, { Component } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from "react-native";
import { db } from "../helpers/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default class CRUDExample extends Component {
  state = {
    username: "",
    password: '',
    jurusan: "",
    image: '',
    parent: '',
    items: [],
  };

  componentDidMount() {
    this.fetchItems();
  }

  // Fetch data from Firestore
  fetchItems = async () => {
    const itemsRef = collection(db, "items");
    const snapshot = await getDocs(itemsRef);
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    this.setState({ items });
  };

  // Add new item
  addItem = async () => {
    const { name, price } = this.state;
    if (!name || !price) {
      Alert.alert("Error", "Both fields are required!");
      return;
    }
    const itemsRef = collection(db, "items");
    await addDoc(itemsRef, { name, price: parseFloat(price) });
    this.setState({ name: "", price: "" });
    this.fetchItems();
  };

  // Update item
  updateItem = async (id) => {
    const newPrice = prompt("Enter new price:");
    if (!newPrice) return;
    const itemRef = doc(db, "items", id);
    await updateDoc(itemRef, { price: parseFloat(newPrice) });
    this.fetchItems();
  };

  // Delete item
  deleteItem = async (id) => {
    const itemRef = doc(db, "items", id);
    await deleteDoc(itemRef);
    this.fetchItems();
  };

  render() {
    const { name, price, items } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Data User</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => this.setState({ name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Item Price"
          value={price}
          keyboardType="numeric"
          onChangeText={(text) => this.setState({ price: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Item Price"
          value={price}
          keyboardType="numeric"
          onChangeText={(text) => this.setState({ price: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Item Price"
          value={price}
          keyboardType="numeric"
          onChangeText={(text) => this.setState({ price: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Item Price"
          value={price}
          keyboardType="numeric"
          onChangeText={(text) => this.setState({ price: text })}
        />
        <Button title="Add Item" onPress={this.addItem} />

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>
                {item.name} - ${item.price}
              </Text>
              <View style={styles.buttons}>
                <Button title="Edit" onPress={() => this.updateItem(item.id)} />
                <Button title="Delete" onPress={() => this.deleteItem(item.id)} />
              </View>
            </View>
          )}
        />
      </View>
    );
  }
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
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});