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
				<H1>{ text } with your crypto wallet</H1>
				<H2>Free, off-chain, no gas fees</H2>
			</Hero>

			<Section direction='row' justify='space-around' padding='5rem .5rem'>

				<Section width='500px' align='flex-start'>

					<H2>✏️ Sign & share a message</H2>
					<Text>Sign a message with your wallet, and share it easily. Completely off-chain.</Text>
					<Button onClick={ f => navigate( '/sign' ) }>Sign & share a message</Button>

				</Section>

				<Section width='500px' align='flex-start'>

					<H2>✉️ Receive emails on your wallet</H2>
					<Text>Forward emails from your_wallet@signer.is to your@email.com</Text>
					<Button onClick={ f => navigate( '/email' ) }>Set email forward</Button>

				</Section>

			</Section>

			<Footer />

	</Container>

}