import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LanguagePicker from '../components/LanguagePicker';
import BackgroundDecor from '../components/BackgroundDecor';

import { AdManager } from '../utils/AdManager';
import mobileAds from 'react-native-google-mobile-ads';
import React, { useEffect } from 'react';

const PAPER_TEXTURE = require('../assets/paper-texture.jpg');

export default function RootLayout() {
    useEffect(() => {
        // Initialize AdMob and Preload Ads
        mobileAds().initialize().then(() => {
            console.log('AdMob Initialized');
            AdManager.loadInterstitial();
            AdManager.loadRewarded();
        });
    }, []);

    return (
        <ImageBackground source={PAPER_TEXTURE} style={styles.background} resizeMode="cover">
            <StatusBar style="auto" />
            <BackgroundDecor />
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
