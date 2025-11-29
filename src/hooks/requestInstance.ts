import React from 'react';

const BASE_IP = import.meta.env.VITE_BASE_URL;

interface LoginResponse {
  success: boolean;
  httpServerInfo?: {
    email: string;
    password: string;
  };
  user?: {
    _id: string; 
    mylist: string[];
    watchedMovies: string[];
  };
  message?: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: { 
    _id: string;
  };
}

interface WatchTimeResponse {
  watchedTime?: number;
  success?: boolean;
  message?: string;
}



interface ShowsWatchTimeResponse {
  watchedShows?: any[];
  success?: boolean;
  message?: string;
}

interface AuthResponse {
  authenticated: boolean;
  user?: Record<string, any>;
  message?: string;
}

interface LogoutResponse {
  success: boolean;
  message?: string;
}


// Export the types from your requestInstance.ts file
export interface Movie {
  _id: string;
  title: string;
  posterPath: string;
  backdropPath: string;
  downloadLink: string;
  runtime: number; 
  genres: string[]; 
  releaseDate: string;
  releaseYear: string;
  overview: string;
  description: string;
}

interface MovieSearchResponse {
  movies?: any[];
  success?: boolean;
  message?: string;
}

export interface WatchedMovie {
  movie: Movie;
  watchedTime: number;
}

export interface MoviesResponse {
  movies?: Movie[];
  success?: boolean;
  message?: string;
}

export interface GenresResponse {
  genres?: string[];
  success?: boolean;
  message?: string;
}

export interface Show {
  _id: string;
  title: string;
  posterPath: string;
  backdropPath?: string;
  overview?: string;
  releaseDate?: string;
  genres?: string[];
  seasons: Season[];
  [key: string]: any;
}

export interface Season {
  _id: string;
  seasonNumber: number;
  episodes: Episode[];
  [key: string]: any;
}

export interface ShowSearchResponse {
  shows?: any[];
  success?: boolean;
  message?: string;
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

export interface Episode {
  _id: string;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  runtime?: number;
  downloadLink?: string;
  [key: string]: any;
}

export interface EpisodeResponse {
  episode?: Episode;
  episodes?: Episode[];
  success?: boolean;
  message?: string;
}


export interface Anime {
  _id: string;
  name: string;
  posterPath: string;
  backdropPath?: string;
  overview?: string;
  releaseDate?: string;
  genres?: string[];
  ratings?: number;
  status?: 'ongoing' | 'completed' | 'upcoming';
  animeDirName?: string;
  ignoreTitleOnScan?: boolean;
  uploadTime?: string;
  seasons: Season[];
  [key: string]: any;
}



// Response Interfaces
export interface AnimeResponse {
  anime?: Anime[];
  success?: boolean;
  message?: string;
}

export interface SingleAnimeResponse {
  anime?: Anime;
  success?: boolean;
  message?: string;
}

export interface AnimeSearchResponse {
  anime?: Anime[];
  success?: boolean;
  message?: string;
}

export interface GenresResponse {
  genres?: string[];
  success?: boolean;
  message?: string;
}

export interface EpisodeResponse {
  episode?: Episode;
  episodes?: Episode[];
  success?: boolean;
  message?: string;
}



export interface AnimeProgressResponse {
  animeName?: string;
  watchedEpisodes?: number;
  totalEpisodes?: number;
  progressPercentage?: number;
  completed?: boolean;
  success?: boolean;
  message?: string;
}

export interface AnimeMylistResponse {
  animeInMyList?: Anime[];
  totalCount?: number;
  success?: boolean;
  message?: string;
}

export interface WatchedAnimeResponse {
  watchedAnime?: Array<{
    id: string;
    episodeInfo?: {
      animeId: string;
      episodeID: string;
      animeName: string;
      seasonNumber: number;
      animePoster: string;
      episodeNumber: number;
      episodePoster: string;
      episodeRuntime: number;
      episodeLink: string;
      episodeName: string;
      animeStatus: string;
    };
    watchedTime: number;
    uploadTime: string;
  }>;
  success?: boolean;
  message?: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

interface VerifyResetCodeResponse {
  success: boolean;
  message?: string;
  resetToken?: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

interface ChangePasswordRequestResponse {
  success: boolean;
  message?: string;
}

interface ChangePasswordVerifyResponse {
  success: boolean;
  message?: string;
}


export const userloginAPI = async (
  email: string,
  password: string,
  expoPushToken?: string
): Promise<LoginResponse | undefined> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      expoPushToken
    }),
  };

  const url = `${BASE_IP}/login`;

  try {
    const response = await fetch(url, options);
    const data: LoginResponse = await response.json();
    // console.log("Login details", data);
    return data;
  } catch (error) {
    // console.error("Error fetching the api", error);
  }
};

