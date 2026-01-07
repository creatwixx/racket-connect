import { useState, FormEvent, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Activity,
  MapPin,
  Calendar,
  Clock,
  Users,
  Search,
} from 'lucide-react';
import { useMatchStore } from '../stores/matchStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const SAMPLE_CLUBS = [
  'Padel Club Sofia',
  'Padel Club AYA',
  'Padel DECATHLON | Падел кортове Витоша',
  'Amik Sport Sofia',
  'Smash Padel Plovdiv',
  'Padel Arena Varna',
  'Just Padel Varna',
  'Padel Club Burgas',
  'Padel Club Stara Zagora',
];

// Club locations mapping
const CLUB_LOCATIONS: Record<string, string> = {
  'Padel Club Sofia': 'ул. Околовръстен път 72, София',
  'Padel Club AYA': 'ул. Свети Пimen Зографски 2, София',
  'Padel DECATHLON | Падел кортове Витоша': 'ул. Олимпийска 4, София',
  'Amik Sport Sofia': 'ул. Академик Георги Бончев 4, София',
  'Smash Padel Plovdiv': 'бул. Марица 15, Пловдив',
  'Padel Arena Varna': 'ул. Приморска 25, Варна',
  'Just Padel Varna': 'ул. Славянска 12, Варна',
  'Padel Club Burgas': 'ул. Александровска 18, Бургас',
  'Padel Club Stara Zagora': 'бул. Руски 8, Стара Загора',
};

const SKILL_LEVELS = [
  { value: 'bronze-low', label: 'Bronze - Low' },
  { value: 'bronze-mid', label: 'Bronze - Mid' },
  { value: 'bronze-high', label: 'Bronze - High' },
  { value: 'silver-low', label: 'Silver - Low' },
  { value: 'silver-mid', label: 'Silver - Mid' },
  { value: 'silver-high', label: 'Silver - High' },
  { value: 'gold', label: 'Gold' },
];

