import { create } from 'zustand';
import type { PadelMatch } from '../types/match';
import { matchService } from '../services/matchService';
import { authService } from '../services/authService';

interface MatchState {
  matches: PadelMatch[];
  loading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
  createMatch: (matchData: {
    clubName: string;
    location: string;
    startTime: Date;
    endTime: Date;
    totalSpots: number;
  }) => Promise<void>;
  joinMatch: (matchId: string) => Promise<void>;
  leaveMatch: (matchId: string) => Promise<void>;
  getMatchById: (matchId: string) => Promise<PadelMatch | null>;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  loading: false,
  error: null,

  fetchMatches: async () => {
    set({ loading: true, error: null });
    try {
      const matches = await matchService.getAllMatches();
      const userId = authService.getCurrentUserId();
      
      // Sort matches: user's matches first, then by start time
      const sortedMatches = [...matches].sort((a, b) => {
        const aIsUserMatch = a.createdBy === userId;
        const bIsUserMatch = b.createdBy === userId;
        
        // If one is user's match and the other isn't, user's match comes first
        if (aIsUserMatch && !bIsUserMatch) return -1;
        if (!aIsUserMatch && bIsUserMatch) return 1;
        
        // Otherwise, sort by start time (earliest first)
        return a.startTime.getTime() - b.startTime.getTime();
      });
      
      set({ matches: sortedMatches, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load matches', loading: false });
    }
  },

  createMatch: async (matchData) => {
    set({ loading: true, error: null });
    try {
      const userId = authService.getCurrentUserId();
      await matchService.createMatch({
        ...matchData,
        createdBy: userId,
      });
      // Refresh matches list
      await get().fetchMatches();
      set({ loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create match', loading: false });
      throw error;
    }
  },

  joinMatch: async (matchId: string) => {
    set({ loading: true, error: null });
    try {
      const userId = authService.getCurrentUserId();
      const success = await matchService.joinMatch(matchId, userId);
      if (!success) {
        throw new Error('Unable to join match. It may be full or you may already be joined.');
      }
      // Refresh matches list
      await get().fetchMatches();
      set({ loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to join match', loading: false });
      throw error;
    }
  },

  leaveMatch: async (matchId: string) => {
    set({ loading: true, error: null });
    try {
      const userId = authService.getCurrentUserId();
      const success = await matchService.leaveMatch(matchId, userId);
      if (!success) {
        throw new Error('Unable to leave match.');
      }
      // Refresh matches list
      await get().fetchMatches();
      set({ loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to leave match', loading: false });
      throw error;
    }
  },

  getMatchById: async (matchId: string) => {
    try {
      return await matchService.getMatchById(matchId);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load match' });
      return null;
    }
  },
}));

