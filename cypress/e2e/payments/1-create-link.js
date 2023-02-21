import { invalid_user_address, mock_user_transaction_to_address, payment_amount, user_address, user_ens } from "../../fixtures/web3"

context( "Payment link creation", () => {

    // Load web3 wallet
    beforeEach( mock_user_transaction_to_address )

    it( 'Fails without input', () => {

        let alerts = 0
        cy.on( 'window:alert', response => {
            alerts++
            if( alerts == 1 ) expect( response ).to.contain( 'Invalid ETH address' )
            if( alerts == 2 ) expect( response ).to.contain( 'Invalid ETH address' )
            if( alerts == 3 ) expect( response ).to.contain( 'Amount to receive missing' )
        } )

        cy.visit( `/pay/create` )
        cy.contains( `Create a payment link` )
        cy.contains( `Generate payment link` ).click()

        cy.get( `input#pay-create-recipient` ).type( invalid_user_address )
        cy.contains( `Generate payment link` ).click()

        cy.get( `input#pay-create-recipient` ).type( user_address )
        cy.contains( `Generate payment link` ).click()

    } )

    it( `Loads the address on wallet connection`, () => {

        cy.visit( `/pay/create` )
        cy.connect_address_autofill()
        cy.get( `input#pay-create-recipient` ).invoke( 'val' ).then( val => expect( val.toLowerCase() ).to.equal( user_address ) )

    } )

    it( `Creates a valid payment link`, () => {

        cy.visit( `/pay/create` )
        cy.get( `input#pay-create-recipient` ).type( user_address )
        cy.get( `input#pay-create-amount` ).type( payment_amount )
        cy.get( '#pay-generate-link' ).click()

        cy.url().should( 'include', '/share' )
        cy.contains( `Share this payment link` )
        cy.contains( `Copy link` )
        cy.get( `#pay-view-qr` )
        cy.get( `input#pay-share-link` ).invoke( 'val' ).then( url => {
            cy.visit( url.replace( '/share', '' ) )
        } )

        cy.contains( user_ens )
        cy.contains( `has requested ${ payment_amount }` )
        cy.connect_metamask()


    } )

    it( `Creates a valid donation link`, () => {

        cy.visit( `/pay/create` )

        cy.contains( 'Make donation link instead' ).click()
        cy.contains( 'Create a donation link' )
        cy.contains( 'Generate donation link' )
        cy.contains( 'Make payment link instead' )

        cy.get( `input#pay-create-recipient` ).type( user_address )
        cy.get( `input#pay-create-amount` ).type( payment_amount )
        cy.get( '#pay-generate-link' ).click()

        cy.url().should( 'include', '/donate' )
        cy.contains( `Share this donation link` )
        cy.contains( `Copy link` )
        cy.get( `#pay-view-qr` )
        cy.get( `input#pay-share-link` ).invoke( 'val' ).then( url => {
            cy.visit( url.replace( '/donate', '' ) )
        } )

        cy.contains( user_ens )
        cy.contains( `Donate ${ payment_amount }` )
        cy.connect_metamask()


    } )

} )