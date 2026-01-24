import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, Modal, Animated, Dimensions, Platform, Linking, Alert, ActivityIndicator, AppState } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/gameStore';
import { translations } from '../constants/translations';
import { Ionicons } from '@expo/vector-icons';
import { BannerAd, BannerAdSize } from '../components/AdBanner';
import { AdManager, AD_UNITS } from '../utils/AdManager';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    cat: require('../assets/images/cat.png'),
    car: require('../assets/images/car.png'),
    coffee: require('../assets/images/coffee.png'),
    cake: require('../assets/images/cake.png'),
    russia: require('../assets/images/russia.png'),
    ukraine: require('../assets/images/ukraine.png'),
    usa: require('../assets/images/usa.png'),
    china: require('../assets/images/china.png'),
    biaggi: require('../assets/images/biaggi.png'),
    billy: require('../assets/images/billy.png'),
    msn: require('../assets/images/msn.png'),
    piscine: require('../assets/images/piscine.png'),
    scene: require('../assets/images/scene.png'),
    squeezie: require('../assets/images/squeezie.png'),
    steak: require('../assets/images/steak.png'),
    watermelon: require('../assets/images/watermelon.png'),
    panier: require('../assets/images/panier.png'),
    piano: require('../assets/images/piano.png'),
    chaperon: require('../assets/images/chaperon.png'),
    champignon: require('../assets/images/champignon.png'),
    chaussette: require('../assets/images/chaussette.png'),
    coussin: require('../assets/images/coussin.png'),
    apple: require('../assets/images/apple.png'),
    pie: require('../assets/images/pie.png'),
    horse: require('../assets/images/horse.png'),
    fly: require('../assets/images/fly.png'),
    mozzarella: require('../assets/images/mozzarella.png'),
    cinderella: require('../assets/images/cinderella.png'),
    umbrella: require('../assets/images/umbrella.png'),
    fortnite: require('../assets/images/fortnite.png'),
    lol: require('../assets/images/lol.png'),
    minecraft: require('../assets/images/minecraft.png'),
};

