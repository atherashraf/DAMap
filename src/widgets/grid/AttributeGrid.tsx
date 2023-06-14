import * as React from "react";
import JqxGrid, {IGridProps} from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import MapVM from "../../ol-map/models/MapVM";
import {Column, Row} from "./GridTypeDeclaration";
import autoBind from "auto-bind";
import {MapAPIs} from "../../ol-map/utils/MapApi";
import {createRoot} from "react-dom/client";
import AttributeGridToolbar, {IToolbarButton} from "./AttributeGridToolbar";
import DAFullScreenDialog from "../../common/DAFullScreenDialog";
import {RefObject} from "react";
import PivotTable from "./PivotTable.";

const zoomBtn = require("../../static/img/search.png")
const clearBtn = require("../../static/img/selection_delete.png")
const pivotBtn = require("../../static/img/pivot-table.png")


interface IDataGridProps {
    columns: Column[];
    data: Row[];
    tableHeight: number,
    tableWidth?: number | 'auto'
    pkCols: string[]
    mapVM: MapVM
    pivotTableSrc?: string
}

interface IDataGridState extends IGridProps {
    isToolbarRendered: boolean
    pivotTableData: { [key: string]: any }[]
}

class AttributeGrid extends React.PureComponent<IDataGridProps, IDataGridState> {
    private jqxGridRef = React.createRef<JqxGrid>();
    private toolbarRef = React.createRef<AttributeGridToolbar>()
    private dialogRef: RefObject<DAFullScreenDialog> = React.createRef<DAFullScreenDialog>()
    private tableMargin: number = 5;

    constructor(props: IDataGridProps) {
        super(props);
        const {columns, dataFields} = this.getGridColumnsDataField();
        this.state = {
            width: "100%",
            height: (this.props.tableHeight - this.tableMargin) + "px",
            columns: columns,
            source: this.createSource(dataFields),
            isToolbarRendered: false,
            pivotTableData: this.props.pivotTableSrc == null ? this.props.data : []
        }
        autoBind(this)
    }

    getJqxGrid() {
        return this.jqxGridRef;
    }

    getToolbbar() {
        return this.toolbarRef;
    }

    getGridColumnsDataField() {
        const columns: any[] = [];
        const dataFields: any[] = [];
        let serial_no_column = {
            text: 'Sr.No.',
            datafield: '',
            columntype: 'number',
            width: 50,
            pinned: true,
            align: 'center',
            cellsrenderer: function (row: any, column: any, value: any) {
                return "<div style='margin: 5px;'>" + (value + 1) + "</div>";
            }
        };
        columns.push(serial_no_column)
        if (this.props.data.length > 0) {
            this.props.columns.forEach((col) => {
                let dataKey = col.id
                // problematic columns updating key of data
                const errorFields = ["group"]

                if (errorFields.includes(dataKey)) {
                    const newKey = dataKey + "_x";
                    this.props.data.map(({dataKey: newKey, ...rest}) => ({
                        newKey,
                        ...rest
                    }));
                    dataKey = newKey
                }
                // column model
                columns.push({
                    text: col.label,
                    cellsalign: col.type == "string" ? "left" : "center",
                    align: 'center',
                    datafield: dataKey,
                    width: col.type == "string" ? 200 : 100
                })
                //data field
                dataFields.push({
                    name: dataKey,
                    type: col.type
                })

            });

        }
        return {columns, dataFields}
    }

    createSource(dataFields: any): any {
        const {data} = this.props
        data.forEach((d, index) => {
            data[index]["geom"] = null
        })
        dataFields.push({
            name: "geom",
            type: 'json',
        })
        return {
            datatype: "json",
            datafields: dataFields,
            localdata: data,
            // async: false,
        }
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        console.error(error, errorInfo);
    }


    updateTableHeight(newHeight) {
        this.setState({height: newHeight - this.tableMargin})
    }

    getSelectedRowIndex() {
        // console.log(this.clGrid.current.getselectedrowindex())
        return this.jqxGridRef?.current?.getselectedrowindex()
    }

    getSelectedRowData() {
        const rowIndex = this.getSelectedRowIndex()
        return this.jqxGridRef.current?.getrowdata(rowIndex)
    }

