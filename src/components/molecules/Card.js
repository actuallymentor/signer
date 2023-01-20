import styled from 'styled-components'
import Section from '../atoms/Section'

export default styled( Section )`
	box-shadow: 0px 0px 10px 1px ${ ( { theme } ) => theme?.colors?.shadow  };
    padding: 2rem;
    border-radius: 20px;
    width: ${ ( { width='500px' } ) => width };
    max-width: 100%;
    margin: 1rem;
`