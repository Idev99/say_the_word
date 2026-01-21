
// Mock AdManager for Web and other platforms without AdMob support
export const AD_UNITS = {
    BANNER: 'mock-banner',
    INTERSTITIAL: 'mock-interstitial',
    REWARDED: 'mock-rewarded',
};

export const AdManager = {
    loadInterstitial: () => {
        console.log('AdManager: [Web Mock] loadInterstitial');
    },
    isRewardedLoaded: () => {
        return true;
    },
    showInterstitial: async () => {
        console.log('AdManager: [Web Mock] showInterstitial');
        return true;
    },
    loadRewarded: () => {
        console.log('AdManager: [Web Mock] loadRewarded');
    },
    showRewarded: async (onReward: () => void) => {
        console.log('AdManager: [Web Mock] showRewarded (auto-rewarding)');
        onReward();
        return true;
    },
    initialize: async () => {
        console.log('AdManager: [Web Mock] initialize');
    }
};
