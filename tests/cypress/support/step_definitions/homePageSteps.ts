import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('I am on the homepage', () => {
  cy.visit('/'); 
});

Then('I should see the main heading {string}', (headingText: string) => {
  cy.get('h3').should('exist').and('contain', headingText);
});

Then('I should see a search input field', () => {
  cy.get('input[type="text"]').should('exist');
});

When('I enter {string} in the search field', (searchText: string) => {
  cy.get('input[type="text"]').type(searchText);
});

When('I click the submit button', () => {
  cy.get('button[type="submit"]').click();
});

Then('I should be redirected to the results page', () => {
  cy.url().should('include', '/results');
});

Then('the URL should contain {string}', (urlParam: string) => {
  cy.url().should('include', urlParam);
});

When('I select {string} from the month dropdown', (month: string) => {
  cy.get('select[name="month"]').select(month);
});
