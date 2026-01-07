import type { PadelMatch } from '../types/match';

// Service for managing padel matches
// For MVP, we'll use in-memory storage
// Later, replace with Firebase Firestore
class MatchService {
  // In-memory storage (replace with Firestore later)
  private matches: PadelMatch[] = [];
  private dummyMatchesInitialized = false;

  // Initialize dummy matches on first access
  private initializeDummyMatches(): void {
    if (this.dummyMatchesInitialized || this.matches.length > 0) {
      return;
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Current user ID (for "My Match")
    const currentUserId = 'dummy_user_123';
    
    // Dummy user IDs - all are потребител
    const otherUser1 = 'потребител_1';
    const otherUser2 = 'потребител_2';
    const otherUser3 = 'потребител_3';

    // My Match: Tomorrow afternoon, 2 spots available (created by current user)
    this.matches.push({
      id: 'my_dummy_match',
      clubName: 'Padel Club Sofia',
      location: 'ул. Околовръстен път 72, София',
      startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 0),
      endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 18, 0),
      totalSpots: 4,
      availableSpots: 2, // 1 creator (me) + 1 joined = 2 taken, 2 available
      createdBy: currentUserId,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      joinedUsers: [otherUser1], // One person already joined
      skillLevel: 'silver-mid',
    });

    // Match 1: Tomorrow, 2 spots available (user can join)
    this.matches.push({
      id: 'dummy_match_1',
      clubName: 'Smash Padel',
      location: 'бул. Марица 15, Пловдив',
      startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 18, 0),
      endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 20, 0),
      totalSpots: 4,
      availableSpots: 2, // 1 creator + 1 joined = 2 taken, 2 available
      createdBy: otherUser1,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      joinedUsers: [otherUser2], // One person already joined
      skillLevel: 'bronze-high',
    });

    // Match 2: Tomorrow evening, 1 spot available (user can join)
    this.matches.push({
      id: 'dummy_match_2',
      clubName: 'Padel Arena Varna',
      location: 'ул. Приморска 25, Варна',
      startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 19, 30),
      endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 21, 30),
      totalSpots: 4,
      availableSpots: 1, // 1 creator + 2 joined = 3 taken, 1 available
      createdBy: otherUser2,
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      joinedUsers: [otherUser1, otherUser3], // Two people already joined
      skillLevel: 'gold',
    });

    // Match 3: Day after tomorrow, 3 spots available (user can join)
    this.matches.push({
      id: 'dummy_match_3',
      clubName: 'Padel Club Burgas',
      location: 'ул. Александровска 18, Бургас',
      startTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 17, 0),
      endTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 19, 0),
      totalSpots: 4,
      availableSpots: 3, // Only creator, no one joined yet
      createdBy: otherUser3,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      joinedUsers: [], // No one joined yet
      skillLevel: 'bronze-low',
    });

    // Match 4: Next week, FULL (user cannot join)
    this.matches.push({
      id: 'dummy_match_4',
      clubName: 'Padel',
      location: 'ул. Славянска 12, Варна',
      startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 18, 30),
      endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 20, 30),
      totalSpots: 4,
      availableSpots: 0, // Full - creator + 3 joined
      createdBy: otherUser1,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      joinedUsers: [otherUser2, otherUser3, 'потребител_4'], // Three people joined
      skillLevel: 'silver-high',
    });

    // Match 5: Tomorrow morning, 2 spots available (user can join)
    this.matches.push({
      id: 'dummy_match_5',
      clubName: 'Padel Club Stara Zagora',
      location: 'бул. Руски 8, Стара Загора',
      startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 0),
      endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0),
      totalSpots: 4,
      availableSpots: 2, // 1 creator + 1 joined = 2 taken, 2 available
      createdBy: otherUser2,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      joinedUsers: [otherUser1], // One person already joined
      skillLevel: 'silver-low',
    });

    this.dummyMatchesInitialized = true;
  }

  // Clear all matches (useful for testing or reset)
  clearMatches(): void {
    this.matches = [];
    this.dummyMatchesInitialized = false;
  }

  // Create a new match
  async createMatch({
    clubName,
    location,
    startTime,
    endTime,
    totalSpots,
    createdBy,
    description,
    skillLevel,
  }: {
    clubName: string;
    location: string;
    startTime: Date;
    endTime: Date;
    totalSpots: number;
    createdBy: string;
    description?: string;
    skillLevel?: string;
  }): Promise<PadelMatch> {
    // Creator automatically takes 1 spot, so available spots = totalSpots - 1
    const match: PadelMatch = {
      id: Date.now().toString(),
      clubName,
      location,
      startTime,
      endTime,
      totalSpots,
      availableSpots: totalSpots - 1, // Creator takes 1 spot
      createdBy,
      createdAt: new Date(),
      joinedUsers: [], // Creator is not in joinedUsers, they're tracked via createdBy
      description,
      skillLevel: skillLevel as any,
    };

    this.matches.push(match);
    return match;
  }

  // Get all matches
  async getAllMatches(): Promise<PadelMatch[]> {
    // Initialize dummy matches if not already done
    this.initializeDummyMatches();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return sorted by start time (earliest first)
    return [...this.matches].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  // Get match by ID
  async getMatchById(id: string): Promise<PadelMatch | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.matches.find(match => match.id === id) || null;
  }

  // Join a match (reduce available spots and add user to joined list)
  async joinMatch(matchId: string, userId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.matches.findIndex(match => match.id === matchId);
    if (index !== -1) {
      const match = this.matches[index];
      // Check if user already joined or is the creator
      if (match.joinedUsers.includes(userId) || match.createdBy === userId) {
        return false; // Already joined
      }
      // Check if there are available spots
      if (match.availableSpots > 0) {
        const updatedJoinedUsers = [...match.joinedUsers, userId];
        this.matches[index] = {
          ...match,
          availableSpots: match.availableSpots - 1,
          joinedUsers: updatedJoinedUsers,
        };
        return true;
      }
    }
    return false;
  }

  // Leave a match (increase available spots and remove user from joined list)
  async leaveMatch(matchId: string, userId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.matches.findIndex(match => match.id === matchId);
    if (index !== -1) {
      const match = this.matches[index];
      // Creator cannot leave their own match
      if (match.createdBy === userId) {
        return false;
      }
      // Check if user is in the joined list
      if (match.joinedUsers.includes(userId)) {
        const updatedJoinedUsers = match.joinedUsers.filter(id => id !== userId);
        this.matches[index] = {
          ...match,
          availableSpots: match.availableSpots + 1,
          joinedUsers: updatedJoinedUsers,
        };
        return true;
      }
    }
    return false;
  }
}

export const matchService = new MatchService();

