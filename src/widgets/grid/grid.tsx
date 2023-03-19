import * as React from "react";
import JqxGrid, {IGridProps, jqx} from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import {Column, Row} from "../../data-grid/TypeDeclaration";
import MapVM from "../../ol-map/models/MapVM";
import GridToolbar from "./toolbar";


interface DataGridProps {
    columns: Column[];
    data: Row[];
    title?: string
    tableHeight: number,
    tableWidth?: number | 'auto'
    mapVM: MapVM
}

class DAGrid extends React.PureComponent<DataGridProps, IGridProps> {
    private myGrid = React.createRef<JqxGrid>();
    private gridToolbar = new GridToolbar(this.myGrid, this.props.mapVM);

    constructor(props: DataGridProps) {
        super(props);

        const columns = [];
        props.columns.forEach((col) => {
            columns.push({
                text: col.label,
                aligh: col.type == "string" ? "left" : "center",
                datafield: col.id,
                width: col.type == "string" ? 200 : 80
            })
        })

        this.state = {
            width: "100%",
            height: this.props.tableHeight + "px",
            columns: columns,
            source: this.getAdapter(),
            rendertoolbar: this.gridToolbar.renderToolbar
        }
    }

    getAdapter(): any {
        const source: any = {
            datatype: "array",
            localdata: this.props.data
        }
        return new jqx.dataAdapter(source)
    }

    public componentDidMount() {
        setTimeout(() => {
            this.gridToolbar.createButtons();
        });
    }


    render() {
        return (
            <React.Fragment>
                <JqxGrid
                    ref={this.myGrid}
                    theme={"web"}
                    width={this.state.width}
                    source={this.state.source}
                    columns={this.state.columns}
                    height={this.state.height}
                    filterable={true}
                    sortable={true}
                    pageable={true}
                    selectionmode={"singlerow"}
                    showtoolbar={true}
                    rendertoolbar={this.state.rendertoolbar}
                    // scrollmode={"default"}
                    altrows={true}/>
            </React.Fragment>
        )
    }
}

export default DAGrid
