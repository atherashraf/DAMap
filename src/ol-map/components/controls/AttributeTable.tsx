import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import TableChartIcon from '@mui/icons-material/TableChart';
import {IControlProps} from "../../TypeDeclaration";
import {MapAPIs} from "../../utils/MapApi";
import DADataGrid from "../../../data-grid/container/DataGrid";


const AttributeTable = (props: IControlProps) => {
    // const bottomDrawerRef = props.mapVM.getBottomDrawerRef();
    const mapBoxRef = props.mapVM.getMapPanelRef()
    return (
        <React.Fragment>
            <Tooltip title={"Open Attribute Table"}>
                <IconButton sx={{padding: "3px"}} onClick={() => {
                    const open = mapBoxRef.current?.isBottomDrawerOpen();
                    if (!open) {
                        const uuid = props.mapVM.getLayerOfInterest();
                        // @ts-ignore
                        let height = mapBoxRef.current?.getMapHeight() / 2;
                        height = height < 300 ? 400 : height
                        props.mapVM.getSnackbarRef()?.current?.show("Getting attribute information...")
                        props.mapVM.getApi().get(MapAPIs.DCH_LAYER_ATTRIBUTES, {uuid: uuid})
                            .then((payload) => {
                                if (payload) {
                                    // console.log("attribute information", payload);
                                    const table = <DADataGrid columns={payload.columns}
                                                              data={payload.rows}
                                                              title={""}
                                                              tableHeight={height - 60}
                                                              tableWidth={'auto'}/>

                                    mapBoxRef.current?.openBottomDrawer(height, table)
                                } else {
                                    props.mapVM.getSnackbarRef()?.current?.show("No attribute found")
                                }
                            });
                    } else {
                        mapBoxRef.current?.closeBottomDrawer()
                    }
                }}>
                    <TableChartIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}
export default AttributeTable;
