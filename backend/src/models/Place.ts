export interface Place {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  location: string | null;
  category: string | null;
  average_rating: number;
  total_ratings: number;
  created_at: Date;
}

export interface CreatePlaceInput {
  name: string;
  description?: string;
  image_url?: string;
  location?: string;
  category?: string;
}

export interface UpdatePlaceInput {
  name?: string;
  description?: string;
  image_url?: string;
  location?: string;
  category?: string;
}