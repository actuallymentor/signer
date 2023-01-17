import styled, { useTheme } from 'styled-components'
import { useAccount, useEnsAvatar } from 'wagmi'
import { log } from '../../modules/helpers'
import Avatar from "boring-avatars"

const AvatarBadge = styled.div`
    height: 150px;
    width: 150px;
    margin: 2rem;

    img, svg {
        border-radius: 50%;
        height: 100%;
        width: 100%;
    }

    svg {
        border: 1px solid ${ ( { theme } ) => theme.colors.hint };
    }
`
export default ( { address, ...props } ) => {

    const theme = useTheme()
    const { address: detected_address } = useAccount()
    const { data: avatar } = useEnsAvatar( { addressOrName: address || detected_address, chainId: 1 } )
    log( `ENS avatar `,  avatar )

    return <AvatarBadge>
        { avatar ? <img src={ avatar } /> : <Avatar name={ address || detected_address } variant='pixel' size='150px' colors={ Object.values( theme.colors ) } /> }
    </AvatarBadge>

}