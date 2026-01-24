import { Audio } from 'expo-av';

export const SOUNDS_CONFIG = {
  monmagaietsifflet2: require('../assets/sounds/monmagaietsifflet2.mp3'),
  siffletgo: require('../assets/sounds/siffletgo.mp3'),
  beat: { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
};

// Global cache to avoid reloading sounds on every hook mount
let globalSounds: Record<string, Audio.Sound> = {};
let soundsPromise: Promise<void> | null = null;

const loadAllSounds = async () => {
  if (soundsPromise) return soundsPromise;

  soundsPromise = (async () => {
    try {
      for (const [key, asset] of Object.entries(SOUNDS_CONFIG)) {
        const { sound } = await Audio.Sound.createAsync(asset);
        globalSounds[key] = sound;
      }
    } catch (error) {
      console.warn('Error loading sound effects', error);
    }
  })();

  return soundsPromise;
};

// Auto-start loading
loadAllSounds();

export const useSoundEffects = () => {
  const playSound = async (name: keyof typeof SOUNDS_CONFIG, rate: number = 1.0, volume: number = 1.0): Promise<void> => {
    await loadAllSounds(); // Ensure loaded

    return new Promise(async (resolve) => {
      try {
        const sound = globalSounds[name];
        if (sound) {
          await sound.stopAsync();
          await sound.setRateAsync(rate, true);
          await sound.setVolumeAsync(volume);
          
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              sound.setOnPlaybackStatusUpdate(null);
              resolve();
            }
          });

          await sound.replayAsync();
        } else {
          resolve();
        }
      } catch (error) {
        console.warn(`Error playing sound: ${name}`, error);
        resolve();
      }
    });
  };

  const stopAllSounds = async () => {
    try {
      for (const sound of Object.values(globalSounds)) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.warn('Error stopping sounds', error);
    }
  };

  return { playSound, stopAllSounds };
};
