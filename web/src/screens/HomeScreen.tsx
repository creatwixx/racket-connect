import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, User, LogOut } from 'lucide-react';
import { authService } from '../services/authService';
import { MatchesList } from '../components/MatchesList';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuItem } from '../components/ui/dropdown-menu';

export function HomeScreen() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserName(authService.getCurrentUserName());
  }, []);

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/login');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='sticky top-0 z-10 w-full bg-gradient-to-r from-green-600 to-green-500 shadow-md'>
        <div className='container mx-auto px-4 md:px-6 xl:px-8'>
          <div className='flex h-16 md:h-20 items-center justify-between'>
            <h1 className='text-2xl md:text-3xl xl:text-4xl font-bold text-white drop-shadow-sm'>
              Racket Connect
            </h1>
            <DropdownMenu
              trigger={
                <div className='flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full cursor-pointer hover:bg-white/30 transition-colors'>
                  <User className='h-4 w-4 md:h-5 md:w-5 text-white' />
                  <span className='text-sm md:text-base font-medium text-white hidden sm:inline'>
                    {userName}
                  </span>
                  <span className='text-sm md:text-base font-medium text-white sm:hidden'>
                    {userName.split(' ')[0]}
                  </span>
                </div>
              }
              align='right'
            >
              <div className='px-3 py-2 md:px-4 md:py-2.5'>
                <div className='flex items-center gap-2 md:gap-3'>
                  <User className='h-4 w-4 md:h-5 md:w-5 text-gray-600' />
                  <div className='flex flex-col'>
                    <span className='text-sm md:text-base font-medium text-gray-900'>
                      {userName}
                    </span>
                    <span className='text-xs md:text-sm text-gray-500'>
                      {authService.getCurrentUserId()}
                    </span>
                  </div>
                </div>
              </div>
              <div className='border-t my-1' />
              <DropdownMenuItem
                onClick={() => {
                  handleLogout();
                }}
                variant='destructive'
              >
                <div className='flex items-center gap-2 md:gap-3'>
                  <LogOut className='h-4 w-4 md:h-5 md:w-5' />
                  <span className='text-sm md:text-base'>Logout</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 md:px-6 xl:px-8 py-4 md:py-6 xl:py-8'>
        <MatchesList />
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => navigate('/create')}
        className='fixed bottom-4 md:bottom-6 xl:bottom-8 right-4 md:right-6 xl:right-8 h-14 md:h-16 px-6 md:px-8 rounded-full shadow-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold flex items-center gap-2 md:gap-3 text-base md:text-lg transition-all transform hover:scale-105'
        size='lg'
      >
        <Plus className='h-6 w-6 md:h-7 md:w-7' />
        <span className='hidden sm:inline'>Create Match</span>
        <span className='sm:hidden'>Create</span>
      </Button>
    </div>
  );
}
