// Random number of length
export const random_number_of_length = ( length, as_string=true ) => {
    const num = Math.floor( Math.random() * ( 10**length ) )
    if( as_string ) return `${ num }`
    return num
}

export const random_string_of_length = length => {
    const characters = 'abcdefghijklmnopqrtsuvwxyz0123456789'
    let string = [ ...Array( length ) ].map( () => characters.charAt( Math.floor( Math.random() * characters.length ) ) ).join( '' )
    return string
}