export const checkAuthAPI = async (): Promise<AuthResponse | undefined> => {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const url = `${BASE_IP}/check-auth`;

  try {
    const response = await fetch(url, options);
    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching the api", error);
  }
};

export const userLogout = async (): Promise<LogoutResponse | undefined> => {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const url = `${BASE_IP}/logout`;

  try {
    const response = await fetch(url, options);
    const data: LogoutResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching the userlogin api", error);
  }
};


export const userRegisterAPI = async (
  email: string,
  password: string,
  expoPushToken?: string
): Promise<RegisterResponse> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      expoPushToken,
      isAdmin: false
    }),
  };

  const url = `${BASE_IP}/register`;

  try {
    const response = await fetch(url, options);
    const data: RegisterResponse = await response.json();
    
    // console.log("Register API Response:", data);
    
    // Check if response is not ok (4xx, 5xx status)
    if (!response.ok) {
      // Use backend error message or default message
      const errorMessage = data.error || `Registration failed: ${response.status}`;
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    // console.error("Error in userRegister API:", error);
    
    // Re-throw the error with proper message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Network error: Unable to connect to server");
    }
  }
};


export const moviesListAPI = async (genreID?: string): Promise<MoviesResponse> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };
  
  let url = "";
  if (genreID) {
      url = `${BASE_IP}/getMovies/${genreID}`;
  } else {
      url = `${BASE_IP}/getMovies`;
  }

  try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      // If the API returns an array directly, wrap it in the expected structure
      if (Array.isArray(data)) {
          return { movies: data, success: true };
      }
      
      return data;
  } catch (error) {
      // console.error("Error fetching the tmdb api", error);
      return { success: false, message: "Failed to fetch movies" };
  }
};

export const getRecentAddedMovies = async (): Promise<MoviesResponse> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/getRecentAddedMovies`;
  
  try {
      const response = await fetch(url, options);
      const data: MoviesResponse = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the api", error);
      return { success: false, message: "Failed to fetch recent movies" };
  }
};

export const getLatestMovies = async (): Promise<MoviesResponse> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/latest-released-movies`;
  
  try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      // If the API returns an array directly, wrap it
      if (Array.isArray(data)) {
          return { movies: data, success: true };
      }
      
      return data;
  } catch (error) {
      // console.error("Error fetching the api", error);
      return { success: false, message: "Failed to fetch latest movies" };
  }
};


export const getAllMoviesGenres = async (): Promise<GenresResponse> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/getAllMoviesGenres`;
  
  try {
      const response = await fetch(url, options);
      const data: GenresResponse = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the api", error);
      return { success: false, message: "Failed to fetch genres" };
  }
};



export const mylistAPI = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    const url = `${BASE_IP}/mylist`

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data
    } catch (error) {
        // console.error("Error fetching the api", error);
    }
};

export const addMovieToList = async (movieID: string) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    const url = `${BASE_IP}/add-to-mylist/${movieID}`

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        // console.log("The data",data)
        return data
    } catch (error) {
        // console.error("Error fetching the api", error);
    }
};

export const removeMovieFromList = async (movieID: string) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    const url = `${BASE_IP}/remove-from-mylist/${movieID}`

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        // console.log("The data",data)
        return data
    } catch (error) {
        // console.error("Error fetching the api", error);
    }
};

export const showsMyList = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    const url = `${BASE_IP}/showsMylist`

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data
    } catch (error) {
        // console.error("Error fetching the api", error);
    }
};

export const addShowsToMylist = async (showID: string) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    const url = `${BASE_IP}/add-show-to-mylist/${showID}`

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        // console.log("The data",data)
        return data
    } catch (error) {
        // console.error("Error fetching the api", error);
    }
};

export const removeShowFromMylist = async (showID: string) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    const url = `${BASE_IP}/remove-show-from-mylist/${showID}`

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        // console.log("The data",data)
        return data
    } catch (error) {
        // console.error("Error fetching the mylist api", error);
    }
};



export const updateWatchtime = async (watchedTime: number, movieID: string) => {
  // Update the watchtime of a single movie in the user list
  const options = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ watchedTime }),
  };

  const url = `${BASE_IP}/update-watched-time/${movieID}`

  try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data
  } catch (error) {
      // console.error("Error fetching the api", error);
  }
};

export const getAllWatchTimes = async () => {
  // Get watchtime of all the movies in the user list
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/watched-movies`

  try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data
  } catch (error) {
      // console.error("Error fetching the api", error);
  }
};

