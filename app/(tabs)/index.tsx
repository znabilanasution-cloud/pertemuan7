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

type Task = {
  id: string;
  title: string;
  done: boolean;
  priority: "HIGH" | "MEDIUM" | "LOW";
};

export default function Index() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "DONE">("ALL");

  const addTask = () => {
    if (task.trim() === "") {
      Alert.alert("Error", "Task tidak boleh kosong!");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: task,
      done: false,
      priority: getRandomPriority(),
    };

    setTasks((prev) => [...prev, newTask]);
    setTask("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const getRandomPriority = (): "HIGH" | "MEDIUM" | "LOW" => {
    const levels: ("HIGH" | "MEDIUM" | "LOW")[] = [
      "HIGH",
      "MEDIUM",
      "LOW",
    ];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  const filteredTasks = tasks.filter((item) => {
    if (filter === "DONE") return item.done;
    if (filter === "ACTIVE") return !item.done;
    return true;
  });

  const completedCount = tasks.filter((t) => t.done).length;

  const renderItem = ({ item }: { item: Task }) => (
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

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addText}>Tambah Task</Text>
        </TouchableOpacity>

        {/* FILTER */}
        <View style={styles.filterContainer}>
          {["ALL", "ACTIVE", "DONE"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                filter === f && styles.activeFilter,
              ]}
              onPress={() => setFilter(f as any)}
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

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return { color: "#ff5252", fontWeight: "bold" };
    case "MEDIUM":
      return { color: "#6e83b6" };
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
  },
  counter: {
    color: "#aaa",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#ddedd9",
    color: "#000000",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#bbd1bc",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  addText: {
    color: "#000000",
    fontWeight: "bold",
  },
  taskItem: {
    backgroundColor: "#e2f8e4",
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskText: {
    color: "#000000",
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
    color: "#ffffff",
    fontWeight: "500",
  },
});