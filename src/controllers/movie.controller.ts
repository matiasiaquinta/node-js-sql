import { Request, Response } from "express";
import { MovieModel } from "../mysql/movie";

/* export class MovieController {
    static async getAll(req: Request, res: Response) {
        try {
            const movies = await MovieModel.getAll();
            const { genre } = req.query;

            if (genre) {
                const filtered = movies.filter(movie =>
                    movie.genre?.some(g => g.toLowerCase() === (genre as string).toLowerCase())
                );
                return res.json(filtered);
            }

            res.json(movies);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
} */