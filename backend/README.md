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
|   |── handlers/
|   |   ├── volcanoServiceHandler.ts
|   |   ├── countryServiceHandler.ts
|   |   ├── earthquakeServiceHandler.ts
|   |   └── tourismServiceHandler.ts
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
│   ├── handlers/
│   │   ├── volcanoServiceHandler.test.ts
|   │   ├── countryServiceHandler.test.ts
|   │   ├── earthquakeServiceHandler.test.ts
|   │   └── tourismServiceHandler.test.ts
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

**Prerequisites:**
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

**Install Dependencies:**

```bash
cd backend
npm install
```

## Running the Application

1. **Start the Application:**

Starts and runs the application in docker containers with `nodemon` for automatic restarts on code changes.

   ```bash
   docker-compose up backend
   ```
   The server will start on http://localhost:8080/

2. **Stopping the Application:**
   ```bash
   docker-compose down
   ```

3. **Rebuilding Containers:**

   ```bash
   docker-compose up backend --build
   ```

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

# Database Migrations

This project uses a custom migration system to manage database schema changes. Migrations are versioned using the format `V1__description.sql`, `V2__description.sql`, etc.

## Migration Files

- All migration files should be placed in the `backend/migrations` directory
- Files must follow the naming convention: `V{number}__{description}.sql`
- Example: `V1__create_users_table.sql`, `V2__add_email_column.sql`
- The `prisma_migrations` directory is automatically excluded

## Running Migrations Locally

### Prerequisites
- Docker and Docker Compose installed
- `.env` file in the `backend` directory with database credentials:
  ```
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_NAME=your_db_name
  ```

### Steps

1. Run migrations:
   ```bash
   docker-compose up migrations
   ```

The migrations will run against your local database using the credentials from your `.env` file.

## Running Migrations in Production

Migrations are automatically run in production when code is pushed to the `main` branch through GitHub Actions.

## Migration Script Features

The migration script (`runMigrations.sh`) includes:
- Version tracking to prevent duplicate migrations
- Transaction support for safe rollbacks
- Validation of migration file format
- Proper ordering of migrations
- Detailed logging
- Error handling and reporting

## Troubleshooting

1. **Migration Already Applied**
   - The script will skip migrations that have already been applied
   - Check the `schema_migrations` table to see applied migrations

2. **Connection Issues**
   - Local: Verify your `.env` file has correct credentials
   - Production: Verify GitHub Secrets are correctly set

3. **Version Format Errors**
   - Ensure migration files follow the `V{number}__{description}.sql` format
   - Version numbers must be sequential

## API Endpoints

### Earthquake Service

The earthquake service endpoint provides earthquake data for a specific country and month.

#### Event Format
When calling the earthquake service Lambda function, provide the following event JSON structure:

```json
{
  "queryStringParameters": {
    "country": "Japan",  // Required: Country name as a string
    "month": "3"        // Required: Month as a string (1-12)
  }
}
```

#### Parameters
- `country` (required): A string representing the country name (e.g., "Japan", "United States", "Italy")
- `month` (required): A string representing the month number (1-12, where 1 is January and 12 is December)
