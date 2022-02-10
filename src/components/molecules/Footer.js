import styled from 'styled-components'
import { A } from '../atoms/Text'

const Footer = styled.nav`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 1rem;
	text-align: center;

	& a {
		padding: 0 1rem;
		opacity: .5;
	}

`

export default ( { ...props } ) => <Footer>
	
	<A href='https://github.com/actuallymentor/signer' target='_blank'>🐙 Source on Github</A>

</Footer>