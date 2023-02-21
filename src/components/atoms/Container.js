import styled from 'styled-components'
import Footer from '../molecules/Footer'
import Menu from '../molecules/Menu'

const Wrapper = styled.div`
	position: relative;
	overflow: hidden;
	background: ${ ( { theme } ) => theme.colors.backdrop };
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	width: 100%;
	box-sizing: border-box;

	main {

		display: flex;
		flex-direction: column;
		flex: 1;
		align-items: ${ ( { align='center' } ) => align };
		justify-content: ${ ( { justify='center' } ) => justify };
		min-height: 100%;
		padding: ${ ( { gutter=true, padding } ) => padding || ( gutter ? '5rem max( 1rem, calc( 15vw - 2rem ) )' : 'none' ) };

	}

	& * {
		box-sizing: border-box;
	}
`

export default ( { gutter, menu=true, footer=true, children, ...props } ) => {

    return <Wrapper { ...props }>

        { menu && <Menu /> }

        <main>
            { children }
        </main>

        { footer && <Footer /> }

    </Wrapper>

}