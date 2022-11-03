import { useENS } from '../../modules/web3'

export default ( { children, ...props } ) => {
	const ENS = useENS( children )
    return <span>{ ENS ? `${ ENS } (aka ${ children?.slice( 0, 9 ) })` : children }</span>
}