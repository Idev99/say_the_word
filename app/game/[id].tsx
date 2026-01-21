import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Modal, Switch, Animated, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore, LevelData } from '../../store/gameStore';
import { useBeatController } from '../../hooks/useBeatController';
import { translations } from '../../constants/translations';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import GridSystem from '../../components/game/GridSystem';
import { useEffect, useState, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { AdManager, AD_UNITS } from '../../utils/AdManager';
import { BannerAd, BannerAdSize } from '../../components/AdBanner';
import { Ionicons } from '@expo/vector-icons';

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
        ],
        imageNames: {
            [require('../../assets/images/bird.png')]: "bird",
            [require('../../assets/images/butter.png')]: "butter",
            [require('../../assets/images/bubble.png')]: "bubble",
            [require('../../assets/images/baby.png')]: "baby",
        }
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
        ],
        imageNames: {
            [require('../../assets/images/1.png')]: "1",
            [require('../../assets/images/2.png')]: "2",
            [require('../../assets/images/3.png')]: "3",
            [require('../../assets/images/4.png')]: "4",
        }
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
        ],
        imageNames: {
            [require('../../assets/images/red.png')]: "red",
            [require('../../assets/images/blue.png')]: "blue",
            [require('../../assets/images/green.png')]: "green",
            [require('../../assets/images/yellow.png')]: "yellow",
        }
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
        ],
        imageNames: {
            [require('../../assets/images/russia.png')]: "russia",
            [require('../../assets/images/ukraine.png')]: "ukraine",
            [require('../../assets/images/usa.png')]: "usa",
            [require('../../assets/images/china.png')]: "china",
        }
    },
    'influencers': {
        id: 'influencers',
        name: 'Influencers Pack',
        rounds: 5,
        images: [
            require('../../assets/images/billy.png'),
            require('../../assets/images/squeezie.png'),
            require('../../assets/images/biaggi.png'),
        ],
        imageNames: {
            [require('../../assets/images/billy.png')]: "billy",
            [require('../../assets/images/squeezie.png')]: "squeezie",
            [require('../../assets/images/biaggi.png')]: "biaggi",
        }
    },
    'pomme': {
        id: 'pomme',
        name: 'Pomme Tarte Cheval Mouche',
        rounds: 5,
        images: [
            require('../../assets/images/apple.png'),
            require('../../assets/images/pie.png'),
            require('../../assets/images/horse.png'),
            require('../../assets/images/fly.png'),
        ],
        imageNames: {
            [require('../../assets/images/apple.png')]: "pomme",
            [require('../../assets/images/pie.png')]: "tarte",
            [require('../../assets/images/horse.png')]: "cheval",
            [require('../../assets/images/fly.png')]: "mouche",
        }
    },
    'mozzarella': {
        id: 'mozzarella',
        name: 'Mozarella Cendrillon Parapluie',
        rounds: 5,
        images: [
            require('../../assets/images/mozzarella.png'),
            require('../../assets/images/cinderella.png'),
            require('../../assets/images/umbrella.png'),
        ],
        imageNames: {
            [require('../../assets/images/mozzarella.png')]: "mozarella",
            [require('../../assets/images/cinderella.png')]: "cendrillon",
            [require('../../assets/images/umbrella.png')]: "parapluie",
        }
    },
    'yummy': {
        id: 'yummy',
        name: 'Yummy Feast',
        rounds: 5,
        images: [
            require('../../assets/images/steak.png'),
            require('../../assets/images/watermelon.png'),
            require('../../assets/images/cake.png'),
            require('../../assets/images/coffee.png'),
        ],
        imageNames: {
            [require('../../assets/images/steak.png')]: "steak",
            [require('../../assets/images/watermelon.png')]: "watermelon",
            [require('../../assets/images/cake.png')]: "cake",
            [require('../../assets/images/coffee.png')]: "coffee",
        }
    },
    'travel': {
        id: 'travel',
        name: 'World Travel',
        rounds: 5,
        images: [
            require('../../assets/images/car.png'),
            require('../../assets/images/piscine.png'),
            require('../../assets/images/scene.png'),
            require('../../assets/images/china.png'),
        ],
        imageNames: {
            [require('../../assets/images/car.png')]: "car",
            [require('../../assets/images/piscine.png')]: "pool",
            [require('../../assets/images/scene.png')]: "stage",
            [require('../../assets/images/china.png')]: "china",
        }
    },
    'cute': {
        id: 'cute',
        name: 'Cute & Co',
        rounds: 5,
        images: [
            require('../../assets/images/cat.png'),
            require('../../assets/images/baby.png'),
            require('../../assets/images/bird.png'),
            require('../../assets/images/bubble.png'),
        ],
        imageNames: {
            [require('../../assets/images/cat.png')]: "cat",
            [require('../../assets/images/baby.png')]: "baby",
            [require('../../assets/images/bird.png')]: "bird",
            [require('../../assets/images/bubble.png')]: "bubble",
        }
    },
    'party': {
        id: 'party',
        name: 'Party Time',
        rounds: 5,
        images: [
            require('../../assets/images/cake.png'),
            require('../../assets/images/bubble.png'),
            require('../../assets/images/scene.png'),
            require('../../assets/images/biaggi.png'),
        ],
        imageNames: {
            [require('../../assets/images/cake.png')]: "cake",
            [require('../../assets/images/bubble.png')]: "bubble",
            [require('../../assets/images/scene.png')]: "stage",
            [require('../../assets/images/biaggi.png')]: "biaggi",
        }
    },
    'summer': {
        id: 'summer',
        name: 'Summer Vibes',
        rounds: 5,
        images: [
            require('../../assets/images/watermelon.png'),
            require('../../assets/images/piscine.png'),
            require('../../assets/images/yellow.png'),
            require('../../assets/images/blue.png'),
        ],
        imageNames: {
            [require('../../assets/images/watermelon.png')]: "watermelon",
            [require('../../assets/images/piscine.png')]: "pool",
            [require('../../assets/images/yellow.png')]: "yellow",
            [require('../../assets/images/blue.png')]: "blue",
        }
    },
    'tech': {
        id: 'tech',
        name: 'Tech Life',
        rounds: 5,
        images: [
            require('../../assets/images/msn.png'),
            require('../../assets/images/1.png'),
            require('../../assets/images/2.png'),
            require('../../assets/images/3.png'),
        ],
        imageNames: {
            [require('../../assets/images/msn.png')]: "msn",
            [require('../../assets/images/1.png')]: "one",
            [require('../../assets/images/2.png')]: "two",
            [require('../../assets/images/3.png')]: "three",
        }
    },
    'nature': {
        id: 'nature',
        name: 'Nature Walk',
        rounds: 5,
        images: [
            require('../../assets/images/bird.png'),
            require('../../assets/images/green.png'),
            require('../../assets/images/butter.png'),
            require('../../assets/images/yellow.png'),
        ],
        imageNames: {
            [require('../../assets/images/bird.png')]: "bird",
            [require('../../assets/images/green.png')]: "green",
            [require('../../assets/images/butter.png')]: "butter",
            [require('../../assets/images/yellow.png')]: "yellow",
        }
    },
    'panier': {
        id: 'panier',
        name: 'Basket Piano',
        rounds: 6,
        images: [
            require('../../assets/images/panier.png'),
            require('../../assets/images/piano.png'),
        ],
        imageNames: {
            [require('../../assets/images/panier.png')]: "panier",
            [require('../../assets/images/piano.png')]: "piano",
        }
    },
    'chaperon': {
        id: 'chaperon',
        name: 'Chaperon Champignon',
        rounds: 6,
        images: [
            require('../../assets/images/chaperon.png'),
            require('../../assets/images/champignon.png'),
        ],
        imageNames: {
            [require('../../assets/images/chaperon.png')]: "chaperon",
            [require('../../assets/images/champignon.png')]: "champignon",
        }
    },
    'chaussette': {
        id: 'chaussette',
        name: 'Chaussette Coussin',
        rounds: 6,
        images: [
            require('../../assets/images/chaussette.png'),
            require('../../assets/images/coussin.png'),
        ],
        imageNames: {
            [require('../../assets/images/chaussette.png')]: "chaussette",
            [require('../../assets/images/coussin.png')]: "coussin",
        }
    }
};

