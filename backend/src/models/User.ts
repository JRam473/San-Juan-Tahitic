export interface User {
  id: string;
  username: string | null;
  email: string;
  password: string | null;
  provider: string;
  provider_id: string | null;
  is_verified: boolean;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  username?: string;
  email: string;
  password: string;
  provider?: string;
  provider_id?: string;
  is_verified?: boolean;
  avatar_url?: string;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
  avatar_url?: string;
  is_verified?: boolean;
}