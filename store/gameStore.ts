import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, translations } from '../constants/translations';
import { Alert, Platform } from 'react-native';
import * as idb from 'idb-keyval';
import { NotificationManager } from '../utils/NotificationManager';

// Custom persistence for Web (IndexedDB) to bypass 5MB quota
const idbStorage = {
    getItem: async (name: string): Promise<string | null> => {
        if (Platform.OS !== 'web') return await AsyncStorage.getItem(name);
        return (await idb.get(name)) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        if (Platform.OS !== 'web') return await AsyncStorage.setItem(name, value);
        await idb.set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        if (Platform.OS !== 'web') return await AsyncStorage.removeItem(name);
        await idb.del(name);
    },
};

export type GameState = 'MENU' | 'PLAYING' | 'RESULT' | 'CREATING';

export interface LevelData {
  id: string;
  name: string;
  images: any[]; // URLs or local paths
  imageNames?: Record<string, string>; // path/uri -> name
  rounds: number;
}

export interface CommunityChallenge extends LevelData {
  creatorMode: 'RANDOM' | 'CUSTOM';
  creatorRoundLayouts: Record<number, (any | null)[]>;
  creatorImages: any[];
  playsCount: number;
  likes: number;
  dislikes: number;
  fire: number;
  boostLevel?: number; // Total/Persistence level
  boostsToday?: number; // 0 to 5, resets daily
  isViral?: boolean; // If this challenge is destined to "buzz"
  hasBuzzNotified?: boolean; // To prevent multiple alerts
  createdAt: number; // timestamp
  lastNotifiedLevel?: number; // 0 to 15 (representing 1k to 15k views)
}

interface GameStore {
  gameState: GameState;
  currentLevel: LevelData | null;
  currentRound: number;
  currentBeat: number; // 0 to TotalSteps
  bpm: number;
  isPlaying: boolean;
  isRoundIntro: boolean;
  language: Language;
  introSpeed: number;
  introAnimationSpeed: number;
  activeTab: 'featured' | 'community' | 'myChallenges' | 'videos';
  showImageNames: boolean;
  isLoggedIn: boolean;
  userChallengeIds: string[];

  // Community State
  communityChallenges: CommunityChallenge[];
  lastEngagementRefresh: number;
  
  // User Stats
  totalFire: number;
  lastResult: { fire: number } | null;
  retryCount: number;
  lastBoostReset: number;
  lastGlobalBoostTime: number;

  // Actions
  setLanguage: (lang: Language) => void;
  setGameState: (state: GameState) => void;
  loadLevel: (level: LevelData | CommunityChallenge) => void;
  startRound: () => void;
  nextRound: () => void;
  setBeat: (beat: number) => void;
  setIntroSpeed: (speed: number) => void;
  setIntroAnimationSpeed: (speed: number) => void;
  boostChallenge: (id: string) => void;
  setLastGlobalBoostTime: (time: number) => void;
  checkBoostReset: () => void;

  endRoundIntro: () => void;
  stopGame: () => void;
  restartGame: () => void;
  setActiveTab: (tab: 'featured' | 'community' | 'myChallenges' | 'videos') => void;
  setShowImageNames: (show: boolean) => void;
  completeGame: () => void;
  rateChallenge: (id: string, stars: number) => void;
  login: () => void;

  // Creator State
  creatorName: string;
  creatorImages: any[];
  creatorImageNames: Record<string, string>;
  creatorMode: 'RANDOM' | 'CUSTOM';
  creatorRoundLayouts: Record<number, (any | null)[]>; // Round -> Array of 8 images (or null)

  // Creator Actions
  setCreatorName: (name: string) => void;
  addCreatorImage: (uri: string) => void;
  removeCreatorImage: (index: number) => void;
  setCreatorImageName: (uri: string, name: string) => void;
  setCreatorMode: (mode: 'RANDOM' | 'CUSTOM') => void;
  setCreatorRoundSlot: (round: number, slotIndex: number, imageUri: string) => void;
  fillRandomSlots: () => void;
  saveChallenge: () => void;

  resetCreator: () => void;
  refreshEngagement: () => void;
  
  // Custom Game Start
  loadCustomLevel: () => void;
  
  // Stats Actions
  addFire: (amount: number) => void;

  // Ad Actions
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
  gameState: 'MENU',
  currentLevel: null,
  currentRound: 1,
  currentBeat: -1,
  bpm: 210,
  isPlaying: false,
  isRoundIntro: false,
  language: 'EN',
  introSpeed: 1.15,
  introAnimationSpeed: 1.15,
  activeTab: 'featured',
  showImageNames: false,
  isLoggedIn: false,
  userChallengeIds: [], // User-created challenges will be persisted here
  lastEngagementRefresh: Date.now(),
  totalFire: 0,
  lastResult: null,
  retryCount: 0,
  lastBoostReset: Date.now(),
  lastGlobalBoostTime: 0,
  setLastGlobalBoostTime: (time: number) => set({ lastGlobalBoostTime: time }),

