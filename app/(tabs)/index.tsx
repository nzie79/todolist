import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import ikon

const Index = () => {
  const [task, setTask] = useState('');
  const [list, setList] = useState([]);
  const [isEditing, setIsediting] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  const saveTask = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(list));
      console.log('berhasil simpan data');
    } catch (error) {
      console.log('gagal simpan data', error);
    }
  };

  const addTask = () => {
    if (task.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      completed: false,
    };
    setList([...list, newTask]);
    setTask('');
  };

  const handleEdit = () => {
    const updated = list.map(item => item.id === editId
      ? { ...item, title: task.trim() }
      : item
    );

    setList(updated);
    setTask('');
    setIsediting(false);
    setEditId(null);
  };

  const startEdit = (item) => {
    setTask(item.title);
    setIsediting(true);
    setEditId(item.id);
  };

  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved !== null) {
        setList(JSON.parse(saved));
        console.log('berhasil load data');
      }
    } catch (error) {
      console.log('gagal load ', error);
    }
  };

  const deleteTask = (id) => {
    const filtered = list.filter((item) => item.id !== id);
    setList(filtered);
  };

  const toggleComplete = (id) => {
    const updatedList = list.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setList(updatedList);
  };

  return (
    <SafeAreaView style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        📋 To Do List
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginRight: 10,
          }}
          placeholder="Tambahkan tugas..."
          value={task}
          onChangeText={setTask}
        />
    
        <TouchableOpacity 
          onPress={isEditing ? handleEdit : addTask}
          style={{
            backgroundColor: '#4CAF50',
            padding: 10,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          }}
        >
          <Icon name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ marginTop: 20 }}
        data={list}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              padding: 10,
              backgroundColor: '#f8f8f8',
              borderRadius: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
          >
            <TouchableOpacity onPress={() => toggleComplete(item.id)}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderWidth: 1,
                  borderColor: '#555',
                  marginRight: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: item.completed ? '#4CAF50' : '#fff',
                }}
              >
                {item.completed && (
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
            </TouchableOpacity>

            <Text
              style={{
                textDecorationLine: item.completed ? 'line-through' : 'none',
                color: item.completed ? '#888' : '#000',
                flex: 1,
              }}
            >
              {item.title}
            </Text>

          
            <TouchableOpacity onPress={() => startEdit(item)}>
              <Icon name="edit" size={20} color="blue" style={{ marginRight: 10 }} />
            </TouchableOpacity>

           
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Icon name="trash" size={20} color="red" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default Index;