export default function ChallengesScreen() {
    const router = useRouter();
    const { language, communityChallenges, loadLevel, activeTab, setActiveTab, isLoggedIn, refreshEngagement } = useGameStore();
    const t = translations[language].challenges;

    // Aggressive Preload & Keep Alive
    React.useEffect(() => {
        const loadAds = () => {
            // Safety check: triggers a load if not already loaded/loading
            AdManager.loadRewarded();
        };

        loadAds(); // Initial load
        refreshEngagement();

        // Check every 15 seconds to ensure we always have an ad ready
        const interval = setInterval(loadAds, 15000);

        // AppState Listener: Trigger check immediately when coming back from background
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                loadAds();
            }
        });

        return () => {
            clearInterval(interval);
            subscription.remove();
        };
    }, []);

    // Optimization: Trigger load when switching to Studio tab
    React.useEffect(() => {
        if (activeTab === 'myChallenges') {
            console.log('AdMob: Tab switch to Studio, pre-loading ad...');
            AdManager.loadRewarded();
        }
    }, [activeTab]);

    const [sortBy, setSortBy] = React.useState<'plays' | 'likes' | 'newest'>('plays');

    const sortedCommunity = [...communityChallenges].sort((a, b) => {
        if (sortBy === 'plays') return b.playsCount - a.playsCount;
        if (sortBy === 'likes') return b.likes - a.likes;
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
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
            <TouchableOpacity onPress={() => setActiveTab('videos')} style={[styles.tab, activeTab === 'videos' && styles.tabActive]}>
                <Text style={styles.tabText}>{t.tabs.videos}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.tab}
                onPress={() => {
                    useGameStore.getState().resetCreator();
                    router.push('/create');
                }}
            >
                <Text style={styles.tabText}>{t.tabs.create}</Text>
            </TouchableOpacity>
            {/* Studio Tab is now always visible */}
            <TouchableOpacity onPress={() => setActiveTab('myChallenges')} style={[styles.tab, activeTab === 'myChallenges' && styles.tabActive]}>
                <Text style={styles.tabText}>{t.tabs.myChallenges}</Text>
            </TouchableOpacity>
        </View>
    );

    const handlePlayChallenge = (challenge: any) => {
        loadLevel(challenge);
        router.push(`/game/${challenge.id}`);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {renderHeader()}

                {activeTab === 'featured' ? (
                    <>
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

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>{t.featuredTitle}</Text>
                        </View>

                        <View style={styles.grid}>
                            <ChallengeCard
                                title={t.list.pomme}
                                icons={['apple', 'pie', 'horse', 'fly']}
                                onPlay={() => router.push('/game/pomme')}
                            />
                            <ChallengeCard
                                title={t.list.fortnite}
                                icons={['minecraft', 'lol', 'fortnite']}
                                onPlay={() => router.push('/game/fortnite')}
                            />
                            <ChallengeCard
                                title={t.list.influencers}
                                icons={['billy', 'squeezie', 'biaggi']}
                                onPlay={() => router.push('/game/influencers')}
                            />
                            <ChallengeCard
                                title={t.list.panier}
                                icons={['panier', 'piano', 'panier', 'piano']}
                                onPlay={() => router.push('/game/panier')}
                            />
                            <ChallengeCard
                                title={t.list.mozzarella}
                                icons={['mozzarella', 'cinderella', 'umbrella']}
                                onPlay={() => router.push('/game/mozzarella')}
                            />
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
                            <ChallengeCard
                                title={t.list.yummy}
                                icons={['steak', 'watermelon', 'cake', 'coffee']}
                                onPlay={() => router.push('/game/yummy')}
                            />
                            <ChallengeCard
                                title={t.list.travel}
                                icons={['car', 'piscine', 'scene', 'china']}
                                onPlay={() => router.push('/game/travel')}
                            />
                            <ChallengeCard
                                title={t.list.cute}
                                icons={['cat', 'baby', 'bird', 'bubble']}
                                onPlay={() => router.push('/game/cute')}
                            />
                            <ChallengeCard
                                title={t.list.party}
                                icons={['cake', 'bubble', 'scene', 'biaggi']}
                                onPlay={() => router.push('/game/party')}
                            />
                            <ChallengeCard
                                title={t.list.chaperon}
                                icons={['chaperon', 'champignon', 'chaperon', 'champignon']}
                                onPlay={() => router.push('/game/chaperon')}
                            />
                            <ChallengeCard
                                title={t.list.chaussette}
                                icons={['chaussette', 'coussin', 'chaussette', 'coussin']}
                                onPlay={() => router.push('/game/chaussette')}
                            />
                        </View>
                    </>
                ) : activeTab === 'community' ? (
                    <View>
                        <View style={[styles.sectionHeader, { backgroundColor: '#FF508E', alignSelf: 'center', width: '90%', marginBottom: 15 }]}>
                            <Text style={[styles.sectionHeaderText, { fontSize: 18, textAlign: 'center' }]}>
                                {((t as any).communityTitle || "COMMUNITY CHALLENGES").toUpperCase()}
                            </Text>
                        </View>

                        <View style={styles.sortContainer}>
                            <TouchableOpacity onPress={() => setSortBy('plays')} style={[styles.sortButton, sortBy === 'plays' && styles.sortButtonActive]}>
                                <Text style={styles.sortText}>{(t as any).sort?.plays || "Most Played"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSortBy('newest')} style={[styles.sortButton, sortBy === 'newest' && styles.sortButtonActive]}>
                                <Text style={styles.sortText}>{(t as any).sort?.newest || "Newest"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSortBy('likes')} style={[styles.sortButton, sortBy === 'likes' && styles.sortButtonActive]}>
                                <Text style={styles.sortText}>{(t as any).sort?.likes || "Most Liked"}</Text>
                            </TouchableOpacity>
                        </View>

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
                ) : activeTab === 'videos' ? (
                    <VideosView />
                ) : (
                    <MyChallengesView />
                )}
                {/* 
                ) : isLoggedIn ? (
                    <MyChallengesView />
                ) : (
                    <GuestStudioView />
                )} 
                */}
            </ScrollView>

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
        </SafeAreaView>
    );
}

