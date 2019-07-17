import React from 'react';
/** @jsx jsx */
import {css, jsx, SerializedStyles} from '@emotion/core';

import {Theme, Colors} from '../Theme';

interface Props extends React.HTMLProps<HTMLButtonElement> {
	/** renders the button with the primary color */
	primary?: boolean;
}

const getButtonStyle = ({primary: prim, secondary: sec}: Colors, primary: boolean = false): SerializedStyles =>
	css({
		'background-color': primary ? prim.background : sec.background,
		color: primary ? prim.color : sec.color
	});

const Button = ({primary, children, ...other}: Props) => {
	return (
		<button {...other} css={(theme: Theme) => getButtonStyle(theme.global.colors, primary)}>
			{children}
		</button>
	);
};

Button.defaultProps = {
	primary: false
};

export default Button;
