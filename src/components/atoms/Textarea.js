import styled from 'styled-components'

export default styled.textarea`
	width: 100%;
	margin: 2rem 0;
	border: none;
	border-left: 2px solid gray;
	height: ${ ( { height='initial' } ) => height };
	padding: 1rem;
	background: ${ ( { theme } ) => theme.colors.backdrop };
	color: ${ ( { banner, theme } ) => banner ? theme.colors.primary_invert : theme.colors.text };
`