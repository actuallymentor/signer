import styled from "styled-components"
import { useAccount } from "wagmi"
import Input from "./Input"
import MetamaskButton from "./MetamaskButton"

const Wrapper = styled.div`
    position: relative;

    .nested {
        position: absolute;
        bottom: 15px;
        right: 8px;
        zoom: .7;
    }

`

export default ( { ...props } ) => {

    const { address } = useAccount()

    return <Wrapper>
        <Input { ...props } />
        { !address && <MetamaskButton className='nested' connect_prompt="Connect" wallet_icon={ true } /> }
    </Wrapper>

}