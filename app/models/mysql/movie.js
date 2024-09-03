import mysql from 'mysql2/promise';

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();
      const [genres] = await connection.query('SELECT id, name FROM genre WHERE LOWER(name) = ?', [lowerCaseGenre]);

      if (genres.length === 0) return [];

      const [{id}] = genres;

      // get all movies ids from databa  table
      // la query a movies_genres
      // join
      // devolver resultdos
      return [];
    }

    const [movies] = await connection.query(`
      SELECT title, year, duration, director, poster, rate, BIN_TO_UUID(id) id FROM movie
      `
    );
    return movies
  }

  static async getById({ id }) {
    const [movies] = await connection.query(`
      SELECT title, year, duration, director, poster, rate, BIN_TO_UUID(id) id
      FROM movie WHERE id = UUID_TO_BIN(?)
      `, [id]
    );

    if (movies.length === 0) return null;

    return movies[0];
  }

  static async create({ input }) {
    const [uuidResult] = await connection.query('SELECT UUID() uuid;');
    const [{ uuid }] = uuidResult;

    const { title, year, duration, director, poster, rate } = input;

    try {
      await connection.query(`
        INSERT INTO movie (id, title, year, duration, director, poster, rate)
        values ( UUID_TO_BIN(?) ?, ?, ?, ?, ?, ?);
        `, [uuid, title, year, duration, director, poster, rate ]
      );
    } catch (error) {
      throw new Error('Error creating movie');
      // send error to any error tracking service
    }

    const movies = await connection.query(`
      SELECT title, year, duration, director, poster, rate, BIN_TO_UUID(id) id
      FROM movie WHERE id = UUID_TO_BIN(?)
      `, [uuid]
    );

    return movies[0];

  }

  static async delete({ id }) {
    try {
      await connection.query('DELETE FROM movie WHERE id = UUID_TO_BIN(?)', [id]);
      return true;
    } catch (error) {
      throw new Error('Error deleting movie');
    }
  }

  static async update({ id, input }) {
    const { title, year, duration, director, poster, rate } = input;

    try {
      await connection.query(`
        UPDATE INTO movie
        values (?, ?, ?, ?, ?, ?)
        WHERE id = UUID_TO_BIN(?);
        `, [title, year, duration, director, poster, rate, id]
      );
    } catch (error) {
      throw new Error('Error updating movie');
    }

    const [movies] = await connection.query(`
      SELECT title, year, duration, director, poster, rate, BIN_TO_UUID(id) id
      FROM movie WHERE id = UUID_TO_BIN(?)
      `, [id]
    );

    return movies[0];
  }
}
