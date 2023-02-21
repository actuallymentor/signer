import { useEffect } from "react"
import { log } from "../helpers"

export const useRedirectOldHashpoundUrls = () => {

    useEffect( () => {

        // Check for old url format
        const { href } = window.location
        const is_old_url_format = href.match( /\/#\// )
        if( !is_old_url_format ) return

        // If found, redirect to new format
        const new_url = href.replace( '/#/', '/' )
        log( `Old hashpound url format detected, redirecting to new url: ${ new_url }` )
        window.location.replace( new_url )

    }, [] )

}