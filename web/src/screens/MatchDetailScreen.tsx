import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, MapPin, Calendar, Clock, Users, UserPlus, UserMinus, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useMatchStore } from '../stores/matchStore';
import { authService } from '../services/authService';
import { hasUserJoined } from '../types/match';
import type { PadelMatch } from '../types/match';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function MatchDetailScreen() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { getMatchById, joinMatch, leaveMatch } = useMatchStore();
  const [match, setMatch] = useState<PadelMatch | null>(null);
  const [matchLoading, setMatchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const currentUserId = authService.getCurrentUserId();
  const currentUserName = authService.getCurrentUserName();

  useEffect(() => {
    if (!matchId) return;

    const loadMatch = async () => {
      setMatchLoading(true);
      setError(null);
      try {
        const loadedMatch = await getMatchById(matchId);
        setMatch(loadedMatch);
        if (!loadedMatch) {
          setError('Match not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load match');
      } finally {
        setMatchLoading(false);
      }
    };

    loadMatch();
  }, [matchId, getMatchById]);

  const handleJoin = async () => {
    if (!matchId) return;
    setActionLoading(true);
    try {
      await joinMatch(matchId);
      // Refresh match
      const updatedMatch = await getMatchById(matchId);
      setMatch(updatedMatch);
    } catch (err) {
      console.error('Error joining match:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!matchId) return;
    setActionLoading(true);
    try {
      await leaveMatch(matchId);
      // Refresh match
      const updatedMatch = await getMatchById(matchId);
      setMatch(updatedMatch);
    } catch (err) {
      console.error('Error leaving match:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (matchLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-10 w-full bg-gradient-to-r from-green-600 to-green-500 shadow-md">
          <div className="container mx-auto px-4 md:px-6 xl:px-8">
            <div className="flex h-16 md:h-20 items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="h-10 w-10 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl md:text-2xl xl:text-3xl font-bold text-white drop-shadow-sm">Match Details</h1>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 md:px-6 xl:px-8 py-8 md:py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-destructive" />
            <h2 className="text-xl md:text-2xl font-semibold">Match not found</h2>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </main>
      </div>
    );
  }

  const isCreator = match.createdBy === currentUserId;
  const userHasJoined = hasUserJoined(match, currentUserId);
  const canJoin = !isCreator && !userHasJoined && match.availableSpots > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-gradient-to-r from-green-600 to-green-500 shadow-md">
        <div className="container mx-auto px-4 md:px-6 xl:px-8">
          <div className="flex h-16 md:h-20 items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-10 w-10 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl xl:text-3xl font-bold text-white drop-shadow-sm">Match Details</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 xl:px-8 py-4 md:py-6 xl:py-8 max-w-7xl">
        <div className="flex flex-col xl:grid xl:grid-cols-2 xl:gap-6 space-y-4 md:space-y-6 xl:space-y-0">
          {/* Left Column: Match Info */}
          <div className="space-y-4 md:space-y-6">
            {/* Match Info Card */}
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center gap-3 md:gap-4">
                  <Activity className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                  <CardTitle className="text-xl md:text-2xl xl:text-3xl">{match.clubName}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {/* Location */}
                <div className="flex items-start gap-3 md:gap-4">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-base md:text-lg text-foreground">{match.location}</p>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 md:gap-4">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  <span className="text-base md:text-lg">{format(match.startTime, 'EEEE, MMMM d, y')}</span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3 md:gap-4">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  <span className="text-base md:text-lg">
                    {format(match.startTime, 'HH:mm')} - {format(match.endTime, 'HH:mm')}
                  </span>
                </div>

                {/* Available Spots */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium ${
                    match.availableSpots > 0
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  <Users className="h-5 w-5 md:h-6 md:w-6" />
                  <span>
                    {match.availableSpots}/{match.totalSpots - 1} spots available
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Join/Leave Button - Only show on mobile/tablet, hidden on desktop */}
            <div className="xl:hidden">
              {isCreator ? (
                <div className="p-4 md:p-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center gap-2 md:gap-3">
                    <User className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    <p className="text-base md:text-lg font-medium text-blue-700 dark:text-blue-400">
                      You created this match
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={userHasJoined ? handleLeave : handleJoin}
                  disabled={!canJoin && !userHasJoined || actionLoading}
                  className={`w-full h-12 md:h-14 text-base md:text-lg font-semibold shadow-lg ${
                    userHasJoined
                      ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
                      : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                  } text-white`}
                  size="lg"
                >
                  {actionLoading ? (
                    'Loading...'
                  ) : userHasJoined ? (
                    <>
                      <UserMinus className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                      Leave Match
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                      Join Match
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Participants */}
          <div className="space-y-4 md:space-y-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl xl:text-2xl">Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {/* Creator */}
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base md:text-lg">Match Creator</p>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {isCreator ? `You (${currentUserName})` : 'Another player'}
                    </p>
                  </div>
                  {isCreator && (
                    <span className="px-3 py-1 text-xs md:text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                      You
                    </span>
                  )}
                </div>

                {/* Joined Users */}
                {match.joinedUsers.length === 0 ? (
                  <div className="p-4 md:p-6 text-center text-muted-foreground">
                    <p className="text-sm md:text-base">No one has joined yet</p>
                  </div>
                ) : (
                  match.joinedUsers.map((userId) => {
                    const isCurrentUser = userId === currentUserId;
                    return (
                      <div
                        key={userId}
                        className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border"
                      >
                        <div
                          className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCurrentUser ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        >
                          <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-base md:text-lg">
                            {isCurrentUser ? 'You' : 'Player'}
                          </p>
                          <p className="text-sm md:text-base text-muted-foreground">
                            {isCurrentUser ? currentUserName : 'Joined player'}
                          </p>
                        </div>
                        {isCurrentUser && (
                          <span className="px-3 py-1 text-xs md:text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Join/Leave Button - Only show on desktop */}
            <div className="hidden xl:block">
              {isCreator ? (
                <div className="p-4 md:p-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center gap-2 md:gap-3">
                    <User className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    <p className="text-base md:text-lg font-medium text-blue-700 dark:text-blue-400">
                      You created this match
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={userHasJoined ? handleLeave : handleJoin}
                  disabled={!canJoin && !userHasJoined || actionLoading}
                  className={`w-full h-12 md:h-14 text-base md:text-lg font-semibold shadow-lg ${
                    userHasJoined
                      ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
                      : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                  } text-white`}
                  size="lg"
                >
                  {actionLoading ? (
                    'Loading...'
                  ) : userHasJoined ? (
                    <>
                      <UserMinus className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                      Leave Match
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                      Join Match
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

