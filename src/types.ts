
export interface Weather {
    id: number
    location: string
    temperature: number
}

export interface Country {
    capitalCity: string
    language: string
    currency: number
    flag: string
}

export interface City {
    city: string
    country: string
    population: number
}

export interface SiteData {
    site: string;
    location: string;
    description: string;
}

export interface ApiResponse<T> {
    data: T
    status: number
}

export interface ApiError {
    message: string
    status: number
}
export interface ThingsToDo {
    location: string;
    item: string[];
}