import { create } from 'zustand';
import { Language } from '../constants/translations';

export type GameState = 'MENU' | 'PLAYING' | 'RESULT' | 'CREATING';

export interface LevelData {
  id: string;
  name: string;
  images: any[]; // URLs or local paths
  rounds: number;
}

export interface CommunityChallenge extends LevelData {
  creatorMode: 'RANDOM' | 'CUSTOM';
  creatorRoundLayouts: Record<number, (any | null)[]>;
  creatorImages: any[];
  playsCount: number;
  likes: number;
  dislikes: number;
  createdAt: number; // timestamp
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

  // Community State
  communityChallenges: CommunityChallenge[];

  // Actions
  setLanguage: (lang: Language) => void;
  setGameState: (state: GameState) => void;
  loadLevel: (level: LevelData | CommunityChallenge) => void;
  startRound: () => void;
  nextRound: () => void;
  setBeat: (beat: number) => void;
  setIntroSpeed: (speed: number) => void;
  setIntroAnimationSpeed: (speed: number) => void;

  endRoundIntro: () => void;
  stopGame: () => void;
  restartGame: () => void;

  // Creator State
  creatorName: string;
  creatorImages: any[];
  creatorMode: 'RANDOM' | 'CUSTOM';
  creatorRoundLayouts: Record<number, (any | null)[]>; // Round -> Array of 8 images (or null)

  // Creator Actions
  setCreatorName: (name: string) => void;
  addCreatorImage: (uri: string) => void;
  removeCreatorImage: (index: number) => void;
  setCreatorMode: (mode: 'RANDOM' | 'CUSTOM') => void;
  setCreatorRoundSlot: (round: number, slotIndex: number, imageUri: string) => void;
  fillRandomSlots: () => void;
  saveChallenge: () => void;

  resetCreator: () => void;
  
  // Custom Game Start
  loadCustomLevel: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'MENU',
  currentLevel: null,
  currentRound: 1,
  currentBeat: -1,
  bpm: 210, // Default BPM

  isPlaying: false,
  isRoundIntro: false,
  language: 'EN',
  introSpeed: 1.15,
  introAnimationSpeed: 1.15,

  communityChallenges: [
    {
        id: 'comm-1',
        name: 'French Streamers',
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
        dislikes: 42,
        createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'comm-2',
        name: 'Foodie Fest',
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
        createdAt: Date.now() - (25 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'comm-3',
        name: 'Vibration',
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
        dislikes: 2,
        createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'comm-4',
        name: 'Kids Fun',
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
        createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'comm-5',
        name: 'Rainbow Dash',
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
        playsCount: 2500,
        likes: 88,
        dislikes: 2,
        createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'comm-6',
        name: 'World Tour',
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
        dislikes: 3,
        createdAt: Date.now() - (10 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'comm-7',
        name: 'Number Mania',
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
        createdAt: Date.now() - (15 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'comm-8',
        name: 'Coffee Break',
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
        createdAt: Date.now() - (20 * 24 * 60 * 60 * 1000),
    }
  ],
  
  setLanguage: (lang) => set({ language: lang }),
  setGameState: (state) => set({ gameState: state }),
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
      isPlaying: true,
      isRoundIntro: true,
      currentLevel: state.currentLevel ? { ...state.currentLevel, images: nextImages } : null
    };
  }),

  // Creator Init
  creatorName: '',
  creatorImages: [],
  creatorMode: 'RANDOM',
  creatorRoundLayouts: { 1: Array(8).fill(null), 2: Array(8).fill(null), 3: Array(8).fill(null), 4: Array(8).fill(null), 5: Array(8).fill(null) },

  setCreatorName: (name) => set({ creatorName: name }),
  addCreatorImage: (uri) => set((state) => ({ creatorImages: [...state.creatorImages, uri] })),
  removeCreatorImage: (index) => set((state) => ({ creatorImages: state.creatorImages.filter((_, i) => i !== index) })),
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
          createdAt: Date.now(),
      };
      
      return {
          communityChallenges: [newChallenge, ...state.communityChallenges],
      };
  }),
  resetCreator: () => set({ creatorName: '', creatorImages: [], creatorMode: 'RANDOM', creatorRoundLayouts: { 1: Array(8).fill(null), 2: Array(8).fill(null), 3: Array(8).fill(null), 4: Array(8).fill(null), 5: Array(8).fill(null) } }),

  loadCustomLevel: () => set((state) => {
    // Generate Level Data from Creator State
    const customLevel: LevelData = {
      id: 'custom',
      name: state.creatorName || 'My Challenge',
      rounds: 5,
      images: [], 
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
}));
