export interface PlaceRating {
  id: string;
  user_id: string;
  place_id: string;
  rating: number; // 0 a 5
  created_at?: string;
  updated_at?: string;
}
