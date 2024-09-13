
interface Weather {
    id: number
    location: string
    temperature: number
}

interface Country {
    capitalCity: string
    language: string
    currency: number
    flag: string
}

interface ApiResponse<T> {
    data: T
    status: number
}

interface ApiError {
    message: string
    status: number
}