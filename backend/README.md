# Backend

## Overview

The **Backend** is a TypeScript-based service that provides data related to natural hazards, including volcanoes and earthquakes and country specific details such as city population and unesco sites. It interacts with external APIs and a DB to fetch and process data, offering endpoints for retrieving comprehensive natural hazard and country specific information based on country and other parameters.

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   |── client.ts
|   |   └── getURL.ts
|   |
│   ├── services/
│   │   ├── CountryService.ts
│   │   ├── EarthquakesService.ts
│   │   ├── TourismService.ts
│   │   └── VolcanoService.ts
│   ├── utils/
│   │   └── getGeoCoordinates.ts
│   ├── web/
│   │   └── scrapeData.ts
│   ├── index.ts
│   └── server.ts
├── tests/
│   ├── volcanoService.test.ts
|   ├── countryService.test.ts
|   ├── earthquakeService.test.ts
│   └── tourismService.test.ts
├── docker-compose.yml
├── jest.config.ts
├── nodemon.json
├── package.json
├── tsconfig.json
└── README.md
└── runMigrations.sh

```

## Features

- **Earthquake Service:** Aggregates data on earthquakes and tsunamis.
- **Volcano Service:** Retrieves a list of volcanoes from an external API
- **Country Service:** Fetches detailed information about a country such as language spoken, city population, currency and the capital city.
- **Tourism Service:** Fetches detailed information about unesco sites and things to do in a country.
- **Testing:** Comprehensive unit tests using Jest to ensure reliability.
- **Environment Configuration:** Utilizes environment variables for configurable endpoints.

## Installation

**Install Dependencies:**

Ensure you have [Node.js](https://nodejs.org/) and [docker](https://www.docker.com/) installed.

Then, run:

```bash
cd backend
npm install
```

- **Start the Application:**

  ```bash
  docker-compose up backend
  ```

Starts and runs the application in docker containers with `nodemon` for automatic restarts on code changes.

Then open:

http://localhost:8080/

## Testing

The backend uses **Jest** for unit testing. Tests are located in the `tests` directory.

- **Run Tests:**

  ```bash
  docker-compose run tests
  ```

  Executes all unit tests using Jest.

- **Test Coverage:**

  To generate a coverage report:

  ```bash
  jest --coverage
  ```
