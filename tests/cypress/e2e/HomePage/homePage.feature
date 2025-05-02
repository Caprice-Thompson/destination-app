
Feature: Homepage

  Background:
    Given I am on the homepage

  Scenario: View homepage content
    Then I should see the main heading "Prepare for your next adventure..."
    And I should see a search input field

  Scenario: Search for a destination
    When I enter "France" in the search field
    And I select "January" from the month dropdown
    And I click the submit button
    Then I should be redirected to the results page
    And the URL should contain "France"