export const getWatchtime = async (movieID: string) => {
  // GEt watchtime of a sinle movie in the user list
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/watched-time/${movieID}`

  try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data
  } catch (error) {
      // console.error("Error fetching the api", error);
  }
};

export const removeWatchedMovie = async (movieID: string) => {
  // Update the watchtime of a single movie in the user list
  const options = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movieID }),
  };

  const url = `${BASE_IP}/remove-watched-movie/${movieID}`

  try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data
  } catch (error) {
      // console.error("Error fetching the usermoviewatchtime api", error);
  }
};


export const similarMoviesAPI = async (movieID: string): Promise<Movie[] | undefined> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/getSimilarMovies/${movieID}`;

  try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the similarsearch api", error);
  }
};

export const updateShowsWatchtime = async (
  showID: string, 
  watchedTime: number, 
  episodeID: string
): Promise<WatchTimeResponse | undefined> => {
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ watchedTime, showID }),
    };

    const url = `${BASE_IP}/update-shows-watched-time/${episodeID}`;

    try {
        const response = await fetch(url, options);
        const data: WatchTimeResponse = await response.json();
        return data;
    } catch (error) {
        // console.error("Error fetching the usershowwatchtime api", error);
    }
};

export const getLatestWatchedEpisodeID = async (
  showID: string
): Promise<EpisodeResponse | undefined> => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    const url = `${BASE_IP}/get-latest-watched-episodeID/${showID}`;

    try {
        const response = await fetch(url, options);
        const data: EpisodeResponse = await response.json();
        return data;
    } catch (error) {
        // console.error("Error fetching the api", error);
    }
};

export const getShowWatchtime = async (
  episodeID: string
): Promise<WatchTimeResponse | undefined> => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    const url = `${BASE_IP}/get-show-watchtime/${episodeID}`;

    try {
        const response = await fetch(url, options);
        const data: WatchTimeResponse = await response.json();
        return data;
    } catch (error) {
        // console.error("Error fetching the api", error);
    }
};

export const getAllShowsWatchtime = async (): Promise<ShowsWatchTimeResponse | undefined> => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    const url = `${BASE_IP}/all-watched-shows`;

    try {
        const response = await fetch(url, options);
        const data: ShowsWatchTimeResponse = await response.json();
        return data;
    } catch (error) {
        // console.error("Error fetching the api", error);
    }
};

export const removeShowWatchtime = async (
  episodeID: string
): Promise<WatchTimeResponse | undefined> => {
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
        }
    };

    const url = `${BASE_IP}/remove-watched-show/${episodeID}`;

    try {
        const response = await fetch(url, options);
        const data: WatchTimeResponse = await response.json();
        return data;
    } catch (error) {
        // console.error("Error fetching the api", error);
    }
};


export const movieSearchAPI = async (movieName: string): Promise<MovieSearchResponse | null> => {
  const options: RequestInit = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      },
  };

  const url = `${BASE_IP}/searchMovies/${movieName}`;

  try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: MovieSearchResponse = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the moviesearch api", error);
      return null;
  }
};


export const getAllShows = async (): Promise<ShowsResponse | undefined> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/getAllShows`
  
  try {
      const response = await fetch(url, options);
      const data: ShowsResponse = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the showlist api", error);
      return undefined;
  }
};

export const getRecentAddedShows = async (): Promise<ShowsResponse | undefined> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/getRecentShows`
  
  try {
      const response = await fetch(url, options);
      const data: ShowsResponse = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the showlist api", error);
      return undefined;
  }
};

export const getLatestReleasedShows = async (): Promise<ShowsResponse | undefined> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/latest-released-shows`
  
  try {
      const response = await fetch(url, options);
      const data: ShowsResponse = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the showlist api", error);
      return undefined;
  }
};

export const getAllShowsGenres = async (): Promise<GenresResponse | undefined> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/getAllShowsGenres`
  
  try {
      const response = await fetch(url, options);
      const data: GenresResponse = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the api", error);
      return undefined;
  }
};

