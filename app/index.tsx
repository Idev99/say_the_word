import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/gameStore';
import { translations } from '../constants/translations';

const { width, height } = Dimensions.get('window');
const PAPER_TEXTURE = require('../assets/paper-texture.jpg');
const DECOR_1 = require('../assets/icons/decor-1.png');
const DECOR_2 = require('../assets/icons/decor-2.png');
const DECOR_3 = require('../assets/icons/decor-3.png');
const DECOR_4 = require('../assets/icons/decor-4.png');

export default function HomeScreen() {
    const router = useRouter();
    const { language } = useGameStore();
    const t = translations[language].home;

    // Animation states
    const titleFade = useRef(new Animated.Value(0)).current;
    const titleTracking = useRef(new Animated.Value(0)).current;
    const vortexProgress = useRef(new Animated.Value(0)).current;
    const tearProgress = useRef(new Animated.Value(0)).current; // 0 = Intact, 1 = Torn apart

    useEffect(() => {
        // High-Fidelity Sequence with Paper Tear (ACCELERATED)
        Animated.sequence([
            // phase 1: Fast Title Reveal
            Animated.parallel([
                Animated.timing(titleFade, {
                    toValue: 1,
                    duration: 600, // Faster
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(titleTracking, {
                    toValue: 1,
                    duration: 1000, // Faster
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: false,
                }),
                // phase 2: Early Swirl Start (Parallel with title)
                Animated.timing(vortexProgress, {
                    toValue: 1,
                    duration: 1400, // Faster
                    easing: Easing.bezier(0.5, 0, 0.2, 1),
                    useNativeDriver: true,
                }),
            ]),
            // phase 3: Snappy Tear
            Animated.timing(tearProgress, {
                toValue: 1,
                duration: 500, // Very snappy
                easing: Easing.in(Easing.poly(3)),
                useNativeDriver: true,
            })
        ]).start(() => {
            router.replace('/challenges');
        });
    }, []);

    const renderVortex = () => {
        const elements = [
            { src: DECOR_1, startAngle: 0, color: '#FF508E' },
            { src: DECOR_2, startAngle: 90, color: '#6BF178' },
            { src: DECOR_3, startAngle: 180, color: '#FFEB3B' },
            { src: DECOR_4, startAngle: 270, color: '#4FC3F7' },
            { isGlow: true, startAngle: 45, color: '#FF508E' },
            { isGlow: true, startAngle: 135, color: '#6BF178' },
            { isGlow: true, startAngle: 225, color: '#FFEB3B' },
            { isGlow: true, startAngle: 315, color: '#4FC3F7' },
        ];

        return elements.map((item, i) => {
            const rotSpeed = 1080;
            const rotation = vortexProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [`${item.startAngle}deg`, `${item.startAngle + rotSpeed}deg`],
            });

            const radiusStart = Math.max(width, height);
            const radius = vortexProgress.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [radiusStart, 80, 0],
            });

            const scale = vortexProgress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0.2, 1.5, 1.8, 0],
            });

            const opacity = vortexProgress.interpolate({
                inputRange: [0, 0.1, 0.9, 1],
                outputRange: [0, 1, 1, 0],
            });

            return (
                <Animated.View key={i} style={[
                    styles.vortexItem,
                    {
                        opacity,
                        transform: [
                            { rotate: rotation },
                            { translateY: radius },
                            { scale: scale }
                        ]
                    }
                ]}>
                    {item.isGlow ? (
                        <View style={[styles.glow, { backgroundColor: item.color }]} />
                    ) : (
                        <Image source={item.src} style={styles.iconImage} />
                    )}
                </Animated.View>
            );
        });
    };

    // Shared content for both halves to ensure seamless look before tear
    const renderSharedContent = (isLeft: boolean) => {
        const translateX = isLeft ? 0 : -width / 2;
        return (
            <Animated.View style={[
                styles.halfContentContainer,
                {
                    width: width,
                    transform: [{ translateX: translateX }]
                }
            ]}>
                <ImageBackground source={PAPER_TEXTURE} style={styles.fullSize}>
                    <View style={styles.fullSizeCenter}>
                        <Animated.View style={[styles.titleGroup, { opacity: titleFade }]}>
                            <Animated.Text style={[
                                styles.title,
                                {
                                    letterSpacing: titleTracking.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [2, 15],
                                    })
                                }
                            ]}>
                                {t.title}
                            </Animated.Text>
                            <View style={styles.bar} />
                        </Animated.View>
                    </View>
                </ImageBackground>
            </Animated.View>
        );
    };

    const leftTranslateX = tearProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -width / 1.5],
    });
    const leftRotate = tearProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-15deg'],
    });

    const rightTranslateX = tearProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width / 1.5],
    });
    const rightRotate = tearProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '15deg'],
    });

    return (
        <View style={styles.masterContainer}>
            {/* Background Page Content (already visible behind the tearing paper) */}
            <View style={styles.placeholderBackground}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading Challenges...</Text>
                </View>
            </View>

            {/* Left Half */}
            <Animated.View style={[
                styles.halfContainer,
                {
                    left: 0,
                    transform: [
                        { translateX: leftTranslateX },
                        { rotate: leftRotate }
                    ]
                }
            ]}>
                {renderSharedContent(true)}
            </Animated.View>

            {/* Right Half */}
            <Animated.View style={[
                styles.halfContainer,
                {
                    left: width / 2,
                    transform: [
                        { translateX: rightTranslateX },
                        { rotate: rightRotate }
                    ]
                }
            ]}>
                {renderSharedContent(false)}
            </Animated.View>

            {/* Vortex Overlay (Stays on top and disappears before tear starts) */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        opacity: tearProgress.interpolate({ inputRange: [0, 0.1], outputRange: [1, 0] }),
                        zIndex: 20
                    }
                ]}
                pointerEvents="none"
            >
                <View style={styles.center}>
                    {renderVortex()}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    masterContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    placeholderBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#E0E0E0', // Light gray background while loading
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 20,
    },
    halfContainer: {
        position: 'absolute',
        top: -height * 0.25, // Oversize to allow rotation without edges showing
        bottom: -height * 0.25,
        width: width / 2,
        overflow: 'hidden',
        zIndex: 10,
    },
    halfContentContainer: {
        height: height * 1.5,
        position: 'absolute',
        top: height * 0.25,
    },
    fullSize: {
        width: width,
        height: height,
    },
    fullSizeCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleGroup: {
        alignItems: 'center',
    },
    title: {
        fontSize: 44,
        fontWeight: '900',
        color: '#000',
        textTransform: 'uppercase',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    bar: {
        height: 8,
        width: 100,
        backgroundColor: '#FF508E',
        marginTop: 10,
        borderRadius: 4,
    },
    center: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vortexItem: {
        position: 'absolute',
        width: 80,
        height: 80,
    },
    iconImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    glow: {
        width: 40,
        height: 40,
        borderRadius: 20,
        opacity: 0.4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
});
