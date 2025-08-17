import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'moviesdb'
}

export async function initDb() {
    const conn = await mysql.createConnection(config);
    MovieModel.connection = conn; // <- asignar conexión aquí
}

export class MovieModel {
    static connection: mysql.Connection;

    static async getAll () {
        const [movies] = await this.connection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
        )
       
        return movies;
    }

    //TODO: genre
    /* static async getGenre ({ genre }) {
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase();

            const [genres] = await this.connection.query('SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]);

            if (genres.length === 0) return [];

            const [{ id }] = genres;

            // get all movies ids from database table
            // la query a movie_genres
            // join
            // devolver resultados.

            return [];
        }
    } */

    static async getById ({ id }) {

    }

    static async create ({ input }) {

    }

    static async delete ({ id }) {

    }

    static async update ({ id, input }) {

    }
}