  communityChallenges: [
    {
        id: 'comm-1',
        name: 'community.challenge1.name',
        rounds: 5,
        images: [],
        creatorMode: 'CUSTOM',
        creatorRoundLayouts: {
            1: [
              require('../assets/images/billy.png'), require('../assets/images/squeezie.png'), require('../assets/images/biaggi.png'),
              require('../assets/images/squeezie.png'), require('../assets/images/billy.png'), require('../assets/images/biaggi.png'),
              require('../assets/images/biaggi.png'), require('../assets/images/billy.png')
            ],
            2: [
              require('../assets/images/squeezie.png'), require('../assets/images/biaggi.png'), require('../assets/images/billy.png'),
              require('../assets/images/biaggi.png'), require('../assets/images/squeezie.png'), require('../assets/images/billy.png'),
              require('../assets/images/billy.png'), require('../assets/images/squeezie.png')
            ],
            3: [
              require('../assets/images/biaggi.png'), require('../assets/images/billy.png'), require('../assets/images/squeezie.png'),
              require('../assets/images/billy.png'), require('../assets/images/biaggi.png'), require('../assets/images/squeezie.png'),
              require('../assets/images/squeezie.png'), require('../assets/images/biaggi.png')
            ],
            4: [
              require('../assets/images/billy.png'), require('../assets/images/biaggi.png'), require('../assets/images/squeezie.png'),
              require('../assets/images/squeezie.png'), require('../assets/images/billy.png'), require('../assets/images/biaggi.png'),
              require('../assets/images/biaggi.png'), require('../assets/images/squeezie.png')
            ],
            5: [
              require('../assets/images/squeezie.png'), require('../assets/images/billy.png'), require('../assets/images/biaggi.png'),
              require('../assets/images/billy.png'), require('../assets/images/squeezie.png'), require('../assets/images/biaggi.png'),
              require('../assets/images/biaggi.png'), require('../assets/images/billy.png')
            ]
        },
        creatorImages: [
          require('../assets/images/squeezie.png'), 
          require('../assets/images/billy.png'), 
          require('../assets/images/biaggi.png')
        ],
        playsCount: 15400,
        likes: 1205,
        dislikes: 2,
        fire: 15,
        createdAt: Date.now() - (8 * 24 * 60 * 60 * 1000),
        imageNames: {
            [require('../assets/images/billy.png')]: "billy",
            [require('../assets/images/squeezie.png')]: "squeezie",
            [require('../assets/images/biaggi.png')]: "biaggi"
        }
    },
    {
        id: 'comm-2',
        name: 'community.challenge2.name',
        rounds: 5,
        images: [],
        creatorMode: 'CUSTOM',
        creatorRoundLayouts: {
            1: [require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png')],
            2: [require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png')],
            3: [require('../assets/images/steak.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/watermelon.png')],
            4: [require('../assets/images/watermelon.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/steak.png')],
            5: [require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png'), require('../assets/images/watermelon.png'), require('../assets/images/steak.png')]
        },
        creatorImages: [require('../assets/images/steak.png'), require('../assets/images/watermelon.png')],
        playsCount: 3500,
        likes: 150,
        dislikes: 11,
        fire: 0,
        createdAt: Date.now() - (25 * 24 * 60 * 60 * 1000),
        imageNames: {
            [require('../assets/images/steak.png')]: "steak",
            [require('../assets/images/watermelon.png')]: "watermelon",
            [require('../assets/images/cake.png')]: "cake",
            [require('../assets/images/coffee.png')]: "coffee"
        }
    },
    {
        id: 'comm-3',
        name: 'community.challenge3.name',
        rounds: 5,
        images: [],
        creatorMode: 'CUSTOM',
        creatorRoundLayouts: {
            1: [require('../assets/images/msn.png'), require('../assets/images/piscine.png'), require('../assets/images/scene.png'), require('../assets/images/msn.png'), require('../assets/images/piscine.png'), require('../assets/images/scene.png'), require('../assets/images/msn.png'), require('../assets/images/piscine.png')],
            2: [require('../assets/images/scene.png'), require('../assets/images/msn.png'), require('../assets/images/piscine.png'), require('../assets/images/scene.png'), require('../assets/images/msn.png'), require('../assets/images/piscine.png'), require('../assets/images/scene.png'), require('../assets/images/msn.png')],
            3: [require('../assets/images/piscine.png'), require('../assets/images/scene.png'), require('../assets/images/msn.png'), require('../assets/images/piscine.png'), require('../assets/images/scene.png'), require('../assets/images/msn.png'), require('../assets/images/piscine.png'), require('../assets/images/scene.png')],
            4: [require('../assets/images/msn.png'), require('../assets/images/msn.png'), require('../assets/images/piscine.png'), require('../assets/images/piscine.png'), require('../assets/images/scene.png'), require('../assets/images/scene.png'), require('../assets/images/msn.png'), require('../assets/images/msn.png')],
            5: [require('../assets/images/piscine.png'), require('../assets/images/piscine.png'), require('../assets/images/scene.png'), require('../assets/images/scene.png'), require('../assets/images/msn.png'), require('../assets/images/msn.png'), require('../assets/images/piscine.png'), require('../assets/images/piscine.png')]
        },
        creatorImages: [require('../assets/images/msn.png'), require('../assets/images/piscine.png'), require('../assets/images/scene.png')],
        playsCount: 996,
        likes: 6,
        dislikes: 0,
        fire: 5,
        createdAt: Date.now() - (35 * 24 * 60 * 60 * 1000),
        imageNames: {
            [require('../assets/images/msn.png')]: "msn",
            [require('../assets/images/piscine.png')]: "piscine",
            [require('../assets/images/scene.png')]: "scene"
        }
    },
    {
        id: 'comm-4',
        name: 'community.challenge4.name',
        rounds: 5,
        images: [],
        creatorMode: 'CUSTOM',
        creatorRoundLayouts: {
            1: [require('../assets/images/baby.png'), require('../assets/images/bird.png'), require('../assets/images/cat.png'), require('../assets/images/baby.png'), require('../assets/images/bird.png'), require('../assets/images/cat.png'), require('../assets/images/baby.png'), require('../assets/images/bird.png')],
            2: [require('../assets/images/cat.png'), require('../assets/images/baby.png'), require('../assets/images/bird.png'), require('../assets/images/cat.png'), require('../assets/images/baby.png'), require('../assets/images/bird.png'), require('../assets/images/cat.png'), require('../assets/images/baby.png')],
            3: [require('../assets/images/bird.png'), require('../assets/images/cat.png'), require('../assets/images/baby.png'), require('../assets/images/bird.png'), require('../assets/images/cat.png'), require('../assets/images/baby.png'), require('../assets/images/bird.png'), require('../assets/images/cat.png')],
            4: [require('../assets/images/baby.png'), require('../assets/images/baby.png'), require('../assets/images/bird.png'), require('../assets/images/bird.png'), require('../assets/images/cat.png'), require('../assets/images/cat.png'), require('../assets/images/baby.png'), require('../assets/images/baby.png')],
            5: [require('../assets/images/cat.png'), require('../assets/images/cat.png'), require('../assets/images/bird.png'), require('../assets/images/bird.png'), require('../assets/images/baby.png'), require('../assets/images/baby.png'), require('../assets/images/cat.png'), require('../assets/images/cat.png')]
        },
        creatorImages: [require('../assets/images/baby.png'), require('../assets/images/bird.png'), require('../assets/images/cat.png')],
        playsCount: 120,
        likes: 12,
        dislikes: 0,
        fire: 55,
        createdAt: Date.now() - (35 * 24 * 60 * 60 * 1000),
        imageNames: {
            [require('../assets/images/baby.png')]: "baby",
            [require('../assets/images/bird.png')]: "bird",
            [require('../assets/images/cat.png')]: "cat"
        }
    },
    {
        id: 'comm-5',
        name: 'community.challenge5.name',
        rounds: 5,
        images: [],
        creatorMode: 'CUSTOM',
        creatorRoundLayouts: {
            1: [require('../assets/images/red.png'), require('../assets/images/blue.png'), require('../assets/images/green.png'), require('../assets/images/yellow.png'), require('../assets/images/red.png'), require('../assets/images/blue.png'), require('../assets/images/green.png'), require('../assets/images/yellow.png')],
            2: [require('../assets/images/yellow.png'), require('../assets/images/red.png'), require('../assets/images/blue.png'), require('../assets/images/green.png'), require('../assets/images/yellow.png'), require('../assets/images/red.png'), require('../assets/images/blue.png'), require('../assets/images/green.png')],
            3: [require('../assets/images/green.png'), require('../assets/images/yellow.png'), require('../assets/images/red.png'), require('../assets/images/blue.png'), require('../assets/images/green.png'), require('../assets/images/yellow.png'), require('../assets/images/red.png'), require('../assets/images/blue.png')],
            4: [require('../assets/images/blue.png'), require('../assets/images/green.png'), require('../assets/images/yellow.png'), require('../assets/images/red.png'), require('../assets/images/blue.png'), require('../assets/images/green.png'), require('../assets/images/yellow.png'), require('../assets/images/red.png')],
            5: [require('../assets/images/red.png'), require('../assets/images/yellow.png'), require('../assets/images/blue.png'), require('../assets/images/green.png'), require('../assets/images/red.png'), require('../assets/images/yellow.png'), require('../assets/images/blue.png'), require('../assets/images/green.png')]
        },
        creatorImages: [require('../assets/images/red.png'), require('../assets/images/blue.png'), require('../assets/images/green.png'), require('../assets/images/yellow.png')],
        playsCount: 450,
        likes: 24,
        dislikes: 1,
        fire: 8,
        createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000),
        imageNames: {
            [require('../assets/images/red.png')]: "red",
            [require('../assets/images/blue.png')]: "blue",
            [require('../assets/images/green.png')]: "green",
            [require('../assets/images/yellow.png')]: "yellow"
        }
    },
    {
        id: 'comm-6',
        name: 'community.challenge6.name',
        rounds: 5,
        images: [],
        creatorMode: 'CUSTOM',
        creatorRoundLayouts: {
            1: [require('../assets/images/usa.png'), require('../assets/images/china.png'), require('../assets/images/russia.png'), require('../assets/images/ukraine.png'), require('../assets/images/usa.png'), require('../assets/images/china.png'), require('../assets/images/russia.png'), require('../assets/images/ukraine.png')],
            2: [require('../assets/images/ukraine.png'), require('../assets/images/usa.png'), require('../assets/images/china.png'), require('../assets/images/russia.png'), require('../assets/images/ukraine.png'), require('../assets/images/usa.png'), require('../assets/images/china.png'), require('../assets/images/russia.png')],
            3: [require('../assets/images/russia.png'), require('../assets/images/ukraine.png'), require('../assets/images/usa.png'), require('../assets/images/china.png'), require('../assets/images/russia.png'), require('../assets/images/ukraine.png'), require('../assets/images/usa.png'), require('../assets/images/china.png')],
            4: [require('../assets/images/china.png'), require('../assets/images/russia.png'), require('../assets/images/ukraine.png'), require('../assets/images/usa.png'), require('../assets/images/china.png'), require('../assets/images/russia.png'), require('../assets/images/ukraine.png'), require('../assets/images/usa.png')],
            5: [require('../assets/images/usa.png'), require('../assets/images/russia.png'), require('../assets/images/china.png'), require('../assets/images/ukraine.png'), require('../assets/images/usa.png'), require('../assets/images/russia.png'), require('../assets/images/china.png'), require('../assets/images/ukraine.png')]
        },
        creatorImages: [require('../assets/images/usa.png'), require('../assets/images/china.png'), require('../assets/images/russia.png'), require('../assets/images/ukraine.png')],
        playsCount: 1800,
        likes: 45,
        dislikes: 0,
        fire: 3,
        createdAt: Date.now() - (12 * 24 * 60 * 60 * 1000),
        imageNames: {
            [require('../assets/images/usa.png')]: "usa",
            [require('../assets/images/china.png')]: "china",
            [require('../assets/images/russia.png')]: "russia",
            [require('../assets/images/ukraine.png')]: "ukraine"
        }
    },
    {
        id: 'comm-7',
        name: 'community.challenge7.name',
        rounds: 5,
        images: [],
        creatorMode: 'CUSTOM',
        creatorRoundLayouts: {
            1: [require('../assets/images/1.png'), require('../assets/images/2.png'), require('../assets/images/3.png'), require('../assets/images/4.png'), require('../assets/images/1.png'), require('../assets/images/2.png'), require('../assets/images/3.png'), require('../assets/images/4.png')],
            2: [require('../assets/images/4.png'), require('../assets/images/1.png'), require('../assets/images/2.png'), require('../assets/images/3.png'), require('../assets/images/4.png'), require('../assets/images/1.png'), require('../assets/images/2.png'), require('../assets/images/3.png')],
            3: [require('../assets/images/3.png'), require('../assets/images/4.png'), require('../assets/images/1.png'), require('../assets/images/2.png'), require('../assets/images/3.png'), require('../assets/images/4.png'), require('../assets/images/1.png'), require('../assets/images/2.png')],
            4: [require('../assets/images/2.png'), require('../assets/images/3.png'), require('../assets/images/4.png'), require('../assets/images/1.png'), require('../assets/images/2.png'), require('../assets/images/3.png'), require('../assets/images/4.png'), require('../assets/images/1.png')],
            5: [require('../assets/images/1.png'), require('../assets/images/3.png'), require('../assets/images/2.png'), require('../assets/images/4.png'), require('../assets/images/1.png'), require('../assets/images/3.png'), require('../assets/images/2.png'), require('../assets/images/4.png')]
        },
        creatorImages: [require('../assets/images/1.png'), require('../assets/images/2.png'), require('../assets/images/3.png'), require('../assets/images/4.png')],
        playsCount: 4200,
        likes: 210,
        dislikes: 5,
        fire: 10,
        createdAt: Date.now() - (15 * 24 * 60 * 60 * 1000),
        imageNames: {
            [require('../assets/images/1.png')]: "1",
            [require('../assets/images/2.png')]: "2",
            [require('../assets/images/3.png')]: "3",
            [require('../assets/images/4.png')]: "4"
        }
    },
    {
        id: 'comm-8',
        name: 'community.challenge8.name',
        rounds: 5,
        images: [],
        creatorMode: 'CUSTOM',
        creatorRoundLayouts: {
            1: [require('../assets/images/coffee.png'), require('../assets/images/cake.png'), require('../assets/images/butter.png'), require('../assets/images/bubble.png'), require('../assets/images/coffee.png'), require('../assets/images/cake.png'), require('../assets/images/butter.png'), require('../assets/images/bubble.png')],
            2: [require('../assets/images/bubble.png'), require('../assets/images/coffee.png'), require('../assets/images/cake.png'), require('../assets/images/butter.png'), require('../assets/images/bubble.png'), require('../assets/images/coffee.png'), require('../assets/images/cake.png'), require('../assets/images/butter.png')],
            3: [require('../assets/images/butter.png'), require('../assets/images/bubble.png'), require('../assets/images/coffee.png'), require('../assets/images/cake.png'), require('../assets/images/butter.png'), require('../assets/images/bubble.png'), require('../assets/images/coffee.png'), require('../assets/images/cake.png')],
            4: [require('../assets/images/cake.png'), require('../assets/images/butter.png'), require('../assets/images/bubble.png'), require('../assets/images/coffee.png'), require('../assets/images/cake.png'), require('../assets/images/butter.png'), require('../assets/images/bubble.png'), require('../assets/images/coffee.png')],
            5: [require('../assets/images/coffee.png'), require('../assets/images/butter.png'), require('../assets/images/cake.png'), require('../assets/images/bubble.png'), require('../assets/images/coffee.png'), require('../assets/images/butter.png'), require('../assets/images/cake.png'), require('../assets/images/bubble.png')]
        },
        creatorImages: [require('../assets/images/coffee.png'), require('../assets/images/cake.png'), require('../assets/images/butter.png'), require('../assets/images/bubble.png')],
        playsCount: 950,
        likes: 32,
        dislikes: 1,
        fire: 20,
        createdAt: Date.now() - (20 * 24 * 60 * 60 * 1000),
        imageNames: {
            [require('../assets/images/coffee.png')]: "coffee",
            [require('../assets/images/cake.png')]: "cake",
            [require('../assets/images/butter.png')]: "butter",
            [require('../assets/images/bubble.png')]: "bubble"
        }
    }
  ],
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setLanguage: (lang) => set({ language: lang }),
  setGameState: (state) => set({ gameState: state }),
  setShowImageNames: (show) => set({ showImageNames: show }),
  loadLevel: (level) => set((state) => {
    const isCommunity = 'creatorMode' in level;
    
    if (isCommunity) {
      const comm = level as CommunityChallenge;
      let initialImages: string[] = [];
      if (comm.creatorMode === 'CUSTOM') {
          initialImages = (comm.creatorRoundLayouts[1] || Array(8).fill(null)).map(img => img || 'https://via.placeholder.com/150');
      } else {
          initialImages = Array(8).fill(null).map(() => comm.creatorImages[Math.floor(Math.random() * comm.creatorImages.length)]);
      }

      return {
          currentLevel: { ...comm, images: initialImages },
          currentRound: 1,
          currentBeat: -1,
          isRoundIntro: false,
          creatorImages: comm.creatorImages,
          creatorMode: comm.creatorMode,
          creatorRoundLayouts: comm.creatorRoundLayouts
      };
    }

    // Featured Level Logic
    const pool = level.images;
    const initialImages = Array(8).fill(null).map(() => pool[Math.floor(Math.random() * pool.length)]);
    
    return { 
        currentLevel: { ...level, images: initialImages },
        currentRound: 1, 
        currentBeat: -1, 
        isRoundIntro: false,
        // Set these so nextRound() continues to randomize
        creatorImages: pool,
        creatorMode: 'RANDOM'
    };
  }),
  startRound: () => set({ isPlaying: true, isRoundIntro: true, currentBeat: -1 }),
  endRoundIntro: () => set({ isRoundIntro: false }),
  nextRound: () => set((state) => {
      const nextR = state.currentRound + 1;
      let nextImages = state.currentLevel?.images || [];

      // If Custom Mode, load specific round images
      if (state.creatorMode === 'CUSTOM' && state.creatorRoundLayouts) {
          const roundLayout = state.creatorRoundLayouts[nextR];
          if (roundLayout) {
             nextImages = roundLayout.map(img => img || 'https://via.placeholder.com/150') as string[];
          }
      } else if (state.creatorMode === 'RANDOM' && state.creatorImages.length > 0) {
          // Regenerate random layout for next round
          nextImages = Array(8).fill(null).map(() => state.creatorImages[Math.floor(Math.random() * state.creatorImages.length)]);
      }

      return {
          currentRound: nextR,
          currentBeat: -1,
          isRoundIntro: true, // Enable intro for the next round
          currentLevel: state.currentLevel ? { ...state.currentLevel, images: nextImages } : null
      };
  }),
  setBeat: (beat) => set({ currentBeat: beat }),
  stopGame: () => set({ isPlaying: false, gameState: 'MENU', isRoundIntro: false, currentBeat: -1 }),
  completeGame: () => set((state) => {
      // Calculate Fire for this session (e.g., base 10)
      const earnedFire = 10; 
      const newTotalFire = state.totalFire + earnedFire;

      const isCommunity = state.currentLevel && state.communityChallenges.some(c => c.id === state.currentLevel?.id);
      
      if (isCommunity) {
          const updatedChallenges = state.communityChallenges.map(c => 
              c.id === state.currentLevel?.id ? { ...c, playsCount: c.playsCount + 1 } : c
          );
          return {
              isPlaying: false,
              gameState: 'RESULT',
              isRoundIntro: false,
              communityChallenges: updatedChallenges,
              totalFire: newTotalFire,
              lastResult: { fire: earnedFire }
          };
      }

      return { 
        isPlaying: false, 
        gameState: 'RESULT', 
        isRoundIntro: false,
        totalFire: newTotalFire,
        lastResult: { fire: earnedFire }
      };
  }),

  addFire: (amount) => set((state) => ({ totalFire: state.totalFire + amount })),

  incrementRetryCount: () => set((state) => ({ retryCount: state.retryCount + 1 })),
  resetRetryCount: () => set({ retryCount: 0 }),
  
  boostChallenge: (id: string) => set((state) => {
    const updatedChallenges = state.communityChallenges.map(c => {
        if (c.id === id) {
            const todayBoosts = c.boostsToday || 0;
            if (todayBoosts >= 5) return c;

            // Boost now only increases the multiplier/level, doesn't add views instantly (Phantom growth)
            return { 
                ...c, 
                boostLevel: (c.boostLevel || 0) + 1,
                boostsToday: todayBoosts + 1,
                fire: c.fire + (Math.floor(Math.random() * 3) + 2), // +2-5 flames per boost
            };
        }
        return c;
    });

    return { 
        communityChallenges: updatedChallenges,
        lastGlobalBoostTime: Date.now()
    };
  }),

  checkBoostReset: () => set((state) => {
    const now = Date.now();
    const lastResetDate = new Date(state.lastBoostReset).toLocaleDateString();
    const todayDate = new Date(now).toLocaleDateString();

    if (lastResetDate !== todayDate) {
        const resetChallenges = state.communityChallenges.map(c => ({
            ...c,
            boostsToday: 0
        }));
        return { 
            communityChallenges: resetChallenges,
            lastBoostReset: now 
        };
    }
    return {};
  }),

  rateChallenge: (id, stars) => set((state) => {
      const updatedChallenges = state.communityChallenges.map(c => {
          if (c.id === id) {
              if (stars >= 4) return { ...c, likes: c.likes + 1 };
              if (stars <= 2) return { ...c, dislikes: c.dislikes + 1 };
          }
          return c;
      });
      return { communityChallenges: updatedChallenges };
  }),
  login: () => set({ isLoggedIn: true }),
  setBpm: (bpm: number) => set({ bpm }),
  setIntroSpeed: (speed: number) => set({ introSpeed: speed }),
  setIntroAnimationSpeed: (speed: number) => set({ introAnimationSpeed: speed }),

  restartGame: () => set((state) => {
    let nextImages = state.currentLevel?.images || [];
    
    if (state.creatorMode === 'RANDOM' && state.creatorImages.length > 0) {
      nextImages = Array(8).fill(null).map(() => state.creatorImages[Math.floor(Math.random() * state.creatorImages.length)]);
    } else if (state.creatorMode === 'CUSTOM' && state.creatorRoundLayouts) {
      const roundLayout = state.creatorRoundLayouts[1];
      if (roundLayout) {
        nextImages = roundLayout.map(img => img || 'https://via.placeholder.com/150') as string[];
      }
    }

    return {
      currentRound: 1,
      currentBeat: -1,
      isPlaying: false,
      gameState: 'MENU',
      isRoundIntro: false,
      currentLevel: state.currentLevel ? { ...state.currentLevel, images: nextImages } : null
    };
  }),

  // Creator Init
  creatorName: '',
  creatorImages: [],
  creatorImageNames: {},
  creatorMode: 'RANDOM',
  creatorRoundLayouts: { 1: Array(8).fill(null), 2: Array(8).fill(null), 3: Array(8).fill(null), 4: Array(8).fill(null), 5: Array(8).fill(null) },

  setCreatorName: (name) => set({ creatorName: name }),
  addCreatorImage: (uri) => set((state) => ({ creatorImages: [...state.creatorImages, uri] })),
  removeCreatorImage: (index) => set((state) => {
      const uri = state.creatorImages[index];
      const newNames = { ...state.creatorImageNames };
      delete newNames[uri];
      return { 
          creatorImages: state.creatorImages.filter((_, i) => i !== index),
          creatorImageNames: newNames
      };
  }),
  setCreatorImageName: (uri, name) => set((state) => ({
      creatorImageNames: { ...state.creatorImageNames, [uri]: name }
  })),
  setCreatorMode: (mode) => set({ creatorMode: mode }),
  setCreatorRoundSlot: (round, slot, uri) => set((state) => {
      const currentRoundLayout = [...(state.creatorRoundLayouts[round] || Array(8).fill(null))];
      currentRoundLayout[slot] = uri;
      return { creatorRoundLayouts: { ...state.creatorRoundLayouts, [round]: currentRoundLayout } };
  }),
  fillRandomSlots: () => set((state) => {
      const newLayouts = { ...state.creatorRoundLayouts };
      const images = state.creatorImages;
      if (images.length === 0) return {}; // No images to fill with

      [1, 2, 3, 4, 5].forEach(round => {
          const layout = newLayouts[round] || Array(8).fill(null);
          const filledLayout = layout.map(slot => {
              if (slot) return slot;
              return images[Math.floor(Math.random() * images.length)];
          });
          newLayouts[round] = filledLayout;
      });
      return { creatorRoundLayouts: newLayouts };
  }),
  saveChallenge: () => set((state) => {
      const id = `comm-${Date.now()}`;
      // Randomly assign viral status (higher chance for first few challenges)
      const isViral = state.userChallengeIds.length < 2 || Math.random() < 0.2;

      const newChallenge: CommunityChallenge = {
          id: id,
          name: state.creatorName || 'Unnamed Challenge',
          images: [], // We use roundLayouts instead
          rounds: 5,
          creatorMode: state.creatorMode,
          creatorRoundLayouts: state.creatorRoundLayouts,
          creatorImages: state.creatorImages,
          playsCount: 0,
          likes: 0,
          dislikes: 0,
          fire: 0,
          boostLevel: 0,
          boostsToday: 0,
          isViral: isViral,
          hasBuzzNotified: false,
          createdAt: Date.now(),
          imageNames: state.creatorImageNames,
      };
      
      const newCommunityChallenges = [newChallenge, ...state.communityChallenges];
      
      return {
          communityChallenges: newCommunityChallenges.slice(0, 25), // Silent pruning to prevent QuotaExceededError
          userChallengeIds: [id, ...state.userChallengeIds],
      };
  }),
  resetCreator: () => set({ creatorName: '', creatorImages: [], creatorImageNames: {}, creatorMode: 'RANDOM', creatorRoundLayouts: { 1: Array(8).fill(null), 2: Array(8).fill(null), 3: Array(8).fill(null), 4: Array(8).fill(null), 5: Array(8).fill(null) } }),

  refreshEngagement: () => set((state) => {
    const now = Date.now();
    const intervalMs = 1 * 60 * 1000; // 1 minute interval for snappy organic updates
    const elapsed = now - state.lastEngagementRefresh;
    
    if (elapsed < intervalMs) return {};

    const intervalsPassed = Math.floor(elapsed / intervalMs);
    
    // Daily Boost Reset Check (Inline)
    const lastResetDate = new Date(state.lastBoostReset).toLocaleDateString();
    const todayDate = new Date(now).toLocaleDateString();
    let currentChallenges = state.communityChallenges;
    let nextBoostResetVal = state.lastBoostReset;

    if (lastResetDate !== todayDate) {
        currentChallenges = currentChallenges.map(c => ({ ...c, boostsToday: 0 }));
        nextBoostResetVal = now;
    }

    const updatedChallenges = currentChallenges.map(challenge => {
      if (!state.userChallengeIds.includes(challenge.id)) return challenge;

      let newPlays = challenge.playsCount;
      let newLikes = challenge.likes;
      let newFire = challenge.fire;
      let notified = !!challenge.hasBuzzNotified;

      const challengeAgeMs = now - challenge.createdAt;
      const challengeIntervals = Math.floor(challengeAgeMs / intervalMs);
      // Only process intervals that occurred AFTER the challenge was created
      const intervalsToProcess = Math.min(intervalsPassed, challengeIntervals);

      for (let i = 0; i < intervalsToProcess; i++) {
        // Calculate age at the specific interval moment for accurate growth
        const ageAtIntervalMs = challengeAgeMs - (intervalsToProcess - 1 - i) * intervalMs;
        const ageHoursAtInterval = ageAtIntervalMs / (1000 * 60 * 60);

        // --- ORGANIC GROWTH LOGIC ---
        
        // 1. Base Multiplier (Grace period -> Diminishing returns)
        let baseChance = 0.95;
        let playRange = [3, 7];

        if (ageHoursAtInterval < 0.05) { // First 3 minutes: "Grace period"
            baseChance = 0.6;
            playRange = [0, 2]; // Max 0-6 views total in 3 mins (Natural)
        } else if (ageHoursAtInterval > 1) { // After 1 hour: "Stabilization"
            baseChance = 0.4;
            playRange = [0, 2];
        }
        
        // 2. Viral "Buzz" Multiplier (Delayed start)
        if (challenge.isViral && ageHoursAtInterval > 0.05) {
            baseChance = 1.0; 
            playRange = ageHoursAtInterval < 5 ? [10, 25] : [2, 5]; // Viral burst
        }

        // 3. Phantom Boost Multiplier (+5% chance/rate per flame, randomized)
        const boostLevel = challenge.boostLevel || 0;
        const boostEffect = 1 + (boostLevel * 0.05 * Math.random());
        
        // 4. Calculate Added plays
        const addedBase = Math.floor(Math.random() * (playRange[1] - playRange[0] + 1)) + playRange[0];
        const added = Math.floor(addedBase * boostEffect);
        
        if (Math.random() < baseChance) {
            newPlays += added;
            
            // 5. Random Likes/Fire (tied to plays) - Only if plays added
            if (added > 0) {
                if (Math.random() > 0.85) newLikes += 1;
                if (Math.random() > 0.95) newFire += 1;
            }
        }
      }

      // 6. Tiered Buzz Notifications (every 1,000 views up to 15,000)
      const currentLevel = Math.floor(newPlays / 1000);
      const prevLevel = challenge.lastNotifiedLevel || 0;
      
      if (currentLevel > prevLevel && currentLevel <= 15) {
          const t = translations[state.language].challenges;
          const msg = (t as any).buzzMessages?.[currentLevel - 1];
          if (msg) {
              const buzzTitle = state.language === 'FR' ? "🚀 CHALLENGE EN BUZZ !" : (state.language === 'ES' ? "🚀 RETO VIRAL !" : "🚀 CHALLENGE BUZZING!");
              
              // Internal Alert
              Alert.alert(buzzTitle, msg);

              // Native Notification
              NotificationManager.sendImmediateBuzz(buzzTitle, msg);
          }
      }

      return {
        ...challenge,
        playsCount: newPlays,
        likes: newLikes,
        fire: newFire,
        lastNotifiedLevel: currentLevel
      };
    });

    return {
      communityChallenges: updatedChallenges,
      lastEngagementRefresh: state.lastEngagementRefresh + (intervalsPassed * intervalMs),
      lastBoostReset: nextBoostResetVal
    };
  }),

  loadCustomLevel: () => set((state) => {
    // Generate Level Data from Creator State
    const customLevel: LevelData = {
      id: 'custom',
      name: state.creatorName || 'My Challenge',
      rounds: 5,
      images: [], 
      imageNames: state.creatorImageNames,
    };
    
    const r1Images = state.creatorMode === 'CUSTOM' 
      ? (state.creatorRoundLayouts[1] || Array(8).fill(null)).map(img => img || 'https://via.placeholder.com/150')
      : Array(8).fill(null).map(() => state.creatorImages[Math.floor(Math.random() * state.creatorImages.length)]);

    return {
        currentLevel: { ...customLevel, images: r1Images as string[] },
        currentRound: 1,
        currentBeat: -1,
        isPlaying: false,
    };
  }),
}), {
  name: 'say-the-word-storage',
  storage: createJSONStorage(() => idbStorage as any), // Use custom IndexedDB/AsyncStorage wrapper
  partialize: (state) => ({
    communityChallenges: state.communityChallenges,
    userChallengeIds: state.userChallengeIds,
    showImageNames: state.showImageNames,
    language: state.language,
    lastEngagementRefresh: state.lastEngagementRefresh,
    lastBoostReset: state.lastBoostReset,
  }),
}));
