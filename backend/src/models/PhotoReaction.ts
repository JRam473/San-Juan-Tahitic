export type PhotoReactionType = 'like' | 'love' | 'laugh' | 'amazing' | 'beautiful';

export interface PhotoReaction {
  id: string;
  user_id: string;
  photo_id: string;
  reaction_type: PhotoReactionType;
  created_at?: string;
}
