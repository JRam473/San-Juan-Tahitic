export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}
export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProfileInput {
  user_id: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}