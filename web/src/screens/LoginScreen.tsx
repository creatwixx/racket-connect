import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Chrome, Apple } from 'lucide-react';
import { authService } from '../services/authService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('dummy@padelconnect.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, accept any credentials or the pre-filled ones
      await authService.signIn(email, password);
      
      // Navigate to home
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center p-4 md:p-6 xl:p-8">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-lg py-8">
            <CardTitle className="text-3xl md:text-4xl xl:text-5xl font-bold text-white">
              Racket Connect
            </CardTitle>
            <CardDescription className="text-green-50 text-base md:text-lg mt-2">
              Sign in to find your next padel match
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 md:pl-12"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 md:pl-12"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 md:p-4 text-sm md:text-base text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            {/* Login Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 md:h-14 text-base md:text-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold shadow-lg"
              size="lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs md:text-sm uppercase">
                <span className="bg-card px-2 md:px-4 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Alternative Login Methods */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 md:h-12"
                disabled
              >
                <Chrome className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                <span className="text-sm md:text-base">Google</span>
              </Button>

              {/* Apple Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 md:h-12"
                disabled
              >
                <Apple className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                <span className="text-sm md:text-base">Apple</span>
              </Button>
            </div>

            {/* Demo Note */}
            <div className="text-center">
              <p className="text-xs md:text-sm text-muted-foreground">
                Demo mode: Credentials are pre-filled
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

