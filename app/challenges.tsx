import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/gameStore';
import { translations } from '../constants/translations';
import { Ionicons } from '@expo/vector-icons';

// Fallback icon for when assets are missing
const FALLBACK_ICON = 'https://via.placeholder.com/150';

const ICON_MAP: Record<string, any> = {
    bird: require('../assets/images/bird.png'),
    butter: require('../assets/images/butter.png'),
    bubble: require('../assets/images/bubble.png'),
    baby: require('../assets/images/baby.png'),
    '1': require('../assets/images/1.png'),
    '2': require('../assets/images/2.png'),
    '3': require('../assets/images/3.png'),
    '4': require('../assets/images/4.png'),
    red: require('../assets/images/red.png'),
    blue: require('../assets/images/blue.png'),
    green: require('../assets/images/green.png'),
    yellow: require('../assets/images/yellow.png'),
    cat: require('../assets/images/cat.png'), // Keeping for fallback or if user switches back
    car: require('../assets/images/car.png'),
    coffee: require('../assets/images/coffee.png'),
    cake: require('../assets/images/cake.png'),
    russia: require('../assets/images/russia.png'),
    ukraine: require('../assets/images/ukraine.png'),
    usa: require('../assets/images/usa.png'),
    china: require('../assets/images/china.png'),
};

export default function ChallengesScreen() {
    const router = useRouter();
    const { language } = useGameStore();
    const t = translations[language].challenges;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Navigation Back */}
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                {/* Top Tabs */}
                <View style={styles.tabsContainer}>
                    <View style={styles.tab}><Text style={styles.tabText}>{t.tabs.featured}</Text></View>
                    <View style={styles.tab}><Text style={styles.tabText}>{t.tabs.community}</Text></View>
                    <View style={styles.tab}><Text style={styles.tabText}>{t.tabs.videos}</Text></View>
                    <View style={styles.tab}><Text style={styles.tabText}>{t.tabs.create}</Text></View>
                    <View style={styles.tab}><Text style={styles.tabText}>{t.tabs.blog}</Text></View>
                </View>

                {/* Create Banner */}
                <TouchableOpacity
                    style={styles.createBanner}
                    onPress={() => router.push('/create')}
                >
                    <View style={styles.plusBox}>
                        <Ionicons name="add" size={32} color="black" />
                    </View>
                    <Text style={styles.bannerText}>{t.createBanner}</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" style={styles.arrow} />
                </TouchableOpacity>

                {/* Featured Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>{t.featuredTitle}</Text>
                </View>

                {/* Challenges Grid */}
                <View style={styles.grid}>
                    <ChallengeCard
                        title={t.list.bird}
                        icons={['bird', 'butter', 'bubble', 'baby']}
                        onPlay={() => router.push('/game/bird')}
                    />
                    <ChallengeCard
                        title={t.list.numbers}
                        icons={['1', '2', '3', '4']}
                        onPlay={() => router.push('/game/numbers')}
                    />
                    <ChallengeCard
                        title={t.list.colors}
                        icons={['red', 'blue', 'green', 'yellow']}
                        onPlay={() => router.push('/game/colors')}
                    />
                    <ChallengeCard
                        title={t.list.country}
                        icons={['russia', 'ukraine', 'usa', 'china']}
                        onPlay={() => router.push('/game/country')}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function ChallengeCard({ title, icons, onPlay }: { title: string, icons: string[], onPlay: () => void }) {
    const { language } = useGameStore();
    const t = translations[language].challenges;

    return (
        <View style={[styles.card, styles.hardShadow]}>
            <View style={styles.cardIcons}>
                {icons.map((icon, idx) => (
                    <View key={idx} style={styles.iconPlaceholder}>
                        {ICON_MAP[icon] ? (
                            <Image source={ICON_MAP[icon]} style={styles.iconImage} />
                        ) : (
                            <Ionicons name="image-outline" size={24} color="#666" />
                        )}
                    </View>
                ))}
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <TouchableOpacity style={[styles.playButton, styles.buttonShadow]} onPress={onPlay}>
                <Ionicons name="play" size={16} color="black" />
                <Text style={styles.playText}>{t.play}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 16,
        paddingTop: 60,
    },
    backButton: {
        marginBottom: 16,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    tab: {
        backgroundColor: '#A2D2FF',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 12,
        flex: 1,
        marginHorizontal: 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    tabText: {
        fontSize: 8,
        fontWeight: '900',
        color: 'black',
    },
    createBanner: {
        backgroundColor: '#6BF178',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    plusBox: {
        width: 50,
        height: 50,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    bannerText: {
        fontSize: 18,
        fontWeight: '900',
        color: 'black',
        flex: 1,
    },
    arrow: {
        marginLeft: 10,
    },
    sectionHeader: {
        backgroundColor: '#FF508E',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    sectionHeaderText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 14,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 12,
        width: '48%',
        padding: 12,
        marginBottom: 20,
    },
    hardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    },
    buttonShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    cardIcons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    iconPlaceholder: {
        width: 32,
        height: 32,
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 12,
        color: 'black',
    },
    playButton: {
        backgroundColor: '#FFEB3B',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 3,
    },
    playText: {
        fontWeight: '900',
        marginLeft: 4,
        fontSize: 12,
    },
});
