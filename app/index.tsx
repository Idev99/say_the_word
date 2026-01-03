import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Say The Word{"\n"}On Beat</Text>

            <View style={styles.menu}>
                <TouchableOpacity onPress={() => router.push('/game/numbers')} style={styles.menuButton}>
                    <Text style={styles.menuText}>PLAY FEATURED</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/create')} style={[styles.menuButton, styles.createButton]}>
                    <Text style={styles.menuText}>CREATE CHALLENGE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 60,
        fontStyle: 'italic',
        // In a real app we'd overlay a "marker" texture
    },
    menu: {
        width: '80%',
        gap: 20,
    },
    menuButton: {
        backgroundColor: '#FFEB3B', // Yellow
        padding: 20,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: 'black',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    createButton: {
        backgroundColor: '#4CAF50', // Green
    },
    menuText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
});
