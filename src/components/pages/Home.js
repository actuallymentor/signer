import Container from '../atoms/Container'
import Button from '../atoms/Button'
import { H1, H2, Text, Br } from '../atoms/Text'
import Section from '../atoms/Section'
import Menu from '../molecules/Menu'
import Hero from '../molecules/Hero'
import Footer from '../molecules/Footer'
import Mailbox from '../../assets/mailbox.svg.js'
import Share from '../../assets/share.svg.js'

import { useNavigate } from 'react-router-dom'
import useTypewriter from '../../modules/hooks/useTypewriter'


export default function Login() {

	const navigate = useNavigate()
	const text = useTypewriter( [ 'Share a signature', 'Receive payments', 'Receive emails'  ]  )

	/* ///////////////////////////////
	// Render component
	// /////////////////////////////*/

	return <Container align='flex-start' justify='flex-start' gutter={ false }>

			<Menu />

			<Hero margin="0 0 4rem 0">
				<H1>{ text } <br />with your crypto wallet</H1>
				<H2>Free, off-chain, no gas fees</H2>
			</Hero>

			<Section direction='row' justify='space-around' align='center' padding='5rem .5rem'>

				<Section width='650px' align='flex-start'>
						
					<H2>✏️ Sign & share a message</H2>
					<Text margin="2rem 0 1rem 0">Sign a message with your wallet, and share it easily. Completely off-chain.</Text>
					<Text>Vitalik.eth could for example share a verifyable message saying "my real twitter is @VitalikButerin".</Text>
					<Button margin="2rem 0" onClick={ f => navigate( '/sign' ) }>Sign & share a message</Button>

				</Section>

				<Section width='400px'>
					<Share />
				</Section>

			</Section>

			<Section direction='row' justify='space-around' align='center' padding='5rem .5rem'>

				<Section width="400px">
					<Mailbox />
				</Section>
			
				<Section width='650px' align='flex-start' justify='center'>

					<H2>✉️ Receive emails on your wallet</H2>
					<Text margin="2rem 0 1rem 0">Forward emails from your_wallet@signer.is to your@email.com.</Text>
					<Text>That way apps and people can contact you by emailing your wallet, without them having to know your email.</Text>
					<Button margin="2rem 0 0" onClick={ f => navigate( '/email' ) }>Set up email forwarding</Button>

				</Section>


			</Section>

			

			<Footer />

	</Container>

}