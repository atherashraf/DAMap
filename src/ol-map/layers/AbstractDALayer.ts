import MapVM from "../models/MapVM";
import VectorLayer from "ol/layer/Vector";
import {Fill, Stroke, Style} from "ol/style";
import autoBind from "auto-bind";
import {MapAPIs} from "../utils/MapApi";
import {Feature} from "ol";
import {styles} from "./styling/styles";
import VectorTileLayer from "ol/layer/VectorTile";
import {IFeatureStyle, IGeomStyle, ILayerInfo} from "../TypeDeclaration";
import {getPointShapes} from "../components/styling/vector/symbolizer/PointSymbolizer";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image"
import SLDStyleParser from "./styling/SLDStyleParser";
import ol_legend_Legend from "ol-ext/legend/Legend";

// import Layer from "ol/layer/Layer"

class AbstractDALayer {
    dataSource: any
    layer: VectorLayer<any> | VectorTileLayer | TileLayer<any> | ImageLayer<any>;
    layerInfo: ILayerInfo;
    style: IFeatureStyle;
    mapVM: MapVM;
    uuid: string;
    extent?: number[]
    features: any[];
    urlParams: string = ""

    constructor(info: ILayerInfo, mapVM: MapVM) {
        autoBind(this);
        this.layerInfo = info;
        this.mapVM = mapVM;
        this.uuid = info && "uuid" in info && info["uuid"];
        this.style = info && "style" in info && info["style"];
        this.setLayer();
        this.layer && this.mapVM.getMap().addLayer(this.layer)
        this.layer && this.addLayerChangeEvent()
    }

    addLayerChangeEvent() {
        this.layer.on("propertychange", (e) => {
            if (e.key == "map" && e.target.values_[e.key] == null) {
                this.mapVM.removeDALayer(this.layerInfo.uuid)
            }
            if (e.key == "map" && e.oldValue == null) {
                this.mapVM.daLayers[this.layerInfo.uuid] = this
            }
        })
    }

    setSlDStyleAndLegendToLayer() {
        const type = this.style?.type || ""
        let lyr = this.layer;
        if (type === 'sld') {
            let sldObj = new SLDStyleParser(this)
            sldObj.convertSLDTextToOL(this.style["style"], lyr)
        } else {
            //@ts-ignore
            lyr.setStyle(this.styleFunction.bind(this))
            this.addLegendGraphic(lyr)
        }
    }

    addLegendGraphic(layer: any) {
        //@ts-ignore
        // this.mapVM.legendPanel.addItem({
        //     title: layer.get('title'),
        //     typeGeom: this.layerInfo.geomType,
        //     style: layer.getStyle()
        // });
        let img = ol_legend_Legend.getLegendImage({
            style: layer.getStyle(),
            typeGeom: this.layerInfo.geomType[0],
            textStyle: null
        });
        layer.legend = {sType: 'ol', graphic: img}
        this.mapVM.legendPanel.refresh()
    }

    setStyle(style: IFeatureStyle) {
        // this.mapVM.showSnackbar("Updating layer style")
        this.style = style
        this.setSlDStyleAndLegendToLayer()
        this.refreshLayer()
    }

    updateStyle() {
        // this.mapVM.showSnackbar("Updating layer style")
        // console.log("layer Info", this.layerInfo)
        if (this.layerInfo.dataModel == "V") {
            this.mapVM.getApi().get(MapAPIs.DCH_GET_STYLE, {uuid: this.uuid}).then((payload) => {
                if (payload) {
                    this.style = payload
                    this.setSlDStyleAndLegendToLayer()
                    this.refreshLayer()
                }
            })
        }
    }

    setAdditionalUrlParams(params: string) {
        this.urlParams = params
    }


    async getExtent(): Promise<number[]> {
        if (!this.extent) {
            this.extent = await this.mapVM.getApi().get(MapAPIs.DCH_LAYER_EXTENT, {uuid: this.getLayerId()});
        }
        return this.extent
    }

    getGeomType(): string[] {
        return this.layerInfo.geomType
    }

    getDataModel(): string {
        return this.layerInfo.dataModel
    }

    getCategory(): string {
        return this.layerInfo.category
    }

    getLayerTitle(): string {
        return this.layer.get("title");
    }

    getLayerId(): string {
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
        // const source = this.layer?.getSource();
        // if(source) {
        //     source.clear()
        //     source.refresh()
        // }
    }

    getDataSource() {
        if (!this.dataSource)
            this.setDataSource();

        return this.dataSource;
    }

    clearAllDataSources() {
        let source = this.layer.getSource();
        while (source) {
            source.clear()
            source = typeof source.getSource === "function" ? source.getSource() : null
        }
    }


    createOLStyle(feature: Feature, style: IGeomStyle = null) {
        const geomType = feature.getGeometry().getType();
        let featureStyle: Style
        if (style) {
            switch (geomType) {
                case "Point":
                case "MultiPoint":
                    featureStyle = getPointShapes(style)
                    break;
                case "Polygon":
                case"MultiPolygon":
                    featureStyle = new Style({
                        stroke: new Stroke({
                            color: style.strokeColor,
                            width: style.strokeWidth
                        }),
                        fill: new Fill({
                            color: style.fillColor   //"rgba(255, 255, 0, 0.1)"
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
        } else {
            featureStyle = styles[geomType];
        }

        return featureStyle

    }

    styleFunction(feature: Feature, resolution: number) {
        return styles[feature.getGeometry().getType()];
    }

    // addFeature(feature:any) {
    //     this.features.push(feature);
    // }
    //
    // addFeatures(features:any) {
    //     this.features.concat(features);
    // }
    //
    // getFeatureById(id: any) {
    //     return this.features.find((feature) => feature.properties.id.toString() === id.toString());
    // }
    //
    // getFeaturesById(ids: any) {
    //     const idSet = new Set(ids);
    //     return this.features.filter((feature) => idSet.has(feature.properties.id));
    // }
    //
    // getFeatureExtent(feature: any) {
    //     return turf.bbox(feature.geometry);
    // }
    //
    // getFeatureCentroid(feature) {
    //     return turf.centroid(feature.geometry);
    // }
    //
    // getGeoJsonFeatureCentroid(geojson) {
    //     return turf.centroid(geojson);
    // }
    //
    // // getFieldUniqueValue (fieldName) {
    // //   const source = this.layer.getSource();
    // //   const fieldValues = [];
    // //   source.getFeatures().forEach((feature) => {
    // //     const properties = feature.getProperties();
    // //     properties && properties[fieldName] && fieldValues.push(properties[fieldName]);
    // //   });
    // //   const valueSet = new Set(fieldValues);
    // //   return valueSet;
    // // }
    //
    // calculateFieldRange(fieldName) {
    //     const features = this.dataSource.getFeatures();
    //     let minVal = null, maxVal = null;
    //     features.forEach((feature, index) => {
    //         const attributes = feature.get("attributes")?.attributes;
    //         if (attributes && attributes.hasOwnProperty(fieldName)) {
    //             const val = attributes[fieldName];
    //             if (!minVal || minVal > val) minVal = val;
    //             if (!maxVal || maxVal < val) maxVal = val;
    //         }
    //     });
    //     return [minVal, maxVal];
    // }
}

export default AbstractDALayer;
