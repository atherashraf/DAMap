import * as React from "react";
import JqxGrid, {IGridProps, jqx} from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import MapVM from "../../ol-map/models/MapVM";
import {Column, Row} from "./GridTypeDeclaration";
import autoBind from "auto-bind";
import {MapAPIs} from "../../ol-map/utils/MapApi";
import {createRoot} from "react-dom/client";
import AttributeGridToolbar, {IToolbarButton} from "./AttributeGridToolbar";
import DAFullScreenDialog from "../../common/DAFullScreenDialog";
import {RefObject} from "react";
import AddRasterLayerInfo from "../../admin/components/forms/AddRasterLayerInfo";
import PivotTable from "./PivotTable.";


interface IDataGridProps {
    columns: Column[];
    data: Row[];
    tableHeight: number,
    tableWidth?: number | 'auto'
    pkCols: string[]
    mapVM: MapVM
}

interface IDataGridState extends IGridProps {
    isToolbarRendered: boolean
}

class AttributeGrid extends React.PureComponent<IDataGridProps, IDataGridState> {
    private jqxGridRef = React.createRef<JqxGrid>();
    private toolbarRef = React.createRef<AttributeGridToolbar>()
    private dialogRef: RefObject<DAFullScreenDialog> = React.createRef<DAFullScreenDialog>()
    private tableMargin: number = 15;

    constructor(props: IDataGridProps) {
        super(props);
        const {columns, dataFields} = this.getGridColumnsDataField();
        this.state = {
            width: "100%",
            height: (this.props.tableHeight - this.tableMargin) + "px",
            columns: columns,
            source: this.createSource(dataFields),
            isToolbarRendered: false
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
        const source: any = {
            datatype: "json",
            datafields: dataFields,
            localdata: data,
            // async: false,
        }
        // return new jqx.dataAdapter(source, {
        //     autoBind: true,
        // })
        return source;

    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        console.error(error, errorInfo);
    }

    // public componentDidMount() {
    //     setTimeout(() => {
    //         // this.gridToolbar.createButtons();
    //     });
    // }
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

    handleRowSelect(e) {
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
        const zoomBtn = require("../../static/img/search.png")
        const clearBtn = require("../../static/img/selection_delete.png")
        const pivotBtn = require("../../static/img/pivot-table.png")
        const btn: IToolbarButton[] = [{
            id: "zoomButton",
            title: "Zoom To Selection",
            imgSrc: zoomBtn,
            onClick: (e) => {
                // alert("zoom to layer")
                me.props.mapVM.selectionLayer.zoomToSelection()
            }
        }, {
            id: "clearSelection",
            title: "Clear Selection",
            imgSrc: clearBtn,
            onClick: (e) => {
                me.props.mapVM.selectionLayer.clearSelection()
                me.props.mapVM.zoomToFullExtent()
            }
        }, {
            id: "pivotTable",
            title: "Pivot Table",
            imgSrc: pivotBtn,
            onClick: (e) => {
                this.dialogRef.current?.handleClickOpen()
                this.dialogRef.current?.setContent("Pivot Table", <PivotTable data={this.props.data} />)

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
