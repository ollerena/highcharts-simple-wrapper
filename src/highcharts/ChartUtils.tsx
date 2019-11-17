const DEFAULT_PLOTLINE_COLOR = '#bfbfbf'; //grey

export type DashStyle =
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
    name: string;
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

export const generatePlotLine = (plotLine: PlotLine) => ({
    dashStyle: plotLine.dashStyle || 'ShortDot',
    width: 2,
    value: plotLine.value,
    label: {
        text: plotLine.label || ''
    },
    color: plotLine.color || DEFAULT_PLOTLINE_COLOR,
    zIndex: 4
});

export const generatePlodBand = (plotBand: PlotBand) => ({
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