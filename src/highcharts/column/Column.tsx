import React, {useState, useEffect} from 'react';
import {Options} from 'highcharts';

import Chart from '../Chart';

const DEFAULT_PLOTLINE_COLOR = '#bfbfbf'; //grey

const initialOptions: Options = {
	chart: {
		type: 'column'
	},
	plotOptions: {
		column: {
			groupPadding: 0.1,
			pointPadding: 0
		}
	}
};

type DashStyle =
	| 'Solid'
	| 'ShortDash'
	| 'ShortDot'
	| 'ShortDashDot'
	| 'ShortDashDotDot'
	| 'Dot'
	| 'Dash'
	| 'LongDash'
	| 'DashDot'
	| 'LongDashDot'
	| 'LongDashDotDot';

export interface Series {
	/**Only needed for Type Checking, should not be setted*/
	type: never;
	name: string;
	color: string;
	data: [Date | string, number | null][];
}

export interface PlotLine {
	color?: string;
	value: number;
	label?: string;
	dashStyle?: DashStyle;
}

export interface PlotBand {
	color: string;
	from: Date;
	to: Date;
	label: string;
	labelColor: string;
}

export interface Props {
	type: 'datetime' | 'category';
	series: Series[];
	plotLines?: PlotLine[];
	plotBands?: PlotBand[];
	showLegend?: boolean;
	showExportMenu?: boolean;
	locale: string; //e.g. "de-DE"
}

const generatePlotLine = (plotLine: PlotLine) => ({
	dashStyle: plotLine.dashStyle || 'ShortDot',
	width: 2,
	value: plotLine.value,
	label: {
		text: plotLine.label || ''
	},
	color: plotLine.color || DEFAULT_PLOTLINE_COLOR,
	zIndex: 3
});

const generatePlodBand = (plotBand: PlotBand) => ({
	color: plotBand.color,
	from: plotBand.from.valueOf(),
	to: plotBand.to.valueOf(),
	label: {
		text: plotBand.label,
		style: {
			color: plotBand.labelColor,
			align: 'left'
		}
	}
});

const generateSeries = (series: Series) => ({
	...series,
	data: series.data.map(([key, value]) => (key instanceof Date ? [key.valueOf(), value] : [key, value]))
});

const Column = ({type, series, plotLines, plotBands, showLegend, showExportMenu, locale}: Props) => {
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
					enabled: !!showLegend
				},
				xAxis: {
					...prevOptions.xAxis,
					labels: {enabled: true},
					type: type,
					tickPositioner: function() {
						if (type === 'datetime' && series.length && series[0].data.length <= 12) {
							//show all tick in the xAxis
							const ticks = generateSeries(series[0]).data.map(item => item[0]);

							/**because issue: https://github.com/highcharts/highcharts/issues/6467 */
							//@ts-ignore
							ticks.info = this.tickPositions.info;
							return ticks;
						}
						//@ts-ignore
						return this.tickPositions;
					},
					plotBands: plotBands ? plotBands.map(generatePlodBand) : undefined
				},
				yAxis: {
					title: {text: null},
					plotLines: plotLines ? plotLines.map(generatePlotLine) : undefined
				},
				plotOptions: {
					...prevOptions.plotOptions,
					column: {
						...(prevOptions.plotOptions ? prevOptions.plotOptions.column : undefined),
						pointPlacement: type === 'datetime' ? 'between' : undefined
					}
				},
				series: series ? series.map(generateSeries) : []
			};
		});
	}, [series, type, plotLines, showLegend, showExportMenu, plotBands]);

	return <Chart options={options} locale={locale} />;
};

Column.defaultProps = {
	series: [],
	showLegend: false
};

export default Column;
