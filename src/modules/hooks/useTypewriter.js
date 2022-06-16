import { useEffect, useState } from "react"
import { log, wait } from '../helpers'

export default function useTypewriter( phrases=[], type_speed_ms=100, delay_between_phrases=4000 ) {

    const [ currentPhrase, setCurrentPhrase ] = useState( 0 )
    const [ currentText, setCurrentText ] = useState( phrases[0].split( '' ) )
    const [ typedText, setTypedText ] = useState( '' )

    // When a new letter is typed, wait and add the next one
    useEffect( (  ) => {

        let cancelled = false;

        ( async () => {

            await wait( type_speed_ms )
            const last_letter_reached = typedText.length === phrases[ currentPhrase ].length

            // If we typed the last letter, empty the text and trigger the next phrase
            if( last_letter_reached ) {
                const next_phrase_index = currentPhrase + 1 >= phrases.length ? 0 : currentPhrase + 1

                // For for a bit and reset the text
                await wait( delay_between_phrases )
                setCurrentPhrase( next_phrase_index )
                setCurrentText( phrases[ next_phrase_index ].split( '' )  )
                return setTypedText( '' )

            }

            // Add the next letter of the phrase
            setTypedText( `${ typedText }${ currentText[ typedText.length ] }` )

        } )( )

        return () => cancelled = true

        }, [ typedText.length ] )

    log( typedText.length, currentText.length )
    return typedText.length == currentText.length ? typedText : `${ typedText  }|`

}