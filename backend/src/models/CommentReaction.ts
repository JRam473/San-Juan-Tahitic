export interface CommentReaction {
  id: string;
  user_id: string;
  comment_id: string;
  reaction_type: 'like';
  created_at: Date;
}

export interface CreateCommentReactionInput {
  user_id: string;
  comment_id: string;
  reaction_type: 'like';
}