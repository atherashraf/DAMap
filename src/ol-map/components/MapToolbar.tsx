import "../static/css/OlControl.css"
import {Control} from "ol/control";
import React from "react";
import {createRoot} from "react-dom/client";
import MapVM from "../models/MapVM";
import SymbologyControl from "./controls/SymbologyControl";
import {IMapToolbarProps} from "../TypeDeclaration";
import Zoom2Extent from "./controls/Zoom2Extent";
import LayerSwitcherControl from "./controls/LayerSwitcherControl";


class MapToolbar extends Control {
    /**
     * @param {Object} [optOptions] Control options.
     */
    constructor(optOptions: IMapToolbarProps) {
        // const options = optOptions || {};
        const element = document.createElement('nav');
        element.className = 'ol-control';
        element.style.left = "3.5em"
        element.style.top = "0.5em"
        element.style.display = "flex"
        super({
            "element": element,
            "target": optOptions.target,
        });
        const mapVM: MapVM = optOptions.mapVM


        const root = createRoot(element)
        root.render(<React.Fragment>
                <LayerSwitcherControl mapVM={mapVM} drawerRef={mapVM?.getRightDrawerRef()}/>
                <Zoom2Extent mapVM={mapVM}/>
                {optOptions.isDesigner &&
                    <SymbologyControl mapVM={mapVM} drawerRef={mapVM?.getRightDrawerRef()}/>
                }
            </React.Fragment>
        );
    }
}

export default MapToolbar;
