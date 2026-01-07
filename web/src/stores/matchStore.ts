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
    description?: string;
    skillLevel?: string;
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
      set({ error: error instanceof Error ? error.message : 'Неуспешно зареждане на мачовете', loading: false });
    }
  },

  createMatch: async (matchData) => {
    set({ loading: true, error: null });
    try {
      const userId = authService.getCurrentUserId();
      await matchService.createMatch({
        clubName: matchData.clubName,
        location: matchData.location,
        startTime: matchData.startTime,
        endTime: matchData.endTime,
        totalSpots: matchData.totalSpots,
        description: matchData.description,
        skillLevel: matchData.skillLevel as any,
        createdBy: userId,
      });
      // Refresh matches list
      await get().fetchMatches();
      set({ loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Неуспешно създаване на мач', loading: false });
      throw error;
    }
  },

  joinMatch: async (matchId: string) => {
    set({ loading: true, error: null });
    try {
      const userId = authService.getCurrentUserId();
      const success = await matchService.joinMatch(matchId, userId);
      if (!success) {
        throw new Error('Не може да се присъедините към мача. Може да е пълен или вече сте присъединени.');
      }
      // Refresh matches list
      await get().fetchMatches();
      set({ loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Неуспешно присъединяване към мача', loading: false });
      throw error;
    }
  },

  leaveMatch: async (matchId: string) => {
    set({ loading: true, error: null });
    try {
      const userId = authService.getCurrentUserId();
      const success = await matchService.leaveMatch(matchId, userId);
      if (!success) {
        throw new Error('Не може да напуснете мача.');
      }
      // Refresh matches list
      await get().fetchMatches();
      set({ loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Неуспешно напускане на мача', loading: false });
      throw error;
    }
  },

  getMatchById: async (matchId: string) => {
    try {
      return await matchService.getMatchById(matchId);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Неуспешно зареждане на мача' });
      return null;
    }
  },
}));

