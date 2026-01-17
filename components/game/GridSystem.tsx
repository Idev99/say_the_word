import { View, Image, StyleSheet, Animated, Easing, Text } from 'react-native';
import { LevelData, useGameStore } from '../../store/gameStore';
import { useEffect, useRef } from 'react';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { translations } from '../../constants/translations';

const GAP = 10;

interface GridSystemProps {
    level: LevelData;
    activeBeat: number;
}

export default function GridSystem({ level, activeBeat }: GridSystemProps) {
    const { isRoundIntro, endRoundIntro, currentRound, introSpeed, introAnimationSpeed, showImageNames, language } = useGameStore();
    const { playSound } = useSoundEffects();
    // ... rest of the setup
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const playedIntroForRound = useRef<string | null>(null);

    const animValues = useRef([...Array(8)].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // ... (animation logic remains same)
        const introKey = `${level.id}-${currentRound}`;

        if (isRoundIntro && playedIntroForRound.current !== introKey) {
            playedIntroForRound.current = introKey;
            animValues.forEach(v => v.setValue(0));
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
            playSound('monmagaietsifflet2', introSpeed);
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

            const totalAnimationTime = ((level.images.length - 1) * STAGGER_MS) + DURATION_MS;
            const endTimeout = setTimeout(() => {
                endRoundIntro();
            }, totalAnimationTime);
            timeoutsRef.current.push(endTimeout);
        } else if (!isRoundIntro) {
            animValues.forEach(v => v.setValue(1));
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
                const translateY = animValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                });
                const opacity = animValues[index];

                // Find image name
                const lookupKey = img?.toString();
                const displayName = (level.imageNames && lookupKey) ? level.imageNames[lookupKey] : '';

                // Translate if possible
                const localizedName = (translations[language] as any).imageNames?.[displayName] || displayName;

                return (
                    <View key={index} style={styles.cell}>
                        {showImageNames && localizedName ? (
                            <Text style={styles.imageName} numberOfLines={1}>{localizedName}</Text>
                        ) : null}
                        <Animated.View
                            style={[
                                styles.cardContainer,
                                {
                                    opacity: isRoundIntro ? opacity : (index <= activeBeat ? 1 : 0.4),
                                    transform: [{ translateY }]
                                },
                                isActive && !isRoundIntro && styles.activeCard
                            ]}
                        >
                            <Image source={typeof img === 'string' ? { uri: img } : img} style={styles.image} resizeMode="cover" />
                        </Animated.View>
                    </View>
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
        gap: 15, // Increased slightly for names
        width: '100%',
        padding: 10,
    },
    cell: {
        width: '21%',
        alignItems: 'center',
    },
    imageName: {
        fontSize: 10,
        fontWeight: '900',
        marginBottom: 4,
        textAlign: 'center',
        width: '100%',
        textTransform: 'uppercase',
        color: '#FF508E',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 4,
        paddingVertical: 1,
    },
    cardContainer: {
        width: '100%',
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
        elevation: 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
