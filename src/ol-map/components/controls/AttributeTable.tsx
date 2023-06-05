import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import TableChartIcon from '@mui/icons-material/TableChart';
import {IControlProps} from "../../TypeDeclaration";
import {MapAPIs} from "../../utils/MapApi";
import {useState} from "react";
import AttributeGrid from "../../../widgets/grid/AttributeGrid";

const daGridRef = React.createRef<AttributeGrid>()

const AttributeTable = (props: IControlProps) => {
    let tableHeight = 300;
    const mapBoxRef = props.mapVM.getMapPanelRef()

    const ro = new ResizeObserver(entries => {
        for (let entry of entries) {
            const cr = entry.contentRect;
            if (cr.height > 0) {
                daGridRef.current?.updateTableHeight(cr.height)
            }
        }
    });
    ro.observe(document.getElementById("bottom-drawer-div"))
    React.useEffect(() => {
        setTimeout(() => props.mapVM.setAttributeTableRef(daGridRef), 500)
    }, [])
    return (
        <React.Fragment>
            <Tooltip title={"Open Attribute Table"}>
                <IconButton sx={{padding: "3px"}} onClick={() => {
                    let open = mapBoxRef.current?.isBottomDrawerOpen();
                    const uuid = props.mapVM.getLayerOfInterest();
                    if (!uuid) {
                        props.mapVM.showSnackbar("Please select a layer to view its attributes");
                    } else if (!open) {
                        const mapHeight = mapBoxRef.current.getMapHeight()
                        tableHeight = mapHeight <= mapBoxRef.current.getMaxMapHeight() ? tableHeight : mapHeight / 2
                        // tableHeight = mapHeight / 2;
                        mapBoxRef.current?.openBottomDrawer(tableHeight)
                        if (uuid) {
                            props.mapVM.getApi().get(MapAPIs.DCH_LAYER_ATTRIBUTES, {uuid: uuid})
                                .then((payload) => {
                                    if (payload) {
                                        props.mapVM?.openAttributeTable(payload.columns, payload.rows,
                                            payload.pkCols,  tableHeight, daGridRef)


                                    } else {
                                        mapBoxRef.current?.closeBottomDrawer()
                                        props.mapVM.getSnackbarRef()?.current?.show("No attribute found")
                                    }
                                })
                                .catch(() => {
                                    mapBoxRef.current?.closeBottomDrawer()
                                    props.mapVM.getSnackbarRef()?.current?.show("No attribute found")
                                });
                        }
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
