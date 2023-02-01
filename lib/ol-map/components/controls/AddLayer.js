var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddLayerPanel from "../AddLayerPanel";
import { MapAPIs } from "../../utils/MapApi";
const AddLayer = (props) => {
    const handleClick = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        let data = [
            { "uuid": "586bcff2-5a85-11ed-beb3-acde48001122", "title": "Rabi 2021-22", "layer_name": "Rabi_2021-22" },
            { "uuid": "2c6baf19-793f-11ed-8936-601895253350", "title": "water quality", "layer_name": "water_quality" }
        ];
        const payload = yield props.mapVM.api.get(MapAPIs.DCH_GET_ALL_LAYERS);
        if (payload) {
            data = payload;
        }
        (_b = (_a = props.drawerRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.addContents(React.createElement(AddLayerPanel, { mapVM: props.mapVM, layers: data }));
        (_d = (_c = props.drawerRef) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.toggleDrawer();
        props.mapVM.refreshMap();
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { title: "Add Layer" },
            React.createElement(IconButton, { sx: { padding: "3px" }, onClick: handleClick },
                React.createElement(AddIcon, null)))));
};
export default AddLayer;
