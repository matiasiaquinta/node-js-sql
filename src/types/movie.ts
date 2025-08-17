export interface Movie {
    id: string
    title: string
    year: number
    director: string
    duration: number
    rate?: number
    poster: string
    genre: string[]
}