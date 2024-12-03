import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { addTask } from "../AsyncStorage";

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Both title and description are required.");
      return;
    }

    setLoading(true);
    try {
      await addTask({ title, description });
      setLoading(false);
      Alert.alert("Success", "Task added successfully!");
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to add the task. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter task description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAddTask}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  label: { fontSize: 20, color: "#333", marginBottom: 5, fontWeight: 'bold', },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  loader: { marginTop: 20 },
});
