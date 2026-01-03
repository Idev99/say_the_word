import { create } from 'zustand';

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

  // Actions
  setGameState: (state: GameState) => void;
  loadLevel: (level: LevelData) => void;
  startRound: () => void;
  nextRound: () => void;
  setBeat: (beat: number) => void;
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
  setCreatorRoundSlot: (round: number, slotIndex: number, imageUri: string) => void;
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

  setGameState: (state) => set({ gameState: state }),
  loadLevel: (level) => set({ currentLevel: level, currentRound: 1, currentBeat: -1 }),
  startRound: () => set({ isPlaying: true, currentBeat: -1 }),
  nextRound: () => set((state) => ({ currentRound: state.currentRound + 1, currentBeat: -1 })),
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
