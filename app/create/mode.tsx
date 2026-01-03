import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../store/gameStore';

export default function CreatorStep2() {
    const router = useRouter();
    const { setCreatorMode } = useGameStore();

    const handleSelect = (mode: 'RANDOM' | 'CUSTOM') => {
        setCreatorMode(mode);
        if (mode === 'RANDOM') {
            // Immediately start random game
            const { loadCustomLevel } = useGameStore.getState();
            loadCustomLevel();
            router.push('/game/custom');
        } else {
            router.push('/create/design');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose Mode</Text>
            <View style={styles.steps}><Text style={styles.step}>1 — </Text><Text style={styles.stepActive}>2</Text><Text style={styles.step}> — 3</Text></View>

            <Text style={styles.subtitle}>How do you want to arrange images?</Text>

            <View style={styles.options}>
                <TouchableOpacity onPress={() => handleSelect('RANDOM')} style={styles.card}>
                    <Text style={styles.emoji}>🎲</Text>
                    <Text style={styles.cardTitle}>Random</Text>
                    <Text style={styles.cardDesc}>System randomly arranges images each round.</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleSelect('CUSTOM')} style={styles.card}>
                    <Text style={styles.emoji}>🎯</Text>
                    <Text style={styles.cardTitle}>Custom Layout</Text>
                    <Text style={styles.cardDesc}>You design exactly which image goes in each slot.</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FAF9F6',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    steps: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    stepActive: {
        fontWeight: 'bold',
        color: '#4CAF50',
        fontSize: 18,
    },
    step: {
        fontSize: 18,
        color: '#ccc',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    options: {
        width: '100%',
        gap: 20,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#eee',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    emoji: {
        fontSize: 40,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardDesc: {
        textAlign: 'center',
        color: '#666',
    },
});
