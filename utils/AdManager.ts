import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
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
    showRewarded: async (onReward: () => void) => {
        const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            // loaded
        });
        const unsubscribeEarned = rewarded.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            reward => {
                console.log('User earned reward of ', reward);
                onReward();
            },
        );

        if (rewarded.loaded) {
            await rewarded.show();
            rewarded.load(); // Preload next
            return true;
        }
        rewarded.load();
        return false;
    }
};
