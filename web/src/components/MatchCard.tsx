import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Activity, MapPin, Calendar, Clock, Users } from 'lucide-react';
import type { PadelMatch } from '../types/match';
import { authService } from '../services/authService';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: PadelMatch;
}

export function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate();
  const currentUserId = authService.getCurrentUserId();
  const isMyMatch = match.createdBy === currentUserId;

  const handleClick = () => {
    navigate(`/match/${match.id}`);
  };

  const hasAvailableSpots = match.availableSpots > 0;

  return (
    <Card
      className='cursor-pointer hover:shadow-lg transition-all duration-300 h-full flex flex-col border-2 hover:border-green-400 bg-white'
      onClick={handleClick}
    >
      <CardContent className='p-4 md:p-6 flex-1 flex flex-col'>
        <div className='space-y-3 md:space-y-4 flex-1'>
          {/* Club Name */}
          <div className='flex items-center gap-2 md:gap-3'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <Activity className='h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0' />
            </div>
            <h3 className='text-lg md:text-xl xl:text-2xl font-bold text-gray-900 line-clamp-1'>
              {match.clubName}
            </h3>
          </div>

          {/* Location */}
          <div className='flex items-start gap-2 md:gap-3'>
            <MapPin className='h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0 mt-0.5' />
            <p className='text-sm md:text-base text-gray-600 line-clamp-2'>
              {match.location}
            </p>
          </div>

          {/* Date and Time */}
          <div className='flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-gray-600'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 md:h-5 md:w-5 text-green-600' />
              <span className='font-medium'>
                {format(match.startTime, 'MMM d, y')}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 md:h-5 md:w-5 text-green-600' />
              <span className='font-medium'>
                {format(match.startTime, 'HH:mm')} -{' '}
                {format(match.endTime, 'HH:mm')}
              </span>
            </div>
          </div>

          {/* Available Spots and My Match Badge */}
          <div className='flex items-center gap-2 md:gap-3 flex-wrap'>
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm md:text-base font-semibold shadow-sm',
                hasAvailableSpots
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
              )}
            >
              <Users className='h-4 w-4 md:h-5 md:w-5' />
              <span>
                {match.availableSpots}/{match.totalSpots - 1} места
              </span>
            </div>
            {isMyMatch && (
              <div className='inline-flex items-center px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm md:text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'>
                Моят мач
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
