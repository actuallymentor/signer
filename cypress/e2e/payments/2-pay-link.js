import { mock_user_transaction_to_address, payment_amount } from "../../fixtures/web3"

context( "Payment link usage", () => { 

    // Load web3 wallet
    beforeEach( mock_user_transaction_to_address )

    it( `Can pay a payment link to an address`, () => {


        cy.visit( `/pay/create` )
        cy.connect_address_autofill()
        cy.get( '#pay-generate-link' ).click()
        cy.url().should( 'contain', '/share' )
        cy.get( `input#pay-share-link` ).invoke( 'val' ).then( url => {
            cy.visit( url.replace( '/share', '' ) )
        } )

        cy.contains( `Transfer ${ payment_amount }` ).click()
        cy.contains( `Payment success` )


    } )

    it( `Can pay a donation link to an address`, () => {


        cy.visit( `/pay/create` )
        cy.contains( 'Make donation link instead' ).click()
        cy.connect_address_autofill()
        cy.get( '#pay-generate-link' ).click()
        cy.url().should( 'contain', '/donate' )

        cy.get( `input#pay-share-link` ).invoke( 'val' ).then( url => {
            cy.visit( url.replace( '/donate', '' ) )
        } )

        cy.get( 'button' ).contains( `Donate ${ payment_amount }` ).click( )
        cy.contains( `Payment success` )


    } )


} )