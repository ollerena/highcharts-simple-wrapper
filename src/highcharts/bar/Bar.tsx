import React, {useState, useEffect} from 'react';
import {Options} from 'highcharts';

import Chart from '../Chart';
import * as ChartUtils from '../ChartUtils';

const initialOptions: Options = {
	chart: {
		type: 'bar'
	},
	plotOptions: {
		column: {
			groupPadding: 0.1,
			pointPadding: 0
		}
	}
};

export interface Series extends ChartUtils.Series{
	/**Only needed for Type Checking, should not be setted*/
	type: never;
	color: string;
	data: [Date | string, number | null][];
}

export interface Props {
	type: 'datetime' | 'category';
	series: Series[];
	plotLines?: ChartUtils.PlotLine[];
	plotBands?: ChartUtils.PlotBand[];
	showLegend?: boolean;
	showExportMenu?: boolean;
	locale: string; //e.g. "de-DE"
};

const generateSeries = (series: Series) => ({
	...series,
	data: series.data.map(([key, value]) => (key instanceof Date ? [key.valueOf(), value] : [key, value]))
});

const Bar = ({type, series, plotLines, plotBands, showLegend, showExportMenu, locale}: Props) => {
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
					plotBands: plotBands ? plotBands.map(ChartUtils.generatePlodBand) : undefined
				},
				yAxis: {
					title: {text: null},
					plotLines: plotLines ? plotLines.map(ChartUtils.generatePlotLine) : undefined
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

	return <Chart options={options} locale={locale} showExportMenu={showExportMenu} />;
};
Bar.defaultProps = {
	series: [],
	showLegend: false
};

export default Bar;
