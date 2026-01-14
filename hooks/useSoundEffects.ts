import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const SOUNDS = {
  monmagai: require('../assets/sounds/monmagai.mp3'),
  sifflet: require('../assets/sounds/sifflet.mp3'),
};

export const useSoundEffects = () => {
  const soundsRef = useRef<Record<string, Audio.Sound>>({});

  useEffect(() => {
    async function loadSounds() {
      try {
        const loadedSounds: Record<string, Audio.Sound> = {};
        for (const [key, asset] of Object.entries(SOUNDS)) {
          const { sound } = await Audio.Sound.createAsync(asset);
          loadedSounds[key] = sound;
        }
        soundsRef.current = loadedSounds;
      } catch (error) {
        console.warn('Error loading sound effects', error);
      }
    }
    loadSounds();

    return () => {
      // Unload all sounds on unmount
      Object.values(soundsRef.current).forEach(sound => sound.unloadAsync());
    };
  }, []);

  const playSound = async (name: keyof typeof SOUNDS, rate: number = 1.0) => {
    try {
      const sound = soundsRef.current[name];
      if (sound) {
        // Stop any current playback to ensure a clean start
        await sound.stopAsync();
        await sound.setRateAsync(rate, true);
        await sound.replayAsync();
      }
    } catch (error) {
      console.warn(`Error playing sound: ${name}`, error);
    }
  };

  return { playSound };
};
