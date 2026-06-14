export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Conversation = {
  id: string;
  profile_id: string;
  avatar_id: string;
  title: string | null;
  comprehension: number | null;
  created_at: string;
  updated_at: string;
};
