import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import MapVM from "../../models/MapVM";
import autoBind from "auto-bind";
import {Style} from "ol/style";
import {IFeatureStyle, IGeoJSON} from "../../TypeDeclaration";
import {Feature} from "ol";
import StylingUtils from "../styling/StylingUtils";
import GeoJSON from "ol/format/GeoJSON";
import {WKT} from "ol/format";
import AbstractOverlayLayer from "./AbstractOverlayLayer";

// import _ from "../../utils/lodash";

export interface IOverLayVectorInfo {
    uuid: string  // use mapVM.generateUUID()
    title: string
    style: IFeatureStyle
    geomType?: "Polygon" | "LineString" | "Point"
}

class OverlayVectorLayer extends AbstractOverlayLayer {
    olLayer: VectorLayer<VectorSource>;
    mapVM: MapVM;
    layerInfo: IOverLayVectorInfo

    //@ts-ignore
    constructor(info: IOverLayVectorInfo, mapVM: MapVM) {
        super()
        this.mapVM = mapVM;
        this.layerInfo = info
        autoBind(this);
        this.olLayer = this.createLayer();
        this.mapVM.addOverlayLayer(this);
        const gtype = this.getGeometryType()
        // console.log("geom type", gtype)
        StylingUtils.addLegendGraphic(this.olLayer, this.layerInfo.style, gtype)
    }

    createLayer() {
        // const title = title;
        return new VectorLayer({
            // @ts-ignore
            name: this.layerInfo.uuid,
            title: this.layerInfo.title,
            displayInLayerSwitcher: true,
            source: new VectorSource(),
            //@ts-ignore
            style: this.vectorStyleFunction,
            zIndex: 1000,
        });

    }

    getFeatures() {
        super.getFeatures();
        return this.getSource()?.getFeatures() || []
    }

    addGeojsonFeature(geojson: IGeoJSON, clearPreviousSelection: boolean = true) {
        if (clearPreviousSelection) {
            this.clearSelection();
        }
        const features = new GeoJSON({
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
        }).readFeatures(geojson);
        // @ts-ignore
        this.getSource().addFeatures(features);
    }

    getGeometryType(): string {
        if (this.layerInfo.geomType) {
            return this.layerInfo.geomType
        } else {
            const features = this.getFeatures()
            // @ts-ignore
            return features.length > 0 ? features[0]?.getGeometry()?.getType().toString() : "Polygon";
        }
    }

    addWKTFeature(wkt: string, clearPreviousSelection: boolean = true) {
        if (clearPreviousSelection) {
            this.clearSelection();
        }
        const features = new WKT().readFeatures(wkt);
        this.getSource().addFeatures(features);
    }

    vectorStyleFunction(feature: Feature): Style {
        return StylingUtils.vectorStyleFunction(feature, this.layerInfo.style);
    }

    zoomToFeatures() {
        if (this.getSource().getFeatures().length > 0) {
            const extent = this.getSource().getExtent();
            this.mapVM.zoomToExtent(extent);
        } else {
            this.mapVM.showSnackbar("Please select feature before zoom to");
        }
    }

    clearSelection() {
        this.getSource().clear();
    }

    getSource(): VectorSource {
        //@ts-ignore
        return this.getOlLayer().getSource();
    }

    getOlLayer(): VectorLayer<VectorSource> {
        return this.olLayer;
    }

    getFeaturesById() {
        super.getFeaturesById();
    }

    toGeoJson() {
        const geojsonFormat = new GeoJSON();
        const features = this.getFeatures()
        return geojsonFormat.writeFeaturesObject(features, {
            featureProjection: 'EPSG:3857', // Change the projection to match your needs
        });
    }

    // openAttributeTable(){
    //     const features = this.getFeatures()
    //     const columns: Column[] = []
    //     const rows: Row[] = []
    //     features?.forEach((feature: Feature, index) => {
    //         const id = feature.getId()
    //         const properties = feature.getProperties()
    //         if (index === 0) {
    //             Object.keys(properties).forEach((key) => {
    //                 columns.push({
    //                     disablePadding: false,
    //                     id: key,
    //                     label: key,
    //                     type: _.checkPremitivesType(properties[key])
    //                 })
    //             })
    //         }
    //         // rows.push(_.cloneObjectWithoutKeys(properties, ["geometry"]))
    //         //@ts-ignore
    //         rows.push({...properties, rowId: parseFloat(id)})
    //     })
    //     this.createAttributeTable(columns, rows, ['id'], tableHeight, daGridRef);
    // }
}

export default OverlayVectorLayer;
