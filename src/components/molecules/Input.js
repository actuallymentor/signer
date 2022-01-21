import styled from 'styled-components'
import { useRef, useState } from 'react'
import ResizingTextArea from './ResizingTextarea'

const Input = styled.div`

	display: flex;
	flex-direction: ${ ( { type } ) => type == 'radio' ? 'row' : 'column' };
	margin: 1rem 0;
	justify-content: center;
	width: 350px;
	
	& input {
		background: ${ ( { theme } ) => theme.colors.backdrop };
		border: none;
		border-left: 2px solid ${ ( { theme } ) => theme.colors.primary };
		color: ${ ( { banner, theme } ) => banner ? theme.colors.primary_invert : theme.colors.text };
	}

	& input {
		padding: 1rem 2rem 1rem 1rem;
		width: ${ ( { type } ) => type == 'radio' ? 'auto' : '100%' };
	}

	& label {
		opacity: .5;
		font-style: italic;
		margin-bottom: .5rem;
		display: flex;
		width: ${ ( { type } ) => type == 'radio' ? 'auto' : '100%' };
		color: ${ ( { theme } ) => theme.colors.text };
		span {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: .9rem;
			margin-left: auto;
			font-style: normal;
			background: ${ ( { theme } ) => theme.colors.hint };
			color: white;
			border-radius: 50%;
			width: 20px;
			height: 20px;
		}
	}

`

export default ( { expand, onChange, type, label, info, id, ...props } ) => {

	const { current: internalId } = useRef( id || `input-${ Math.random() }` )
	const [ expanded, setExpanded ] = useState( false )

	const handleFocus = f => {

		// If not expandable, exit
		if( !expand ) return

		// If exbandable, change state to match
		setExpanded( true )

	}

	return <Input type={ type }>

		{ label && <label htmlFor={ internalId }>{ label } { info && <span onClick={ f => alert( info ) }>?</span> }</label> }
		{ !expanded && <input onClick={ handleFocus } data-testid={ internalId } { ...props } id={ internalId } onChange={ onChange } type={ type || 'text' } /> }
		{ expanded && <ResizingTextArea { ...props } data-testid={ internalId } id={ internalId } onChange={ onChange } /> }

	</Input>

}