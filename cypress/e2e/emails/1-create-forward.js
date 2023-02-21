import { email_user_address, email_user_email, email_user_ens, mock_user_signature_for_email_forward } from "../../fixtures/web3"

context( 'Email forwarding', () => {

    beforeEach( mock_user_signature_for_email_forward )

    it( `Can view the creation interface`, () => {

        cy.visit( `/email` )
        cy.connect_metamask()
        cy.contains( `Forward ${ email_user_ens }@signer.is and ${ email_user_address }@signer.is to`, { matchCase: false } )
        cy.contains( `Sign message to set email forwarder` )

    } )

    it( `Fails without email input`, () => {

        cy.on( 'window:alert', response => {
			
            expect( response ).to.contain( 'Please enter a valid email address' )

        } )

        cy.visit( `/email` )
        cy.connect_metamask()
        cy.get( `input#forward-input-email` ).clear()
        cy.contains( `Sign message` ).click()

        

    } )

    it( `Can set an email forward`, () => {

        cy.visit( `/email` )
        cy.connect_metamask()
        cy.contains( `Forward ${ email_user_ens }@signer.is and ${ email_user_address }@signer.is to`, { matchCase: false } )
        cy.get( `input#forward-input-email` ).type( email_user_email )
        cy.contains( `Sign message` ).click()
        cy.contains( `Please open your ${ email_user_email } inbox` )

    } )

} )