export const getAllEpisodeList = async (episodeID: string): Promise<EpisodeResponse | undefined> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/episode-info/${episodeID}`
  
  try {
      const response = await fetch(url, options);
      const data: EpisodeResponse = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the api", error);
      return undefined;
  }
};


export const getAllAnimeEpisodeList = async (episodeID: string): Promise<EpisodeResponse | undefined> => {
  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
      }
  };

  const url = `${BASE_IP}/anime/episode-info/${episodeID}`
  
  try {
      const response = await fetch(url, options);
      const data: EpisodeResponse = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the api", error);
      return undefined;
  }
};

export const showsSearchAPI = async (showName: string): Promise<ShowSearchResponse> => {
  const options: RequestInit = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      },
  };

  const url = `${BASE_IP}/searchShows/${encodeURIComponent(showName)}`;

  try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ShowSearchResponse = await response.json();
      return data;
  } catch (error) {
      // console.error("Error fetching the showsearch api", error);
      // Return a consistent error response structure
      return {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          shows: []
      };
  }
};



export const getAllAnime = async (): Promise<AnimeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/getAllAnime`;
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return { anime: data, success: true };
    }
    
    return data;
  } catch (error) {
    // console.error("Error fetching anime list:", error);
    return { success: false, message: "Failed to fetch anime" };
  }
};

/**
 * Get recently added anime
 */
export const getRecentAddedAnime = async (): Promise<AnimeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/getRecentAnime`;
  
  try {
    const response = await fetch(url, options);
    const data: AnimeResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching recent anime:", error);
    return { success: false, message: "Failed to fetch recent anime" };
  }
};

/**
 * Get latest released anime
 */
export const getLatestReleasedAnime = async (): Promise<AnimeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/latest-released-anime`;
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return { anime: data, success: true };
    }
    
    return data;
  } catch (error) {
    // console.error("Error fetching latest anime:", error);
    return { success: false, message: "Failed to fetch latest anime" };
  }
};

/**
 * Get all anime genres
 */
export const getAllAnimeGenres = async (): Promise<GenresResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/getAllAnimeGenres`;
  
  try {
    const response = await fetch(url, options);
    const data: GenresResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching anime genres:", error);
    return { success: false, message: "Failed to fetch genres" };
  }
};

/**
 * Get anime by specific genre
 */
export const getAnimeByGenre = async (genre: string): Promise<AnimeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/getAnimeBySpecificGenre/${encodeURIComponent(genre)}`;
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return { anime: data, success: true };
    }
    
    return data;
  } catch (error) {
    // console.error("Error fetching anime by genre:", error);
    return { success: false, message: "Failed to fetch anime by genre" };
  }
};

/**
 * Get anime by status
 */
export const getAnimeByStatus = async (status: string): Promise<AnimeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/getAnimeByStatus/${encodeURIComponent(status)}`;
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return { anime: data, success: true };
    }
    
    return data;
  } catch (error) {
    // console.error("Error fetching anime by status:", error);
    return { success: false, message: "Failed to fetch anime by status" };
  }
};

/**
 * Get popular anime (highest rated)
 */
export const getPopularAnime = async (): Promise<AnimeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/getPopularAnime`;
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return { anime: data, success: true };
    }
    
    return data;
  } catch (error) {
    // console.error("Error fetching popular anime:", error);
    return { success: false, message: "Failed to fetch popular anime" };
  }
};

/**
 * Search anime by name
 */
export const animeSearchAPI = async (animeName: string): Promise<AnimeSearchResponse> => {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const url = `${BASE_IP}/searchAnime/${encodeURIComponent(animeName)}`;

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: AnimeSearchResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error searching anime:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      anime: []
    };
  }
};

// Anime My List Functions

/**
 * Get anime in user's my list
 */
export const animeMyList = async (): Promise<AnimeMylistResponse> => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const url = `${BASE_IP}/animeMylist`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching anime my list:", error);
    return { success: false, message: "Failed to fetch anime my list" };
  }
};

/**
 * Add anime to my list
 */
