export interface LoginCredentials {
  username: string;
  password: string;
  mfaCode?: string;
}

export interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
