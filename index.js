const express = require('express');
const movies = require('./app/movies.json');
const crypto = require('node:crypto');
const cors = require('cors')

const { validateMovie, validatePartialMovie } = require('./schemas/movie')

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3000',
]

const app = express();
const PORT= process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}));

app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.get('/movies', (req, res) => {
  const { genre } = req.query;
  if(genre) {
    const moviesByGenre =
      movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
    return res.json(moviesByGenre);
  }
  res.json(movies);
});

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if(movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  };

  movies[movieIndex] = updatedMovie;

  res.json(updatedMovie);
});

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find(movie => movie.id === id);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
