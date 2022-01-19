import React from 'react'
import { ThemeProvider } from 'styled-components'

const theme = {
	colors: {
		primary: 'black',
		primary_invert: 'white',
		text: 'rgb( 0, 0, 0, .8 )',
		accent: 'orange',
		hint: 'rgba( 0, 0, 0, .4 )',
		backdrop: 'rgba( 0, 0, 0, .05 )'
	}
}

export default props => <ThemeProvider { ...props } theme={ theme } />