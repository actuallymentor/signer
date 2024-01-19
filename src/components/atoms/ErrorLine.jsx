import styled from 'styled-components'
import { Sidenote } from './Text'

export const ErrorLine = styled( Sidenote )`

    align-items: center;
    justify-content: center;
    color: ${ ( { color='red' } ) => color };
    border: 1px solid ${ ( { color='red' } ) => color };
    border-radius: 20px;
    padding: 1rem;
    margin: 0;
    & svg {
        height: .8rem;
    }
    sup {
        margin-left: .2rem;
        cursor: pointer;
    }
`