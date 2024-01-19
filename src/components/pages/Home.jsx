import Container from '../atoms/Container'
import Button from '../atoms/Button'
import { H1, H2, Text } from '../atoms/Text'
import Section from '../atoms/Section'
import Hero from '../molecules/Hero'
import Mailbox from '../../assets/mailbox.svg.jsx'
import Share from '../../assets/share.svg.jsx'

import { useNavigate } from 'react-router-dom'
import useTypewriter from '../../modules/hooks/useTypewriter'
import Piggybank from '../../assets/piggybank'
import Card from '../molecules/Card'
import { dev } from '../../modules/helpers'


export default function Login() {

    const navigate = useNavigate()
    const text = useTypewriter( [ 'Share a signature', 'Receive payments', 'Receive emails'  ], dev ? 10 : 100, dev ? 1000 : 4000 )

    /* ///////////////////////////////
	// Render component
	// /////////////////////////////*/

    return <Container align='flex-start' justify='flex-start' padding="0 0 10rem"  gutter={ false }>

        <Hero margin="0 0 4rem 0">
            <H1>{ text } <br />with your crypto wallet</H1>
            <H2>Free, off-chain, no gas fees</H2>
        </Hero>

        <Section direction='row' justify='space-around' align='center' padding='5rem .5rem'>

            <Section width="400px">
                <Piggybank />
            </Section>
			
            <Card width='650px' align='flex-start' justify='center'>

                <H2>💰 1-click payment links</H2>
                <Text margin="2rem 0 1rem 0">Generate payment links for ETH and USDC you can share with others.</Text>
                <Text>Payments are directly wallet-to-wallet, signer.is charges 0% and requests no access to your wallet.</Text>
                <Button margin="2rem 0 0" onClick={ f => navigate( '/pay/create' ) }>Generate a payment link</Button>

            </Card>


        </Section>

        <Section direction='row' justify='space-around' align='center' padding='5rem .5rem'>

            <Card width='650px' align='flex-start'>
						
                <H2>✏️ Sign & share a message</H2>
                <Text margin="2rem 0 1rem 0">Sign a message with your wallet, and share it easily. Completely off-chain.</Text>
                <Text>Vitalik.eth could for example share a verifyable message saying &quot;my real twitter is @VitalikButerin&quot;.</Text>
                <Button margin="2rem 0" onClick={ f => navigate( '/sign' ) }>Sign & share a message</Button>

            </Card>

            <Section width='400px'>
                <Share />
            </Section>

        </Section>

        <Section direction='row' justify='space-around' align='center' padding='5rem .5rem'>

            <Section width="400px">
                <Mailbox />
            </Section>
			
            <Card width='650px' align='flex-start' justify='center'>

                <H2>✉️ Receive emails on your wallet</H2>
                <Text margin="2rem 0 1rem 0">Forward emails from your_wallet@signer.is to your@email.com.</Text>
                <Text>That way apps and people can email your wallet, without knowing your email.</Text>
                <Button margin="2rem 0 0" onClick={ f => navigate( '/email' ) }>Set up email forwarding</Button>

            </Card>


        </Section>


    </Container>

}