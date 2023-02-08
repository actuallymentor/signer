import styled from 'styled-components'

export default styled.textarea`
	margin: 2rem 0;
	border: none;
	border-left: 2px solid gray;
	height: ${ ( { height='initial' } ) => height };
	width: ${ ( { width='100%' } ) => width };
	max-width: 100%;
	padding: 1rem;
	background: ${ ( { theme } ) => theme.colors.backdrop };
	color: ${ ( { banner, theme } ) => banner ? theme.colors.primary_invert : theme.colors.text };
`