export const addAnimeToMyList = async (animeID: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const url = `${BASE_IP}/add-anime-to-mylist/${animeID}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error adding anime to list:", error);
    return { success: false, message: "Failed to add anime to list" };
  }
};

/**
 * Remove anime from my list
 */
export const removeAnimeFromMyList = async (animeID: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const url = `${BASE_IP}/remove-anime-from-mylist/${animeID}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error removing anime from list:", error);
    return { success: false, message: "Failed to remove anime from list" };
  }
};

/**
 * Check if anime is in my list
 */
export const checkAnimeInMyList = async (animeID: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const url = `${BASE_IP}/check-anime-in-mylist/${animeID}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error checking anime in list:", error);
    return { success: false, message: "Failed to check anime in list" };
  }
};

// Anime Watch Time Functions

/**
 * Update anime watched time
 */
export const updateAnimeWatchTime = async (
  animeID: string, 
  watchedTime: number, 
  episodeID: string
): Promise<WatchTimeResponse> => {
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ watchedTime, animeID }),
  };

  const url = `${BASE_IP}/update-anime-watched-time/${episodeID}`;

  try {
    const response = await fetch(url, options);
    const data: WatchTimeResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error updating anime watch time:", error);
    return { success: false, message: "Failed to update watch time" };
  }
};

/**
 * Get anime episode watch time
 */
export const getAnimeWatchTime = async (
  episodeID: string
): Promise<WatchTimeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/get-anime-watchtime/${episodeID}`;

  try {
    const response = await fetch(url, options);
    const data: WatchTimeResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching anime watch time:", error);
    return { success: false, message: "Failed to fetch watch time" };
  }
};

/**
 * Get all watched anime
 */
export const getAllWatchedAnime = async (): Promise<WatchedAnimeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/all-watched-anime`;

  try {
    const response = await fetch(url, options);
    const data: WatchedAnimeResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching watched anime:", error);
    return { success: false, message: "Failed to fetch watched anime" };
  }
};

/**
 * Remove anime from watched list
 */
export const removeAnimeWatchTime = async (
  episodeID: string
): Promise<WatchTimeResponse> => {
  const options = {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/remove-watched-anime/${episodeID}`;

  try {
    const response = await fetch(url, options);
    const data: WatchTimeResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error removing anime watch time:", error);
    return { success: false, message: "Failed to remove watch time" };
  }
};

/**
 * Get latest watched episode ID for a specific anime
 */
export const getLatestWatchedAnimeEpisodeID = async (
  animeID: string
): Promise<EpisodeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/get-latest-watched-episodeID/${animeID}`;

  try {
    const response = await fetch(url, options);
    const data: EpisodeResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching latest watched episode:", error);
    return { success: false, message: "Failed to fetch latest watched episode" };
  }
};

/**
 * Get anime progress (watched vs total episodes)
 */
export const getAnimeProgress = async (
  animeID: string
): Promise<AnimeProgressResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/anime-progress/${animeID}`;

  try {
    const response = await fetch(url, options);
    const data: AnimeProgressResponse = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching anime progress:", error);
    return { success: false, message: "Failed to fetch anime progress" };
  }
};

/**
 * Clear anime watch history
 */
export const clearAnimeHistory = async (
  animeID: string
) => {
  const options = {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/clear-anime-history/${animeID}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error clearing anime history:", error);
    return { success: false, message: "Failed to clear anime history" };
  }
};

/**
 * Get episode information
 */


// Bulk operations for anime my list

/**
 * Bulk add anime to my list
 */
export const bulkAddAnimeToMyList = async (animeIDs: string[]) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ animeIDs }),
  };

  const url = `${BASE_IP}/bulk-add-anime-to-mylist`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error bulk adding anime to list:", error);
    return { success: false, message: "Failed to bulk add anime to list" };
  }
};

/**
 * Clear entire anime my list
 */
export const clearAnimeMyList = async () => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const url = `${BASE_IP}/clear-anime-mylist`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error clearing anime my list:", error);
    return { success: false, message: "Failed to clear anime my list" };
  }
};

/**
 * Reorder anime in my list
 */
export const reorderAnimeMyList = async (animeIDs: string[]) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ animeIDs }),
  };

  const url = `${BASE_IP}/reorder-anime-mylist`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error reordering anime my list:", error);
    return { success: false, message: "Failed to reorder anime my list" };
  }
};


// Add this function to your requestInstance.ts file
/**
 * Get anime episode information
 */
