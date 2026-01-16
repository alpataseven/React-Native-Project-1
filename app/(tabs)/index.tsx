import TaskItem from '@/components/TaskItem';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react'; // useRef eklendi
import { ActivityIndicator, Animated, FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'; // Animated ve Easing eklendi

export default function HomeScreen() {

  const [task, setTask] = useState("")
  const [array, setArray] = useState<{ key: string; value: string; isCompleted: boolean }[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [isIntroVisible, setIsIntroVisible] = useState(true);

  // ANİMASYON DEĞERLERİ
  // 1. Opaklık (Görünürlük) 0'dan başlayacak
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  // 2. Büyüklük (Scale) 0.8'den başlayacak
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    loadData();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // Tam görünür ol
        duration: 1000, // 1 saniye sürsün
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1, // Normal boyutuna gel (yaylanarak)
        friction: 5, // Yaylanma sertliği
        useNativeDriver: true,
      })
    ]).start();

    // 3 saniye sonra intro'yu kapat
    const timer = setTimeout(() => {
      setIsIntroVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [])

  // VERİYİ YÜKLEME ve KAYDETME FONKSİYONLARI
  const loadData = async () => { try {const jsonValue = await AsyncStorage.getItem('tasks'); if (jsonValue != null) setArray(JSON.parse(jsonValue));} catch (e) { console.log(e); }}
  const saveData = async (newArray: any) => {try {const jsonValue = JSON.stringify(newArray); await AsyncStorage.setItem('tasks', jsonValue);} catch (e) { console.log(e); }}
  const addTask = () => {if (task.length === 0) return; const newArray = [...array, { key: Date.now().toString(), value: task, isCompleted: false }]; setArray(newArray); saveData(newArray); setTask(""); setModalVisible(false); }
  const toggleComplete = (id: string) => {const newArray = array.map(item => item.key === id ? { ...item, isCompleted: !item.isCompleted } : item ); setArray(newArray); saveData(newArray); }
  const removeTask = (key: string) => {const newArray = array.filter(item => item.key !== key); setArray(newArray); saveData(newArray); }


  // --- LOGO TASARIMLI INTRO EKRANI ---
  if (isIntroVisible) {
    return (
      <View style={styles.introContainer}>
        {/* Mavi Arka Plan */}
        
        <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }],
            alignItems: 'center' 
        }}>
          
          <View style={styles.logoCircle}>
            <Ionicons name="checkmark-done" size={80} color="#2196F3" />
          </View>

          <Text style={styles.introTitle}>To Do List</Text>
          
          <Text style={styles.introSubtitle}>Verimli ol. Planlı yaşa.</Text>

        </Animated.View>

        <View style={styles.loadingContainer}>
           <ActivityIndicator size="small" color="white" />
        </View>
        
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerRight: () => (
            <Link href="/Settings" asChild>
              <TouchableOpacity>
                <Ionicons name="settings-outline" size={24} color="#000" />
              </TouchableOpacity>
            </Link>
          ),
        }} 
      />

      <FlatList
        data={array}
        renderItem={({ item }) => (
          <TaskItem item={item} onToggle={toggleComplete} onDelete={removeTask} />
        )}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }} 
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Yeni Görev Ekle</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Ne Yapacaksın?"
          onChangeText={setTask}
          value={task}
          autoFocus={true}
        />
        
        <View style={styles.modalButtons}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={[styles.button, styles.buttonCancel]}
          >
            <Text style={{color: 'black'}}>Vazgeç</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={addTask}
            style={[styles.button, styles.buttonSave]}
          >
            <Text style={{color: 'white', fontWeight: 'bold'}}>Kaydet</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>

  </KeyboardAvoidingView>
  {/* YENİ KISIM BİTİYOR */}
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- YENİ LOGO STİLLERİ ---
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3', // TAM EKRAN MAVİ
  },
  logoCircle: {
    width: 140,
    height: 140,
    backgroundColor: 'white', // Beyaz daire
    borderRadius: 70, // Tam yuvarlak
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Hafif gölge efekti
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  introTitle: {
    fontSize: 42,
    fontWeight: '900', // Çok kalın font
    color: 'white',
    letterSpacing: 1, // Harf aralığını açtık
  },
  introSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255, 0.8)', // Hafif saydam beyaz
    marginTop: 5,
    fontWeight: '500',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 50, // Ekranın en altına sabitle
  },

  // --- MEVCUT DİĞER STİLLER (Aynı kalacak) ---
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center', elevation: 5, zIndex: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16, backgroundColor: '#f9f9f9' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  button: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonCancel: { backgroundColor: '#ddd' },
  buttonSave: { backgroundColor: '#2196F3' }
});