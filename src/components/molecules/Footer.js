import styled from 'styled-components'
import { A } from '../atoms/Text'

const Footer = styled.nav`
	flex-wrap: wrap;
	flex: 0 1;
	width: 100%;
	padding: 1rem 0;
	text-align: center;
	display: flex;
	margin-top: auto;
	
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