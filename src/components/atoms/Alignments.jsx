import styled from 'styled-components'

export const Row = styled.div`
    display: flex;
    flex-direction: ${ ( { direction='row' } ) => direction };
    width: ${ ( { width='100%' } ) => width };
    margin: ${ ( { margin } ) => margin };
    padding: ${ ( { padding } ) => padding };
    justify-content: ${ ( { justify } ) => justify };
    align-items: ${ ( { align } ) => align };
`

export const Col = styled.div`
    display: flex;
    flex-direction: ${ ( { direction='column' } ) => direction };
    width: ${ ( { width } ) => width };
    height: ${ ( { height='100%' } ) => height };
    margin: ${ ( { margin } ) => margin };
    padding: ${ ( { padding } ) => padding };
    justify-content: ${ ( { justify } ) => justify };
    align-items: ${ ( { align } ) => align };
`