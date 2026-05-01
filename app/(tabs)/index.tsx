import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const addTask = () => {
    if (task.trim() === "") {
      Alert.alert("Error", "Task tidak boleh kosong!");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: task,
      done: false,
      priority: getRandomPriority(),
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const toggleDone = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const getRandomPriority = () => {
    const levels = ["HIGH", "MEDIUM", "LOW"];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  const filteredTasks = tasks.filter((item) => {
    if (filter === "DONE") return item.done;
    if (filter === "ACTIVE") return !item.done;
    return true;
  });

  const completedCount = tasks.filter((t) => t.done).length;

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => toggleDone(item.id)}>
        <Text style={[styles.taskText, item.done && styles.doneText]}>
          {item.title}
        </Text>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <Text style={getPriorityStyle(item.priority)}>
          {item.priority}
        </Text>

        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Text style={styles.delete}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>MyTaskList</Text>

        <Text style={styles.counter}>
          {completedCount} selesai dari {tasks.length} task
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Masukkan task..."
          placeholderTextColor="#888"
          value={task}
          onChangeText={setTask}
        />

        {/* 🔥 BUTTON TENGAH + TURUN */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addText}>Tambah Task</Text>
          </TouchableOpacity>
        </View>

        {/* FILTER */}
        <View style={styles.filterContainer}>
          {["ALL", "ACTIVE", "DONE"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                filter === f && styles.activeFilter,
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={styles.filterText}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>Belum ada task 😴</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "HIGH":
      return { color: "#ff5252", fontWeight: "bold" };
    case "MEDIUM":
      return { color: "#ffb300" };
    default:
      return { color: "#4caf50" };
  }
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fbfafa",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7e9682",
    marginBottom: 10,
    textAlign: "center",
  },
  counter: {
    color: "#aaa",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#ddedd9",
    color: "#000000",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonWrapper: {
    marginTop: 50,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#bbd1bc",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "70%",
  },
  addText: {
    color: "#000000",
    fontWeight: "bold",
  },
  taskItem: {
    backgroundColor: "#a28585",
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskText: {
    color: "#99b7a2",
    fontSize: 16,
  },
  doneText: {
    textDecorationLine: "line-through",
    color: "#777",
  },
  delete: {
    marginLeft: 10,
    fontSize: 18,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 30,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  filterBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  activeFilter: {
    backgroundColor: "#4CAF50",
  },
  filterText: {
    color: "#cadbc0",
    fontWeight: "500",
  },
});
