// Dummy authentication service
// For MVP, we'll use a simple dummy user
export class AuthService {
  static readonly DUMMY_USER_ID = 'dummy_user_123';
  static readonly DUMMY_USER_NAME = 'Dummy User';
  static readonly DUMMY_USER_EMAIL = 'dummy@padelconnect.com';
  private static readonly AUTH_KEY = 'racket_connect_auth';

  // Check localStorage on initialization
  private getStoredAuth(): boolean {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(AuthService.AUTH_KEY);
    return stored === 'true';
  }

  private setStoredAuth(value: boolean): void {
    if (typeof window === 'undefined') return;
    if (value) {
      localStorage.setItem(AuthService.AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(AuthService.AUTH_KEY);
    }
  }

  private isAuthenticated = this.getStoredAuth();

  // Simulate login with email/password
  async signIn(_email: string, _password: string): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // For demo, accept any credentials
    this.isAuthenticated = true;
    this.setStoredAuth(true);
    return true;
  }

  // Simulate auto-login (legacy method)
  async signInDummy(): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    this.isAuthenticated = true;
    this.setStoredAuth(true);
    return true;
  }

  // Get current user ID
  getCurrentUserId(): string {
    return AuthService.DUMMY_USER_ID;
  }

  // Get current user name
  getCurrentUserName(): string {
    return AuthService.DUMMY_USER_NAME;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    // Always check localStorage to ensure consistency
    this.isAuthenticated = this.getStoredAuth();
    return this.isAuthenticated;
  }

  // Sign out
  async signOut(): Promise<void> {
    this.isAuthenticated = false;
    this.setStoredAuth(false);
  }
}

export const authService = new AuthService();

