import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useGameStore } from '../store/gameStore';

// Default beat sound (placeholder, we will need to load a real one)
// For now we assume a local asset will be placed at assets/sounds/beat.mp3
const BEAT_SOUND = { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' }; 

export const useBeatController = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const { isPlaying, bpm, setBeat, isRoundIntro } = useGameStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load sound
  useEffect(() => {
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(BEAT_SOUND);
        soundRef.current = sound;
      } catch (error) {
        console.warn('Error loading beat sound', error);
      }
    }
    loadSound();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const playBeat = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (e) {
      console.log('Error playing beat', e);
    }
  }, []);

  useEffect(() => {
    // Only start beats if playing AND not in intro/presentation mode
    if (isPlaying && !isRoundIntro) {
      const beatInterval = 60000 / bpm;
      let beatCount = 0;
      
      // Start loop
      playBeat(); // Play first beat immediately
      setBeat(0);

      intervalRef.current = setInterval(() => {
        beatCount++;
        
        // Check end of round sequence (8 items, no pause)
        const itemsPerRound = 8;
        const totalRoundBeats = itemsPerRound; 

        if (beatCount >= totalRoundBeats) {
             const { nextRound, currentLevel, currentRound, stopGame, completeGame } = useGameStore.getState();
             
             if (currentLevel && currentRound >= currentLevel.rounds) {
                 // Game Over
                 clearInterval(intervalRef.current!);
                 completeGame();
                 // Should navigate to result screen realistically
             } else {
                 // Next Round
                 nextRound();
                 beatCount = -1; // Reset beat count for next round (-1 because we increment immediately next loop? No, we need to sync)
                 // actually nextRound resets beat to -1 in store.
                 // But this local `beatCount` needs reset too.
                 // And we want the next beat (beat 0) to play immediately? 
                 // Or wait one interval? 
                 // If we reset to -1, next tick (interval) it becomes 0 and we playBeat. Correct.
                 beatCount = -1; 
             }
        } else {
            // Normal beat
            if (beatCount < itemsPerRound) {
                playBeat();
            }
            // If beatCount >= 8 (the pause beats), we don't play sound? Or maybe a different sound?
            // Site has a different "tock" or silence. Let's silence for now.
            setBeat(beatCount);
        }
      }, beatInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm, playBeat, setBeat, isRoundIntro]);
};
