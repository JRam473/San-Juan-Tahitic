export type CommentReactionType = 'like' | 'love' | 'laugh' | 'angry' | 'sad';

export interface CommentReaction {
  id: string;
  user_id: string;
  comment_id: string;
  reaction_type: CommentReactionType;
  created_at?: string;
}
