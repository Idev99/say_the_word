import mobileAds, { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// REAL IDS (provided by user)
const APP_ID = 'ca-app-pub-4385842952170039~3782033490';
const BANNER_ID = 'ca-app-pub-4385842952170039/3997655913';
const INTERSTITIAL_ID = 'ca-app-pub-4385842952170039/1367429629';
const REWARDED_ID = 'ca-app-pub-4385842952170039/7497917225';

export const AD_UNITS = {
    BANNER: __DEV__ ? TestIds.BANNER : BANNER_ID,
    INTERSTITIAL: __DEV__ ? TestIds.INTERSTITIAL : INTERSTITIAL_ID,
    REWARDED: __DEV__ ? TestIds.REWARDED : REWARDED_ID,
};

// Interstitial Instance
const interstitial = InterstitialAd.createForAdRequest(AD_UNITS.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true,
});

// Rewarded Instance
const rewarded = RewardedAd.createForAdRequest(AD_UNITS.REWARDED, {
    requestNonPersonalizedAdsOnly: true,
});

export const AdManager = {
    // Interstitial Logic
    loadInterstitial: () => {
        interstitial.load();
    },
    showInterstitial: async () => {
        if (interstitial.loaded) {
            await interstitial.show();
            interstitial.load(); // Preload next
            return true;
        }
        interstitial.load(); // Try loading if not ready
        return false;
    },

    // Rewarded Logic
    loadRewarded: () => {
        rewarded.load();
    },
    showRewarded: (onReward: () => void): Promise<boolean> => {
        return new Promise((resolve) => {
            if (!rewarded.loaded) {
                console.log('AdMob: Rewarded ad not loaded');
                rewarded.load();
                resolve(false);
                return;
            }

            let earned = false;
            const subs: (() => void)[] = [];

            const cleanUp = () => {
                subs.forEach(unsub => unsub());
            };

            subs.push(rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
                console.log('AdMob: Reward earned', reward);
                earned = true;
            }));

            subs.push(rewarded.addAdEventListener(AdEventType.CLOSED, () => {
                console.log('AdMob: Ad closed');
                cleanUp();
                if (earned) {
                    onReward();
                    resolve(true);
                } else {
                    resolve(false);
                }
                rewarded.load(); // Preload next
            }));

            subs.push(rewarded.addAdEventListener(AdEventType.ERROR, (err) => {
                console.warn('AdMob: Ad error', err);
                cleanUp();
                resolve(false);
                rewarded.load();
            }));

            rewarded.show().catch(err => {
                console.error('AdMob: Failed to show ad', err);
                cleanUp();
                resolve(false);
                rewarded.load();
            });
        });
    },
    initialize: async () => {
        await mobileAds().initialize();
        console.log('AdMob Initialized');
        AdManager.loadInterstitial();
        AdManager.loadRewarded();
    }
};
