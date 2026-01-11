import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { LevelData, useGameStore } from '../../store/gameStore';
import { useEffect, useRef } from 'react';

const GAP = 10;

interface GridSystemProps {
    level: LevelData;
    activeBeat: number;
}

export default function GridSystem({ level, activeBeat }: GridSystemProps) {
    const { isRoundIntro, endRoundIntro } = useGameStore();

    // Create animated values for each possible card (max 8)
    const animValues = useRef([...Array(8)].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        if (isRoundIntro) {
            // Reset values to 0 (hidden/start position)
            animValues.forEach(v => v.setValue(0));

            // Start Staggered Animation
            Animated.stagger(100, animValues.map((anim, i) => {
                // Ensure we only animate existent images
                if (i < level.images.length) {
                    return Animated.timing(anim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: false, // safer for web/layout properties sometimes, true for transform
                        easing: Easing.out(Easing.back(1.5)),
                    });
                }
                return Animated.delay(0);
            })).start(({ finished }) => {
                // Only trigger end of intro if the animation actually finished
                if (finished) {
                    endRoundIntro();
                }
            });
        } else {
            // Ensure all visible if not in intro (e.g. idle or playing normal loop)
            animValues.forEach(v => v.setValue(1));
        }
    }, [isRoundIntro, level.images.length, endRoundIntro]);

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
