import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {

  const [task, setTask] = useState("");
  const [array, setArray] = useState<{ key: string; value: string; isCompleted: boolean }[]>([])

  // Uygulama açılınca verileri çek
  useEffect(() => {
    loadData();
  }, [])

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('tasks')
      if (jsonValue != null) {
        setArray(JSON.parse(jsonValue));
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  // Verileri telefona kaydet
  const saveData = async (newArray: any) => {
    try {
      const jsonValue = JSON.stringify(newArray);
      await AsyncStorage.setItem('tasks', jsonValue);
    }
    catch (e) {
      console.log(e);
    }
  }

  const addTask = () => {
    if (task.length === 0) return;

    const newArray = [...array, {
      key: Date.now().toString(),
      value: task,
      isCompleted: false
    }];

    setArray(newArray); // Ekranı güncelle
    saveData(newArray); // Hafızaya kaydet
    setTask("");
  }

  const toggleComplete = (id: string) => {
    const newArray = array.map(item =>
      item.key === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setArray(newArray);
    saveData(newArray);
  }

  const removeTask = (key: string) => {
    const newArray = array.filter(item => item.key !== key);
    setArray(newArray);
    saveData(newArray);
  }

  return (
    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Görev Ekle'
          onChangeText={setTask}
          value={task}
        />
        <View>
          <Button  style={styles.btn} title="Ekle" onPress={addTask} />
        </View>
      </View>

      <FlatList
        data={array}
        renderItem={({ item }) => (
          // Alert tetikleyen TouchableOpacity kaldırıldı, sadece View kaldı
          <View style={[styles.box, item.isCompleted && styles.completedBox]}>
            
            <Text style={[styles.text, item.isCompleted && styles.textCompleted]}>
              {item.value}
            </Text>

            <View style={styles.iconContainer}>
              
              <TouchableOpacity onPress={() => toggleComplete(item.key)}>
                <Ionicons
                  name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"}
                  size={28}
                  color={item.isCompleted ? "green" : "gray"}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => removeTask(item.key)} style={{ marginLeft: 10 }}>
                <Ionicons name="trash" size={28} color="red" />
              </TouchableOpacity>

            </View>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  box: {
    padding: 15,
    backgroundColor: '#c7ecee',
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  completedBox: {
    backgroundColor: '#f0f0f0',
  },
  input: {
    width: '75%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    padding: 10,
  },
  text: {
    fontSize: 16,
    color: 'black',
    maxWidth: '70%'
  },
  textCompleted: {
    color: 'gray',
    textDecorationLine: 'line-through'
  },
  iconContainer: {
    flexDirection: 'row',
  },
  btn: {
    borderRadius: 50, 
  }
});