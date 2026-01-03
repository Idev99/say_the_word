import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import { LevelData } from '../../store/gameStore';

const GAP = 10;

interface GridSystemProps {
    level: LevelData;
    activeBeat: number; // For progressive reveal if we do that, or just for highlight logic
}

export default function GridSystem({ level, activeBeat }: GridSystemProps) {
    // If we want "progressive reveal", we render items only if index <= activeBeat (or similar logic)
    // For now, let's render all but assume the overlay handles the focus.

    return (
        <View style={styles.grid}>
            {level.images.map((img, index) => {
                const isActive = index === (activeBeat % level.images.length);
                return (
                    <View
                        key={index}
                        style={[
                            styles.cardContainer,
                            { opacity: index <= activeBeat ? 1 : 0.4 }, // Increased base opacity so you can see them coming
                            isActive && styles.activeCard
                        ]}
                    >
                        <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
                        {/* Label if exists */}
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
        justifyContent: 'center',
        gap: GAP,
        width: '100%',
        padding: 10,
    },
    cardContainer: {
        width: '23%', // approx 4 per row with gap
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
