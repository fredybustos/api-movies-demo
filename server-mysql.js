import { createApp } from './index.js';

import { MovieModel } from './app/models/mysql/movie.js';

createApp({ movieModel: MovieModel });
