import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";  // Import FontAwesome

const TugasKu = () => {
  const [task, setTask] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [kategori, setKategori] = useState("PR");
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [list]);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tugasList", JSON.stringify(list));
    } catch (error) {
      console.log("Gagal simpan data:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem("tugasList");
      if (saved !== null) {
        setList(JSON.parse(saved));
      }
    } catch (error) {
      console.log("Gagal load data:", error);
    }
  };

  const clearInput = () => {
    setTask("");
    setSubject("");
    setDeadline("");
    setKategori("PR");
  };

  const handleAddTask = () => {
    if (task.trim() === "" || subject.trim() === "") {
      Alert.alert("Duh, belum kamu isi");
      return;
    }

    if (task.trim().length < 3) {
      Alert.alert("Huh, 'yang bener kamu input gak ada'");
    }

    const newTask = {
      id: Date.now().toString(),
      task: task.trim(),
      subject: subject.trim(),
      deadline,
      kategori,
      status: "Belum Selesai",
    };

    setList([...list, newTask]);
    clearInput();
  };

  const handleEdit = () => {
    const updated = list.map((item) =>
      item.id === editId
        ? {
            ...item,
            task,
            subject,
            deadline,
            kategori,
          }
        : item
    );

    setList(updated);
    clearInput();
    setIsEditing(false);
    setEditId(null);
  };

  const startEdit = (item) => {
    setTask(item.task);
    setSubject(item.subject);
    setDeadline(item.deadline);
    setKategori(item.kategori);
    setIsEditing(true);
    setEditId(item.id);
  };

  const deleteTask = (id) => {
    const tugas = list.find((item) => item.id === id);

    if (tugas.status === "Selesai") {
      Alert.alert(
        "Konfirmasi Hapus",
        "Apakah kamu yakin ingin menghapus tugas ini?",
        [
          {
            text: "Batal",
            onPress: () => console.log("Penghapusan dibatalkan"),
            style: "cancel",
          },
          {
            text: "Hapus",
            onPress: () => {
              const filtered = list.filter((item) => item.id !== id);
              setList(filtered);
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Tugas belum selesai!",
        "Selesaikan dulu tugasnya sebelum menghapus."
      );
    }
  };

  const markAsDone = (id) => {
    const updated = list.map((item) =>
      item.id === id ? { ...item, status: "Selesai" } : item
    );
    setList(updated);
  };

  return (
    <SafeAreaView style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        📘 TugasKu
      </Text>

      <TextInput
        placeholder="Judul Tugas"
        value={task}
        onChangeText={setTask}
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Mata Pelajaran"
        value={subject}
        onChangeText={setSubject}
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="20 April 2025"
        value={deadline}
        onChangeText={setDeadline}
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      />

      <View style={{ flexDirection: "row", marginBottom: 15 }}>
        {["PR", "Proyek", "Ujian"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setKategori(item)}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: kategori === item ? "blue" : "#aaa",
              borderRadius: 8,
              marginRight: 10,
              backgroundColor: kategori === item ? "#cce5ff" : "#eee",
            }}
          >
            <Text
              style={{ fontWeight: kategori === item ? "bold" : "normal" }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title={isEditing ? "Simpan Edit" : "Tambah Tugas"}
        onPress={isEditing ? handleEdit : handleAddTask}
      />

      {list.length === 0 ? (
        <View style={{ marginTop: 50, alignItems: "center" }}>
          <Text style={{ fontSize: 14, fontWeight: "bold", color: "gray" }}>
            YEAY GADA TUGAS KAMU
          </Text>
        </View>
      ) : (
        <>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            Ada tugas ni kamu
          </Text>
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 15,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  marginBottom: 15,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.task}</Text>
                <Text style={{ fontSize: 14, marginTop: 4 }}>
                  {item.subject}
                </Text>
                <Text style={{ fontSize: 14, marginTop: 4 }}>
               {item.deadline}
                </Text>
                <Text style={{ fontSize: 14, marginTop: 4 }}>
                  Kategori: {item.kategori}
                </Text>
                <Text style={{ fontSize: 14, marginTop: 4 }}>
                  Status: {item.status}
                </Text>

                <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
                  {item.status !== "Selesai" && (
                    <TouchableOpacity
                      onPress={() => markAsDone(item.id)}
                      style={{
                        backgroundColor: "#2e7d32",
                        padding: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: "white" }}>
                        <Icon name="check" size={16} /> 
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => startEdit(item)}
                    style={{
                      backgroundColor: "#1565c0",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "white" }}>
                      <Icon name="edit" size={16} />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteTask(item.id)}
                    disabled={item.status !== "Selesai"}
                    style={{
                      backgroundColor:
                        item.status === "Selesai" ? "#c62828" : "#aaa",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "white" }}>
                      <Icon name="trash" size={16} /> 
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default TugasKu;
