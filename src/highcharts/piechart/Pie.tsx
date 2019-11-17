import React, {useState, useEffect} from 'react';
import {Options, SeriesPieOptions, SeriesPieDataOptions} from 'highcharts';

import * as ChartUtils from '../ChartUtils';

import Chart from '../Chart';

const convertSeries = (series: Series[], valueUnit?: string, tooltipValueDecimals?: number): SeriesPieOptions[] => {
	return series.map(
		({colors, name, data, outerRadius, innerRadius}): SeriesPieOptions => ({
			type: 'pie',
			ignoreHiddenPoint: false,
			tooltip: {
				valueDecimals: tooltipValueDecimals,
				valueSuffix: valueUnit ? ` ${valueUnit}` : ''
			},
			name,
			colors,
			data: data as SeriesPieDataOptions[],
			size: outerRadius ? `${outerRadius}%` : `${100 / series.length}%`,
			innerSize: innerRadius ? `${innerRadius}%` : undefined
		})
	);
};

export interface Point {
	name: string;
	y: number;
	visible: boolean; //default: true (by highcharts)
}

export interface Series extends ChartUtils.Series {
	colors: string[]; // Please entry only HEX or RGB
	data: ([string, number] | Point)[];
	outerRadius?: number;
	innerRadius?: number;
}

export interface Props {
	tooltipValueDecimals?: number;
	valueUnit?: string;
	series: Series[];
	showExportMenu?: boolean;
	locale: string; //e.g. en-US
	showLegend?: boolean;
}

const Pie = ({series, valueUnit, showExportMenu, locale, tooltipValueDecimals, showLegend}: Props) => {
	const [options, setOptions] = useState<Options>({});

	useEffect(() => {
		setOptions(prevOptions => {
			return {
				...prevOptions,
				exporting: {
					enabled: showExportMenu
				},
				plotOptions: {
					pie: {
						states: {
							hover: {
								brightness: -0.2
							}
						},
						dataLabels: {
							enabled: true,
							style: {
								textOutline: undefined
							},
							format: '{point.name}: {point.y}'
						},
						showInLegend: showLegend
					}
				},
				series: convertSeries(series, valueUnit, tooltipValueDecimals)
			};
		});
	}, [series, valueUnit, showExportMenu, tooltipValueDecimals, showLegend]);

	return <Chart options={options} locale={locale} showExportMenu={showExportMenu}/>;
};
Pie.defaultProps = {
	tooltipValueDecimals: 2,
	series: [],
	showLegend: false
};
export default Pie;
