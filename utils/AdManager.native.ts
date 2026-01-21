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

let isRewardedLoading = false;
let rewardedRetryCount = 0;
let isInterstitialLoading = false;
let interstitialRetryCount = 0;

export const AdManager = {
    // Interstitial Logic
    loadInterstitial: () => {
        if (interstitial.loaded || isInterstitialLoading) return;
        
        isInterstitialLoading = true;
        console.log('AdMob: Loading Interstitial...');
        interstitial.load();
    },
    showInterstitial: async () => {
        if (interstitial.loaded) {
            await interstitial.show();
            return true;
        }
        AdManager.loadInterstitial();
        return false;
    },

    // Rewarded Logic
    isRewardedLoaded: () => {
        return rewarded.loaded;
    },
    loadRewarded: () => {
        if (rewarded.loaded) return;
        
        // Safety: If it's been "loading" for too long (stuck), force reset
        if (isRewardedLoading) {
             // You could add a timestamp check here, or just trust the new timeout below
             // For now, we'll let the existing logic permit one overlapping call if needed, 
             // but let's just rely on the timeout added below.
        }
        
        if (isRewardedLoading) return;

        isRewardedLoading = true;
        console.log('AdMob: Loading Rewarded Ad...');
        rewarded.load();
        
        // Failsafe: Reset flag after 15s if stuck (no LOADED or ERROR event fired)
        setTimeout(() => {
            if (isRewardedLoading) {
                console.log('AdMob: Force resetting stuck loading flag');
                isRewardedLoading = false;
            }
        }, 15000);
    },
    showRewarded: (onReward: () => void): Promise<boolean> => {
        return new Promise((resolve) => {
            if (!rewarded.loaded) {
                console.log('AdMob: Rewarded ad not loaded, attempting emergency reload');
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

            // Force reload on close, error, etc.
            const handleFinish = () => {
                cleanUp();
                setTimeout(() => AdManager.loadRewarded(), 1000); // Wait 1s and reload
            };

            subs.push(rewarded.addAdEventListener(AdEventType.CLOSED, () => {
                console.log('AdMob: Ad closed');
                handleFinish();
                if (earned) {
                    onReward();
                    resolve(true);
                } else {
                    resolve(false);
                }
            }));

            subs.push(rewarded.addAdEventListener(AdEventType.ERROR, (err) => {
                console.warn('AdMob: Ad error', err);
                handleFinish();
                resolve(false);
            }));

            rewarded.show().catch(err => {
                console.error('AdMob: Failed to show ad', err);
                handleFinish();
                resolve(false);
            });
        });
    },
    initialize: async () => {
        await mobileAds().initialize();
        console.log('AdMob Initialized');

        // Rewarded Listeners
        rewarded.addAdEventListener(AdEventType.LOADED, () => {
            console.log('AdMob: Rewarded Loaded');
            isRewardedLoading = false;
            rewardedRetryCount = 0;
        });
        rewarded.addAdEventListener(AdEventType.ERROR, (err) => {
            console.log('AdMob: Rewarded Load Error', err);
            isRewardedLoading = false;
            rewardedRetryCount++;
            const delay = Math.min(60000, 5000 * Math.pow(2, rewardedRetryCount - 1));
            console.log(`AdMob: Retrying Rewarded load in ${delay / 1000}s...`);
            setTimeout(() => AdManager.loadRewarded(), delay);
        });

        // Interstitial Listeners
        interstitial.addAdEventListener(AdEventType.LOADED, () => {
            console.log('AdMob: Interstitial Loaded');
            isInterstitialLoading = false;
            interstitialRetryCount = 0;
        });
        interstitial.addAdEventListener(AdEventType.ERROR, (err) => {
            console.log('AdMob: Interstitial Load Error', err.message);
            isInterstitialLoading = false;
            interstitialRetryCount++;
            const delay = Math.min(60000, 5000 * Math.pow(2, interstitialRetryCount - 1));
            console.log(`AdMob: Retrying Interstitial load in ${delay / 1000}s...`);
            setTimeout(() => AdManager.loadInterstitial(), delay);
        });

        // Initial loads
        AdManager.loadInterstitial();
        AdManager.loadRewarded();
    }
};
