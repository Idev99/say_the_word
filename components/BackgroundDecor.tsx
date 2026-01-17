import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const DECOR_1 = require('../assets/icons/decor-1.png');
const DECOR_2 = require('../assets/icons/decor-2.png');
const DECOR_3 = require('../assets/icons/decor-3.png');
const DECOR_4 = require('../assets/icons/decor-4.png');

export default function BackgroundDecor() {
    const rotationAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(250), // 4x faster pause (1000/4)
                    Animated.timing(rotationAnim, {
                        toValue: 1,
                        duration: 25, // 4x faster jump (100/4)
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.delay(250), // 4x faster pause (1000/4)
                    Animated.timing(rotationAnim, {
                        toValue: 0,
                        duration: 25, // 4x faster jump (100/4)
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        startAnimation();
    }, [rotationAnim]);

    const rotate = rotationAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-20deg', '20deg'],
    });

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Top Left */}
            <Animated.View style={[styles.decorContainer, styles.topLeft, { transform: [{ rotate }] }]}>
                <Image source={DECOR_1} style={styles.image} resizeMode="contain" />
            </Animated.View>

            {/* Top Right */}
            <Animated.View style={[styles.decorContainer, styles.topRight, { transform: [{ rotate }] }]}>
                <Image source={DECOR_2} style={styles.image} resizeMode="contain" />
            </Animated.View>

            {/* Bottom Left */}
            <Animated.View style={[styles.decorContainer, styles.bottomLeft, { transform: [{ rotate }] }]}>
                <Image source={DECOR_3} style={styles.image} resizeMode="contain" />
            </Animated.View>

            {/* Bottom Right */}
            <Animated.View style={[styles.decorContainer, styles.bottomRight, { transform: [{ rotate }] }]}>
                <Image source={DECOR_4} style={styles.image} resizeMode="contain" />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    decorContainer: {
        position: 'absolute',
        width: 120,
        height: 120,
        opacity: 0.6,
        zIndex: -1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    topLeft: {
        top: -20,
        left: -20,
    },
    topRight: {
        top: -20,
        right: -20,
    },
    bottomLeft: {
        bottom: -20,
        left: -20,
    },
    bottomRight: {
        bottom: -20,
        right: -20,
    },
});
