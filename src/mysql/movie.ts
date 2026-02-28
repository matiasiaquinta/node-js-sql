import mysql, { Pool } from 'mysql2/promise';

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'moviesdb'
}

const connection: Pool = mysql.createPool(config);

export class MovieModel {
    static connection = connection

    static async getAll({ genre }) {
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase();

            const [genres] = await this.connection.query(
                'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
            )

            console.log("genres", genres)

            if (genres.length === 0) return []

            const [{ id }] = genres
            return [] // TODO: obtener peli por genero.
        }

        const [movies] = await this.connection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
        )
       
        return movies;
    }

    static async getById ({ id }) {
        const [movies] = await this.connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
             FROM movie WHERE id = UUID_TO_BIN(?);`, [id]
        )

        if (movies.length === 0) return null

        return movies[0]
    }

    static async create ({ input }) {
        const { 
            genre: genreInput, // array
            title,
            year,
            director,
            duration,
            rate,
            poster
        } = input

        // Todo: crear el genre.

        const [uuidResult] = await connection.query('SELECT UUID() uuid;');
        const [{ uuid }] = uuidResult;

        try {
            const result = await this.connection.query(
                `INSERT INTO movie (title, year, director, duration, poster, rate)
                VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`, [title, year, director, duration, poster, rate]
            )
        } catch (error) {
            //* Cuidado aca que se puede enviar información sensible al usuario.
            throw new Error('Error creating movie')

            // SendLog(error) --> aca enviarlo para analizis propio.
        }

        const [movies] = await connection.query(`
            SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
            FROM movie WHERE id = UUID_TO_BIN(?);`, [uuid])

        console.log(result)
    }

    static async delete ({ id }) {
        // Todo: hacerlo
    }

    static async update ({ id, input }) {
        // Todo: hacerlo
    }
}