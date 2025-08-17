import z from 'zod';

const movieSchema = z.object({
    title: z.string({
        required_error: 'Movie title is required.',
        invalid_type_error: 'Movie title must be a string'
    }),
    year: z.number().int().min(1900).max(2025),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(z.enum(['Action', 'Adventure', 'Horror', 'Mystery']),
    {
        required_error: 'Movie genre is required.',
        invalid_type_error: 'Movie genre must be an array of enum Genre'
    })
})

function validateMovie(object) {
    return movieSchema.safeParse(object) // TODO: .safeParseAsync
}

function validatePartialMovie(input) {
    return movieSchema.partial().safeParse(input)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}