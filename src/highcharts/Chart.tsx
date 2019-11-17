import React, {useEffect, useRef, useMemo, useCallback} from 'react';
import {Options, Chart as ChartType} from 'highcharts';

interface Props {
	options: Options;
	showExportMenu: boolean;
	locale: string;
}
//Should only be used by chart-components
const Chart = ({options, showExportMenu, locale}: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<ChartType>();

	const [thousandSeparator, decimalSepearator] = useMemo(() => {
		const res: string[] | null = (1000.1 as number).toLocaleString(locale).match(/1(.)000(.)1/);
		return res ? res.splice(1, 2) : ['\u0020', '.'];
	}, [locale]);

	const createChart = useCallback((options: Options, Highcharts: any) => {
		Highcharts.setOptions({
			credits: {
				enabled: false
			},
			title: {text: ''},
			subtitle: {text: ''}
		});
		chartRef.current = Highcharts.chart(containerRef.current, options);
	}, []);

	const loadHighcharts = useCallback(newOptions => {

		if (!containerRef || !containerRef.current) {
			throw Error('containerRef is null');
		}

		const {exporting, chart} = newOptions;
		const modules: Promise<any>[] = [];
		if (chart && chart.type && chart.type === 'bubble') {
			modules.push(import('highcharts/highcharts-more'));
		}
		if (exporting && exporting.enabled) {
			modules.push(import('highcharts/modules/exporting.js'));
		}

		if (modules.length > 0) {
			Promise
			.all([import('highcharts'), ...modules])
			.then(([Highcharts, ...importedModules]) => {
					importedModules.forEach(module => {
						module.default(Highcharts)
					});
					createChart(newOptions, Highcharts);
		});
		} else {
			import('highcharts').then(Highcharts => {
				createChart(newOptions, Highcharts);
			});
		}
	}, [showExportMenu, createChart]);

	useEffect(() => {
		if (!containerRef || !containerRef.current) {
			throw Error('containerRef is null');
		}

		const newOptions = {
			...options,
			exporting: {
				enabled: showExportMenu
			}
		};

		if (chartRef.current) {
			chartRef.current.update(newOptions, true, true);
		} else {
			if (Object.keys(newOptions).length > 0) {
				loadHighcharts(newOptions)
			}

		}
	}, [options, showExportMenu, loadHighcharts]);

	return <div ref={containerRef} />;
};

Chart.defaultProps = {
	showExportMenu: false,
	locale: 'en-GB'
};

export default Chart;