    getSelectedRowPKValue() {
        const rowData = this.getSelectedRowData()
        let pkVal = ""
        this.props.pkCols.forEach((col) => {
            // console.log(col, rowData[col])
            pkVal += rowData[col]
        })
        return pkVal
    }

    updateRow(updatedRow: any) {
        try {
            const rowId = this.getSelectedRowIndex()
            this.jqxGridRef?.current?.updaterow(rowId, updatedRow)
        } catch (e) {
            // console.error("failed to update row")
        }
    }

    pinColumns(columnIds: string[]) {
        columnIds.forEach((id) => {
            this.jqxGridRef?.current?.pincolumn(id)
        })

    }
    getJqxGridRef(): RefObject<JqxGrid> {
        return this.jqxGridRef
    }

    getToolbarRef(): RefObject<AttributeGridToolbar> {
        return this.toolbarRef
    }

    handleRowSelect() {
        const row = this.getSelectedRowData()
        if (!row["geom"]) {
            const pkVal = this.getSelectedRowPKValue()
            this.props.mapVM.getApi().get(MapAPIs.DCH_GET_FEATURE_GEOMETRY,
                {uuid: this.props.mapVM.getLayerOfInterest(), pk_values: pkVal})
                .then((payload) => {
                    this.props.mapVM.selectionLayer.addWKT2Selection(payload)
                    row["geom"] = payload
                    this.updateRow(row)
                })

        } else {
            this.props.mapVM.selectionLayer.addWKT2Selection(row["geom"])
        }

    }

    addToolbarButtons() {
        const me = this;

        const btn: IToolbarButton[] = [{
            id: "zoomButton",
            title: "Zoom To Selection",
            imgSrc: zoomBtn,
            onClick: () => {
                // alert("zoom to layer")
                me.props.mapVM.selectionLayer.zoomToSelection()
            }
        }, {
            id: "clearSelection",
            title: "Clear Selection",
            imgSrc: clearBtn,
            onClick: () => {
                me.props.mapVM.selectionLayer.clearSelection()
                me.props.mapVM.zoomToFullExtent()
            }
        }, {
            id: "pivotTable",
            title: "Pivot Table",
            imgSrc: pivotBtn,
            onClick: () => {
                this.dialogRef.current?.handleClickOpen()
                // console.log(this.state.pivotTableData)
                if (this.state.pivotTableData.length > 0) {
                    this.dialogRef.current?.setContent("Pivot Table", <PivotTable data={this.state.pivotTableData}/>)
                } else {
                    const api = this.props.mapVM.getApi()
                    api.getFetch(this.props.pivotTableSrc).then((payload) => {
                        this.setState(() => ({pivotTableData: payload}))
                        this.dialogRef.current?.setContent("Pivot Table", <PivotTable data={payload}/>)
                    })
                }

            }
        }]
        if (this.toolbarRef.current) {
            this.toolbarRef.current.addButton(btn)
        } else {
            console.error("Attribute Grid toolbar is not available")
        }
    }

    renderToolbar(toolbar) {
        if (!this.state.isToolbarRendered) {
            const toolbarElem = toolbar[0] as HTMLElement
            const root = createRoot(toolbarElem)
            root.render(<React.Fragment><AttributeGridToolbar ref={this.toolbarRef} mapVM={this.props.mapVM}
                                                              daGrid={this.jqxGridRef}/></React.Fragment>)
            this.setState(() => ({isToolbarRendered: true}))
            setTimeout(() => this.addToolbarButtons(), 1000)
        }
    }

    render() {
        return (
            <React.Fragment>
                <JqxGrid
                    ref={this.jqxGridRef}
                    theme={"web"}
                    width={this.state.width}
                    source={this.state.source}
                    columns={this.state.columns}
                    height={this.state.height}
                    filterable={true}
                    sortable={true}
                    pageable={true}
                    pagesize={20}
                    groupable={true}
                    columnsresize={true}
                    selectionmode={"singlerow"}
                    showtoolbar={true}
                    rendertoolbar={this.renderToolbar}
                    onRowselect={this.handleRowSelect}
                    // scrollmode={"default"}
                    // filtermode={"excel"}
                    altrows={true}/>
                <DAFullScreenDialog ref={this.dialogRef}/>
            </React.Fragment>
        )
    }
}

export default AttributeGrid
