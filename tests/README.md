# End-to-End Testing with Cypress and Cucumber

This directory contains end-to-end tests for the Destination App using Cypress and Cucumber with Gherkin syntax.

## Testing Structure

The tests follow the testing pyramid approach:

1. **Unit Tests** (Base)
   - Located in the frontend and backend directories
   - Test individual components and functions
   - Uses Jest for testing

2. **Integration Tests** (Middle)
   - Test component interactions
   - API endpoint testing
   - Located in respective frontend/backend test directories

3. **E2E Tests** (Top)
   - Complete user flow testing
   - Located in this directory
   - Uses Cypress with Cucumber

## Directory Structure

```
tests/
├── cypress/
│   ├── e2e/
│   │   ├── HomePage/
│   │   │   └── homePage.feature
│   │   ├── ResultsPage/
│   │   │   └── resultsPage.feature
│   │   └── step_definitions/
│   │       ├── homePageSteps.ts
│   │       └── resultsPageSteps.ts
│   ├── fixtures/
│   └── support/
│       ├── commands.js
│       └── e2e.ts
├── cypress.config.ts
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Install dependencies:
```bash
cd tests
npm install
```

2. Make sure the application is running at the URL specified in `cypress.config.ts`

## Running Tests

### Open Cypress Test Runner
```bash
npm run cypress:open
```

### Run Tests Headlessly
```bash
npm run cypress:run
```


## Best Practices

1. **Selectors**
   - Use data-testid attributes for stable selectors
   - Prefer IDs over classes for unique elements
   - Avoid using text content as selectors

2. **Test Organization**
   - Group related scenarios in feature files
   - Keep step definitions DRY
   - Use background steps for common setup

3. **Assertions**
   - Be specific in assertions
   - Test one thing per scenario
   - Use meaningful error messages

4. **Maintenance**
   - Keep tests independent
   - Clean up test data
   - Update tests when UI changes

## Contributing

1. Follow the existing test structure
2. Write clear, descriptive feature files
3. Implement step definitions using Cypress best practices
4. Update this README when adding new test features

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/reference/)
