export interface PhotoReaction {
  id: string;
  user_id: string;
  photo_id: string;
  reaction_type: 'like';
  created_at: Date;
}

export interface CreatePhotoReactionInput {
  user_id: string;
  photo_id: string;
  reaction_type: 'like';
}