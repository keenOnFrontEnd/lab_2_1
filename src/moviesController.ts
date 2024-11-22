// src/moviesController.ts
import { Request, Response } from 'express';
import { Movie, createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie, getMoviesWithHalls, getFilteredMovies, getAverageRatingByGenre } from './movies';

// Створення фільму
export async function createMovieHandler(req: Request, res: Response) {
  try {
    const movie: Movie = req.body;
    const movieId = await createMovie(movie);
    res.status(201).json({ MovieID: movieId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка створення фільму' });
  }
}

// Отримання всіх фільмів
export async function getAllMoviesHandler(req: Request, res: Response) {
  try {
    const movies = await getAllMovies();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка отримання фільмів' });
  }
}

// Отримання фільму за ID
export async function getMovieByIdHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const movie = await getMovieById(id);
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({ error: 'Фільм не знайдено' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка отримання фільму' });
  }
}

// Оновлення фільму
export async function updateMovieHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const movie: Movie = req.body;
    const success = await updateMovie(id, movie);
    if (success) {
      res.status(200).json({ message: 'Фільм оновлено' });
    } else {
      res.status(404).json({ error: 'Фільм не знайдено' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка оновлення фільму' });
  }
}

// Видалення фільму
export async function deleteMovieHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const success = await deleteMovie(id);
    if (success) {
      res.status(200).json({ message: 'Фільм видалено' });
    } else {
      res.status(404).json({ error: 'Фільм не знайдено' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка видалення фільму' });
  }
}

// Отримання фільмів з назвами залів
export async function getMoviesWithHallsHandler(req: Request, res: Response) {
  try {
    const data = await getMoviesWithHalls();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка отримання даних' });
  }
}

// Отримання фільтрованих фільмів
export async function getFilteredMoviesHandler(req: Request, res: any) {
  try {
    const genre = req.query.genre as string;
    const minRating = parseFloat(req.query.minRating as string) || 0;

    if (!genre) {
      return res.status(400).json({ error: 'Потрібно вказати жанр' });
    }

    const movies = await getFilteredMovies(genre, minRating);
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка отримання фільтрованих фільмів' });
  }
}

// Отримання середнього рейтингу за жанрами
export async function getAverageRatingByGenreHandler(req: Request, res: Response) {
  try {
    const data = await getAverageRatingByGenre();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка отримання агрегованих даних' });
  }
}
