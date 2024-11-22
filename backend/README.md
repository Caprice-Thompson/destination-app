# Backend

## Overview

The **Backend** is a TypeScript-based service that provides data related to natural hazards, including volcanoes and earthquakes. It interacts with external APIs to fetch and process data, offering endpoints for retrieving comprehensive natural hazard information based on location and other parameters.

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   └── apiClient.ts
│   ├── natural_hazards/
│   │   ├── NaturalHazardService.ts
│   │   ├── getEarthquakes.ts
│   │   ├── getGeoCoordinates.ts
│   │   └── volcanoes.ts
│   ├── country/
│   │   └── country.ts
│   ├── prisma/
│   │   └── prismaClient.ts
│   ├── types.ts
│   └── index.ts
├── tests/
│   ├── volcano.test.ts
│   └── country.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- **Fetch Volcano Data:** Retrieves a list of volcanoes from an external API.
- **Natural Hazard Service:** Aggregates data on volcanoes, earthquakes, and other natural hazards.
- **Country Details:** Fetches detailed information about countries.
- **Testing:** Comprehensive unit tests using Jest to ensure reliability.
- **Environment Configuration:** Utilizes environment variables for configurable endpoints.

## Installation

**Install Dependencies:**

Ensure you have [Node.js](https://nodejs.org/) installed. Then, run:

   ```bash
   npm install
   ```

- **Start the Application:**

  ```bash
  npm start
  ```

  Runs the application using `ts-node`.

- **Develop the Application:**

  ```bash
  npm run dev
  ```

  Starts the application in development mode with `nodemon` for automatic restarts on code changes.

- **Build the Application:**

  ```bash
  npm run build
  ```

  Compiles the TypeScript code into JavaScript.

- **Run Tests:**

  ```bash
  npm test
  ```

  Executes all unit tests using Jest.

- **Backend Specific Start:**

  ```bash
  npm run backend:start
  ```

  Starts the backend server.

- **Backend Specific Develop:**

  ```bash
  npm run backend:dev
  ```

  Starts the backend server in development mode with `nodemon`.

## Testing

The backend uses **Jest** for unit testing. Tests are located in the `tests` directory.

- **Run All Tests:**

  ```bash
  npm test
  ```

- **Test Coverage:**

  To generate a coverage report:

  ```bash
  jest --coverage
  ```

## Usage

1. **Start the Backend Server:**

   ```bash
   npm start
   ```

2. **Fetch Volcano List:**

   The `getVolcanoList` function retrieves a list of volcanoes. You can invoke this function or set up an API endpoint to expose this data.

3. **Natural Hazard Service:**

   Use the `NaturalHazardService` to get aggregated natural hazard data based on location and target month.

