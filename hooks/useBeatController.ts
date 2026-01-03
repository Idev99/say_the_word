import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useGameStore } from '../store/gameStore';

// Default beat sound (placeholder, we will need to load a real one)
// For now we assume a local asset will be placed at assets/sounds/beat.mp3
const BEAT_SOUND = { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' }; 

export const useBeatController = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const { isPlaying, bpm, setBeat } = useGameStore();
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
    if (isPlaying) {
      const beatInterval = 60000 / bpm;
      let beatCount = 0;
      
      // Start loop
      playBeat(); // Play first beat immediately
      setBeat(0);

      intervalRef.current = setInterval(() => {
        beatCount++;
        playBeat();
        setBeat(beatCount);
      }, beatInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm, playBeat, setBeat]);
};
