import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler'; // <--- Kaydırma kütüphanesi

const TaskItem = ({ item, onToggle, onDelete }: any) => {

  // Kaydırınca sağdan çıkacak olan Kırmızı Kutu tasarımı
  const renderRightActions = (progress: any, dragX: any) => {
    return (
      <TouchableOpacity onPress={() => onDelete(item.key)} style={styles.deleteButtonContainer}>
        <View style={styles.deleteButtonContent}>
          <Ionicons name="trash" size={30} color="white" />
          <Text style={styles.deleteText}>Sil</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    // Swipeable bileşeni, içeriği sarmalar ve kaydırma özelliği katar
    <Swipeable renderRightActions={renderRightActions}>
      
      <View style={[styles.box, item.isCompleted && styles.completedBox]}>
        
        {/* Yazı Alanı */}
        <Text style={[styles.text, item.isCompleted && styles.textCompleted]}>
          {item.value}
        </Text>

        {/* Sadece Tamamlama Butonu Kaldı (Silme butonu kaydırınca çıkacak) */}
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => onToggle(item.key)}>
            <Ionicons
              name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"}
              size={28}
              color={item.isCompleted ? "green" : "gray"}
            />
          </TouchableOpacity>
        </View>

      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 15,
    backgroundColor: '#c7ecee',
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Swipeable içinde düzgün görünmesi için yükseklik ayarı
    height: 70, 
  },
  completedBox: {
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 16,
    color: 'black',
    maxWidth: '80%'
  },
  textCompleted: {
    color: 'gray',
    textDecorationLine: 'line-through'
  },
  iconContainer: {
    flexDirection: 'row',
  },
  // --- KAYDIRINCA ÇIKAN KIRMIZI ALAN ---
  deleteButtonContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end', // İkonu sağa yasla
    marginBottom: 10, // Kutu ile aynı hizada olsun
    borderRadius: 10,
    width: 100, // Ne kadar kaydırınca tam açılsın
    height: 70, // Kutu yüksekliğiyle aynı
  },
  deleteButtonContent: {
    paddingRight: 20, // Sağa yaslı ikon için boşluk
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export default TaskItem;