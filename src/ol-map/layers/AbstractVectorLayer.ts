import MapVM from "../models/MapVM";
import VectorLayer from "ol/layer/Vector";
import {Fill, Stroke, Style} from "ol/style";
import autoBind from "auto-bind";
import Api, {APIs} from "../../Api";
import {Feature} from "ol";
import {styles} from "./styles";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTile from 'ol/source/VectorTile';
import VectorSource from "ol/source/Vector";
import {DAFeatureStyle, DAGeomStyle, ILayerInfo} from "../utils/TypeDeclaration";


class AbstractVectorLayer {
    dataSource: VectorTile;
    layer: VectorLayer<any> | VectorTileLayer;
    layerInfo: ILayerInfo;
    style: DAFeatureStyle;
    mapVM: MapVM;
    uuid: string;
    features: any[];

    constructor(info: ILayerInfo, mapVM: MapVM) {
        autoBind(this);
        this.layerInfo = info;
        this.mapVM = mapVM;
        this.uuid = info && "uuid" in info && info["uuid"];
        this.style = info && "style" in info && info["style"];
        this.setLayer();
        this.layer && this.mapVM.getMap().addLayer(this.layer)
    }

    getLayerTitle(): string {
        return this.layer.get("title");
    }

    getLayerId(): string {
        return this.uuid;
    }

    setLayer() {

    }

    async getLayerExtent() {
        const extent = await Api.get(APIs.DCH_LAYER_EXTENT, {uuid: this.getLayerId()});
        return extent;

    }

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

    setStyle(style: DAFeatureStyle) {
        this.style = style;
        this.refreshLayer();
    }

    createOLStyle(feature: Feature, style: DAGeomStyle = null) {
        const geomType = feature.getGeometry().getType();
        let featureStyle: Style
        if (style) {
            switch (geomType) {
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
                case "MultiLineString":
                case "LineString":
                    featureStyle = new Style({
                        stroke: new Stroke({
                            color: style.strokeColor,
                            width: style.strokeWidth
                        })
                    });
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

export default AbstractVectorLayer;
