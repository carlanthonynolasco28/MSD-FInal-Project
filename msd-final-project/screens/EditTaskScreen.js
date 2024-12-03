import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { updateTask } from "../AsyncStorage";

export default function EditTaskScreen({ route, navigation }) {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required.");
      return;
    }

    setLoading(true);
    try {
      await updateTask({ ...task, title, description });
      setLoading(false);
      Alert.alert("Success", "Task updated successfully!");
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to update the task. Please try again.");
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
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
});
