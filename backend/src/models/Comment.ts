export interface Comment {
  id: string;
  user_id: string;
  place_id?: string;
  content: string;
  parent_comment_id?: string;
  created_at?: string;
  updated_at?: string;
}
