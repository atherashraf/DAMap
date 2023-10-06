import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import MapVM from "../models/MapVM";
import autoBind from "auto-bind";
import {Style} from "ol/style";
import {IFeatureStyle, IGeoJSON} from "../TypeDeclaration";
import {Feature} from "ol";
import StylingUtils from "./styling/StylingUtils";
import GeoJSON from "ol/format/GeoJSON";
import {WKT} from "ol/format";

interface IOverLayVectorInfo {
    uuid: string  // use mapVM.generateUUID()
    title: string
    style: IFeatureStyle
}

class OverlayVectorLayer {
    olLayer: VectorLayer<VectorSource>;
    mapVM: MapVM;
    layerInfo: IOverLayVectorInfo

    //@ts-ignore
    constructor(info: IOverLayVectorInfo, mapVM: MapVM) {
        this.mapVM = mapVM;
        this.layerInfo = info
        autoBind(this);
        this.olLayer = this.createLayer();
        this.mapVM.addOverlayLayer(this);
    }

    createLayer() {
        // const title = title;
        return new VectorLayer({
            // @ts-ignore
            title: this.title,
            displayInLayerSwitcher: true,
            source: new VectorSource(),
            //@ts-ignore
            style: this.vectorStyleFunction,
            zIndex: 1000,
        });

    }

    addGeojsonFeature(geojson: IGeoJSON, clearPreviousSelection: boolean = true) {
        if (clearPreviousSelection) {
            this.clearSelection();
        }
        const features = new GeoJSON({
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
        }).readFeatures(geojson);
        this.getSource().addFeatures(features);
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
}

export default OverlayVectorLayer;
