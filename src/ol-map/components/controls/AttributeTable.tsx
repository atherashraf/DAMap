import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import TableChartIcon from '@mui/icons-material/TableChart';
import {IControlProps} from "../../TypeDeclaration";
import {MapAPIs} from "../../utils/MapApi";
import DADataGrid from "../../../data-grid/container/DataGrid";
import {useState} from "react";


const AttributeTable = (props: IControlProps) => {
    // const bottomDrawerRef = props.mapVM.getBottomDrawerRef();
    const [loi, setCurrentLOI] = useState(null);
    const mapBoxRef = props.mapVM.getMapPanelRef()
    return (
        <React.Fragment>
            <Tooltip title={"Open Attribute Table"}>
                <IconButton sx={{padding: "3px"}} onClick={() => {
                    let open = mapBoxRef.current?.isBottomDrawerOpen();
                    const uuid = props.mapVM.getLayerOfInterest();
                    // if (!loi) {
                    //     setCurrentLOI(loi)
                    // } else if (loi && uuid != loi) {
                    //     setCurrentLOI(loi)
                    //     if (open) {
                    //         mapBoxRef.current?.closeBottomDrawer()
                    //         open = false
                    //     }
                    //     console.log(open, uuid)
                    // } else {
                    //     setCurrentLOI(null)
                    // }
                    if (!open) {
                        // @ts-ignore
                        let height = mapBoxRef.current?.getMapHeight() / 2;
                        height = height < 250 ? 400 : height
                        props.mapVM.getSnackbarRef()?.current?.show("Getting attribute information...")
                        mapBoxRef.current?.openBottomDrawer(height)
                        props.mapVM.getApi().get(MapAPIs.DCH_LAYER_ATTRIBUTES, {uuid: uuid})
                            .then((payload) => {
                                if (payload) {
                                    // console.log("attribute information", payload);
                                    const table = <DADataGrid columns={payload.columns}
                                                              data={payload.rows}
                                                              title={""}
                                                              tableHeight={height - 60}
                                                              tableWidth={'auto'}
                                                              mapVM={props.mapVM}
                                    />

                                    mapBoxRef.current?.setContent(table)
                                } else {
                                    mapBoxRef.current?.closeBottomDrawer()
                                    props.mapVM.getSnackbarRef()?.current?.show("No attribute found")
                                }
                            })
                            .catch(() => {
                                mapBoxRef.current?.closeBottomDrawer()
                                props.mapVM.getSnackbarRef()?.current?.show("No attribute found")
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
