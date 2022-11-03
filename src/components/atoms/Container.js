import styled from 'styled-components'

export default styled.div`
	position: relative;
	overflow: hidden;
	background: ${ ( { theme } ) => theme.colors.backdrop };
	display: flex;
	flex-direction: column;
	align-items: ${ ( { align='center' } ) => align };
	justify-content: ${ ( { justify='center' } ) => justify };
	min-height: 100vh;
	width: 100%;
	padding: ${ ( { gutter=true } ) => gutter ? '3rem max( 1rem, calc( 15vw - 2rem ) )' : 'none' };
	box-sizing: border-box;
	& * {
		box-sizing: border-box;
	}
`