export interface ITweetEntry {
  created_at: string;
  id: number;
  text: string;
  truncated: boolean;
  name: string;
  user_url: string;
  followers_count: number;
  profile_image_url_https: string;
  url: string;
  screen_name: string;
  extended_entities?: Array<{ media_url_https: string }>;
}
