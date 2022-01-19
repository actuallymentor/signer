import styled from 'styled-components'
import Textarea from '../atoms/Textarea'
import { useState, useEffect, useRef } from 'react'

// eslint-disable-next-line import/no-anonymous-default-export
export default ( { minRows=3,value='', ...props } ) => {

	const ref = useRef()
	const [ height, setHeight ] = useState( `100px` )
	
	useEffect( f => {

		console.log( 'Ref changed: ', ref.current.scrollHeight )
		if( ref.current?.scrollHeight ) setHeight( `${ref.current.scrollHeight}px` )

	}, [ ref.current?.scrollHeight ])

	const rowsOfText = value.split(/\r\n|\r|\n/).length
	const rowsToShow = minRows > rowsOfText ? minRows : rowsOfText

	return <Textarea height={ height } ref={ ref } { ...props } value={ value } />
}