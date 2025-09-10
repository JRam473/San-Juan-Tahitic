export interface User {
  id: string;
  username?: string;
  email: string;
  password?: string;
  provider?: 'local' | 'google';
  provider_id?: string;
  is_verified?: boolean;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}
