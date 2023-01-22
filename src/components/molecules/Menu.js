import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWidth } from '../../modules/hooks/window'
import { A } from '../atoms/Text'

const Menu = styled.nav`

	position: ${ ( { mobile_open } ) => mobile_open ? 'fixed' : 'relative' };
	padding-left: inherit;
    padding-right: inherit;

	// Height for animation
	max-height: ${ ( { mobile_open } ) => mobile_open ? '100%' : '0' };
	overflow: ${ ( { mobile_open } ) => mobile_open ? 'hidden' : 'visible' };
	transition: max-height 1s;

	z-index: 99;
	top: 0;
	left: 0;
	width: 100%;
	padding: ${ ( { mobile_open, theme } ) => mobile_open ? '3rem 0 3rem 1rem' : '0' };
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
	align-self: flex-start;

	background: ${ ( { mobile_open, theme } ) => mobile_open ? theme.colors.primary_invert : '' };
	box-shadow: ${ ( { mobile_open, theme } ) => mobile_open && `0px 0px 10px 1px ${ theme?.colors?.shadow }` };

	& a {

		display: inline-block;

		&.menu_burger {
			margin: 0 ${ ( { mobile_open } ) => mobile_open ? '100px' : '0' } 0 0 20px;
		}
		&:not(:first-child) {
			width: ${ ( { mobile_open } ) => mobile_open ? '100%' : '' };
			border-bottom: 1px solid ${ ( { theme, mobile_open } ) => mobile_open ? theme.colors.primary : 'rgba( 0,0,0,0 )' };
			margin: .5rem .5rem 0;
			padding: 0 0 .5rem;
		}
		padding: 1rem;
		margin: 0;
		color: ${ ( { mobile_open, theme } ) => mobile_open ? theme.colors.primary : '' };
	}

`

const Burger = styled.a`
	position: ${ ( { mobile_open } ) => mobile_open ? 'fixed' : 'absolute' };
	padding-left: inherit;
    padding-right: inherit;
	top: 0;
	right: 0;
	width: 50px;
	height: 50px;
	padding: 10px;
	&:hover {
		cursor: pointer;
	opacity: .5;
	}
	display: inline-block;

	span {
		background: ${ ( { theme } ) => theme.colors.primary };
		display: block;
		height: 2px;
		width: 100%;
		position: relative;
		transition: all 0.5s ease;
		margin-top: 5px;

	}
`

const Hamburger = ( { ...props } ) => <Burger className='menu_burger' { ...props }>
	<span />
	<span />
	<span />
</Burger>

export default ( { ...props } ) => {

	const [ open, set_open ] = useState( false )
	const width = useWidth()
	const menu_cutoff = 600
	const use_burger = width < menu_cutoff

	useEffect( () => {
		if( !use_burger ) set_open( false )
	}, [ width ] )

	return <Menu mobile_open={ open }>
	
		{ use_burger && <Hamburger mobile_open={ open } onClick={ f => set_open( !open ) } /> }
		{ ( ( use_burger && open ) || !use_burger ) && <>
			<A href='/'>Home</A>
			<A href='/#/sign'>Sign</A>
			<A href='/#/pay/create'>Payments</A>
			<A href='/#/email'>Email</A>
			<A href='https://signer.docs.apiary.io/' target='_blank'>API</A>
		</> }

	</Menu>

}