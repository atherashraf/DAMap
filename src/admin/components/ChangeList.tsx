import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import JqxGrid, {IGridProps, jqx} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid";
import {Column, Row} from "../../widgets/grid/GridTypeDeclaration";
import "jqwidgets-scripts/jqwidgets/styles/jqx.ui-darkness.css"
import autoBind from "auto-bind";
import ChangeListToolbar, {IToolbarButton} from "./ChangeListToolbar";
import MapApi, {MapAPIs} from "../../ol-map/utils/MapApi";


export interface Action {
    name: string
    action: Function
}

interface ICLGridProps {
    columns: Column[];
    data: Row[];
    title?: string
    tableHeight?: number | string,
    tableWidth?: number | string
    actions: Action[]
    api: MapApi
    pkColName: string
    modelName: string
    // mapVM: MapVM
}

interface IEditedData {
    pk: { colName: string, colValue: any }
    rowData: { [key: string]: any }
}

interface IChangeListState extends IGridProps {
    actions: Action[]
    isToolbarAdded: boolean
}

class ChangeList extends React.PureComponent<ICLGridProps, IChangeListState> {
    private daGrid = React.createRef<JqxGrid>();

    private columns: any[] = [];
    private dataFields: any[] = [];
    // @ts-ignore
    private selectedAction: Action;

    // private gridToolbar = new ChangeListToolbar(this.clGrid);

    constructor(props: ICLGridProps) {
        super(props);
        autoBind(this);
        this.setTableStructure();
        this.state = {
            width: this.props.tableWidth ? this.props.tableWidth : "100%",
            height: this.props.tableHeight ? this.props.tableHeight : "100$",
            columns: this.columns,
            source: this.getAdapter(),
            actions: [...this.props.actions],
            editable: false,
            isToolbarAdded: false,
        }
    }

    setTableStructure() {

        this.props?.columns?.forEach((col: Column) => {
            let dataKey = col.id

            this.columns.push({
                text: col.label,
                cellsalign: col.type === "string" ? "left" : "right",
                datafield: dataKey,
                width: col.type === "string" ? 200 : 80
            })
            //data field
            this.dataFields.push({
                name: dataKey,
                type: col.type
            })
        });
    }

    getAdapter(data?: Row[]): any {
        data = data ? data : [...this.props.data]
        console.log("data", this.props.data);
        data?.forEach((row) => {
            // console.log(row)
            for (let key in row) {
                if (row[key] && typeof row[key] == "object") {
                    row[key] = JSON.stringify(row[key])
                }
            }
        })
        const source: any = {
            datatype: "json",
            datafields: this.dataFields,
            localdata: data,
            // async: false,
            // deleterow: function (rowid, commit) {
            //     // synchronize with the server - send delete command
            //     // call commit with parameter true if the synchronization with the server is successful
            //     //and with parameter false if the synchronization failed.
            //     commit(true);
            // },
            updaterow: (rowid: number, rowdata: any, commit: any): void => {
                const editedData: IEditedData = {
                    // cellName: args.dataFields,
                    // cellValue: args.value
                    pk: {colName: this.props.pkColName, colValue: rowdata[this.props.pkColName]},
                    rowData: rowdata
                }
                this.props.api.post(MapAPIs.DCH_EDIT_MODEL_ROW, editedData, {modelName: this.props.modelName}).then(payload => {
                    if (payload) {
                        this.props.api.snackbarRef?.current?.show("data updated successfully...")
                        commit(true);
                        this.setState(() => ({editable: false}))
                    } else {
                        commit(false);
                    }
                })

            }

        }
        return new jqx.dataAdapter(source, {
            autoBind: true,
        })
    }

    updateSource(data?: Row[]) {
        this.daGrid.current!.setOptions({source: this.getAdapter(data)});
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

    getToolbarButtons() {
        // const reloadBtn = require("../../static/img/pencil-icon.png");
        const tbButtons: IToolbarButton[] = []
        return tbButtons
    }

    getToolbarContainer() {
        const buttons = this.getToolbarButtons()
        return (
            <span style={{display: "flex"}}>
                <ChangeListToolbar daGrid={this.daGrid} parent={this} buttons={buttons}/>
                <div style={{overflow: "hidden", position: "relative", margin: "5px", padding: "5px"}}>
                    <span>actions: &nbsp; &nbsp;</span>
                    <select onChange={(e) => {
                        // @ts-ignore
                        this.selectedAction = this.state.actions.find((item) => item.name === e.target.value)
                    }}>
                        <option value={"-1"}>Select an action</option>
                        {this.state.actions.map((item: Action) =>
                            (<option key={"key-" + item.name} value={item.name}>{item.name}</option>))}
                    </select>

                    &nbsp; &nbsp;
                    <button onClick={(e) => {
                        if (this.selectedAction) {
                            this.selectedAction.action()
                        }
                    }}>Go
                    </button>
                </div>
            </span>
        )
    }

    renderToolbar(toolbar: any) {
        if (!this.state.isToolbarAdded) {
            const container = this.getToolbarContainer();
            // const container: JSX.Element = <span style={{display: "flex"}}>
            //     <ChangeListToolbar  daGrid={this.daGrid}/>
            //     {this.getToolbarContainer()}</span>
            const root = ReactDOMClient.createRoot(toolbar[0])
            root.render(container)
            this.setState({isToolbarAdded: true})
        }

    }

    getSelectedRowIndex() {
        // console.log(this.clGrid.current.getselectedrowindex())
        return this.daGrid?.current?.getselectedrowindex()
    }

    getSelectedRowData(): Row {
        const rowIndex = this.daGrid?.current?.getselectedrowindex()
        return this.daGrid.current?.getrowdata(rowIndex || -1)
    }


    startEditing() {
        this.setState(() => ({editable: true}))
        this.props.api?.snackbarRef?.current?.show("Please double click on cell for editing...")
    }

    render() {
        return (
            <React.Fragment>
                <JqxGrid
                    ref={this.daGrid}
                    theme={"ui-darkness"}
                    width={this.state?.width}
                    source={this.state?.source}
                    columns={this.state?.columns}
                    height={this.state?.height}
                    filterable={true}
                    sortable={true}
                    pageable={true}
                    pagesize={30}
                    groupable={true}
                    editable={this.state.editable}
                    selectionmode={'singlerow'}
                    columnsresize={true}
                    showtoolbar={true}
                    rendertoolbar={this.renderToolbar}
                    scrollmode={"default"}
                    altrows={true}/>

            </React.Fragment>


        )
    }
}

export default ChangeList
