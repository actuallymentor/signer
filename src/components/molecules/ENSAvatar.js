import styled from 'styled-components'
import { useAccount, useEnsAvatar } from 'wagmi'
import { log } from '../../modules/helpers'

const AvatarBadge = styled.img`
    height: 150px;
    width: 150px;
    border-radius: 50%;
    margin: 2rem;
`

export default ( { address, ...props } ) => {

    const { data: avatar } = useEnsAvatar( { addressOrName: address, chainId: 1 } )
    log( `ENS avatar `,  avatar )

    if( !avatar ) return
    return <AvatarBadge src={ avatar } />

}