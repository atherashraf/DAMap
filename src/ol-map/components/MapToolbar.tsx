import "../static/css/OlControl.css"
import {Control} from "ol/control";
import * as React from "react";
import {createRoot} from "react-dom/client";
import MapVM from "../models/MapVM";
import SymbologyControl from "./controls/SymbologyControl";
import {IMapToolbarProps} from "../TypeDeclaration";
import Zoom2Extent from "./controls/Zoom2Extent";
import Identifier from "./controls/Identifier";
import LayerSwitcherControl from "./controls/LayerSwitcherControl";
import AttributeTable from "./controls/AttributeTable";
import LOISelector from "./controls/LOISelector";
import AddLayer from "./controls/AddLayer";
import SaveMap from "./controls/SaveMap";
import RefreshMap from "./controls/RefreshMap";
import ClearSelection from "./controls/ClearSelection";


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
                {/*<AddClassificationSurface mapVM={mapVM}/>*/}
                <RefreshMap mapVM={mapVM} />
                {optOptions.isCreateMap && <SaveMap mapVM={mapVM}/>}
                <AddLayer mapVM={mapVM} drawerRef={mapVM?.getRightDrawerRef()}/>
                <LayerSwitcherControl mapVM={mapVM} drawerRef={mapVM?.getRightDrawerRef()}/>
                <Zoom2Extent mapVM={mapVM}/>
                {/*<RasterArea mapVM={mapVM} drawerRef={mapVM?.getRightDrawerRef()}/>*/}
                <Identifier mapVM={mapVM} drawerRef={mapVM?.getRightDrawerRef()}/>
                <ClearSelection mapVM={mapVM} />
                {optOptions.isDesigner &&
                    <SymbologyControl mapVM={mapVM} drawerRef={mapVM?.getRightDrawerRef()}/>
                }
                <AttributeTable mapVM={mapVM}/>
                {!optOptions.isDesigner &&
                    <LOISelector mapVM={mapVM}/>
                }
                {mapVM.getAdditionalToolbarButtons().map((elem: JSX.Element) => elem)}
            </React.Fragment>
        );
    }
}

export default MapToolbar;