export function CreateMatchScreen() {
  const navigate = useNavigate();
  const { createMatch, loading } = useMatchStore();
  const [clubName, setClubName] = useState('');
  const [clubSearch, setClubSearch] = useState('');
  const [showClubDropdown, setShowClubDropdown] = useState(false);
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalSpots, setTotalSpots] = useState('4');
  const [description, setDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const clubDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clubDropdownRef.current &&
        !clubDropdownRef.current.contains(event.target as Node)
      ) {
        setShowClubDropdown(false);
      }
    };

    if (showClubDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showClubDropdown]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clubName.trim()) {
      newErrors.clubName = 'Моля, изберете клуб';
    }
    if (!location.trim()) {
      newErrors.location = 'Моля, въведете локация';
    }
    if (!selectedDate) {
      newErrors.date = 'Моля, изберете дата';
    }
    if (!startTime) {
      newErrors.startTime = 'Моля, изберете начален час';
    }
    if (!endTime) {
      newErrors.endTime = 'Моля, изберете краен час';
    }
    if (startTime && endTime) {
      const start = new Date(`${selectedDate}T${startTime}`);
      const end = new Date(`${selectedDate}T${endTime}`);
      if (end <= start) {
        newErrors.endTime = 'Краят трябва да е след началото';
      }
    }
    const spots = parseInt(totalSpots);
    if (!totalSpots || isNaN(spots) || spots < 1) {
      newErrors.totalSpots = 'Моля, въведете валидно число (мин. 1)';
    }
    if (!skillLevel) {
      newErrors.skillLevel = 'Моля, изберете ниво на игра';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const startDateTime = new Date(`${selectedDate}T${startTime}`);
      const endDateTime = new Date(`${selectedDate}T${endTime}`);

      await createMatch({
        clubName: clubName.trim(),
        location: location.trim(),
        startTime: startDateTime,
        endTime: endDateTime,
        totalSpots: parseInt(totalSpots),
        description: description.trim() || undefined,
        skillLevel: skillLevel,
      });

      navigate('/home');
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  // Filter clubs based on search
  const filteredClubs = useMemo(() => {
    if (!clubSearch.trim()) {
      return SAMPLE_CLUBS;
    }
    return SAMPLE_CLUBS.filter((club) =>
      club.toLowerCase().includes(clubSearch.toLowerCase())
    );
  }, [clubSearch]);

  const handleClubSelect = (club: string) => {
    setClubName(club);
    setLocation(CLUB_LOCATIONS[club] || '');
    setClubSearch(club);
    setShowClubDropdown(false);
  };

  const handleClubSearchChange = (value: string) => {
    setClubSearch(value);
    setShowClubDropdown(true);
    if (!value) {
      setClubName('');
      setLocation('');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='sticky top-0 z-10 w-full bg-gradient-to-r from-green-600 to-green-500 shadow-md'>
        <div className='container mx-auto px-4 md:px-6 xl:px-8'>
          <div className='flex h-16 md:h-20 items-center gap-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => navigate('/home')}
              className='h-10 w-10 text-white hover:bg-white/20'
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <h1 className='text-xl md:text-2xl xl:text-3xl font-bold text-white drop-shadow-sm'>
              Създай педел мач
            </h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className='container mx-auto px-4 md:px-6 xl:px-8 py-4 md:py-6 xl:py-8 max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle>Детайли за мача</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
              {/* Club Name Searchable Dropdown */}
              <div className='space-y-2'>
                <Label htmlFor='club'>Педел клуб</Label>
                <div className='relative' ref={clubDropdownRef}>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground z-10' />
                  <Input
                    id='club'
                    type='text'
                    value={clubSearch}
                    onChange={(e) => handleClubSearchChange(e.target.value)}
                    onFocus={() => setShowClubDropdown(true)}
                    placeholder='Търсене на клуб...'
                    className='pl-10 md:pl-12'
                  />
                  {showClubDropdown && filteredClubs.length > 0 && (
                    <div className='absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto'>
                      {filteredClubs.map((club) => (
                        <button
                          key={club}
                          type='button'
                          onClick={() => handleClubSelect(club)}
                          className='w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2'
                        >
                          <Activity className='h-4 w-4 text-green-600' />
                          <span>{club}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.clubName && (
                  <p className='text-sm text-destructive'>{errors.clubName}</p>
                )}
              </div>

              {/* Location */}
              <div className='space-y-2'>
                <Label htmlFor='location'>Локация</Label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground' />
                  <Input
                    id='location'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder='Въведете адрес на клуба'
                    className='pl-10 md:pl-12'
                    readOnly
                  />
                </div>
                {errors.location && (
                  <p className='text-sm text-destructive'>{errors.location}</p>
                )}
              </div>

              {/* Date */}
              <div className='space-y-2'>
                <Label htmlFor='date'>Дата</Label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground' />
                  <Input
                    id='date'
                    type='date'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className='pl-10 md:pl-12'
                  />
                </div>
                {errors.date && (
                  <p className='text-sm text-destructive'>{errors.date}</p>
                )}
              </div>

              {/* Start Time */}
              <div className='space-y-2'>
                <Label htmlFor='startTime'>Начален час</Label>
                <div className='relative'>
                  <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground' />
                  <Input
                    id='startTime'
                    type='time'
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className='pl-10 md:pl-12'
                  />
                </div>
                {errors.startTime && (
                  <p className='text-sm text-destructive'>{errors.startTime}</p>
                )}
              </div>

              {/* End Time */}
              <div className='space-y-2'>
                <Label htmlFor='endTime'>Краен час</Label>
                <div className='relative'>
                  <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground' />
                  <Input
                    id='endTime'
                    type='time'
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className='pl-10 md:pl-12'
                  />
                </div>
                {errors.endTime && (
                  <p className='text-sm text-destructive'>{errors.endTime}</p>
                )}
              </div>

              {/* Total Spots */}
              <div className='space-y-2'>
                <Label htmlFor='totalSpots'>Общо места</Label>
                <div className='relative'>
                  <Users className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground' />
                  <Input
                    id='totalSpots'
                    type='number'
                    value={totalSpots}
                    onChange={(e) => setTotalSpots(e.target.value)}
                    placeholder='Брой необходими играчи'
                    min='1'
                    className='pl-10 md:pl-12'
                  />
                </div>
                {errors.totalSpots && (
                  <p className='text-sm text-destructive'>
                    {errors.totalSpots}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className='space-y-2'>
                <Label htmlFor='description'>Описание (незадължително)</Label>
                <textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Добавете описание за мача...'
                  rows={3}
                  className='w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none'
                />
              </div>

              {/* Skill Level */}
              <div className='space-y-2'>
                <Label htmlFor='skillLevel'>Ниво на игра</Label>
                <select
                  id='skillLevel'
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className='w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                >
                  <option value=''>Избери ниво</option>
                  {SKILL_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.skillLevel && (
                  <p className='text-sm text-destructive'>
                    {errors.skillLevel}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={loading}
                className='w-full h-12 md:h-14 text-base md:text-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold shadow-lg'
                size='lg'
              >
                {loading ? 'Създаване...' : 'Създай мач'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
