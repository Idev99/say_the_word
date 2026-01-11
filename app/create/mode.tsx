import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../store/gameStore';
import { translations } from '../../constants/translations';

export default function CreatorStep2() {
    const router = useRouter();
    const { setCreatorMode, language } = useGameStore();
    const t = translations[language].creator;

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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{t.back}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>{t.modeTitle}</Text>
            <View style={styles.steps}><Text style={styles.step}>1 — </Text><Text style={styles.stepActive}>2</Text><Text style={styles.step}> — 3</Text></View>

            <Text style={styles.subtitle}>{t.modeSubtitle}</Text>

            <View style={styles.options}>
                <TouchableOpacity onPress={() => handleSelect('RANDOM')} style={styles.card}>
                    <Text style={styles.emoji}>🎲</Text>
                    <Text style={styles.cardTitle}>{t.randomTitle}</Text>
                    <Text style={styles.cardDesc}>{t.randomDesc}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleSelect('CUSTOM')} style={styles.card}>
                    <Text style={styles.emoji}>🎯</Text>
                    <Text style={styles.cardTitle}>{t.customTitle}</Text>
                    <Text style={styles.cardDesc}>{t.customDesc}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
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
