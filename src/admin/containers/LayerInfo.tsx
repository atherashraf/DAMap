import * as React from "react";
import {Column, Row} from "../../widgets/GridTypeDeclaration";
import ChangeList, {Action} from "../components/ChangeList";
import MapApi, {MapAPIs} from "../../ol-map/utils/MapApi";
import DASnackbar from "../../ol-map/components/common/DASnackbar";
import {RefObject} from "react";
import {useNavigate} from "react-router-dom";
import DAFullScreenDialog from "../../common/DAFullScreenDialog";
import AddRasterLayerInfo from "../components/forms/AddRasterLayerInfo";


const changeListRef = React.createRef<ChangeList>()
const snackbarRef: RefObject<DASnackbar> = React.createRef<DASnackbar>();
const dialogRef: RefObject<DAFullScreenDialog> = React.createRef<DAFullScreenDialog>()
const LayerInfo = () => {
    const [columns, setColumns] = React.useState<Column[]>([]);
    const [data, setData] = React.useState<Row[]>()
    const [actions, setActions] = React.useState<Action[]>([])
    const api = new MapApi(snackbarRef);
    const navigate = useNavigate();

    React.useEffect(() => {
        initActions();
        api.get(MapAPIs.DCH_ALL_LAYER_INFO).then((payload) => {
            if (payload) {
                setData(payload.rows)
                setColumns(payload.columns)
            }
        })
    }, [])
    const getRowData = () => {
        const rowData = changeListRef.current?.getSelectedRowData()
        return rowData

    }
    const getSelectedUUID = () => {
        const rowData = getRowData()
        if (rowData) {
            return rowData.uuid
        }
    }
    const initActions = () => {
        const actions: Action[] = [{
            name: "View Layer Designer",
            action: () => {
                const uuid = getSelectedUUID();
                navigate("/designer/" + uuid,)
            }
        }, {
            name: "Add Raster Layer",
            action: () => {
                dialogRef.current?.handleClickOpen()
                dialogRef.current?.setContent("Add Raster Layer", <AddRasterLayerInfo snackbarRef={snackbarRef}/>)
                // alert("Adding LayerInfo....")
            }
        }, {
            name: "Delete layer Info",
            action: () => {
                // console.log(changeListRef)
                const rowData = changeListRef.current?.getSelectedRowData()
                if (rowData) {
                    console.log(rowData)
                    alert(`Deleting ${rowData.id} LayerInfo....`)
                }
            }
        }]
        setActions(actions)
    }
    const infoGridHeight=0
    const appbarHeight=0
    return (
        <React.Fragment>
            {columns.length > 0 ?
                <ChangeList ref={changeListRef} columns={columns} data={data} tableHeight={'100%'} tableWidth={"100%"}
                            actions={actions}/> :
                <React.Fragment/>
            }
            <DASnackbar ref={snackbarRef}/>
            <DAFullScreenDialog ref={dialogRef} />
        </React.Fragment>
    )
}

export default LayerInfo
