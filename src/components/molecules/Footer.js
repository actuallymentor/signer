import styled from 'styled-components'
import { A } from '../atoms/Text'

const Footer = styled.nav`
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 1rem;
	text-align: center;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	& a {
		padding: 0 1rem;
		opacity: .5;

	}

`

export default ( { ...props } ) => <Footer>
	
	<A href='https://twitter.com/actuallymentor' target='_blank'>© mentor.eth</A>
	<A href='https://github.com/actuallymentor/signer' target='_blank'>source on Github</A>

</Footer>