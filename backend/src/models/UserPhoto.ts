export interface UserPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  caption: string | null;
  place_id: string | null;
  storage_path: string | null;
  created_at: Date;
}

export interface CreateUserPhotoInput {
  user_id: string;
  photo_url: string;
  caption?: string;
  place_id?: string;
  storage_path?: string;
}

export interface UpdateUserPhotoInput {
  caption?: string;
  place_id?: string;
}