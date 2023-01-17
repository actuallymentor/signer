Cypress.Commands.add( 'connect_metamask', () => {

    cy.contains( `Connect to wallet` ).click()
    cy.contains( `MetaMask` ).click()

} )

Cypress.Commands.add( 'connect_address_autofill', () => {

    cy.get( `button#address-input-connect` ).click( { force: true } )
    cy.contains( 'MetaMask' ).click()

} )