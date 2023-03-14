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
import { useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
const AddLayerPanel = (props) => {
    const mapVM = props.mapVM;
    const options = props.layers;
    React.useEffect(() => {
        const elem = document.getElementById('div-add_layer');
        mapVM.identifyFeature(elem);
    }, []);
    const [selectedOption, setSelectedOption] = useState(options[0].uuid);
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handelAddButton = () => __awaiter(void 0, void 0, void 0, function* () {
        yield props.mapVM.addDALayer({ uuid: selectedOption });
    });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "panel" },
            React.createElement("h3", null, "Add New Layer"),
            React.createElement(FormControl, { style: { display: "flex" } },
                React.createElement(InputLabel, { id: "dropdown-label" }, "Select Layer"),
                React.createElement(Select, { labelId: "dropdown-label", id: "dropdown", value: selectedOption, onChange: handleOptionChange }, options.map((option) => (React.createElement(MenuItem, { key: option.uuid, value: option.uuid }, option.title))))),
            React.createElement(Button, { style: { marginTop: "5px" }, variant: "contained", color: "primary", onClick: handelAddButton }, "Add Layer"),
            React.createElement("div", { id: "div-add_layer", style: { width: "100%", height: "auto" } }))));
};
export default AddLayerPanel;
