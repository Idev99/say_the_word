import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore, LevelData } from '../../store/gameStore';
import { useBeatController } from '../../hooks/useBeatController';
import { translations } from '../../constants/translations';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import GridSystem from '../../components/game/GridSystem';
import { useEffect, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Mock Data for "Featured" levels
const MOCK_LEVELS: Record<string, LevelData> = {
    'bird': {
        id: 'bird',
        name: 'Bird Butter Bubble',
        rounds: 5,
        images: [
            require('../../assets/images/bird.png'),
            require('../../assets/images/butter.png'),
            require('../../assets/images/bubble.png'),
            require('../../assets/images/baby.png'),
        ]
    },
    'numbers': {
        id: 'numbers',
        name: 'Numbers 1-8',
        rounds: 5,
        images: [
            require('../../assets/images/1.png'),
            require('../../assets/images/2.png'),
            require('../../assets/images/3.png'),
            require('../../assets/images/4.png'),
        ]
    },
    'colors': {
        id: 'colors',
        name: 'Colors',
        rounds: 5,
        images: [
            require('../../assets/images/red.png'),
            require('../../assets/images/blue.png'),
            require('../../assets/images/green.png'),
            require('../../assets/images/yellow.png'),
        ]
    },
    'country': {
        id: 'country',
        name: 'Country Road C-Pack',
        rounds: 5,
        images: [
            require('../../assets/images/russia.png'),
            require('../../assets/images/ukraine.png'),
            require('../../assets/images/usa.png'),
            require('../../assets/images/china.png'),
        ]
    }
};

export default function GameScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { loadLevel, startRound, currentLevel, currentBeat, currentRound, isPlaying, stopGame, language, restartGame } = useGameStore();
    const { playSound, stopAllSounds } = useSoundEffects();
    const t = translations[language].game;

    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraOn, setIsCameraOn] = useState(false);

    // Initialize Loop
    useBeatController();

    useEffect(() => {
        if (id === 'custom') {
            // Already loaded via loadCustomLevel() in the creator screens
            // Just ensure we don't overwrite it
        } else if (typeof id === 'string' && MOCK_LEVELS[id]) {
            loadLevel(MOCK_LEVELS[id]);
        }
    }, [id, loadLevel]);

    const toggleCamera = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (granted) setIsCameraOn(!isCameraOn);
        } else {
            setIsCameraOn(!isCameraOn);
        }
    };

    const handleStart = () => {
        if (currentLevel && currentRound >= currentLevel.rounds && !isPlaying) {
            restartGame();
        } else {
            startRound();
        }
    };

    const handleBack = () => {
        stopAllSounds();
        stopGame();
        router.back();
    };

    if (!currentLevel) {
        return <View style={styles.container}><Text>{t.loading}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.buttonSmall}>
                    <Text style={styles.buttonText}>{t.back}</Text>
                </TouchableOpacity>

                <Text style={styles.roundText}>{t.round} {currentRound}/{currentLevel.rounds}</Text>

                <TouchableOpacity onPress={toggleCamera} style={[styles.buttonSmall, isCameraOn && styles.buttonActive]}>
                    <Text style={styles.buttonText}>{isCameraOn ? t.camOn : t.camOff}</Text>
                </TouchableOpacity>
            </View>

            {/* Camera Background - Mobile Only */}
            {isCameraOn && Platform.OS !== 'web' && (
                <CameraView style={StyleSheet.absoluteFillObject} facing="front" />
            )}

            <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
                <View style={styles.gameArea}>
                    <GridSystem key={currentRound} level={currentLevel} activeBeat={currentBeat} />
                </View>

                {!isPlaying && (
                    <TouchableOpacity onPress={handleStart} style={styles.startButton}>
                        <Text style={styles.startButtonText}>{t.start}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100, // Space for header
    },
    header: {
        position: 'absolute',
        top: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    roundText: {
        fontFamily: 'System', // Replace with custom hand-drawn font if available
        fontSize: 24,
        fontWeight: '900',
        fontStyle: 'italic',
    },
    gameArea: {
        width: '100%',
        maxWidth: 500, // Constrain width for better layout on wide screens
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        marginTop: 50,
        paddingVertical: 15,
        paddingHorizontal: 40,
        backgroundColor: '#FFEB3B',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 10,
        // Add "messy" border radius later
    },
    startButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonSmall: {
        padding: 10,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        backgroundColor: 'white',
    },
    buttonActive: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        fontWeight: 'bold',
    }
});
