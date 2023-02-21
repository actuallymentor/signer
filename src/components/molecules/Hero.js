import styled from 'styled-components'
import Section from '../atoms/Section'

export default styled( Section )`
	width: 100%;
	min-height: 60vh;
	align-items: flex-start;
	padding: ${ ( { gutter=true } ) => gutter ? '3rem max( 1rem, calc( 15vw - 2rem ) )' : 'none' };
	box-shadow: 0px 0 20px 2px ${ ( { theme } ) => theme?.colors?.shadow  };
	margin: ${ ( { margin='0' } ) => margin  };
	background-color: ${ ( { theme } ) => theme?.colors?.text_backdrop  };
	background-image: url( "/hero-texture.png" );
	& h1 {
		margin-bottom: .5rem;
		text-align: left;
	}
	& * {
		max-width: 850px;
	}
	& > p {
		margin: 0 0 4rem;
	}
`