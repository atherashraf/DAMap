import * as React from "react";
import JqxGrid, {IGridProps, jqx} from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import MapVM from "../../ol-map/models/MapVM";
import {Column, Row} from "../GridTypeDeclaration";


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

    // private gridToolbar = new GridToolbar(this.myGrid, this.props.mapVM);

    constructor(props: DataGridProps) {
        super(props);
        if (this.props.data.length > 0) {
            const columns : any[] = [];
            const dataFields: any[] = [];
            const data = this.props.data;
            this.props.columns.forEach((col) => {
                let dataKey = col.id
                // problematic columns updating key of data
                const errorFields = ["group"]

                if (errorFields.includes(dataKey)) {
                    const newKey = dataKey + "_x";
                    data.map(({dataKey: newKey, ...rest}) => ({
                        newKey,
                        ...rest
                    }));
                    dataKey = newKey
                }
                // column model
                columns.push({
                    text: col.label,
                    cellsalign: col.type == "string" ? "left" : "right",
                    datafield: dataKey,
                    width: col.type == "string" ? 200 : 80
                })
                //data field
                dataFields.push({
                    name: dataKey,
                    type: col.type
                })

            });
            this.state = {
                width: "100%",
                height: this.props.tableHeight + "px",
                columns: columns,
                source: this.getAdapter(dataFields, data),
                // rendertoolbar: this.gridToolbar.renderToolbar
            }
        }
    }
    // componentDidUpdate(prevProps: Readonly<DataGridProps>, prevState: Readonly<IGridProps>, snapshot?: any) {
    //     // if(this.state.height !== this.props.tableHeight){
    //     //     console.log("updating table height", this.state.height, this.props.tableHeight)
    //         // this.setState({height: this.props.tableHeight})
    //     // }
    // }

    getAdapter(dataFields:any, data:any): any {
        const source: any = {
            datatype: "json",
            datafields: dataFields,
            localdata: data,
            // async: false,

        }
        return new jqx.dataAdapter(source, {
            autoBind: true,
        })
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    // public componentDidMount() {
    //     setTimeout(() => {
    //         // this.gridToolbar.createButtons();
    //     });
    // }
    updateTableHeight(newHeight){
        this.setState({height: newHeight})
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
                    groupable={false}
                    columnsresize={true}
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
