export interface MegasetTrack {
  id: number;
  filename: string;
  filepath: string;
  relative_path: string;
  album_folder?: string | null;
  artist_folder?: string | null;
  filesize?: number | null;
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  year?: number | null;
  tracknumber?: number | null;
  genre?: string | null;
  top_5_genres?: string | null;
  created_at: string; // datetime from Python will be string in TS
  embedding_512_vector?: number[] | null;
}

export interface ArtistListResponse {
  artists: string[];
}

export interface AlbumListResponse {
  albums: string[];
}

export interface TrackListResponse {
  tracks: MegasetTrack[];
}

export interface User {
  id: number;
  email: string;
  username?: string | null;
  is_active: boolean;
  is_admin: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserCreate {
  email: string;
  username?: string | null;
  password: string;
}
