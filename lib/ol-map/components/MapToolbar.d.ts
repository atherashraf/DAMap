import "../static/css/OlControl.css";
import { Control } from "ol/control";
import { IMapToolbarProps } from "../TypeDeclaration";
declare class MapToolbar extends Control {
    /**
     * @param {Object} [optOptions] Control options.
     */
    constructor(optOptions: IMapToolbarProps);
}
export default MapToolbar;
