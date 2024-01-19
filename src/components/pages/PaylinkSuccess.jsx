import { useNavigate, useParams } from "react-router-dom"
import { tx_explorer_link } from "../../modules/web3/chains"
import Button from "../atoms/Button"
import Container from "../atoms/Container"
import { H1, Text } from "../atoms/Text"

export default ( { ...props } ) => {

    const navigate = useNavigate()
    const { chain_id, tx_hash } = useParams()

    return <Container>

        <H1>Payment success!</H1>
        <Text margin="2rem 0">You can create your own free payment links any time at signer.is.</Text>
        <Button href={ tx_explorer_link( tx_hash, chain_id ) }>View transaction on block explorer</Button>
        <Button onClick={ () => navigate( `/pay/create` ) }>Create your own payment link</Button>

    </Container>
}