import styled from 'styled-components'

export const Text = styled.p`
	font-size: 1rem;
	margin:  ${ ( { margin='.2rem 0' } ) => margin };
	line-height: 1.5rem;
	color: ${ ( { banner, theme, invert } ) =>  banner || invert  ? theme.colors.primary_invert : theme.colors.text };
	// background: ${ ( { banner, theme } ) => banner ? theme.colors.primary : theme.colors.primary_invert };
	padding: ${ ( { banner } ) => banner ? '.5rem 1rem' : 'initial' };
	box-shadow: ${ ( { banner } ) => banner ? '0 0 20px 2px rgb(0 0 0 / 70%)' : '' };
	text-align: ${ ( { align } ) => align || 'left' };
	max-width: 100%;
	overflow-wrap: anywhere;
`

export const A = styled.a`
	font-size: 1rem;
	margin: .2rem 0;
	line-height: 1.5rem;
	color: ${ ( { banner, theme } ) => banner ? theme.colors.primary_invert : theme.colors.text };
	text-decoration: none;
	// background: ${ ( { banner, theme } ) => banner ? theme.colors.primary : theme.colors.primary_invert };
	padding: ${ ( { banner } ) => banner ? '.5rem 1rem' : 'initial' };
	box-shadow: ${ ( { banner } ) => banner ? '0 0 20px 2px rgb(0 0 0 / 70%)' : '' };
	text-align: ${ ( { align } ) => align || 'left' };
	max-width: 90%;
	overflow-wrap: anywhere;
	&:hover {
		text-decoration: 'underline';
	}
	
`

export const H1 = styled.h1`
	font-size: 2.5rem;
	font-weight: 500;
	line-height: 1.2;
	margin: 1rem 0;
	text-align: ${ ( { align } ) => align || 'left' };
	box-shadow: ${ ( { banner } ) => banner ? '0 0 20px 2px rgb(0 0 0 / 70%)' : '' };
	color: ${ ( { banner, theme } ) => banner ? theme.colors.primary_invert : theme.colors.text };
	// background: ${ ( { banner, theme } ) => banner ? theme.colors.primary : theme.colors.primary_invert };
	padding: ${ ( { banner } ) => banner ? '.5rem 1rem' : 'initial' };
`

export const H2 = styled.h2`
	font-size: 1.5rem;
	margin:  ${ ( { margin='.5rem 0' } ) => margin };
	line-height: 1.2;
	font-weight: 400;
	text-align: ${ ( { align } ) => align || 'left' };
	box-shadow: ${ ( { banner } ) => banner ? '0 0 20px 2px rgb(0 0 0 / 70%)' : '' };
	color: ${ ( { banner, theme } ) => banner ? theme.colors.primary_invert : theme.colors.text };
	// background: ${ ( { banner, theme } ) => banner ? theme.colors.primary : theme.colors.primary_invert };
	padding: ${ ( { banner } ) => banner ? '.5rem 1rem' : 'initial' };
`

export const Sidenote = styled.p`
	color: ${ ( { theme } ) => theme.colors.hint };
	margin:  ${ ( { margin='.2rem 0' } ) => margin };
	font-style: italic;
	margin-top:  1rem;
	text-align:  ${ ( { align='left' } ) => align };
	cursor: ${ ( { onClick } ) => onClick ? 'pointer' : 'none' };
	&:hover {
		text-decoration: ${ ( { onClick } ) => onClick ? 'underline' : 'none' };
	}
`

export const Br = styled.span`
	width: 100%;
	margin: 1rem 0;
`

export const Hr = styled.hr`
	width: ${ ( { width="300px" } ) => width };
	border: 1px solid ${ ( { theme } ) => theme.colors.text };
	opacity: .5;
	margin: ${ ( { margin='.5rem 0' } ) => margin };
`