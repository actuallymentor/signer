import styled, { keyframes } from 'styled-components'
import QRCode from 'react-qr-code'

const glow = color => keyframes`
	0% {
		box-shadow: 0 0 0 0px ${ color };
	}
	50% {
		box-shadow: 0 0 50px 0px ${ color };
	}
	100% {
		box-shadow: 0 0 0 0px ${ color };
	}
`

export default styled( QRCode )`
	margin: ${ ( { margin='2rem 0' } ) => margin };
	opacity: 1;
	box-shadow: 0px 0px 10px 1px ${ ( { theme } ) => theme?.colors?.shadow  };
	&.glow {
		animation: ${ ( { theme } ) => glow( theme.colors.primary  )} 1.5s ease-in-out 1;
	}
`