import "../static/css/OlControl.css"
import {Control} from "ol/control";
import React from "react";
import {createRoot} from "react-dom/client";
import MapVM from "../models/MapVM";
import SymbologyControl from "./controls/SymbologyControl";
import {IMapToolbarProps} from "../TypeDeclaration";
import Zoom2Extent from "./controls/Zoom2Extent";
import Identifier from "./controls/Identifier";
import LayerSwitcherControl from "./controls/LayerSwitcherControl";
import AttributeTable from "./controls/AttributeTable";
import LOISelector from "./controls/LOISelector";
import AddClassificationSurface from "./controls/AddClassificationSurface";
import RasterArea from "./controls/RasterArea";


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
                <AddClassificationSurface mapVM={mapVM}/>
                <LayerSwitcherControl mapVM={mapVM} drawerRef={mapVM?.getRightDrawerRef()}/>
                <Zoom2Extent mapVM={mapVM}/>
                <RasterArea mapVM={mapVM}/>
                <Identifier mapVM={mapVM} drawerRef={mapVM?.getRightDrawerRef()}/>
                {optOptions.isDesigner &&
                    <SymbologyControl mapVM={mapVM} drawerRef={mapVM?.getRightDrawerRef()}/>
                }
                <AttributeTable mapVM={mapVM}/>
                <LOISelector mapVM={mapVM}/>

            </React.Fragment>
        );
    }
}

export default MapToolbar;
