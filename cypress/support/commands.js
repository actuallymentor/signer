Cypress.Commands.add( 'connect_metamask', () => {

    cy.contains( `Connect to wallet` ).click()
    cy.contains( `MetaMask` ).click()

} )