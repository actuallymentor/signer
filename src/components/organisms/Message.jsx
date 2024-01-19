import Container from "../atoms/Container"
import { Text } from "../atoms/Text"
import styled from "styled-components"

const Wrapper = styled.div`
    max-width: 500px;
    flex-direction: column;
`

export default ( { message, emoji, children, ...props } ) => <Container justify="center" { ...props }>
	
    <Wrapper>
        { children }
        { emoji && <Text align="center">{ emoji }</Text> }
        { message && <Text align="center">{ message }</Text> }
    </Wrapper>



</Container>