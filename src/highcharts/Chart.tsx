import React, {useEffect, useRef, useMemo} from 'react';
import {Options, Chart as ChartType} from 'highcharts';

const loadHighcharts = async (options: Options) => {
	const {exporting, chart} = options;
	const modules: string[] = [];
	if (chart && chart.type && chart.type === 'bubble') {
		modules.push('highcharts-more.js');
	}
	if (exporting && exporting.enabled) {
		modules.push('modules/exporting.js');
	}

	const Highcharts = await import('highcharts');
	if (modules.length > 0) {
		return await Promise.all([
			...modules.map(module => {
				return import(`highcharts/${module}`);
			})
		]).then(importedModules => {
			importedModules.forEach(module => module(Highcharts));
			return Highcharts;
		});
	}
	return Highcharts;
};

interface Props {
	options: Options;
	locale: string;
}

//Should only be used by chart-components
const Chart = ({options, locale}: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<ChartType>();

	const [thousandSeparator, decimalSepearator] = useMemo(() => {
		const res: string[] | null = (1000.1 as number).toLocaleString(locale).match(/1(.)000(.)1/);
		return res ? res.splice(1, 2) : ['\u0020', '.'];
	}, [locale]);

	useEffect(() => {
		const legend = {
			symbolRadius: 0
		};
		if (chartRef.current) {
			chartRef.current.update(options, true, true);
		} else {
			if (Object.keys(options).length > 0) {
				loadHighcharts(options).then((Highcharts: any) => {
					Highcharts.setOptions({
						legend: options.chart && options.chart.type !== 'bubble' ? legend : undefined,
						lang: {
							thousandsSep: thousandSeparator,
							decimalPoint: decimalSepearator
						},
						credits: {
							enabled: false
						},
						title: {text: ''},
						subtitle: {text: ''}
					});
					chartRef.current = Highcharts.chart(containerRef.current, options);
				});
			}
		}
	}, [options, thousandSeparator, decimalSepearator]);

	return <div ref={containerRef} />;
};

Chart.defaultProps = {
	showExportMenu: false
};

export default Chart;
