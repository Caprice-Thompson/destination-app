# Destination-App

Destination-App is an intelligent data aggregation tool designed for travelers and researchers. It scrapes and compiles comprehensive information about various destinations worldwide, including activities, largest cities, UNESCO World Heritage Sites, and climate data. Destination-App provides up-to-date and detailed information to help users plan their travels or conduct geographical research.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Data Sources](#data-sources)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Web Scraping**: Extracts data from multiple sources such as Wikipedia and World Population Review.
- **Data Aggregation**: Compiles information on things to do, largest cities, UNESCO sites, and climate data.
- **API Integration**: Fetches real-time data from external APIs for weather and country-specific information.
- **Rate Limiting**: Implements delays between requests to comply with target websites' scraping policies.
- **Automated Testing**: Ensures code reliability through Jest-based tests.

## Technologies Used

- **Programming Languages**: TypeScript, JavaScript
- **Libraries & Frameworks**:
  - [Axios](https://axios-http.com/) for HTTP requests
  - [Cheerio](https://cheerio.js.org/) for HTML parsing and scraping
  - [Jest](https://jestjs.io/) for testing
- **Tools**:
  - Node.js runtime
  - File System (fs) for handling file operations

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

3. **Configure Environment Variables**

   If the project requires API keys or other configurations, create a `.env` file in the root directory and add the necessary variables.

   ```env
   API_KEY=your_api_key_here
   ```

## Usage

### Scraping Data

The application includes several scripts to scrape data from various sources. Here's how you can run them:

1. **Scrape Things To Do**

   ```bash
   npm run scrape:things-to-do
   ```

   This command scrapes activities and things to do in different countries.

2. **Scrape Largest Cities**

   ```bash
   npm run scrape:largest-cities
   ```

   This command compiles a list of the largest cities worldwide along with their populations.

3. **Scrape UNESCO World Heritage Sites**

   ```bash
   npm run scrape:unesco-sites
   ```

   This command gathers information about UNESCO World Heritage Sites across different regions.

4. **Run All Scrapers**

   ```bash
   npm run scrape:all
   ```

   This command executes all available scraping scripts sequentially.

### Fetching Weather and Country Data

The application can also fetch real-time weather and country-specific data using APIs.

1. **Fetch Weather Data**

   ```bash
   npm run fetch:weather
   ```

   Retrieves weather information from the configured API.

2. **Fetch Country Data**

   ```bash
   npm run fetch:country -- Spain
   ```

   Replace `Spain` with any country name to get specific information about that country.

### Running the Application

To start the main application script:
