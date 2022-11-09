import styled, { useTheme } from 'styled-components'
import { ReactComponent as Ethereum } from '../../assets/logos/ethereum.svg'
import { ReactComponent as Arbitrum } from '../../assets/logos/arbitrum.svg'
import { ReactComponent as Polygon } from '../../assets/logos/polygon.svg'
import { log } from '../../modules/helpers'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { chain_ids, chain_id_to_chain_name } from '../../modules/web3/chains'

const IconWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    height: ${ ( { size } ) => size };
    width: ${ ( { size } ) => size };

    svg {
        height: 80%;
        width: 80%;
        background: ${ ( { theme } ) => theme.colors.surface };
        border-radius: 50%;
        padding: 10%;
    }

    
`

const LabelWrap = styled.div`
    display: flex;
    flex-direction: ${ ( { direction='row' } ) => direction };
    align-items: center;
    margin: ${ ( { margin } ) => margin };
    cursor: pointer;
    &.current_chain {
        text-decoration: underline;
    }
    &.not_current_chain {
        opacity: .6;
    }
    span {
        color: ${ ( { theme } ) => theme.colors.text };
        margin: 0 .5rem;
    }
`

export default ( { chain_id=1, label=true, direction,  shortname=false, margin='0 var(--spacing_4)', size='43px', ...props } ) => {

    const { switchNetwork } = useSwitchNetwork()
    const theme = useTheme()
    const { chain } = useNetwork()
    const is_current_chain = chain?.id == chain_id

    // Choose image based on https://chainlist.org/
    let Icon = Ethereum
    if( chain_id == chain_ids.ethereum ) Icon = Ethereum
    if( chain_id == chain_ids.goerli ) Icon = Ethereum
    if( chain_id == chain_ids.arbitrum_one ) Icon = Arbitrum
    if( chain_id == chain_ids.polygon ) Icon = Polygon

    const chain_name = chain_id_to_chain_name( chain_id )
    const switch_network = () => {
        if( !chain ) return alert( `Please connect to a wallet before trying to switch network.` )
        log( `Requesting network switch to ${ chain_id }` )
        switchNetwork?.( chain_id )
    }

    return <LabelWrap className={ is_current_chain ? 'current_chain' : "not_current_chain" } onClick={ switch_network } { ...{ margin, size, direction, ...props } }>

        <IconWrap { ...{ size, ...props } }>
            <Icon fill={ theme?.colors?.primary }  />
        </IconWrap>

        { label && <span>{ shortname ? chain_name.split( ' ' )[0] : chain_name }</span> }

    </LabelWrap>


}