function GuestStudioView() {
    const { language, login } = useGameStore();
    const t = translations[language].challenges;
    const gt = (t as any).guest || {};

    return (
        <View style={styles.guestContainer}>
            <View style={styles.guestIconContainer}>
                <Ionicons name="rocket" size={80} color="#FFD700" />
                <View style={styles.moneyBadge}>
                    <Text style={styles.moneyBadgeText}>€€€</Text>
                </View>
            </View>

            <Text style={styles.guestTitle}>{gt.title}</Text>
            <Text style={styles.guestSubtitle}>{gt.subtitle}</Text>

            <View style={styles.authButtons}>
                <TouchableOpacity style={[styles.authButton, styles.googleButton]} onPress={() => login()}>
                    <Ionicons name="logo-google" size={24} color="white" />
                    <Text style={styles.authButtonText}>{gt.loginGoogle}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.authButton, styles.appleButton]}>
                    <Ionicons name="logo-apple" size={24} color="white" />
                    <Text style={styles.authButtonText}>{gt.loginApple}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.guestBenefitRow}>
                <View style={styles.benefitIcon}>
                    <Ionicons name="trending-up" size={20} color="#6BF178" />
                </View>
                <Text style={styles.benefitText}>Grow your audience</Text>
            </View>
            <View style={styles.guestBenefitRow}>
                <View style={styles.benefitIcon}>
                    <Ionicons name="gift" size={20} color="#FF508E" />
                </View>
                <Text style={styles.benefitText}>Earn real world rewards</Text>
            </View>
        </View>
    );
}

const MOCK_VIDEOS = [
    {
        id: '1',
        title: 'Nico joue au jeu 😂',
        tiktokId: '7597756310767095062',
        url: 'https://www.tiktok.com/@hydoradorad/video/7597756310767095062'
    },
    {
        id: '3',
        title: 'Pomme Tarte Maison Mouche 😂',
        tiktokId: '7597755508094668054',
        url: 'https://www.tiktok.com/@hydoradorad/video/7597755508094668054'
    },
    {
        id: '4',
        title: 'Cendrillon mozzarella 👸🏼⛱️',
        tiktokId: '7597754379143351574',
        url: 'https://www.tiktok.com/@hydoradorad/video/7597754379143351574'
    },
    {
        id: '2',
        title: 'Prank 😲',
        tiktokId: '7597754142555245846',
        url: 'https://www.tiktok.com/@hydoradorad/video/7597754142555245846'
    }
];