export const getAnimeEpisodeInfo = async (episodeID: string): Promise<EpisodeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/episode-info/${episodeID}`;
  
  try {
    const response = await fetch(url, options);
    const data: EpisodeResponse = await response.json();
    // console.log("Anime episode info response:", data);
    return data;
  } catch (error) {
    // console.error("Error fetching anime episode info:", error);
    return { success: false, message: "Failed to fetch anime episode info" };
  }
};

/**
 * Get anime episodes list
 */
export const getAnimeEpisodesList = async (animeID: string): Promise<EpisodeResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };

  const url = `${BASE_IP}/get-anime-episodes/${animeID}`;
  
  try {
    const response = await fetch(url, options);
    const data: EpisodeResponse = await response.json();
    // console.log("Anime episodes list response:", data);
    return data;
  } catch (error) {
    // console.error("Error fetching anime episodes list:", error);
    return { success: false, message: "Failed to fetch anime episodes list" };
  }
};


export const forgotPasswordAPI = async (email: string): Promise<ForgotPasswordResponse> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email: email.toLowerCase() }),
  };

  const url = `${BASE_IP}/forgot-password`;

  try {
    const response = await fetch(url, options);
    const data: ForgotPasswordResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    // console.error("Error in forgot password API:", error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Network error: Unable to connect to server");
    }
  }
};

/**
 * Verify reset code and get reset token
 */
/**
 * Verify reset code and get reset token
 */
export const verifyResetCodeAPI = async (email: string, code: string): Promise<VerifyResetCodeResponse> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ 
      email: email.toLowerCase(),
      code: code.trim()
    }),
  };

  const url = `${BASE_IP}/verify-reset-code`;

  try {
    const response = await fetch(url, options);
    
    // First, check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // If it's not JSON, get the text to see what's wrong
      const textResponse = await response.text();
      // console.error(' Non-JSON response from server:', textResponse.substring(0, 200));
      throw new Error('Server error. Please try again.');
    }
    
    const data: VerifyResetCodeResponse = await response.json();
    
    if (!response.ok) {
      // Use the backend error message directly - this will show "Invalid verification code" to user
      throw new Error(data.message || `Verification failed`);
    }
    
    return data;
  } catch (error) {
    // console.error("Error in verify reset code API:", error);
    
    // Re-throw the error so it can be displayed to the user
    if (error instanceof Error) {
      throw error; // This will show "Invalid verification code" to the user
    } else {
      throw new Error("Network error. Please check your connection.");
    }
  }
};

/**
 * Reset password with new password
 */
export const resetPasswordAPI = async (
  email: string, 
  resetToken: string, 
  newPassword: string, 
  confirmPassword: string
): Promise<ResetPasswordResponse> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ 
      email: email.toLowerCase(),
      resetToken,
      newPassword,
      confirmPassword
    }),
  };

  const url = `${BASE_IP}/reset-password`;

  try {
    const response = await fetch(url, options);
    const data: ResetPasswordResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Password reset failed: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    // console.error("Error in reset password API:", error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Network error: Unable to connect to server");
    }
  }
};

/**
 * Request change password code (requires old password)
 */
export const changePasswordRequestAPI = async (email: string, oldPassword: string): Promise<ChangePasswordRequestResponse> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ 
      email: email.toLowerCase(),
      oldPassword
    }),
  };

  const url = `${BASE_IP}/change-password/request`;

  try {
    const response = await fetch(url, options);
    const data: ChangePasswordRequestResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    // console.error("Error in change password request API:", error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Network error: Unable to connect to server");
    }
  }
};


export const changePasswordVerifyAPI = async (
  email: string, 
  code: string, 
  newPassword: string, 
  confirmPassword: string
): Promise<ChangePasswordVerifyResponse> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ 
      email: email.toLowerCase(),
      code: code.trim(),
      newPassword,
      confirmPassword
    }),
  };

  const url = `${BASE_IP}/change-password/verify`;

  try {
    const response = await fetch(url, options);
    const data: ChangePasswordVerifyResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Password change failed: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    // console.error("Error in change password verify API:", error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Network error: Unable to connect to server");
    }
  }
};


export const resendVerificationCodeAPI = async (email: string): Promise<ForgotPasswordResponse> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email: email.toLowerCase() }),
  };

  const url = `${BASE_IP}/forgot-password`; // Reuse the same endpoint

  try {
    const response = await fetch(url, options);
    const data: ForgotPasswordResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    // console.error("Error in resend code API:", error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Network error: Unable to connect to server");
    }
  }
};