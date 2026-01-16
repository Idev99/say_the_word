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
    const { language, communityChallenges, loadLevel } = useGameStore();
    const t = translations[language].challenges;

    const [activeTab, setActiveTab] = React.useState<'featured' | 'community'>('featured');
    const [sortBy, setSortBy] = React.useState<'plays' | 'likes' | 'dislikes'>('plays');

    const sortedCommunity = [...communityChallenges].sort((a, b) => {
        if (sortBy === 'plays') return b.playsCount - a.playsCount;
        if (sortBy === 'likes') return b.likes - a.likes;
        if (sortBy === 'dislikes') return a.dislikes - b.dislikes; // More dislikes is "less liked"? User said "moins aimé" (least liked/most disliked)
        return 0;
    });

    const renderHeader = () => (
        <View style={styles.tabsContainer}>
            <TouchableOpacity onPress={() => setActiveTab('featured')} style={[styles.tab, activeTab === 'featured' && styles.tabActive]}>
                <Text style={styles.tabText}>{t.tabs.featured}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('community')} style={[styles.tab, activeTab === 'community' && styles.tabActive]}>
                <Text style={styles.tabText}>{t.tabs.community}</Text>
            </TouchableOpacity>
            <View style={styles.tab}><Text style={styles.tabText}>{t.tabs.videos}</Text></View>
            <TouchableOpacity
                style={styles.tab}
                onPress={() => {
                    useGameStore.getState().resetCreator();
                    router.push('/create');
                }}
            >
                <Text style={styles.tabText}>{t.tabs.create}</Text>
            </TouchableOpacity>
            <View style={styles.tab}><Text style={styles.tabText}>{t.tabs.blog}</Text></View>
        </View>
    );

    const handlePlayChallenge = (challenge: any) => {
        loadLevel(challenge);
        router.push(`/game/${challenge.id}`);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Navigation Back */}
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                {/* Top Tabs */}
                {renderHeader()}

                {activeTab === 'featured' ? (
                    <>
                        {/* Create Banner */}
                        <TouchableOpacity
                            style={styles.createBanner}
                            onPress={() => {
                                useGameStore.getState().resetCreator();
                                router.push('/create');
                            }}
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
                    </>
                ) : (
                    <View>
                        {/* Community Header Box */}
                        <View style={[styles.sectionHeader, { backgroundColor: '#FF508E', alignSelf: 'center', width: '90%', marginBottom: 15 }]}>
                            <Text style={[styles.sectionHeaderText, { fontSize: 18, textAlign: 'center' }]}>COMMUNITY CHALLENGES</Text>
                        </View>

                        {/* Sorting UI */}
                        <View style={styles.sortContainer}>
                            <TouchableOpacity onPress={() => setSortBy('plays')} style={[styles.sortButton, sortBy === 'plays' && styles.sortButtonActive]}>
                                <Text style={styles.sortText}>Most Played</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSortBy('likes')} style={[styles.sortButton, sortBy === 'likes' && styles.sortButtonActive]}>
                                <Text style={styles.sortText}>Most Liked</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSortBy('dislikes')} style={[styles.sortButton, sortBy === 'dislikes' && styles.sortButtonActive]}>
                                <Text style={styles.sortText}>Least Liked</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Community Grid */}
                        <View style={styles.grid}>
                            {sortedCommunity.map((challenge) => (
                                <CommunityChallengeCard
                                    key={challenge.id}
                                    challenge={challenge}
                                    onPlay={() => handlePlayChallenge(challenge)}
                                />
                            ))}
                        </View>
                    </View>
                )}
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

function CommunityChallengeCard({ challenge, onPlay }: { challenge: any, onPlay: () => void }) {
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        const days = Math.floor(seconds / (3600 * 24));
        return `${days} days ago`;
    };

    // Extract first 3 images for the stack
    const stackImages = [];
    if (challenge.creatorMode === 'CUSTOM') {
        const allImages = Object.values(challenge.creatorRoundLayouts).flat().filter(img => img !== null) as string[];
        stackImages.push(...allImages.slice(0, 3));
    } else {
        stackImages.push(...challenge.creatorImages.slice(0, 3));
    }
    // Fill with placeholders if less than 3
    while (stackImages.length < 3) stackImages.push('https://via.placeholder.com/150');

    return (
        <TouchableOpacity style={[styles.card, styles.hardShadow]} onPress={onPlay}>
            {/* Stack Visual */}
            <View style={styles.stackContainer}>
                <View style={[styles.stackCard, styles.stackCardBack, { transform: [{ rotate: '-10deg' }, { translateX: -10 }] }]}>
                    <Image source={{ uri: stackImages[2] }} style={styles.stackImage} />
                </View>
                <View style={[styles.stackCard, styles.stackCardMid, { transform: [{ rotate: '-5deg' }, { translateX: -5 }] }]}>
                    <Image source={{ uri: stackImages[1] }} style={styles.stackImage} />
                </View>
                <View style={[styles.stackCard, styles.stackCardTop]}>
                    <Image source={{ uri: stackImages[0] }} style={styles.stackImage} />
                </View>
            </View>

            <View style={styles.cardInfo}>
                <Text style={styles.cardMetaText}>{timeAgo(challenge.createdAt)} · {challenge.rounds} rounds</Text>

                <View style={styles.statsRow}>
                    <Ionicons name="flame" size={16} color="#FF508E" />
                    <Text style={styles.playsCount}>{(challenge.playsCount / 1000).toFixed(1)}K</Text>
                </View>

                <View style={styles.likesRow}>
                    <View style={styles.statItem}>
                        <Ionicons name="thumbs-up-outline" size={14} color="black" />
                        <Text style={styles.statValue}>{challenge.likes}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="thumbs-down-outline" size={14} color="black" />
                        <Text style={styles.statValue}>{challenge.dislikes}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
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
        paddingHorizontal: 4,
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
    tabActive: {
        backgroundColor: 'white',
        shadowOffset: { width: 1, height: 1 },
    },
    tabText: {
        fontSize: 8,
        fontWeight: '900',
        color: 'black',
        textTransform: 'uppercase',
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
        backgroundColor: '#A2D2FF',
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
        color: 'black',
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
        marginBottom: 20,
        overflow: 'hidden',
    },
    hardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    },
    cardIcons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
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
        fontSize: 18,
        fontWeight: '900',
        marginHorizontal: 12,
        marginBottom: 12,
        color: 'black',
    },
    playButton: {
        backgroundColor: '#FFEB3B',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        paddingVertical: 8,
        margin: 10,
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
    // Community Card Styles
    stackContainer: {
        height: 120,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
    },
    stackCard: {
        width: 70,
        height: 90,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stackCardTop: {
        zIndex: 3,
    },
    stackCardMid: {
        zIndex: 2,
    },
    stackCardBack: {
        zIndex: 1,
    },
    stackImage: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    cardInfo: {
        padding: 10,
    },
    cardMetaText: {
        fontSize: 10,
        color: '#666',
        fontWeight: '700',
        marginBottom: 5,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    playsCount: {
        fontSize: 14,
        fontWeight: '900',
        marginLeft: 4,
        color: '#FF508E',
    },
    likesRow: {
        flexDirection: 'row',
        gap: 15,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 12,
        fontWeight: '700',
    },
    // Sort UI
    sortContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    sortButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 15,
        backgroundColor: '#eee',
    },
    sortButtonActive: {
        backgroundColor: '#FFEB3B',
    },
    sortText: {
        fontSize: 10,
        fontWeight: '900',
    },
    buttonShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
});
