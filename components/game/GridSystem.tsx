import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { LevelData, useGameStore } from '../../store/gameStore';
import { useEffect, useRef } from 'react';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const GAP = 10;

interface GridSystemProps {
    level: LevelData;
    activeBeat: number;
}

export default function GridSystem({ level, activeBeat }: GridSystemProps) {
    const { isRoundIntro, endRoundIntro, currentRound, introSpeed, introAnimationSpeed } = useGameStore();
    const { playSound } = useSoundEffects();
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const playedIntroForRound = useRef<string | null>(null);

    // Create animated values for each possible card (max 8)
    const animValues = useRef([...Array(8)].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // Unique key for this specific round's intro to prevent re-runs within the same round
        const introKey = `${level.id}-${currentRound}`;

        if (isRoundIntro && playedIntroForRound.current !== introKey) {
            playedIntroForRound.current = introKey;

            // Initialize animations
            animValues.forEach(v => v.setValue(0));
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];

            // Start intro sound
            playSound('monmagaietsifflet2', introSpeed);

            // Stagger animation for cards
            const BASE_STAGGER = 250;
            const STAGGER_MS = BASE_STAGGER / introAnimationSpeed;
            const DURATION_MS = 500 / introAnimationSpeed;

            level.images.forEach((_, i) => {
                const t = setTimeout(() => {
                    Animated.timing(animValues[i], {
                        toValue: 1,
                        duration: DURATION_MS,
                        useNativeDriver: false,
                        easing: Easing.out(Easing.back(1.5)),
                    }).start();
                }, i * STAGGER_MS);
                timeoutsRef.current.push(t);
            });

            // Signal end of intro after ALL card animations finish
            const totalAnimationTime = ((level.images.length - 1) * STAGGER_MS) + DURATION_MS;
            const endTimeout = setTimeout(() => {
                endRoundIntro();
            }, totalAnimationTime);
            timeoutsRef.current.push(endTimeout);
        } else if (!isRoundIntro) {
            // Ensure all visible if not in intro
            animValues.forEach(v => v.setValue(1));
            // Clear timeouts if we leave intro early
            timeoutsRef.current.forEach(clearTimeout);
        }

        return () => {
            timeoutsRef.current.forEach(clearTimeout);
        };
    }, [isRoundIntro, level.images.length, level.id, currentRound]);

    return (
        <View style={styles.grid}>
            {level.images.map((img, index) => {
                const isActive = index === activeBeat;

                // Interpolations for entering effect
                const translateY = animValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0] // Slide up from 50px down
                });
                const opacity = animValues[index];

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.cardContainer,
                            {
                                opacity: isRoundIntro ? opacity : (index <= activeBeat ? 1 : 0.4),
                                transform: [{ translateY }]
                            },
                            isActive && !isRoundIntro && styles.activeCard // Only show green border if intro finished
                        ]}
                    >
                        <Image source={typeof img === 'string' ? { uri: img } : img} style={styles.image} resizeMode="cover" />
                    </Animated.View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
        padding: 10,
    },
    cardContainer: {
        width: '21%', // 21 * 4 = 84%, leaves 16% for gaps/padding. Plenty safe.
        aspectRatio: 1,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        overflow: 'hidden',
    },
    activeCard: {
        borderColor: '#4CAF50',
        borderWidth: 4,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10, // Android shadow
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
