import {Tile} from "ol/layer";
import XYZ from "ol/source/XYZ";
import MapVM from "../../models/MapVM";

export interface IXYZLayerInfo {
    title: string
    url: string
    uuid : string
    visible? : boolean
    opacity? : number
    legendURL?: string
}

class XYZLayer {
    mapVM : MapVM
    layerInfo: IXYZLayerInfo
    uuid: string
    olLayer: Tile<XYZ>
    constructor(info: IXYZLayerInfo, mapVM: MapVM) {
        this.mapVM = mapVM;
        this.layerInfo = info
        this.uuid = info.uuid ? info.uuid : MapVM.generateUUID()
        this.olLayer = this.createLayer()
        this.setLegendImage()
    }
    createLayer(): Tile<XYZ> {

        return  new Tile({
            // @ts-ignore
            title: this.layerInfo.title,
            info: "weather",
            name: this.uuid,
            source: new XYZ({
                url: this.layerInfo.url,
                // @ts-ignore
                crossOrigion: "anonymous",
            }),
            visible: this.layerInfo.visible? this.layerInfo.visible: true,
            opacity: this.layerInfo.opacity? this.layerInfo.opacity : 1,
        });
    }
    setLegendImage(){
        if(this.olLayer && this.layerInfo.legendURL){
            // this.mapVM.getApi().getFetch(this.layerInfo.legendURL)
            //@ts-ignore
            this.olLayer.legend = { sType: "src", graphic: this.layerInfo.legendURL, width:"200px", height:"25px" };
        }
    }
}

export  default XYZLayer