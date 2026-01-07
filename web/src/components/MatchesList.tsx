import { useEffect, useState, useMemo } from 'react';
import { Activity, AlertCircle, Filter, X } from 'lucide-react';
import { useMatchStore } from '../stores/matchStore';
import { MatchCard } from './MatchCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { PadelMatch } from '../types/match';

export function MatchesList() {
  const { matches, loading, error, fetchMatches } = useMatchStore();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedClub, setSelectedClub] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('');

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Extract unique cities and clubs from matches
  const { cities, clubs } = useMemo(() => {
    const citySet = new Set<string>();
    const clubSet = new Set<string>();
    
    matches.forEach(match => {
      // Extract city from location (format: "ул. ..., София" or "бул. ..., София")
      const cityMatch = match.location.match(/(София|Пловдив|Варна|Бургас|Русе|Стара Загора)/);
      if (cityMatch) {
        citySet.add(cityMatch[1]);
      }
      clubSet.add(match.clubName);
    });
    
    return {
      cities: Array.from(citySet).sort(),
      clubs: Array.from(clubSet).sort(),
    };
  }, [matches]);

  // Filter matches
  const filteredMatches = useMemo(() => {
    let filtered: PadelMatch[] = [...matches];

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter(match => 
        match.location.includes(selectedCity)
      );
    }

    // Filter by club
    if (selectedClub) {
      filtered = filtered.filter(match => 
        match.clubName === selectedClub
      );
    }

    // Filter by time range
    if (timeRange) {
      const [hours] = timeRange.split(':').map(Number);
      filtered = filtered.filter(match => {
        const matchHour = match.startTime.getHours();
        return matchHour >= hours && matchHour < hours + 2;
      });
    }

    return filtered;
  }, [matches, selectedCity, selectedClub, timeRange]);

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedClub('');
    setTimeRange('');
  };

  const hasActiveFilters = selectedCity || selectedClub || timeRange;

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
          <h3 className="text-lg md:text-xl font-semibold mb-2">Грешка при зареждане на мачовете</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchMatches}>Опитай отново</Button>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 md:gap-6 p-4">
        <Activity className="h-16 w-16 md:h-20 md:w-20 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg md:text-xl xl:text-2xl font-semibold mb-2">Още няма мачове</h3>
          <p className="text-sm md:text-base text-muted-foreground">Създайте първия си мач!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-green-600" />
            <h2 className="text-lg md:text-xl font-semibold">Филтри</h2>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm"
            >
              <X className="h-4 w-4 mr-1" />
              Изчисти филтри
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City Filter */}
          <div className="space-y-2">
            <Label htmlFor="city">Град</Label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Всички градове</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Club Filter */}
          <div className="space-y-2">
            <Label htmlFor="club">Клуб</Label>
            <select
              id="club"
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Всички клубове</option>
              {clubs.map(club => (
                <option key={club} value={club}>{club}</option>
              ))}
            </select>
          </div>

          {/* Time Range Filter */}
          <div className="space-y-2">
            <Label htmlFor="timeRange">Час (от)</Label>
            <Input
              id="timeRange"
              type="time"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              placeholder="Избери час"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Намерени {filteredMatches.length} мач{filteredMatches.length !== 1 ? 'а' : ''} от {matches.length}
        </div>
      )}

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 md:gap-6 p-4">
          <Activity className="h-16 w-16 md:h-20 md:w-20 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg md:text-xl xl:text-2xl font-semibold mb-2">Няма намерени мачове</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              Опитайте с други филтри
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Изчисти филтри
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

