export interface PlaceRating {
  id: string;
  user_id: string;
  place_id: string;
  rating: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePlaceRatingInput {
  user_id: string;
  place_id: string;
  rating: number;
}

export interface UpdatePlaceRatingInput {
  rating: number;
}