// src/movies.ts
import sql from 'mssql/msnodesqlv8';
import poolPromise from './db';

export interface Movie {
  MovieID?: number;
  Title: string;
  Genre?: string;
  Duration?: number;
  Rating?: number;
}

// Створення фільму
export async function createMovie(movie: Movie): Promise<number> {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('Title', sql.VarChar(100), movie.Title)
    .input('Genre', sql.VarChar(50), movie.Genre)
    .input('Duration', sql.Int, movie.Duration)
    .input('Rating', sql.Decimal(3, 2), movie.Rating)
    .query(`
      INSERT INTO Movies (Title, Genre, Duration, Rating)
      OUTPUT INSERTED.MovieID
      VALUES (@Title, @Genre, @Duration, @Rating)
    `);
  return result.recordset[0].MovieID;
}

// Отримання всіх фільмів
export async function getAllMovies(): Promise<Movie[]> {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT * FROM Movies');
  return result.recordset;
}

// Отримання фільму за ID
export async function getMovieById(id: number): Promise<Movie | null> {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MovieID', sql.Int, id)
    .query('SELECT * FROM Movies WHERE MovieID = @MovieID');
  return result.recordset[0] || null;
}

// Оновлення фільму
export async function updateMovie(id: number, movie: Movie): Promise<boolean> {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MovieID', sql.Int, id)
    .input('Title', sql.VarChar(100), movie.Title)
    .input('Genre', sql.VarChar(50), movie.Genre)
    .input('Duration', sql.Int, movie.Duration)
    .input('Rating', sql.Decimal(3, 2), movie.Rating)
    .query(`
      UPDATE Movies
      SET Title = @Title,
          Genre = @Genre,
          Duration = @Duration,
          Rating = @Rating
      WHERE MovieID = @MovieID
    `);
  return result.rowsAffected[0] > 0;
}

// Видалення фільму
export async function deleteMovie(id: number): Promise<boolean> {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MovieID', sql.Int, id)
    .query('DELETE FROM Movies WHERE MovieID = @MovieID');
  return result.rowsAffected[0] > 0;
}

// Отримання фільмів з назвами залів
export async function getMoviesWithHalls(): Promise<any[]> {
  const pool = await poolPromise;
  const result = await pool.request()
    .query(`
      SELECT Movies.Title, Halls.HallName, Sessions.StartTime
      FROM Movies
      JOIN Sessions ON Movies.MovieID = Sessions.MovieID
      JOIN Halls ON Sessions.HallID = Halls.HallID
    `);
  return result.recordset;
}


// Отримання фільмів з фільтрацією за жанром та рейтингом
export async function getFilteredMovies(genre: string, minRating: number): Promise<Movie[]> {
  const pool = await poolPromise;
  const result = await pool.query`EXEC FilterMoviesByGenre @Genre = ${genre}, @Rating = ${minRating}`;

  //   USE [Kino]
  // GO
  // /****** Object:  StoredProcedure [dbo].[FilterMoviesByGenre]    Script Date: 22.11.2024 21:00:40 ******/
  // SET ANSI_NULLS ON
  // GO
  // SET QUOTED_IDENTIFIER ON
  // GO
  // ALTER PROCEDURE [dbo].[FilterMoviesByGenre]
  //     @Genre VARCHAR(50),
  //     @Rating DECIMAL(3,2)
  // AS
  // BEGIN
  //     SET NOCOUNT ON;

  //     SELECT *
  //     FROM Movies
  //     WHERE Genre = @Genre
  //       AND Rating >= @Rating;
  // END;

  return result.recordset;
}

// Отримання середнього рейтингу за жанрами
export async function getAverageRatingByGenre(): Promise<any[]> {
  const pool = await poolPromise;
  const result = await pool.query`EXEC GetAverageRatings`;


  //   USE [Kino]
  // GO
  // /****** Object:  StoredProcedure [dbo].[GetAverageRatings]    Script Date: 22.11.2024 21:01:36 ******/
  // SET ANSI_NULLS ON
  // GO
  // SET QUOTED_IDENTIFIER ON
  // GO
  // ALTER PROCEDURE [dbo].[GetAverageRatings]
  // AS
  // BEGIN
  //     SELECT 
  //         M.MovieID,
  //         M.Title,
  //         AVG(R.Rating) AS AverageRating
  //     FROM 
  //         Movies M
  //     LEFT JOIN 
  //         Ratings R ON M.MovieID = R.MovieID
  //     GROUP BY 
  //         M.MovieID, M.Title;
  // END;

  return result.recordset;
}