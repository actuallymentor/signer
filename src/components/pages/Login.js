import Container from '../atoms/Container'
import Button from '../atoms/Button'
import { H1, H2, Text, Br } from '../atoms/Text'
import Section from '../atoms/Section'
import Menu from '../molecules/Menu'
import Hero from '../molecules/Hero'
import Footer from '../molecules/Footer'

import { useNavigate } from 'react-router-dom'
import useTypewriter from '../../modules/hooks/useTypewriter'


export default function Login() {

	const navigate = useNavigate()
	const text = useTypewriter( [ 'Share a signature', 'Receive emails'  ]  )

	/* ///////////////////////////////
	// Render component
	// /////////////////////////////*/

	return <Container align='flex-start' justify='flex-start' gutter={ false }>

			<Menu />

			<Hero>
				<H1>{ text } <br />with your crypto wallet</H1>
				<H2>Free, off-chain, no gas fees</H2>
			</Hero>

			<Section direction='row' justify='space-around' padding='5rem .5rem'>

				<Section width='500px' align='flex-start'>

					<H2>✏️ Sign & share a message</H2>
					<Text margin="2rem 0 1rem 0">Sign a message with your wallet, and share it easily. Completely off-chain.</Text>
					<Button margin="2rem 0" onClick={ f => navigate( '/sign' ) }>Sign & share a message</Button>

				</Section>

				<Section width='500px' align='flex-start'>

					<H2>✉️ Receive emails on your wallet</H2>
					<Text margin="2rem 0 1rem 0">Forward emails from your_wallet@signer.is to your@email.com.</Text>
					<Button margin="2rem 0" onClick={ f => navigate( '/email' ) }>Set up email forwarding</Button>

				</Section>

			</Section>

			<Footer />

	</Container>

}