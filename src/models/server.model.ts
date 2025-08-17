import express, { Application, Request, Response } from 'express';
import routesProduct from '../routes/product.routes';
import routesUser from '../routes/user.routes';

import moviesMock from '../mock/movies.json'
import { Movie } from '../types/movie'
import { validateMovie, validatePartialMovie } from '../schemas/movies.schema.js'

import mysql from 'mysql2/promise'
import { dbConfig } from '../db/connection';
import { MovieController } from '../controllers/movie.controller';

// import cors, { CorseOptions } from 'cors';

import { initDb } from '../mysql/movie';

initDb().then(() => {
    const server = new Server();
})

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.listen();
        this.middlewares();
        
        this.newStart();
        // this.start();

        // this.routes();
        // this.dbConnect();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server running on port " + this.port);
        });
    }

    middlewares() {
        this.app.use(express.json());
    }

    newStart() {
        this.app.get('/movies', MovieController.getAll);
    }

    start() {
        const movies: Movie[] = moviesMock as Movie[];
        this.app.disable('x-powered-by'); // algo de express



        //! CORS
        /* this.app.use(cors({
            origin: (origin: CorseOptions, callback) => {
                const ACCEPTED_ORIGINS = [
                    'http://localhost:8080',
                    'http://midu.dev'
                    // otros...
                ]

                if (ACCEPTED_ORIGINS.includes(origin)) {
                    return callback(null, true);
                }

                if (!origin) {
                    return callback(null, true);
                }

                return callback(new Error('Not allowed by CORS'))
            }
        })) */

        //* TEST
        this.app.get('/', (req: Request, res: Response) => {
            res.json({ message: 'hola mundo' })
        })

        //* GET MOVIES
        this.app.get('/movies', (req: Request, res: Response) => {
            //! CORS
            const origin = req.header('origin')
            res.header('Access-Control-Allow-Origin', '*');
            // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
            //     res.header('Access-Control-Allow-Origin', origin);
            // }

            // const { genre, search } = req.query; //TODO: el search
            const { genre } = req.query;

            if (genre) {
                // const filteredMovies = movies.filter(movie => movie.genre.includes(genre));
                const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
                return res.json(filteredMovies);
            }

            res.json(movies);
        })

        //* GET MOVIE BY ID
        this.app.get('/movies/:id', (req: Request, res: Response) => {
            const { id } = req.params;
            const movie = movies.find(movie => movie.id === id);
            if (movie) return res.json(movie);
        })

        //* NEW MOVIE
        this.app.post('/movies', (req: Request, res: Response) => {
            // const { title, genre, year, director, duration, rate, poster } = req.body;

            const result = validateMovie(req.body)

            if (result.error) {
                return res.status(400).json({ error: JSON.parse(result.error.message) })
            }

            const newMovie = {
                id: crypto.randomUUID(), // uuid v4 de node
                ...result.data //* aca ya estan validados los datos.
            }

            //* esto no es REST porque no estamos guardando el estado de aplicación en memoria.

            movies.push(newMovie);

            res.status(201).json(newMovie); // actualizar la caché del cliente. 201 = created.
        })

        //* UPDATE MOVIE
        this.app.patch('/movies/:id', (req: Request, res: Response) => {
            const result = validatePartialMovie(req.body)
            
            if (result.error) {
                return res.status(400).json({ error: JSON.parse(result.error.message) })
            }
            
            const { id } = req.params;
            const movieIndex = movies.findIndex(movie => movie.id === id)

            if (movieIndex === -1) {
                return res.status(404).json({ message: 'Movie not found' })
            }

            const updateMovie = {
                ...movies[movieIndex],
                ...result.data
            }

            movies[movieIndex] = updateMovie

            return res.json(updateMovie)
        })
    }

    routes() {
        this.app.use('/api/products', routesProduct);
        this.app.use('/api/users', routesUser)
    }

    async dbConnect() {
        try {
            const connection = await mysql.createConnection(dbConfig);
            console.log("Connection Successfully!");
        } catch (error) {
            console.error("Unable to connect", error)
        }
    }
}

export default Server