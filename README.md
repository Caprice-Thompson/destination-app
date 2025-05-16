# Destination-App

Destination-App is an intelligent data aggregation tool designed for travelers and researchers. It scrapes and compiles comprehensive information about various destinations worldwide, including activities, largest cities, UNESCO World Heritage Sites, and climate data. Destination-App provides up-to-date and detailed information to help users plan their travels or conduct geographical research.

### Notes
In DB: population, things to do, volcano list, unesco sites

## Features

- **Web Scraping**: Extracts data from multiple sources such as Wikipedia and World Population Review.
- **Data Aggregation**: Compiles information on things to do, largest cities, UNESCO sites, and climate data.
- **API Integration**: Fetches real-time data from external APIs for weather and country-specific information.
- **Automated Testing**: Ensures code reliability through Jest-based tests.

## Installation

1. **Clone the Repository**

   ```bash
   git clone
   cd destination-app
   ```

2. **Install Dependencies**

   Ensure you have [Node.js](https://nodejs.org/) installed. Then, install the necessary packages:

   ```bash
   npm install
   ```

## Usage

### Running the Application

To start the main application script:

```bash
npm start
```

### Run unit tests

To start the main application script:

```bash
npm test
```

## Environment Setup

### Local Development
1. Create a `.env` file in the `backend` directory with your database credentials:
   ```env
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DB_HOST=localhost
   DB_PORT=5432
   ```

2. Load environment variables:
   ```bash
   source ./loadEnvVars.sh
   ```

### Production
The application uses GitHub Secrets for production environment variables. These are automatically loaded during deployment.
