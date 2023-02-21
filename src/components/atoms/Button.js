import { Link } from 'react-router-dom'
import styled from 'styled-components'

const DynamicButton = ( { to='', onClick, ...props } ) => to && !to.includes( 'http' ) ? <Link { ...props } to={ to } /> : <button onClick={ onClick || ( () => window.open( to, '_blank' ).focus() ) } { ...props } />


const shadow_transition_speed = '.2s'
const shadow_transition_delay = '0s'
const PrettyButton = styled( DynamicButton )`

	display: flex;
	height: ${ ( { height='50px' } ) => height };
	flex-direction: ${ ( { direction='row' } ) => direction };
	align-items: center;
	justify-content: center;
	border: 0px solid ${ ( { theme } ) => theme.colors.text };
	transition-duration: ${ shadow_transition_speed  };
	transition-delay: ${ shadow_transition_delay };
	box-shadow: 0px 0px 10px 1px ${ ( { theme } ) => theme?.colors?.shadow  };
	background: none;
	color: ${ ( { theme } ) => theme.colors.text };
	text-decoration: none;
	font-size: 1.2rem;
	padding: .8rem 1.2rem;
	margin:  ${ ( { margin='1rem 0' } ) => margin };
	background-color: ${ ( { theme } ) => theme?.colors?.text_backdrop  };
	background-image: url( "/hero-texture.png" );

	&:hover {
		transition-duration: ${ shadow_transition_speed  };
		transition-delay: ${ shadow_transition_delay };
		box-shadow: 0px 0px 15px 5px ${ ( { theme } ) => theme?.colors?.shadow  };
		cursor: pointer;
	}

	& img {
		height: 50px;
		max-height: 100%;
		width: auto;
		margin: ${ ( { direction='row' } ) => direction == 'row' ? '0 1rem 0 0' : '1rem' };
	}
`

export default ( { icon, href, onClick, ...props } ) => {

    function open_tab() {
        if( href ) window.open( href, '_blank' ) .focus()
    }

    return !icon ? <PrettyButton onClick={ onClick || open_tab } { ...props } /> : <PrettyButton onClick={ onClick || open_tab } { ...props }>
        <img alt="Button icon" src={ icon } />
        { props.children }
    </PrettyButton>
}