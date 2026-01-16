import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is the Settings Screen</Text>
            <Text style={styles.subText}>Buraya ileride tema rengi, bildirim ayarları vb. koyacağız.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ekranı kapla
        justifyContent: 'center', // Dikeyde ortala
        alignItems: 'center', // Yatayda ortala
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        paddingHorizontal: 20,
    }
});

