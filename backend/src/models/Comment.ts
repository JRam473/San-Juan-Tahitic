export interface Comment {
  id: string;
  user_id: string;
  place_id: string | null;
  content: string;
  parent_comment_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCommentInput {
  user_id: string;
  place_id?: string;
  content: string;
  parent_comment_id?: string;
}

export interface UpdateCommentInput {
  content: string;
}