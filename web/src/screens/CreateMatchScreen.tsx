import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { useMatchStore } from '../stores/matchStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const SAMPLE_CLUBS = [
  'Padel Club Sofia',
  'Padel Club AYA',
  'Padel DECATHLON | Падел кортове Витоша',
  'Amik Sport',
  'Smash Padel',
  'Padel Arena Varna',
  'Padel',
  'Padel Club Burgas',
  'Padel Club Stara Zagora',
];

export function CreateMatchScreen() {
  const navigate = useNavigate();
  const { createMatch, loading } = useMatchStore();
  const [clubName, setClubName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalSpots, setTotalSpots] = useState('4');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      });

      navigate('/home');
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const handleClubSelect = (club: string) => {
    setClubName(club);
    setLocation(club);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-gradient-to-r from-green-600 to-green-500 shadow-md">
        <div className="container mx-auto px-4 md:px-6 xl:px-8">
          <div className="flex h-16 md:h-20 items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
              className="h-10 w-10 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl xl:text-3xl font-bold text-white drop-shadow-sm">
              Създай педел мач
            </h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 md:px-6 xl:px-8 py-4 md:py-6 xl:py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Детайли за мача</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Club Name Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="club">Педел клуб</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {SAMPLE_CLUBS.map((club) => (
                    <Button
                      key={club}
                      type="button"
                      variant={clubName === club ? 'default' : 'outline'}
                      onClick={() => handleClubSelect(club)}
                      className="justify-start"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      {club}
                    </Button>
                  ))}
                </div>
                {errors.clubName && (
                  <p className="text-sm text-destructive">{errors.clubName}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Локация</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Въведете адрес на клуба"
                    className="pl-10 md:pl-12"
                    readOnly
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Дата</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-10 md:pl-12"
                  />
                </div>
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date}</p>
                )}
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="startTime">Начален час</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10 md:pl-12"
                  />
                </div>
                {errors.startTime && (
                  <p className="text-sm text-destructive">{errors.startTime}</p>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label htmlFor="endTime">Краен час</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10 md:pl-12"
                  />
                </div>
                {errors.endTime && (
                  <p className="text-sm text-destructive">{errors.endTime}</p>
                )}
              </div>

              {/* Total Spots */}
              <div className="space-y-2">
                <Label htmlFor="totalSpots">Общо места</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  <Input
                    id="totalSpots"
                    type="number"
                    value={totalSpots}
                    onChange={(e) => setTotalSpots(e.target.value)}
                    placeholder="Брой необходими играчи"
                    min="1"
                    className="pl-10 md:pl-12"
                  />
                </div>
                {errors.totalSpots && (
                  <p className="text-sm text-destructive">{errors.totalSpots}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 md:h-14 text-base md:text-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold shadow-lg"
                size="lg"
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

