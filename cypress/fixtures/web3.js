import { mock } from '@depay/web3-mock'
import { utils } from 'ethers'

// Address of connector. Can be any.
export const user_address = "0x7dbf6820d32cfbd5d656bf9bff0def229b37cf0e"
export const user_ens = 'mentor.eth'


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