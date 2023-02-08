import React, { useState, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { log } from '../modules/helpers'

const theme = {
    colors: {
        primary: 'black',
        primary_invert: 'white',
        text: 'rgba( 0, 0, 0, .8 )',
        text_backdrop: 'rgba( 255, 255, 255, .8 )',
        shadow: 'rgba( 0, 0, 0, .2 )',
        hint: 'rgb( 170, 170, 170 )',
        backdrop: 'rgba( 250, 250, 250, 1 )'
    }
}

const dark_theme = {
    colors: {
        primary: 'white',
        primary_invert: 'black',
        text: 'rgba( 255, 255, 255, 1 )',
        text_backdrop: 'rgba( 0, 0, 0, .8 )',
        shadow: 'rgba( 255, 255, 255, .4 )',
        hint: 'rgb( 200, 200, 200 )',
        backdrop: 'rgb( 5, 5, 5 )'
    }
}

export default props => {

    const [ dark, setDark ] = useState( false )

    useEffect( f => {

        // If API is not available, assume light
        if( !window.matchMedia ) {
            log( 'No darkmode detection support' )
            return setDark( false )
        }

        // Check with API
        const prefers_dark = window.matchMedia( '(prefers-color-scheme: dark)' ).matches
        setDark( prefers_dark )
        log( `User prefers ${ prefers_dark ? 'dark' : 'light' } theme` )

        // Enable a listener
        window.matchMedia( '(prefers-color-scheme: dark)' ).addEventListener( 'change', event => {
            const prefer_dark = event.matches
            log( 'Darkmode setting changed to ', prefer_dark )
            setDark( prefer_dark )
        } )

    }, [] )

    return <ThemeProvider { ...props } theme={ dark ? dark_theme : theme } />
}