import { useEffect } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { useMatchStore } from '../stores/matchStore';
import { MatchCard } from './MatchCard';
import { Button } from './ui/button';

export function MatchesList() {
  const { matches, loading, error, fetchMatches } = useMatchStore();

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 md:gap-6 p-4">
        <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Error loading matches</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchMatches}>Retry</Button>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 md:gap-6 p-4">
        <Activity className="h-16 w-16 md:h-20 md:w-20 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg md:text-xl xl:text-2xl font-semibold mb-2">No matches yet</h3>
          <p className="text-sm md:text-base text-muted-foreground">Create your first match!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

