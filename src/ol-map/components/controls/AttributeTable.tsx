import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import TableChartIcon from '@mui/icons-material/TableChart';
import {IControlProps} from "../../TypeDeclaration";
import {APIs} from "../../utils/Api";
import DADataGrid from "../../../data-grid/container/DataGrid";


const AttributeTable = (props: IControlProps) => {
    // const bottomDrawerRef = props.mapVM.getBottomDrawerRef();
    const mapBoxRef = props.mapVM.getMapBoxRef()
    return (
        <React.Fragment>
            <Tooltip title={"Open Attribute Table"}>
                <IconButton sx={{padding: "3px"}} onClick={() => {
                    const uuid = props.mapVM.getLayerOfInterest();
                    // @ts-ignore
                    const height = mapBoxRef.current?.getMapHeight() / 2;
                    console.log(mapBoxRef)
                    mapBoxRef.current?.toggleDrawer(height, <React.Fragment/>)
                    // props.mapVM.getApi().get(APIs.DCH_LAYER_ATTRIBUTES, {uuid: uuid})
                    //     .then((payload) => {
                    //         if (payload) {
                    //             // console.log("attribute information", payload);
                    //             const table = <DADataGrid columns={payload.columns}
                    //                                       data={payload.rows}
                    //                                       title={""}
                    //                                       tableHeight={height}
                    //                                       tableWidth={1500}/>
                    //
                    //             mapBoxRef.current?.toggleDrawer(height, table)
                    //         } else {
                    //             props.mapVM.getSnackbarRef()?.current?.show("No attribute found")
                    //         }
                    //     });


                }}>
                    <TableChartIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}
export default AttributeTable;
