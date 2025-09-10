export interface Place {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  location?: string;
  category?: string;
  average_rating?: number;
  total_ratings?: number;
  created_at?: string;
}
