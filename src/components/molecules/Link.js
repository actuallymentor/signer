import { useNavigate } from "react-router-dom"
import { A } from "../atoms/Text"

export default ( { children, href, to, ...props } ) => {

    const navigate = useNavigate()

    // Component navigation function, does nothing for href-only, uses navigate for 'to'
    const nav = e => {

        // No 'to' attribute = do nothing
        if( !to ) return

        // Prevent href click (triggers network request)
        e.preventDefault()

        // Use in-browser navigation
        navigate( to )

    }

    return <A { ...props } onClick={ nav } href={ href || to }>{ children }</A>

}