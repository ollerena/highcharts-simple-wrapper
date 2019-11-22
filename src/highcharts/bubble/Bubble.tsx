import React, {useState, useEffect} from 'react';
import {Options} from 'highcharts';

import Chart from '../Chart';
import * as ChartUtils from '../ChartUtils';
import { Color } from 'csstype';
import { type } from 'os';

const initialOptions: Options = {
	chart: {
		type: 'bubble'
	},
	plotOptions: {
		column: {
			groupPadding: 0.1,
			pointPadding: 0
		}
	}
};

export type SeriesData = [number, number, number];


export interface Series extends ChartUtils.Series {
	/**Only needed for Type Checking, should not be setted*/
	type: never;
	color: string;
	data: SeriesData[];
}

export interface Props {
	series: Series[];
	plotLines?: ChartUtils.PlotLine[];
	plotBands?: ChartUtils.PlotBand[];
	showExportMenu?: boolean;
	locale: string; //e.g. "de-DE"
	labelsFormat?: string
	showLegend: boolean
}

const Bubble = ({series, plotLines, plotBands, showExportMenu, locale, labelsFormat, showLegend}: Props) => {
	const [options, setOptions] = useState<Options>(initialOptions);

	useEffect(() => {
		//@ts-ignore
		setOptions(prevOptions => {
			return {
				...prevOptions,
				exporting: {
					enabled: showExportMenu
				},
				legend: {
					enabled: showLegend,
					symbolRadius: undefined
				},
				xAxis: {
					...prevOptions.xAxis,
					labels: {enabled: true}
				},
				yAxis: {
					title: {text: null},
					labels: {
						format: labelsFormat ? labelsFormat : '{value}'
					},
					plotLines: plotLines ? plotLines.map(ChartUtils.generatePlotLine) : undefined
				},
				series: series ? series : []
			};
		});
	}, [series, plotLines, showExportMenu, plotBands, labelsFormat, showLegend]);

	return <Chart options={options} showExportMenu={showExportMenu || false} locale={locale} />;
};

Bubble.defaultProps = {
	series: []
};

export default Bubble;
