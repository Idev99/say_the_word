import { create } from 'zustand';
import { Language } from '../constants/translations';

export type GameState = 'MENU' | 'PLAYING' | 'RESULT' | 'CREATING';

export interface LevelData {
  id: string;
  name: string;
  images: string[]; // URLs or local paths
  rounds: number;
}

export interface CommunityChallenge extends LevelData {
  creatorMode: 'RANDOM' | 'CUSTOM';
  creatorRoundLayouts: Record<number, (string | null)[]>;
  creatorImages: string[];
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
  creatorImages: string[];
  creatorMode: 'RANDOM' | 'CUSTOM';
  creatorRoundLayouts: Record<number, (string | null)[]>; // Round -> Array of 8 images (or null)

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
        name: 'Super Stars',
        rounds: 5,
        images: [],
        creatorMode: 'CUSTOM',
        creatorRoundLayouts: {
            1: ['https://via.placeholder.com/150/FFEB3B', 'https://via.placeholder.com/150/FFEB3B', null, null, null, null, null, null],
            2: [], 3: [], 4: [], 5: []
        },
        creatorImages: ['https://via.placeholder.com/150/FFEB3B'],
        playsCount: 1200,
        likes: 55,
        dislikes: 12,
        createdAt: Date.now() - (22 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'comm-2',
        name: 'Emoji Fun',
        rounds: 5,
        images: [],
        creatorMode: 'RANDOM',
        creatorRoundLayouts: { 1: [], 2: [], 3: [], 4: [], 5: [] },
        creatorImages: ['https://via.placeholder.com/150/FF508E', 'https://via.placeholder.com/150/A2D2FF'],
        playsCount: 3500,
        likes: 150,
        dislikes: 11,
        createdAt: Date.now() - (25 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'comm-3',
        name: 'Nature Pack',
        rounds: 5,
        images: [],
        creatorMode: 'CUSTOM',
        creatorRoundLayouts: { 1: [], 2: [], 3: [], 4: [], 5: [] },
        creatorImages: [],
        playsCount: 996,
        likes: 6,
        dislikes: 6,
        createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000),
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
