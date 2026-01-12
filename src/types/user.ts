export type UserRole = 'analyst' | 'investigator' | 'admin' | 'provider' | 'patient' | 'regulator';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
}
