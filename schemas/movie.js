const z = require('zod');

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required'
  }),
  year: z.number({
    required_error: 'Year is required'
  }).int().min(1900).max(2024),
  director: z.string({
    required_error: 'Director is required'
  }),
  duration: z.number({
    required_error: 'Duration is required'
  }).positive().int(),
  rate: z.number({
    required_error: 'Rate is required'
  }).positive().min(1).max(10),
  poster: z.string({
    required_error: 'Poster is required'
  }).url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(z.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Historical', 'Horror', 'Mystery', 'Romance', 'Sci-fi', 'Thriller', 'Western']), {
    required_error: 'Genre is required',
    invalid_type_error: 'Genre must be an array',
  })
});

function validateMovie(shape) {
  return movieSchema.safeParse(shape);
}

function validatePartialMovie(shape) {
  return movieSchema.partial().safeParse(shape);
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
