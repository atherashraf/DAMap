import "../static/css/OlControl.css";
import { Control } from "ol/control";
import * as React from "react";
import { createRoot } from "react-dom/client";
import SymbologyControl from "./controls/SymbologyControl";
import Zoom2Extent from "./controls/Zoom2Extent";
import Identifier from "./controls/Identifier";
import LayerSwitcherControl from "./controls/LayerSwitcherControl";
import AttributeTable from "./controls/AttributeTable";
import LOISelector from "./controls/LOISelector";
import RasterArea from "./controls/RasterArea";
import AddLayer from "./controls/AddLayer";
class MapToolbar extends Control {
    /**
     * @param {Object} [optOptions] Control options.
     */
    constructor(optOptions) {
        // const options = optOptions || {};
        const element = document.createElement('nav');
        element.className = 'ol-control';
        element.style.left = "3.5em";
        element.style.top = "0.5em";
        element.style.display = "flex";
        super({
            "element": element,
            "target": optOptions.target,
        });
        const mapVM = optOptions.mapVM;
        const root = createRoot(element);
        root.render(React.createElement(React.Fragment, null,
            React.createElement(AddLayer, { mapVM: mapVM, drawerRef: mapVM === null || mapVM === void 0 ? void 0 : mapVM.getRightDrawerRef() }),
            React.createElement(LayerSwitcherControl, { mapVM: mapVM, drawerRef: mapVM === null || mapVM === void 0 ? void 0 : mapVM.getRightDrawerRef() }),
            React.createElement(Zoom2Extent, { mapVM: mapVM }),
            React.createElement(RasterArea, { mapVM: mapVM, drawerRef: mapVM === null || mapVM === void 0 ? void 0 : mapVM.getRightDrawerRef() }),
            React.createElement(Identifier, { mapVM: mapVM, drawerRef: mapVM === null || mapVM === void 0 ? void 0 : mapVM.getRightDrawerRef() }),
            optOptions.isDesigner &&
                React.createElement(SymbologyControl, { mapVM: mapVM, drawerRef: mapVM === null || mapVM === void 0 ? void 0 : mapVM.getRightDrawerRef() }),
            React.createElement(AttributeTable, { mapVM: mapVM }),
            React.createElement(LOISelector, { mapVM: mapVM })));
    }
}
export default MapToolbar;
