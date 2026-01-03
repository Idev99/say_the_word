import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');
const GAP = 10;
const ITEM_SIZE = (width - 60) / 4;

interface CursorOverlayProps {
    currentBeat: number;
    totalItems: number;
}

export default function CursorOverlay({ currentBeat, totalItems }: CursorOverlayProps) {
    // Calculate position based on beat index
    // 4 items per row.
    // 0, 1, 2, 3 -> Row 0
    // 4, 5, 6, 7 -> Row 1

    // Note: currentBeat can go higher than totalItems if creating a loop.
    // We module it to keep it in grid.
    const activeIndex = currentBeat % totalItems;

    const col = activeIndex % 4;
    const row = Math.floor(activeIndex / 4);

    // We need to map `col/row` to X/Y coordinates relative to the Grid container.
    // In a real app we might use `onLayout` to measure exact positions. 
    // For now, we estimate based on fixed sizes.
    // Grid Padding: 10
    // Gap: 10
    const x = 10 + col * (ITEM_SIZE + GAP);
    const y = 10 + row * (ITEM_SIZE + GAP);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: withSpring(x, { damping: 15, stiffness: 120 }) },
                { translateY: withSpring(y, { damping: 15, stiffness: 120 }) },
            ],
            // Add a "Pulse" scale effect on beat?
            // scale: withSequence(withTiming(1.1, { duration: 50 }), withTiming(1, { duration: 100 })),
        };
    });

    if (currentBeat < 0) return null;

    return (
        <Animated.View style={[styles.cursor, animatedStyle]} pointerEvents="none" />
    );
}

const styles = StyleSheet.create({
    cursor: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderWidth: 4,
        borderColor: '#4CAF50', // Green highlight
        borderRadius: 8,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        backgroundColor: 'rgba(76, 175, 80, 0.1)', // Slight green tint
    },
});
