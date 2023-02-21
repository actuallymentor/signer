import { useEffect, useState } from "react"

export const useWidth = () => {

    const [ width, setWidth ] = useState( window.innerWidth )

    // Keep track of window width
    useEffect( () => {
        const handleWindowResize = () => setWidth( window.innerWidth )
        window.addEventListener( 'resize', handleWindowResize )

        return () => window.removeEventListener( 'resize', handleWindowResize )
    }, [] )

    return width

}