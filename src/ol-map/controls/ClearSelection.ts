import {Control} from "ol/control";
import MapVM from "../MapVM";

class ClearSelectionControl extends Control {
    /**
     * @param {Object} [optOptions] Control options.
     */
    constructor(optOptions: any) {
        // super(opt_options);
        const options = optOptions || {};
        const button = document.createElement('button');
        button.innerHTML = 'C';
        button.title = "Clear Selected Feature"

        const element = document.createElement('div');
        element.className = 'ol-unselectable ol-control';
        element.style.left = "0.5em"
        element.style.top = "6.5em"
        element.appendChild(button);

        super({
            "element": element,
            "target": options.target,
        });

        button.addEventListener('click', () => this.handleClearSelection(options.mapCtrl), false);
    }

    handleClearSelection(mapCtrl: MapVM) {
        // mapCtrl.clearSelectedFeatures();
        mapCtrl.zoomToFullExtent();
    }
}

export default ClearSelectionControl