function VideosView() {
    return (
        <View style={styles.videosContainer}>
            <View style={[styles.sectionHeader, { backgroundColor: '#FFD700', alignSelf: 'center', width: '90%', marginBottom: 20 }]}>
                <Text style={[styles.sectionHeaderText, { fontSize: 18, textAlign: 'center' }]}>
                    COMMUNITY VIDEOS
                </Text>
            </View>
            <View style={styles.grid}>
                {MOCK_VIDEOS.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </View>
        </View>
    );
}

function VideoCard({ video }: { video: typeof MOCK_VIDEOS[0] }) {
    const handleOpen = () => {
        Linking.openURL(video.url);
    };

    return (
        <View style={[styles.videoCard, styles.hardShadow]}>
            <View style={styles.videoThumbnailContainer}>
                {Platform.OS === 'web' ? (
                    <iframe
                        src={`https://www.tiktok.com/embed/v2/${video.tiktokId}`}
                        style={{ width: '100%', height: '100%', border: 'none', borderRadius: 10 }}
                        allow="autoplay; encrypted-media; fullscreen"
                    />
                ) : (
                    <TouchableOpacity style={styles.mobileVideoPlaceholder} onPress={handleOpen}>
                        <Ionicons name="play-circle" size={60} color="#FF508E" />
                        <Text style={styles.watchOnTikTok}>Watch on TikTok</Text>
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity onPress={handleOpen} style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <View style={styles.videoPlatformRow}>
                    <Ionicons name="logo-tiktok" size={16} color="black" />
                    <Text style={styles.videoCreator}>TikTok</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

function MyChallengesView() {
    const { language, communityChallenges, userChallengeIds, loadLevel, refreshEngagement } = useGameStore();
    const router = useRouter();
    const t = translations[language].challenges;
    const rt = (t as any).rewards || {};
    const [modalVisible, setModalVisible] = React.useState(false);
    const anim = React.useRef(new Animated.Value(0)).current;
    const refreshAnim = React.useRef(new Animated.Value(0)).current;

    const handleRefresh = () => {
        AdManager.loadRewarded(); // Preload on manual refresh
        refreshAnim.setValue(0);
        Animated.timing(refreshAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
        refreshEngagement();
    };

    const spin = refreshAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const userChallenges = communityChallenges.filter(c => userChallengeIds.includes(c.id));
    const totalViews = userChallenges.reduce((acc, c) => acc + c.playsCount, 0);
    const totalFire = userChallenges.reduce((acc, c) => acc + (c.fire || 0), 0);

    const tiers = [1, 5, 10, 20, 50, 100, 500];
    const reachedTiers = tiers.filter(v => totalViews >= v * 1000);
    const latestReached = reachedTiers.length > 0 ? reachedTiers[reachedTiers.length - 1] : 0;

    const stepperTiers = reachedTiers.length >= 3
        ? reachedTiers.slice(-3)
        : tiers.slice(0, 3);

    /* 
    const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] });
    const rotate = anim.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: ['0deg', '-15deg', '0deg', '15deg', '0deg'] });
    const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.7, 1] });

    const scaleInv = anim.interpolate({ inputRange: [0, 1], outputRange: [1.3, 1] });
    const rotateInv = anim.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: ['0deg', '15deg', '0deg', '-15deg', '0deg'] });
    const opacityInv = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.7, 1, 0.7] });
    */

    return (
        <View>
            {/* 
            <TouchableOpacity style={styles.rewardsBanner} onPress={() => setModalVisible(true)}>
                <View style={styles.rewardsHeader}>
                    <Animated.View style={{ transform: [{ scale }, { rotate }], opacity }}>
                        <Ionicons name="gift" size={32} color="#FFD700" />
                    </Animated.View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.rewardsTitle}>{rt.bannerTitle}</Text>
                        <View style={styles.totalViewsBadge}>
                            <Ionicons name="eye" size={12} color="white" />
                            <Text style={styles.totalViewsBadgeText}>{(totalViews / 1000).toFixed(1)}k views</Text>
                        </View>
                    </View>
                    <Animated.View style={{ transform: [{ scale: scaleInv }, { rotate: rotateInv }], opacity: opacityInv }}>
                        <Ionicons name="logo-euro" size={32} color="#FFD700" />
                    </Animated.View>
                </View>

                <View style={styles.stepperContainer}>
                    {stepperTiers.map((v, i) => {
                        const isUnlocked = totalViews >= (v * 1000);
                        return (
                            <View key={i} style={styles.stepGroup}>
                                <View style={[styles.stepDot, isUnlocked && styles.stepDotActive]}>
                                    <Text style={[styles.stepText, isUnlocked && {color: 'black'}]}>{v}€</Text>
                                    {isUnlocked && <Ionicons name="checkmark" size={10} color="black" style={styles.checkIcon} />}
                                </View>
                                {i < stepperTiers.length - 1 && (
                                    <View style={[styles.stepLine, totalViews >= (stepperTiers[i + 1] * 1000) && styles.stepLineActive]} />
                                )}
                            </View>
                        );
                    })}
                    <View style={styles.viewMoreStep}>
                        <Ionicons name="chevron-forward" size={18} color="#FFD700" />
                    </View>
                </View>
            </TouchableOpacity>
            */}

            <View style={styles.statsBanner}>
                <Text style={styles.statsBannerTitle}>{rt.statsTitle}</Text>
                <View style={styles.statsBannerRight}>
                    {totalFire > 0 && (
                        <View style={styles.fireBadge}>
                            <Ionicons name="flame" size={16} color="#FF9800" />
                            <Text style={styles.fireBadgeText}>{totalFire}</Text>
                        </View>
                    )}
                    <TouchableOpacity onPress={handleRefresh} style={styles.manualRefreshButton}>
                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                            <Ionicons name="refresh" size={22} color="black" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.grid}>
                {userChallenges.map((challenge) => (
                    <CommunityChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onPlay={() => {
                            loadLevel(challenge);
                            router.push(`/game/${challenge.id}`);
                        }}
                        showBoost={true}
                    />
                ))}
            </View>

            {/* 
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.premiumModalContent}>
                        <TouchableOpacity style={styles.closeModal} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.premiumModalTitle}>{rt.totalTiers}</Text>
                        
                        <ScrollView style={{ maxHeight: SCREEN_HEIGHT * 0.4, width: '100%', marginBottom: 15 }} showsVerticalScrollIndicator={false}>
                            {tiers.map((v, j) => {
                                const target = v * 1000;
                                const isUnlocked = totalViews >= target;
                                return (
                                    <View key={j} style={[styles.tierRowPremium, isUnlocked && styles.tierUnlockedPremium]}>
                                        <View style={styles.tierInfo}>
                                            <Text style={[styles.tierValuePremium, isUnlocked && { color: 'black' }]}>{v}€</Text>
                                            <Text style={[styles.tierTargetPremium, isUnlocked && { color: '#333' }]}>{target.toLocaleString()} {rt.views}</Text>
                                        </View>
                                        {isUnlocked ? (
                                            <Ionicons name="checkmark-circle" size={32} color="#00C853" />
                                        ) : (
                                            <View style={styles.progressBadge}>
                                                <Text style={styles.progressBadgeText}>{Math.min(100, Math.floor((totalViews / target) * 100))}%</Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </ScrollView>

                        <View style={styles.bonusGrid}>
                            <View style={styles.bonusCardSimplified}>
                                <Ionicons name="heart" size={20} color="#FF508E" />
                                <Text style={styles.bonusCardLabel}>{rt.bonusLikes}</Text>
                            </View>
                            <TouchableOpacity style={styles.bonusCardSimplified}>
                                <Ionicons name="logo-tiktok" size={20} color="#000" />
                                <Text style={styles.bonusCardLabel}>{rt.bonusTikTok}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.bonusCardSimplified, { borderColor: '#FF0000' }]}>
                                <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                                <Text style={styles.bonusCardLabel}>{rt.bonusYouTube}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.bonusCardSimplified, { borderColor: '#E1306C' }]}>
                                <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                                <Text style={styles.bonusCardLabel}>{rt.bonusInstagram}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalActionRow}>
                            <TouchableOpacity 
                                style={[styles.getPaidButton, latestReached < 50 && styles.getPaidDisabled]}
                                disabled={latestReached < 50}
                            >
                                <Text style={styles.getPaidText}>{rt.getPaid}</Text>
                                <Text style={styles.minAmountText}>{rt.minAmount}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.okButton}>
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            */}
        </View>
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

function CommunityChallengeCard({ challenge, onPlay, showBoost }: { challenge: any, onPlay: () => void, showBoost?: boolean }) {
    const { boostChallenge, language, isPendingBoost, pendingBoostChallengeId, setPendingBoost } = useGameStore();
    const [isBoosting, setIsBoosting] = React.useState(false);
    const [isAdLoading, setIsAdLoading] = React.useState(false);
    const t = translations[language].challenges;
    const rt = (t as any).rewards || {};

    const isThisPending = isPendingBoost && pendingBoostChallengeId === challenge.id;

    const handleBoost = async () => {
        if (isAdLoading || isBoosting || isPendingBoost) return;

        // 0. Immediate UI Feedback
        setIsAdLoading(true);

        try {
            // 1. Global Cooldown Check (3 minutes)
            const lastGlobalBoost = useGameStore.getState().lastGlobalBoostTime;
            const now = Date.now();
            const COOLDOWN_MS = 3 * 60 * 1000;

            if (now - lastGlobalBoost < COOLDOWN_MS) {
                const remainingMins = Math.ceil((COOLDOWN_MS - (now - lastGlobalBoost)) / 60000);
                Alert.alert(rt.boostTitle, rt.adNotReady);
                return;
            }

            // 2. Daily Limit Check
            const todayBoosts = challenge.boostsToday || 0;
            if (todayBoosts >= 5) {
                Alert.alert(rt.boostLimit.split(' ')[0] || "Limit", rt.boostLimit.replace('{n}', '5'));
                return;
            }

            // 3. Instant show if ready
            if (AdManager.isRewardedLoaded()) {
                setIsBoosting(true);
                const success = await AdManager.showRewarded(() => {
                    boostChallenge(challenge.id);
                });
                setIsBoosting(false);
                if (!success) Alert.alert(rt.boostTitle, rt.adNotReady);
                return;
            }

            // 4. Background Loading (up to 1 min)
            // Trigger load if not already loading
            AdManager.loadRewarded();
            setPendingBoost(true, challenge.id);

            // Wait loop (6s max)
            let attempts = 0;
            while (!AdManager.isRewardedLoaded() && attempts < 12) {
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            }

            if (!AdManager.isRewardedLoaded()) {
                Alert.alert(
                    rt.pendingBoostTitle,
                    rt.pendingBoostDesc
                );
            } else {
                // Late success - try showing again
                setIsBoosting(true);
                const success = await AdManager.showRewarded(() => {
                    boostChallenge(challenge.id);
                });
                setIsBoosting(false);
            }

        } catch (error) {
            console.error("Boost error:", error);
        } finally {
            setIsAdLoading(false);
        }
    };

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        const days = Math.floor(seconds / (3600 * 24));
        return (t as any).timeAgo.replace('{n}', days.toString());
    };

    const stackImages = [];
    if (challenge.creatorMode === 'CUSTOM') {
        const allImages = Object.values(challenge.creatorRoundLayouts).flat().filter(img => img !== null) as any[];
        stackImages.push(...allImages.slice(0, 3));
    } else {
        stackImages.push(...challenge.creatorImages.slice(0, 3));
    }
    while (stackImages.length < 3) stackImages.push('https://via.placeholder.com/150');

    const boostLevel = challenge.boostsToday || 0; // Show current daily level
    const isLimitReached = boostLevel >= 5;

    const lastGlobalBoost = useGameStore(state => state.lastGlobalBoostTime);
    const COOLDOWN_MS = 3 * 60 * 1000;
    const isGlobalCooldown = (Date.now() - lastGlobalBoost) < COOLDOWN_MS;
    const [now, setNow] = React.useState(Date.now());

    React.useEffect(() => {
        const diff = Date.now() - lastGlobalBoost;
        if (diff < COOLDOWN_MS) {
            const interval = setInterval(() => {
                setNow(Date.now());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [lastGlobalBoost]);

    const getRemainingText = () => {
        if (isLimitReached) return rt.boostLimit.replace('{n}', '5');
        if (isGlobalCooldown) {
            const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastGlobalBoost)) / 1000);
            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }
        return rt.boostButtonText || "+ BOOST";
    };

    const isButtonDisabled = isLimitReached || isBoosting || isGlobalCooldown || isAdLoading;

    return (
        <View style={[styles.card, styles.hardShadow]}>
            <TouchableOpacity style={styles.stackContainer} onPress={onPlay}>
                {/* Flame Boost Indicator (GTA Style) */}
                {boostLevel > 0 && (
                    <View style={styles.boostFlamesContainer}>
                        {Array(5).fill(0).map((_, i) => (
                            <Ionicons
                                key={i}
                                name="flame"
                                size={14}
                                color={i < boostLevel ? "#FF9800" : "#ccc"}
                                style={{ opacity: i < boostLevel ? 1 : 0.3 }}
                            />
                        ))}
                    </View>
                )}

                <View style={[styles.stackCard, styles.stackCardBack, { transform: [{ rotate: '-10deg' }, { translateX: -10 }] }]}>
                    <Image source={typeof stackImages[2] === 'string' ? { uri: stackImages[2] } : stackImages[2]} style={styles.stackImage} />
                </View>
                <View style={[styles.stackCard, styles.stackCardMid, { transform: [{ rotate: '-5deg' }, { translateX: -5 }] }]}>
                    <Image source={typeof stackImages[1] === 'string' ? { uri: stackImages[1] } : stackImages[1]} style={styles.stackImage} />
                </View>
                <View style={[styles.stackCard, styles.stackCardTop]}>
                    <Image source={typeof stackImages[0] === 'string' ? { uri: stackImages[0] } : stackImages[0]} style={styles.stackImage} />
                </View>
            </TouchableOpacity>

            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>
                    {challenge.name.includes('.')
                        ? (challenge.name.split('.').reduce((obj: any, key: string) => obj?.[key], translations[language].challenges) || challenge.name)
                        : challenge.name}
                </Text>
                <Text style={styles.cardMetaText}>{timeAgo(challenge.createdAt)} · {challenge.rounds} rounds</Text>

                <View style={styles.likesRow}>
                    <View style={styles.statItem}>
                        <Ionicons name="play-circle-outline" size={14} color="black" />
                        <Text style={styles.statValue}>
                            {challenge.playsCount >= 1000 ? (challenge.playsCount / 1000).toFixed(1) + 'K' : Math.floor(challenge.playsCount)}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="thumbs-up-outline" size={14} color="black" />
                        <Text style={styles.statValue}>{challenge.likes}</Text>
                    </View>
                </View>

                {showBoost && (
                    <TouchableOpacity
                        style={[styles.boostButton, (isButtonDisabled && !isThisPending) && styles.boostButtonDisabled]}
                        onPress={handleBoost}
                        disabled={isButtonDisabled || isThisPending}
                    >
                        {isAdLoading || isThisPending || isBoosting ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : (
                            <>
                                <Ionicons name="flame" size={16} color="black" />
                                <Text style={styles.boostButtonText}>
                                    {getRemainingText()}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { padding: 16, paddingTop: 60 },
    backButton: { marginBottom: 16 },
    tabsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
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
    tabActive: { backgroundColor: 'white', shadowOffset: { width: 1, height: 1 } },
    tabText: { fontSize: 8, fontWeight: '900', color: 'black', textTransform: 'uppercase' },
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
    bannerText: { fontSize: 18, fontWeight: '900', color: 'black', flex: 1 },
    arrow: { marginLeft: 10 },
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
    sectionHeaderText: { color: 'black', fontWeight: '900', fontSize: 14 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
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
    cardIcons: { flexDirection: 'row', flexWrap: 'wrap', padding: 10 },
    iconPlaceholder: { width: 32, height: 32, margin: 2, alignItems: 'center', justifyContent: 'center' },
    iconImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    cardTitle: { fontSize: 18, fontWeight: '900', marginHorizontal: 12, marginBottom: 12, color: 'black' },
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
    playText: { fontWeight: '900', marginLeft: 4, fontSize: 12 },
    stackContainer: { height: 120, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', overflow: 'visible' },
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
    stackCardTop: { zIndex: 3 },
    stackCardMid: { zIndex: 2 },
    stackCardBack: { zIndex: 1 },
    stackImage: { width: '90%', height: '90%', resizeMode: 'contain' },
    cardInfo: { padding: 10 },
    cardMetaText: { fontSize: 10, color: '#666', fontWeight: '700', marginBottom: 5 },
    statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    playsCount: { fontSize: 14, fontWeight: '900', marginLeft: 4, color: '#FF508E' },
    likesRow: { flexDirection: 'row', gap: 15 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statValue: { fontSize: 12, fontWeight: '700' },
    sortContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
    sortButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 15,
        backgroundColor: '#eee',
    },
    sortButtonActive: { backgroundColor: '#FFEB3B' },
    sortText: { fontSize: 10, fontWeight: '900' },
    buttonShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    rewardsBanner: {
        backgroundColor: '#1A1A1A',
        borderWidth: 3,
        borderColor: '#FFD700',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    rewardsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    rewardsTitle: { fontSize: 20, fontWeight: '900', color: 'white', textTransform: 'uppercase' },
    totalViewsBadge: { backgroundColor: '#FF508E', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    totalViewsBadgeText: { fontSize: 10, fontWeight: '900', color: 'white', marginLeft: 4 },
    stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    stepGroup: { flexDirection: 'row', alignItems: 'center' },
    stepDot: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#333', borderWidth: 2, borderColor: '#555', alignItems: 'center', justifyContent: 'center' },
    stepDotActive: { backgroundColor: '#FFD700', borderColor: 'white' },
    stepText: { fontSize: 14, fontWeight: '900', color: '#888' },
    stepLine: { width: 30, height: 6, backgroundColor: '#333' },
    stepLineActive: { backgroundColor: '#FFD700' },
    checkIcon: { position: 'absolute', bottom: -2, right: -2, backgroundColor: 'white', borderRadius: 6, overflow: 'hidden' },
    viewMoreStep: { width: 36, height: 36, borderRadius: 18, borderStyle: 'dotted', borderWidth: 2, borderColor: '#FFD700', marginLeft: 15, alignItems: 'center', justifyContent: 'center' },

    // Premium Modal
    premiumModalContent: {
        backgroundColor: '#121212',
        borderRadius: 30,
        padding: 22,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
    },
    closeModal: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
    premiumModalTitle: { fontSize: 24, fontWeight: '900', color: 'white', marginBottom: 20, textShadowColor: '#FF508E', textShadowRadius: 10 },
    tierRowPremium: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#333', marginBottom: 8, borderRadius: 15 },
    tierUnlockedPremium: { backgroundColor: '#FFD700', borderColor: 'white' },
    tierInfo: { flex: 1 },
    tierValuePremium: { fontSize: 20, fontWeight: '900', color: '#FFD700' },
    tierTargetPremium: { fontSize: 11, fontWeight: '700', color: '#888' },
    progressBadge: { backgroundColor: '#333', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    progressBadgeText: { color: 'white', fontSize: 11, fontWeight: '900' },

    bonusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15, justifyContent: 'center' },
    bonusCardSimplified: { width: '47%', backgroundColor: '#1E1E1E', borderWidth: 2, borderColor: '#333', borderRadius: 15, padding: 10, alignItems: 'center', gap: 5 },
    bonusCardLabel: { fontSize: 10, fontWeight: '900', color: 'white', textAlign: 'center' },

    modalActionRow: { flexDirection: 'row', width: '100%', gap: 10, marginTop: 10 },
    getPaidButton: { flex: 1.5, backgroundColor: '#00C853', borderRadius: 15, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#00C853', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
    getPaidDisabled: { backgroundColor: '#333', shadowOpacity: 0 },
    getPaidText: { fontSize: 16, fontWeight: '900', color: 'white' },
    minAmountText: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '700' },
    okButton: { flex: 1, backgroundColor: '#FF508E', borderRadius: 15, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#FF508E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
    okButtonText: { fontSize: 18, fontWeight: '900', color: 'white' },

    // Guest Studio Styles
    guestContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#eee',
        paddingHorizontal: 20,
    },
    guestIconContainer: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moneyBadge: {
        position: 'absolute',
        bottom: -5,
        right: -10,
        backgroundColor: '#6BF178',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        transform: [{ rotate: '15deg' }],
    },
    moneyBadgeText: {
        fontSize: 12,
        fontWeight: '900',
        color: 'black',
    },
    guestTitle: {
        fontSize: 26,
        fontWeight: '900',
        textAlign: 'center',
        color: 'black',
        marginBottom: 10,
    },
    guestSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        lineHeight: 22,
    },
    authButtons: {
        width: '100%',
        gap: 12,
        marginBottom: 40,
    },
    authButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        gap: 10,
    },
    googleButton: {
        backgroundColor: '#4285F4',
    },
    appleButton: {
        backgroundColor: '#000',
    },
    authButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    guestBenefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
        gap: 15,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    benefitIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    benefitText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },

    // Videos Styles
    videosContainer: {
        flex: 1,
        paddingBottom: 20,
    },
    videoCard: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 15,
        width: '48%',
        marginBottom: 20,
        overflow: 'hidden',
    },
    videoThumbnailContainer: {
        height: 350,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mobileVideoPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    watchOnTikTok: {
        color: 'white',
        fontWeight: '900',
        marginTop: 10,
        fontSize: 12,
    },
    videoInfo: {
        padding: 10,
    },
    videoTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: 'black',
        marginBottom: 5,
        height: 40,
    },
    videoPlatformRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    videoCreator: {
        fontSize: 12,
        color: '#666',
        fontWeight: '700',
    },
    fireBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.3)',
        paddingHorizontal: 8,
        borderRadius: 12,
        gap: 4,
    },
    fireBadgeText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14,
    },
    bannerContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderTopColor: 'black',
        paddingVertical: 5,
    },
    boostFlamesContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 4,
        borderRadius: 10,
        zIndex: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    boostButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFEB3B',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginTop: 10,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    boostButtonDisabled: {
        backgroundColor: '#eee',
        opacity: 0.6,
    },
    boostButtonText: {
        fontSize: 12,
        fontWeight: '900',
        color: 'black',
    },
    manualRefreshButton: {
        marginLeft: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 8,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    statsBanner: {
        backgroundColor: '#6BF178',
        width: '100%',
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 3,
    },
    statsBannerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: 'black',
    },
    statsBannerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});
