import React from 'react';
import {ThemeProvider} from 'emotion-theming';

import {Theme, Colors} from './Theme';

const getColors = (): Colors => ({
	primary: {
		background: '#0074bd',
		color: '#e3f0f8'
	},
	secondary: {
		background: '#fff',
		color: '#c0c0c0'
	}
});

const theme: Theme = {
	global: {
		colors: getColors()
	}
};

const DoczWrapper = ({children}: {children: React.ReactNode}) => (
	<ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default DoczWrapper;
