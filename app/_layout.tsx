import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LanguagePicker from '../components/LanguagePicker';
import BackgroundDecor from '../components/BackgroundDecor';
import AdBackgroundWatcher from '../components/AdBackgroundWatcher';

import { AdManager } from '../utils/AdManager';
import { NotificationManager } from '../utils/NotificationManager';
import { useGameStore } from '../store/gameStore';
import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

const PAPER_TEXTURE = require('../assets/paper-texture.jpg');

export default function RootLayout() {
    useEffect(() => {
        AdManager.initialize();
        NotificationManager.setupHandlers();
        NotificationManager.initialize();

        // Initial landing: Cancel any scheduled ones since the app is open
        NotificationManager.cancelAllScheduledNotifications();

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState.match(/inactive|background/)) {
                console.log('App going to background, scheduling predictive notifications...');
                useGameStore.getState().scheduleFutureNotifications();
            } else if (nextAppState === 'active') {
                console.log('App coming to foreground, clearing notifications...');
                NotificationManager.cancelAllScheduledNotifications();
            }
        });

        return () => subscription.remove();
    }, []);

    return (
        <ImageBackground source={PAPER_TEXTURE} style={styles.background} resizeMode="cover">
            <StatusBar style="auto" />
            <BackgroundDecor />
            <AdBackgroundWatcher />
            <View style={styles.pickerContainer}>
                <LanguagePicker />
            </View>
            <Slot />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    pickerContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 100,
        padding: 0,
    },
});
