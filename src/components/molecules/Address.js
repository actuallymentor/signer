import { useENS } from '../../modules/web3'
import { eth_address_regex } from '../../modules/web3/validations'

export default ( { children, ...props } ) => {
	const ENS = useENS( children?.match( eth_address_regex ) ? children : undefined, { chainId: 1 } )
    return <span>{ ENS ? `${ ENS } (aka ${ children?.slice( 0, 9 ) })` : children }</span>
}