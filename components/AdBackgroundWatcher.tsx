import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { AdManager } from '../utils/AdManager';
import { Alert } from 'react-native';
import { translations } from '../constants/translations';

export default function AdBackgroundWatcher() {
    const { isPendingBoost, pendingBoostChallengeId, setPendingBoost, boostChallenge, language } = useGameStore();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isPendingBoost || !pendingBoostChallengeId) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        console.log(`[AdWatcher] Watching for ad to boost: ${pendingBoostChallengeId}`);

        const startTime = Date.now();
        const t = (translations[language].challenges as any).rewards || {};

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(async () => {
            const elapsed = Date.now() - startTime;

            // 1 Minute Timeout
            if (elapsed > 60000) {
                console.log("[AdWatcher] Timeout reached (1 min). Cancelling.");
                setPendingBoost(false, null);
                if (intervalRef.current) clearInterval(intervalRef.current);
                Alert.alert(t.boostTitle || "Boost", t.adNotReady || "Ad not ready, try again later.");
                return;
            }

            if (AdManager.isRewardedLoaded()) {
                console.log("[AdWatcher] Ad Loaded! Showing now...");
                if (intervalRef.current) clearInterval(intervalRef.current);

                // Reset pending state BEFORE showing to avoid race conditions
                setPendingBoost(false, null);

                const success = await AdManager.showRewarded(() => {
                    boostChallenge(pendingBoostChallengeId);
                });

                if (!success) {
                    console.warn("[AdWatcher] Ad show failed after load.");
                }
            } else if (elapsed % 10000 < 1000) {
                // Occasional log and force reload just in case
                console.log(`[AdWatcher] Still waiting... (${Math.round(elapsed / 1000)}s)`);
                AdManager.loadRewarded();
            }
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPendingBoost, pendingBoostChallengeId, language]);

    return null;
}
