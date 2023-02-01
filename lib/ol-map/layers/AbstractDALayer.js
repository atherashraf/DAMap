var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Fill, Stroke, Style } from "ol/style";
import autoBind from "auto-bind";
import { MapAPIs } from "../utils/MapApi";
import { styles } from "./styling/styles";
import { getPointShapes } from "../components/styling/forms/symbolizer/PointSymbolizer";
class AbstractDALayer {
    constructor(info, mapVM) {
        autoBind(this);
        this.layerInfo = info;
        this.mapVM = mapVM;
        this.uuid = info && "uuid" in info && info["uuid"];
        this.style = info && "style" in info && info["style"];
        this.setLayer();
        this.layer && this.mapVM.getMap().addLayer(this.layer);
    }
    getExtent() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.extent) {
                this.extent = yield this.mapVM.getApi().get(MapAPIs.DCH_LAYER_EXTENT, { uuid: this.getLayerId() });
            }
            return this.extent;
        });
    }
    getGeomType() {
        return this.layerInfo.geomType;
    }
    getDataModel() {
        return this.layerInfo.dataModel;
    }
    getCategory() {
        return this.layerInfo.category;
    }
    getLayerTitle() {
        return this.layer.get("title");
    }
    getLayerId() {
        return this.uuid;
    }
    setLayer() {
    }
    // async getLayerExtent() {
    //     const extent = await this.mapVM.getApi().get(APIs.DCH_LAYER_EXTENT, {uuid: this.getLayerId()});
    //     return extent;
    //
    // }
    setDataSource() {
    }
    getOlLayer() {
        return this.layer;
    }
    refreshLayer() {
        this.layer.getSource().refresh();
    }
    getDataSource() {
        if (!this.dataSource)
            this.setDataSource();
        return this.dataSource;
    }
    setStyle(style) {
        this.style = style;
        this.refreshLayer();
    }
    createOLStyle(feature, style = null) {
        const geomType = feature.getGeometry().getType();
        let featureStyle;
        if (style) {
            switch (geomType) {
                case "Point":
                case "MultiPoint":
                    featureStyle = getPointShapes(style);
                    break;
                case "Polygon":
                case "MultiPolygon":
                    featureStyle = new Style({
                        stroke: new Stroke({
                            color: style.strokeColor,
                            width: style.strokeWidth
                        }),
                        fill: new Fill({
                            color: style.fillColor //"rgba(255, 255, 0, 0.1)"
                        })
                    });
                    break;
                case "MultiLineString":
                case "LineString":
                    featureStyle = new Style({
                        stroke: new Stroke({
                            color: style.strokeColor,
                            width: style.strokeWidth
                        })
                    });
                    break;
            }
        }
        else {
            featureStyle = styles[geomType];
        }
        return featureStyle;
    }
    styleFunction(feature, resolution) {
        return styles[feature.getGeometry().getType()];
    }
}
export default AbstractDALayer;
