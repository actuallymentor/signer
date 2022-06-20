import styled from 'styled-components'
import { A } from '../atoms/Text'

const Menu = styled.nav`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	padding: 1rem;

	& a {
		padding: 0 1rem;
	}

`

export default ( { ...props } ) => <Menu>
	
	<A href='/'>Home</A>
	<A href='/#/sign'>Sign</A>
	<A href='/#/email'>Email</A>
	<A href='https://signer.docs.apiary.io/' target='_blank'>API</A>

</Menu>