import { Routes, Route, Navigate } from "react-router-dom"
import HomeScreen from "./pages/HomeScreen"
import TopbarLayout from "./layout/Topbar"
import Page404 from "./pages/pageNotFound"
import MovieDetails from "./pages/MovieDetails"
import MoviesSearchScreen from "./pages/MoviesSearchScreen"
import ShowsScreen from "./pages/ShowsScreen"
import ShowDetails from "./pages/ShowDetails"
import ShowsSearchScreen from "./pages/ShowsSearchScreen"
import AnimeScreen from "./pages/AnimeScreen"
import AnimeDetails from "./pages/AnimeDetails"
import AnimeSearchScreen from "./pages/AnimeSearchScreen"


function App() {
  return (
    <Routes>
        {/* Wrap routes inside TopbarLayout */}
        <Route element={<TopbarLayout />}>
        <Route path="/" element={<Navigate to="/movies" replace />} />
          <Route path="/movies" element={<HomeScreen />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/search" element={<MoviesSearchScreen />} />
          <Route path="/shows" element={<ShowsScreen />} />
          <Route path="/show/:id" element={<ShowDetails />} /> 
          <Route path="/show-search" element={<ShowsSearchScreen />} />
          <Route path="/anime" element={<AnimeScreen />} /> 
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/anime-search" element={<AnimeSearchScreen />} /> 


          <Route path="*" element={<Page404 />} />

        </Route>
      </Routes>
  )
}

export default App
