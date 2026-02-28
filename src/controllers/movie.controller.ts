import { Request, Response } from "express";
import { MovieModel } from "../mysql/movie";

export class MovieController {
    static async getAll (req: Request, res: Response) {
        const { genre } = req.query;
        const movies = await MovieModel.getAll({ genre });
        res.json(movies);
    }

    static async getById (req: Request, res: Response) {
        const { id } = req.params;
        const movie = await MovieModel.getById({ id });
        if (movie) return res.json(movie)
        res.status(404).json({ message: 'Movie not found' })
    }

    static async create (req: Request, res: Response) {
        const input = req.body;
        const movie = await MovieModel.create({ input });
        res.status(201).json(movie);
    }
}