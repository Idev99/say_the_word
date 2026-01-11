import { create } from 'zustand';
import { Language } from '../constants/translations';

export type GameState = 'MENU' | 'PLAYING' | 'RESULT' | 'CREATING';

export interface LevelData {
  id: string;
  name: string;
  images: string[]; // URLs or local paths
  rounds: number;
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

  // Actions
  setLanguage: (lang: Language) => void;
  setGameState: (state: GameState) => void;
  loadLevel: (level: LevelData) => void;
  startRound: () => void;
  nextRound: () => void;
  setBeat: (beat: number) => void;

  endRoundIntro: () => void;
  stopGame: () => void;

  // Creator State
  creatorImages: string[];
  creatorMode: 'RANDOM' | 'CUSTOM';
  creatorRoundLayouts: Record<number, (string | null)[]>; // Round -> Array of 8 images (or null)

  // Creator Actions
  addCreatorImage: (uri: string) => void;
  removeCreatorImage: (index: number) => void;
  setCreatorMode: (mode: 'RANDOM' | 'CUSTOM') => void;
  setCreatorRoundSlot: (round: number, slotIndex: number, imageUri: string) => void;
  fillRandomSlots: () => void;

  resetCreator: () => void;
  
  // Custom Game Start
  loadCustomLevel: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'MENU',
  currentLevel: null,
  currentRound: 1,
  currentBeat: -1,
  bpm: 100, // Default BPM

  isPlaying: false,
  isRoundIntro: false,
  language: 'EN',

  setLanguage: (lang) => set({ language: lang }),
  setGameState: (state) => set({ gameState: state }),
  loadLevel: (level) => set({ currentLevel: level, currentRound: 1, currentBeat: -1, isRoundIntro: false }),
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
  stopGame: () => set({ isPlaying: false, gameState: 'MENU' }),

  // Creator Init
  creatorImages: [],
  creatorMode: 'RANDOM',
  creatorRoundLayouts: { 1: Array(8).fill(null), 2: Array(8).fill(null), 3: Array(8).fill(null), 4: Array(8).fill(null), 5: Array(8).fill(null) },

  addCreatorImage: (uri) => set((state) => ({ creatorImages: [...state.creatorImages, uri] })),
  removeCreatorImage: (index) => set((state) => ({ creatorImages: state.creatorImages.filter((_, i) => i !== index) })),
  setCreatorMode: (mode) => set({ creatorMode: mode }),
  setCreatorRoundSlot: (round, slot, uri) => set((state) => {
      const currentRoundLayout = [...(state.creatorRoundLayouts[round] || Array(8).fill(null))];
      currentRoundLayout[slot] = uri;
      return { creatorRoundLayouts: { ...state.creatorRoundLayouts, [round]: currentRoundLayout } };
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
  resetCreator: () => set({ creatorImages: [], creatorMode: 'RANDOM', creatorRoundLayouts: { 1: Array(8).fill(null), 2: Array(8).fill(null), 3: Array(8).fill(null), 4: Array(8).fill(null), 5: Array(8).fill(null) } }),

  loadCustomLevel: () => set((state) => {
    // Generate Level Data from Creator State
    const customLevel: LevelData = {
      id: 'custom',
      name: 'My Challenge',
      rounds: 5,
      images: [], // This will be dynamic per round in the real game logic, but for now we need a flat list or handle it in GameScreen
    };

    // For the current GridSystem, it expects `level.images` to be the *current round's* images.
    // The current implementation of GridSystem uses `level.images` which is static for the level in MOCK_DATA.
    // We need to support round-specific images. 
    // Let's modify the store to just set the currentLevel with the *current round's* layout when we start/next round?
    // OR: simpler for MVP: just put round 1's images in `images` initially.
    
    // Actually, `loadLevel` sets `currentLevel`.
    // In `nextRound`, we might need logic to update `currentLevel.images` if it's a custom game.
    // But `LevelData` structure implies static images for the whole level?
    // MOCK_LEVELS has 5 rounds but only 1 array of images.
    // This implies the same images are used for all rounds in the mock.
    // But the Custom Creator allows different images per round.
    
    // Fix: We'll construct the level, but we might need to change how GameScreen gets images.
    // For now, let's just use Round 1's layout for the initial load.
    
    const r1Images = state.creatorMode === 'CUSTOM' 
      ? state.creatorRoundLayouts[1].map(img => img || 'https://via.placeholder.com/150') // Fallback
      : Array(8).fill(null).map(() => state.creatorImages[Math.floor(Math.random() * state.creatorImages.length)]);

    return {
        currentLevel: {
            ...customLevel,
            images: r1Images as string[]
        },
        currentRound: 1,
        currentBeat: -1,
        gameState: 'MENU',
        // metadata for custom game handling
        creatorRoundLayouts: state.creatorRoundLayouts, 
        creatorMode: state.creatorMode
    };
  }),
}));
