@skip
Feature: Results Page

  Background:
    Given I am on the results page for "France"

  Scenario: View search results content
    Then I should see the heading "France"
    And I should see a list of results
    And each result should contain basic information
      | Quick facts     |
      | Popular cities  |
      | Things to do    |
      | Volcanoes       |
      | Earthquakes     |

