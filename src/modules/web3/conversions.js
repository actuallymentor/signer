const { utils: { parseEther, parseUnits } } = require( 'ethers' )

/* ///////////////////////////////
// Number interactors
// /////////////////////////////*/
export const string_to_hex = string => `${ string }`.split().map( char => char.toString( 16 ) ).join( '' )
export const num_to_hex = num => num.toString( 16 )
export const chain_num_to_hex = chain_number => `0x${ num_to_hex( chain_number ) }`
export const num_to_bignumber = ( number, decimals=18 ) => number && parseUnits( number.toString(), decimals )

export function eth_to_gwei( eth_decimal, format_as_hex=false ) {

    if( !eth_decimal ) return

    const eth_wei = parseEther( `${ eth_decimal }` )
    if( !format_as_hex ) {
        return eth_wei
    }
    const eth_wei_hex = eth_wei.toHexString()
    return eth_wei_hex

}