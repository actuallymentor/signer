import { mock } from '@depay/web3-mock'
import { utils } from 'ethers'

// Address of connector. Can be any.
export const user_address = "0x7dbf6820d32cfbd5d656bf9bff0def229b37cf0e"
export const user_ens = 'mentor.eth'
export const invalid_user_address = '0x123'
export const invalid_ens = 'foo.bar'


// Mock the user signing a hardcoded signature
export const message_to_sign = `message`
const message_utf8 = utils.toUtf8Bytes( message_to_sign )
const message_hex = utils.hexlify( message_utf8 ).substring(2)
export const message_signature = "0x1023de3db63cf997865b91959093f4e6bc43189618c1e526b9d4c3f90dcf0eba20a181d3a5dcb3cfb54caf52124f76acfab64a1ef72c43bf174d51aa7f95930300"
export const signature_link = `/verify/JTdCJTIyY2xhaW1lZF9tZXNzYWdlJTIyJTNBJTIybWVzc2FnZSUyMiUyQyUyMnNpZ25lZF9tZXNzYWdlJTIyJTNBJTIyMHgxMDIzZGUzZGI2M2NmOTk3ODY1YjkxOTU5MDkzZjRlNmJjNDMxODk2MThjMWU1MjZiOWQ0YzNmOTBkY2YwZWJhMjBhMTgxZDNhNWRjYjNjZmI1NGNhZjUyMTI0Zjc2YWNmYWI2NGExZWY3MmM0M2JmMTc0ZDUxYWE3Zjk1OTMwMzAwJTIyJTJDJTIyY2xhaW1lZF9zaWduYXRvcnklMjIlM0ElMjIweDdEQkY2ODIwRDMyY0ZCZDVENjU2YmY5QkZmMGRlRjIyOUIzN2NGMEUlMjIlN0Q=`
export const mock_user_signature = ( blockchain='ethereum' ) => {

    cy.on( 'window:before:load', ( window ) => {
        
        mock( {
            blockchain,
            window,
            wallet: 'metamask',
            accounts: { return: [ user_address ] },
            signature: {
                params: [ user_address, `0x${ message_hex }`],
                return: message_signature
            }
        } )

    } )

}

// Mock transaction
export const payment_amount = 0.001
export const mock_user_transaction_to_address = ( blockchain='ethereum' ) => {

    cy.on( 'window:before:load', ( window ) => {
        
        mock( {
            blockchain,
            window,
            wallet: 'metamask',
            accounts: { return: [ user_address ] },
            transaction: {
                to: user_address,
                from: user_address
            }
        } )

    } )

}

// Mock the user signing a hardcoded signature
export const email_user_address = `0xE3Ae145545f096e9b6EeA9d13c24405aFcfddf82`
export const email_user_ens = `rocketeers.eth`
export const email_user_email = `info@rocketeer.fans`
export const email_message_to_sign = `{"ENS":"${ email_user_ens }","address":"${ email_user_address }","email":"${ email_user_email }"}`
const email_message_utf8 = utils.toUtf8Bytes( email_message_to_sign )
const email_message_hex = utils.hexlify( email_message_utf8 ).substring(2)
export const email_message_signature = "0x70555388bdf95f6196a8f0decaa732f9c586b7c8e6c836a3cef5e40c1e5b6ac954af90dd2471bfbdcab3aeb8d69d4f2f9d7759cd9a027aec168be6b76bb8fe381b"
export const mock_user_signature_for_email_forward = ( blockchain='ethereum' ) => {

    cy.on( 'window:before:load', ( window ) => {
        
        mock( {
            blockchain,
            window,
            wallet: 'metamask',
            accounts: { return: [ email_user_address ] },
            signature: {
                params: [ email_user_address, `0x${ email_message_hex }`],
                return: email_message_signature
            }
        } )

    } )

}