import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import TableChartIcon from '@mui/icons-material/TableChart';
import { MapAPIs } from "../../utils/MapApi";
import DADataGrid from "../../../data-grid/container/DataGrid";
const AttributeTable = (props) => {
    // const bottomDrawerRef = props.mapVM.getBottomDrawerRef();
    const mapBoxRef = props.mapVM.getMapPanelRef();
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { title: "Open Attribute Table" },
            React.createElement(IconButton, { sx: { padding: "3px" }, onClick: () => {
                    var _a, _b, _c, _d, _e;
                    const open = (_a = mapBoxRef.current) === null || _a === void 0 ? void 0 : _a.isBottomDrawerOpen();
                    if (!open) {
                        const uuid = props.mapVM.getLayerOfInterest();
                        // @ts-ignore
                        let height = ((_b = mapBoxRef.current) === null || _b === void 0 ? void 0 : _b.getMapHeight()) / 2;
                        height = height < 250 ? 400 : height;
                        (_d = (_c = props.mapVM.getSnackbarRef()) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.show("Getting attribute information...");
                        props.mapVM.getApi().get(MapAPIs.DCH_LAYER_ATTRIBUTES, { uuid: uuid })
                            .then((payload) => {
                            var _a, _b, _c;
                            if (payload) {
                                // console.log("attribute information", payload);
                                const table = React.createElement(DADataGrid, { columns: payload.columns, data: payload.rows, title: "", tableHeight: height - 60, tableWidth: 'auto' });
                                (_a = mapBoxRef.current) === null || _a === void 0 ? void 0 : _a.openBottomDrawer(height, table);
                            }
                            else {
                                (_c = (_b = props.mapVM.getSnackbarRef()) === null || _b === void 0 ? void 0 : _b.current) === null || _c === void 0 ? void 0 : _c.show("No attribute found");
                            }
                        });
                    }
                    else {
                        (_e = mapBoxRef.current) === null || _e === void 0 ? void 0 : _e.closeBottomDrawer();
                    }
                } },
                React.createElement(TableChartIcon, null)))));
};
export default AttributeTable;
