import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import JqxGrid, {IGridProps, jqx} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid";
import {Column, Row} from "../../widgets/GridTypeDeclaration";
import ChangeListToolbar from "./ChangeListToolbar";

import autoBind from "auto-bind";
import jsxToString from 'jsx-to-string';


export interface Action {
    name: string
    action: Function
}

interface CLGridProps {
    columns: Column[];
    data: Row[];
    title?: string
    tableHeight?: number | string,
    tableWidth?: number | string
    actions: Action[]
    // mapVM: MapVM
}


interface IChangeListState extends IGridProps {
    actions: Action[]
    selectedAction: Action | null
    isToolbarAdded: boolean
}

class ChangeList extends React.PureComponent<CLGridProps, IChangeListState> {
    private clGrid = React.createRef<JqxGrid>();

    // private gridToolbar = new ChangeListToolbar(this.clGrid);

    constructor(props: CLGridProps) {
        super(props);
        autoBind(this);
        const columns: any[] = [];
        const dataFields: any[] = [];

        this.props?.columns?.forEach((col: Column) => {
            let dataKey = col.id
            // problematic columns updating key of data
            const errorFields = ["group"]

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
            width: this.props.tableWidth ? this.props.tableWidth : "100%",
            height: this.props.tableHeight ? this.props.tableHeight : "100$",
            columns: columns,
            source: this.getAdapter(dataFields),
            selectedAction: null,
            actions: [...this.props.actions],
            isToolbarAdded: false,
            // {
            // name: "delete",
            // action: () => {
            //     alert("item deleted")
            // }}
            // ],
            // rendertoolbar: (toolbar) => this.renderToolbar(toolbar)
            // rendertoolbar: this.gridToolbar.renderToolbar
        }
    }

    getAdapter(dataFields: any): any {
        const source: any = {
            datatype: "json",
            datafields: dataFields,
            localdata: this.props.data,
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

    public componentDidMount() {
        setTimeout(() => {
            // this.gridToolbar.createButtons();
        }, 1000);
    }

    getToolbarContainer() {
        return (
            <div style={{overflow: "hidden", position: "absolute", margin: "5px", padding: "5px"}}>
                <span>actions: &nbsp; &nbsp;</span>
                <select onChange={(e) => {
                    const action = this.state.actions.find((item) => item.name == e.target.value)
                    this.setState({selectedAction: action})
                }}>
                    <option value={"-1"}>Select an action</option>
                    {this.state.actions.map((item: Action) =>
                        (<option key={"key-" + item.name} value={item.name}>{item.name}</option>))}
                </select>

                &nbsp; &nbsp;
                <button onClick={(e) => {
                    if (this.state.selectedAction) {
                        this.state.selectedAction?.action()
                    }
                }}>Go
                </button>
            </div>
        )
    }

    renderToolbar(toolbar: any) {
        if(!this.state.isToolbarAdded) {
            // console.log("toolbar", toolbar)
            // const style: React.CSSProperties = {float: 'left', marginLeft: '5px'};
            // const toolbarRenderer =
            // createRoot(toolbar[0]).render(this.getToolbarContainer());
            const container = this.getToolbarContainer();
            // console.log(jsxToString(container))
            console.log(toolbar[0])
            // toolbar[0].innerHTML = jsxToString(container)
            const root = ReactDOMClient.createRoot(toolbar[0])
            root.render(container)
            this.setState({isToolbarAdded: true})
        }

    }

    getSelectedRowIndex(){
        // console.log(this.clGrid.current.getselectedrowindex())
        return this.clGrid?.current?.getselectedrowindex()
    }

    getSelectedRowData(){
        const rowIndex = this.clGrid?.current?.getselectedrowindex()
        return this.clGrid.current?.getrowdata(rowIndex)
    }
    render() {
        return (
            <React.Fragment>
                <JqxGrid
                    ref={this.clGrid}
                    theme={"web"}
                    width={this.state?.width}
                    source={this.state?.source}
                    columns={this.state?.columns}
                    height={this.state?.height}
                    filterable={true}
                    filtermode={'excel'}
                    sortable={true}
                    pageable={true}
                    groupable={true}
                    columnsresize={true}
                    selectionmode={"singlerow"}
                    showtoolbar={true}
                    rendertoolbar={this.renderToolbar}
                    scrollmode={"default"}
                    altrows={true}/>
            </React.Fragment>
        )
    }
}

export default ChangeList
