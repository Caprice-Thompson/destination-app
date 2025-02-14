# Destination App Frontend

A React application that provides travel information, including country details, tourism data, and natural hazard information.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn


## Features

- Country information lookup
- Tourism data including UNESCO sites and things to do
- Natural hazard information (volcanoes and earthquakes)
- Responsive design
- TypeScript support
- Environment-based configuration

## API Integration

The application integrates with four AWS API Gateway endpoints:
- Country API: Basic country information
- Tourism API: Tourism-related data
- Earthquake API: Historical earthquake data
- Volcano API: Volcano information

## Development Notes

- The development server includes a proxy configuration for local API development
- CORS headers are handled by the backend API Gateway configuration
- Environment variables are managed through Vite's import.meta.env

## Start development

### Local Development
- Development server runs on `http://localhost:5173`
- API proxy is configured to forward requests to `http://localhost:8000`
- Set `VITE_USE_MOCK_DATA=true` to use mock data instead of API calls

### Production Mode
- Uses AWS API Gateway endpoints
- CORS is configured for CloudFront distribution
- Set `VITE_USE_MOCK_DATA=false` to use real API endpoints


## Available Scripts

Start development server
```
npm run dev
```
Build for production
```
npm run build
```

Deploy to AWS CloudFront
```
npm run deploy
```

