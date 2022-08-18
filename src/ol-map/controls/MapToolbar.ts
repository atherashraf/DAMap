import {Control} from "ol/control";

class MapToolbar extends Control {
    /**
     * @param {Object} [optOptions] Control options.
     */
    constructor(optOptions: any) {
        const options = optOptions || {};
        const element = document.createElement('nav');
        element.className = 'ol-control';
        element.style.left = "3.5em"
        element.style.top = "0.5em"
        element.style.display = "flex"
        super({
            "element": element,
            "target": options.target,
        });
        const mapVM = optOptions.mapVM
        const btnZoomToExtent = this.createButton("E", "Zoom to Extent", () => {
            mapVM.zoomToFullExtent()
            // CommonUtils.showSnackbar("Adjusting Map Extent")
        });
        element.appendChild(btnZoomToExtent)

        const btnClear = this.createButton("C", "Clear Selected Feature",
            () => alert("working..."))
        element.appendChild(btnClear);


    }

    createButton(innerHTML: any, title: string, callback: Function): HTMLElement {
        const button = document.createElement('button');
        button.innerHTML = innerHTML;
        button.title = "Clear Selected Feature"
        button.style.height = "32px";
        button.style.width = "32px";

        button.addEventListener('click', () => {
            callback()
        });
        return button
    }


}

export default MapToolbar;
