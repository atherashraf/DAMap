import * as React from "react";
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import createPlotlyComponent from 'react-plotlyjs';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import {Row} from "./GridTypeDeclaration";

// create Plotly React component via dependency injection
const Plot = createPlotlyComponent(Plotly);

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);
interface IProps{
    data: Row[]
}
interface IState{

}
class PivotTable extends React.PureComponent<IProps, IState>{

    constructor(props:IProps) {
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
