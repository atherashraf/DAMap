import * as React from "react";
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
// @ts-ignore
import Plotly from 'plotly.js/dist/plotly-cartesian';
// @ts-ignore
import createPlotlyComponent from 'react-plotlyjs';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';


const Plot = createPlotlyComponent(Plotly);

const PlotlyRenderers = createPlotlyRenderers(Plot);

interface IProps {
    data: { [key: string]: any }[]
}

interface IState {

}

class PivotTable extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = props;
    }

    render() {
        return (
            <PivotTableUI
                data={this.props.data}
                onChange={s => this.setState(s)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                {...this.state}
            />
        );
    }
}

export default PivotTable
