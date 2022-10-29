
context( "Frontpage tests", () => {


    it( 'Can view frontpage', () => {

		// Visit code claim page
		cy.visit( `/` )

		// Page renders
        cy.contains( `Share a signature with your crypto wallet` )
		cy.contains( `Receive emails with your crypto wallet` )
		cy.contains( `Receive emails on your wallet` )
		cy.contains( `Sign & share a message` )

	} )


} )
