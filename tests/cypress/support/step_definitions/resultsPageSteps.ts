import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('I am on the results page for {string}', (searchTerm: string) => {
    cy.visit(`/results/${searchTerm}/5`);
});

Then('I should see the heading {string}', (headingText: string) => {
    cy.get('h1').should('exist').and('contain', headingText);
});

Then('I should see a list of results', () => {
    cy.get('.dashboard-grid').should('exist');
});

Then('each result should contain basic information', () => {
    cy.get('.dashboard-grid').each(($el) => {
        cy.wrap($el).find('h2').should('exist');
    });
});

