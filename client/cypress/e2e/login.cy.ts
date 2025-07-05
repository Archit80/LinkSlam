describe('LinkSlam Login Flow', () => {
  it('should load login page and login a user', () => {
    cy.visit('http://localhost:3000/auth');

    cy.get('input[name="email"]').type('test.user@email.com');
    cy.get('input[name="password"]').type('11234567');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/public-feed');
    cy.contains('Popular Tags'); // adjust based on your UI
  });
});
