export interface Color {
	background: string;
	color: string;
}

export interface Colors {
	primary: Color;
	secondary: Color;
}

export interface Theme {
	global: {
		colors: Colors;
	};
}
