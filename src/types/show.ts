export interface Episode {
    _id: string;
    name: string;
    downloadLink: string | null;
    episode?: string;
    poster?: string;
    episode_number?: number;
    runtime?: number;
    overview?: string;
    [key: string]: any;
  }
  
  export interface Season {
    _id: string;
    seasonNumber: number;
    episodes: Episode[];
    [key: string]: any;
  }
  
  export interface Show {
    _id: string;
    name: string;
    backdropPath: string;
    posterPath: string;
    releaseDate: string;
    ratings: number;
    overview: string;
    genres: string[];
    seasons: Season[];
    [key: string]: any;
  }
  
  export interface ShowsResponse {
    shows?: Show[];
    success?: boolean;
    message?: string;
  }
  
  export interface GenresResponse {
    genres?: string[];
    success?: boolean;
    message?: string;
  }