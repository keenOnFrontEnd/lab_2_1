// src/routes.ts
import { Router } from 'express';
import {
  createMovieHandler,
  getAllMoviesHandler,
  getMovieByIdHandler,
  updateMovieHandler,
  deleteMovieHandler,
  getMoviesWithHallsHandler,
  getFilteredMoviesHandler,
  getAverageRatingByGenreHandler,
} from './moviesController';

const router = Router();


// Спочатку визначаємо більш специфічні маршрути
router.get('/movies/filter', getFilteredMoviesHandler);
router.get('/movies/average-rating', getAverageRatingByGenreHandler);
router.get('/movies-with-halls', getMoviesWithHallsHandler);

// Потім визначаємо параметризований маршрут
router.get('/movies/:id', getMovieByIdHandler);

// Інші маршрути CRUD
router.post('/movies', createMovieHandler);
router.get('/movies', getAllMoviesHandler);
router.put('/movies/:id', updateMovieHandler);
router.delete('/movies/:id', deleteMovieHandler);


export default router;
