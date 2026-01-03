import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';

const PAPER_TEXTURE = require('../assets/paper-texture.jpg');

export default function RootLayout() {
    return (
        <ImageBackground source={PAPER_TEXTURE} style={styles.background} resizeMode="cover">
            <StatusBar style="auto" />
            <Slot />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});
