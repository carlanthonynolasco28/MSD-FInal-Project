import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getTasks, deleteTask } from "../AsyncStorage";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); 
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchTasks);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteTask(id);
              const updatedTasks = tasks.filter((task) => task.id !== id);
              setTasks(updatedTasks);
              setFilteredTasks(updatedTasks);
              Alert.alert("Success", "Task deleted successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to delete the task. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    const lowercasedKeyword = keyword.toLowerCase();
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowercasedKeyword) ||
        task.description.toLowerCase().includes(lowercasedKeyword)
    );
    setFilteredTasks(filtered);
  };

  const handleFilter = (status) => {
    setStatusFilter(status);
    if (status === "all") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.status === status);
      setFilteredTasks(filtered);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search and Filter Section */}
      <View style={styles.searchFilterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchKeyword}
          onChangeText={handleSearch}
        />
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "all" && styles.activeFilterButton,
            ]}
            onPress={() => handleFilter("all")}
          >
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "completed" && styles.activeFilterButton,
            ]}
            onPress={() => handleFilter("completed")}
          >
            <Text style={styles.filterButtonText}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "pending" && styles.activeFilterButton,
            ]}
            onPress={() => handleFilter("pending")}
          >
            <Text style={styles.filterButtonText}>Pending</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("EditTask", { task: item })}
            >
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <Text style={styles.taskStatus}>
                    {item.status === "completed" ? "✓ Completed" : "⏳ Pending"}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks match your criteria.</Text>
            </View>
          }
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTask")}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8", padding: 10 },
  searchFilterContainer: { marginBottom: 20 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  filterContainer: { flexDirection: "row", justifyContent: "space-between" },
  filterButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  activeFilterButton: { backgroundColor: "#007bff" },
  filterButtonText: { color: "#333", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: { fontSize: 16, color: "#333", fontWeight: "bold" },
  taskStatus: { fontSize: 14, color: "#666" },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 20,
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: { fontSize: 16, color: "#888" },
});
