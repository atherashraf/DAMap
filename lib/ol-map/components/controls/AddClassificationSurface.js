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
const AddClassificationSurface = (props) => {
    const handelAddButton = () => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        const value = "586bcff2-5a85-11ed-beb3-acde48001122";
        console.log("value", value);
        yield props.mapVM.addDALayer({ uuid: value });
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { title: "Zoom to Map Extent" },
            React.createElement(IconButton, { sx: { padding: "3px" }, onClick: handelAddButton },
                React.createElement(AddIcon, null)))));
};
export default AddClassificationSurface;
