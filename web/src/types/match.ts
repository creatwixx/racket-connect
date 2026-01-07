export interface PadelMatch {
  id: string;
  clubName: string;
  location: string;
  startTime: Date;
  endTime: Date;
  totalSpots: number;
  availableSpots: number;
  createdBy: string;
  createdAt: Date;
  joinedUsers: string[];
}

export function hasUserJoined(match: PadelMatch, userId: string): boolean {
  return match.joinedUsers.includes(userId) || match.createdBy === userId;
}