export default function GameScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { loadLevel, startRound, currentLevel, currentBeat, currentRound, isPlaying, stopGame, language, restartGame, setGameState, showImageNames, setShowImageNames, gameState, rateChallenge } = useGameStore();
    const { playSound, stopAllSounds } = useSoundEffects();
    const t = (translations[language].game as any);

    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [difficulty, setDifficulty] = useState('normal');
    const [rating, setRating] = useState(0);

    // Countdown state
    const [countdownText, setCountdownText] = useState<string | null>(null);
    const countdownAnim = useRef(new Animated.Value(0)).current;

    // Initialize Loop
    useBeatController();

    useEffect(() => {
        AdManager.loadInterstitial();
        AdManager.loadRewarded();

        if (id === 'custom') {
            // Already loaded via loadCustomLevel() in the creator screens
        } else if (typeof id === 'string' && MOCK_LEVELS[id]) {
            loadLevel(MOCK_LEVELS[id]);
        }
    }, [id, loadLevel]);

    // Auto-open options only on initial entry or when explicitly requested
    useEffect(() => {
        if (!isPlaying && gameState === 'MENU') {
            setOptionsVisible(true);
        } else {
            setOptionsVisible(false);
        }
    }, [isPlaying, gameState]);

    const toggleCamera = async () => {
        if (!isCameraOn) {
            if (!permission?.granted) {
                const { granted } = await requestPermission();
                if (granted) {
                    setIsCameraOn(true);
                    await AdManager.showInterstitial();
                }
            } else {
                setIsCameraOn(true);
                await AdManager.showInterstitial();
            }
        } else {
            setIsCameraOn(false);
        }
    };

    const handleConfirmPlay = async () => {
        setOptionsVisible(false);
        setGameState('PLAYING');

        // Start countdown
        const sequence = [
            { text: '3', rate: 1.0, volume: 0.5 },
            { text: '2', rate: 1.0, volume: 0.75 },
            { text: '1', rate: 1.2, volume: 1.0 },
            { text: 'GO!', rate: 1.0, volume: 1.0, sound: 'siffletgo' }
        ];

        for (const step of sequence) {
            setCountdownText(step.text);
            countdownAnim.setValue(0);

            // Trigger animation
            Animated.parallel([
                Animated.timing(countdownAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(700),
                    Animated.timing(countdownAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ])
            ]).start();

            // Play sound with crescendo
            // playSound('beat', step.rate, step.volume);
        }

        // Wait for 1 second (approx)
        await new Promise(resolve => setTimeout(resolve, 1000));

        setCountdownText(null);
        setRating(0); // Reset rating for new attempt

        if (currentLevel && currentRound >= currentLevel.rounds && !isPlaying) {
            restartGame();
            startRound();
        } else {
            startRound();
        }
    };

    const handleBack = () => {
        stopAllSounds();
        stopGame();
        router.back();
    };

    const handleRetryDirect = async () => {
        const { retryCount, incrementRetryCount, resetRetryCount } = useGameStore.getState();
        incrementRetryCount();

        if (retryCount + 1 >= 2) {
            await AdManager.showInterstitial();
            resetRetryCount();
        }

        restartGame();
        handleConfirmPlay();
    };

    const handleRetryWithOptions = async () => {
        const { retryCount, incrementRetryCount, resetRetryCount } = useGameStore.getState();
        incrementRetryCount();

        if (retryCount + 1 >= 2) {
            await AdManager.showInterstitial();
            resetRetryCount();
        }

        restartGame();
    };

    const handleRate = (stars: number) => {
        setRating(stars);
        if (currentLevel?.id) {
            rateChallenge(currentLevel.id, stars);
        }
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


            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    isCameraOn ? styles.scrollContentCameraOn : styles.scrollContentCameraOff
                ]}
                style={styles.scrollView}
            >
                <View style={[styles.gameArea, !isCameraOn && { aspectRatio: 1, justifyContent: 'center' }]}>
                    <GridSystem key={currentRound} level={currentLevel} activeBeat={currentBeat} />
                </View>

                {isCameraOn && (
                    <View style={styles.cameraContainer}>
                        <CameraView style={styles.cameraPreview} facing="front" />
                    </View>
                )}
            </ScrollView>

            {/* Game Options Modal */}
            <Modal visible={optionsVisible} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t.optionsTitle}</Text>


                        <View style={styles.optionRow}>
                            <Text style={styles.optionText}>{t.showNames}</Text>
                            <Switch
                                value={showImageNames}
                                onValueChange={setShowImageNames}
                                trackColor={{ false: '#767577', true: '#FF508E' }}
                                thumbColor={showImageNames ? '#fff' : '#f4f3f4'}
                            />
                        </View>

                        <View style={styles.optionRow}>
                            <Text style={styles.optionText}>{t.showCamera}</Text>
                            <TouchableOpacity
                                onPress={toggleCamera}
                                style={[styles.buttonSmall, isCameraOn && styles.buttonActive]}
                            >
                                <Text style={styles.buttonText}>{isCameraOn ? t.camOn : t.camOff}</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.difficultyLabel}>{t.difficulty}</Text>
                        <View style={styles.difficultyContainer}>
                            {['easy', 'normal', 'hard'].map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() => setDifficulty(level)}
                                    style={[
                                        styles.difficultyButton,
                                        difficulty === level && styles.difficultyButtonActive
                                    ]}
                                >
                                    <Text style={[
                                        styles.difficultyText,
                                        difficulty === level && styles.difficultyTextActive
                                    ]}>
                                        {(t as any)[`difficulty${level.charAt(0).toUpperCase() + level.slice(1)}`]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity onPress={handleConfirmPlay} style={styles.confirmButton}>
                            <Text style={styles.confirmButtonText}>{t.startGame}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleBack} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>{translations[language].creator.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Results Modal */}
            <Modal visible={gameState === 'RESULT'} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.wellDoneText}>{t.wellDone}</Text>

                        <Text style={styles.rateLabel}>{t.rateChallenge}</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => handleRate(star)}>
                                    <Text style={[styles.starIcon, rating >= star && styles.starActive]}>
                                        {rating >= star ? '★' : '☆'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.resultsButtons}>
                            <TouchableOpacity
                                onPress={handleRetryDirect}
                                style={[styles.resultButton, styles.retryBtn]}
                            >
                                <Text style={styles.resultButtonText}>{t.retry}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleRetryWithOptions}
                                style={[styles.resultButton, styles.optionBtn]}
                            >
                                <Text style={styles.resultButtonText}>{t.retryWithOptions}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={async () => {
                                await AdManager.showInterstitial();
                                handleBack();
                            }}
                            style={styles.resultsBackFull}
                        >
                            <Text style={styles.resultsBackFullText}>{t.backToMenu}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Banner at the very bottom */}
            <View style={styles.bannerContainer}>
                <BannerAd
                    unitId={AD_UNITS.BANNER}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
            </View>

            {/* Countdown Overlay */}
            {countdownText && (
                <View style={styles.countdownOverlay}>
                    <Animated.Text
                        style={[
                            styles.countdownText,
                            {
                                opacity: countdownAnim,
                                transform: [
                                    {
                                        scale: countdownAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.5, 2.5]
                                        })
                                    }
                                ]
                            }
                        ]}
                    >
                        {countdownText}
                    </Animated.Text>
                </View>
            )}
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
    },
    scrollContentCameraOn: {
        paddingTop: 140,
        paddingBottom: 20,
        justifyContent: 'flex-start',
    },
    scrollContentCameraOff: {
        paddingTop: 0,
        paddingBottom: 0,
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        top: 80,
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
        maxWidth: 500,
        alignItems: 'center',
        marginBottom: 5,
    },
    cameraContainer: {
        width: '80%',
        maxWidth: 300,
        aspectRatio: 4 / 3, // slightly more compact
        backgroundColor: '#000',
        borderRadius: 20,
        borderWidth: 4,
        borderColor: 'black',
        overflow: 'hidden',
        marginTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 8,
    },
    cameraPreview: {
        flex: 1,
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
    },
    // New Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 30,
        width: '90%',
        maxWidth: 380,
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 30,
        textAlign: 'center',
        color: '#FF508E',
        textTransform: 'uppercase',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#000',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#333',
        maxWidth: '70%',
    },
    difficultyLabel: {
        fontSize: 16,
        fontWeight: '900',
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginTop: 10,
        textTransform: 'uppercase',
    },
    difficultyContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 30,
        gap: 8,
    },
    difficultyButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
    },
    difficultyButtonActive: {
        backgroundColor: '#FFEB3B',
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '800',
        color: 'black',
    },
    difficultyTextActive: {
        fontWeight: '900',
    },
    confirmButton: {
        width: '100%',
        padding: 20,
        backgroundColor: '#6BF178',
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'black',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    confirmButtonText: {
        fontSize: 20,
        fontWeight: '900',
        color: 'black',
        textTransform: 'uppercase',
    },
    cancelButton: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    // Countdown Styles
    countdownOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countdownText: {
        fontSize: 100,
        fontWeight: '900',
        color: '#FFEB3B',
        textShadowColor: 'black',
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 1,
    },
    // Results Modal Styles
    wellDoneText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#6BF178',
        marginBottom: 20,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    rateLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        gap: 10,
    },
    starIcon: {
        fontSize: 40,
        color: '#DDD',
    },
    starActive: {
        color: '#FFD700',
    },
    resultsButtons: {
        flexDirection: 'column',
        width: '100%',
        gap: 12,
    },
    resultButton: {
        width: '100%',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
    },
    backBtn: {
        backgroundColor: '#F5F5F5',
    },
    retryBtn: {
        backgroundColor: '#FFEB3B', // Yellow for main action
    },
    optionBtn: {
        backgroundColor: '#6BF178', // Green for options
    },
    resultsBackFull: {
        marginTop: 15,
        width: '100%',
        padding: 12,
        alignItems: 'center',
    },
    resultsBackFullText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    resultButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: 'black',
        textAlign: 'center',
    },
    bannerContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderTopColor: 'black',
        paddingVertical: 5,
        position: 'absolute',
        bottom: 0,
    },
});
