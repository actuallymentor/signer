import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../atoms/Button"
import Container from "../atoms/Container"
import { H1, Text } from "../atoms/Text"
import Footer from "../molecules/Footer"
import Menu from "../molecules/Menu"

export default ( { ...props } ) => {

    const navigate = useNavigate()

    return <Container>

        <Menu />

        <H1>Payment success!</H1>
        <Text margin="2rem 0">You can create your own free payment links any time at signer.is.</Text>
        <Button onClick={ () => navigate( `/pay/create` ) }>Create your own payment link</Button>

        <Footer />

    </Container>
}