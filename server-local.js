import { createApp } from './index.js';

import { MovieModel } from './app/models/local-file-system/movie.js';

createApp({ movieModel: MovieModel });
