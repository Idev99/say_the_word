import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../store/gameStore';
import { translations } from '../../constants/translations';
import { BannerAd, BannerAdSize } from '../../components/AdBanner';
import { AD_UNITS } from '../../utils/AdManager';

export default function CreatorStep2() {
    const router = useRouter();
    const { setCreatorMode, language } = useGameStore();
    const t = translations[language].creator;

    const handleSelect = (mode: 'RANDOM' | 'CUSTOM') => {
        setCreatorMode(mode);
        const { fillRandomSlots } = useGameStore.getState();
        if (mode === 'RANDOM') {
            fillRandomSlots();
        }
        router.push('/create/design');
    };

    return (
        <View style={styles.container}>
            {/* Navigation Header */}
            <View style={styles.navHeader}>
                <TouchableOpacity
                    onPress={() => router.push('/challenges')}
                    style={styles.homeButton}
                >
                    <Image
                        source={require('../../assets/icons/home.png')}
                        style={styles.homeIcon}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButtonStyled}
                >
                    <Text style={styles.backButtonTextStyled}>{t.back}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>{t.modeTitle}</Text>
            <View style={styles.steps}><Text style={styles.step}>1 — </Text><Text style={styles.stepActive}>2</Text><Text style={styles.step}> — 3</Text></View>

            <Text style={styles.subtitle}>{t.modeSubtitle}</Text>

            <View style={styles.options}>
                <TouchableOpacity onPress={() => handleSelect('RANDOM')} style={styles.card}>
                    <Text style={styles.emoji}>🎲</Text>
                    <Text style={styles.cardTitle}>{t.randomTitle}</Text>
                    <Text style={styles.cardDesc}>{t.randomDesc}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleSelect('CUSTOM')} style={styles.card}>
                    <Text style={styles.emoji}>🎯</Text>
                    <Text style={styles.cardTitle}>{t.customTitle}</Text>
                    <Text style={styles.cardDesc}>{t.customDesc}</Text>
                </TouchableOpacity>
            </View>

            {/* Fixed Banner at the bottom */}
            <View style={styles.bannerContainer}>
                <BannerAd
                    unitId={AD_UNITS.BANNER}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    navHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        marginBottom: 20,
        gap: 15,
    },
    backButtonStyled: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 3,
    },
    backButtonTextStyled: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    steps: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    stepActive: {
        fontWeight: 'bold',
        color: '#4CAF50',
        fontSize: 18,
    },
    step: {
        fontSize: 18,
        color: '#ccc',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    options: {
        width: '100%',
        gap: 20,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#eee',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    emoji: {
        fontSize: 40,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardDesc: {
        textAlign: 'center',
        color: '#666',
    },
    homeButton: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 25,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    homeIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    bannerContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderTopColor: 'black',
        paddingVertical: 5,
    },
});
