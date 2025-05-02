Cypress.on('uncaught:exception', (err, runnable) => {
    return false
});
// Your code can be before this line
// require('./commands')
require('dd-trace/ci/cypress/support');
// Also supported:
// import 'dd-trace/ci/cypress/support'
// Your code can also be after this line
// Cypress.Commands.add('login', (email, pw) => {})
