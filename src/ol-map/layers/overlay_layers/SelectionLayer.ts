import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import MapVM from "../../models/MapVM";
import {Fill, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import {IGeoJSON} from "../../TypeDeclaration";
import GeoJSON from "ol/format/GeoJSON";
import autoBind from "auto-bind";
import {WKT} from "ol/format";
import AbstractOverlayLayer from "./AbstractOverlayLayer";
import {buffer} from "ol/extent";
import StylingUtils from "../styling/StylingUtils";
// import {getPointShapes} from "../../components/styling/vector/symbolizer/PointSymbolizer";

class SelectionLayer extends AbstractOverlayLayer {
    //@ts-ignore
    olLayer: VectorLayer<VectorSource>;
    mapVM: MapVM;

    constructor(mapVM: MapVM) {
        super()
        this.mapVM = mapVM;
        autoBind(this);
    }

    createSelectionLayer() {
        const title = "sel_layer";
        this.olLayer = new VectorLayer({
            // @ts-ignore
            title: title,
            displayInLayerSwitcher: false,
            source: new VectorSource(),
            style: this.getSelectStyle,
            zIndex: 1000,
        });

        this.mapVM.addOverlayLayer(this);
    }

    clearSelection() {
        this.getSource()?.clear();
    }

    getOlLayer(): VectorLayer<VectorSource> {
        if (!this.olLayer) {
            this.createSelectionLayer();
        }
        return this.olLayer;
    }

    getSource(): VectorSource | undefined {
        return this?.getOlLayer()?.getSource() || undefined;
    }

    addGeoJson2Selection(
        geojson: IGeoJSON,
        clearPreviousSelection: boolean = true
    ) {
        if (clearPreviousSelection) {
            this.clearSelection();
        }
        const features = new GeoJSON({
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
        }).readFeatures(geojson);
        // @ts-ignore
        this.getSource()?.addFeatures(features);
    }

    addWKT2Selection(wkt: string, clearPreviousSelection: boolean = true) {
        if (clearPreviousSelection) {
            this.clearSelection();
        }
        const features = new WKT().readFeatures(wkt);
        this.getSource()?.addFeatures(features);
    }

    getSelectStyle(feature: any) {
        let g_type = feature.getGeometry().getType();
        let selStyle;
        if (!g_type) g_type = feature.f;
        if (g_type.indexOf("Point") !== -1) {
            // selStyle = getPointShapes({
            //     pointShape: "circle",
            //     pointSize: 7,
            //     fillColor: "#00000033",
            //     strokeColor: "#000000",
            //     strokeWidth: 3.5
            // })
            // const flash_icon = require("../../../static/img/circle_blink.gif")
            selStyle = new Style({
                image: new CircleStyle({
                    radius: 7,
                    displacement: [-10,0],
                    fill: new Fill({color: "#ffff00"}),
                    stroke: new Stroke({
                        color: "#481414",
                        width: 1.5,
                    }),
                }),
                // image: new Icon({
                //     anchor: [0.5, 0.5],
                //     // opacity: 1,
                //     // src: '/static/assets/img/icons/flashing_circle.gif'
                //     src: "data:image/gif;base64," + btoa(flash_icon)
                // })
            });
            StylingUtils.flash(feature, this.mapVM)
        } else if (g_type.indexOf("LineString") !== -1) {
            selStyle = new Style({
                stroke: new Stroke({
                    color: "#d17114",
                    width: 5,
                }),
            });
        } else {
            selStyle = new Style({
                fill: new Fill({
                    color: "rgba(209, 113, 20, 0)",
                }),
                stroke: new Stroke({
                    color: "#d17114",
                    width: 3,
                }),
            });
        }
        return selStyle;
    }

    getFeatures() {
        super.getFeatures();
        return this.getSource()?.getFeatures();
    }

    zoomToSelection() {
        //@ts-ignore
        if (this.getSource()?.getFeatures()?.length > 0) {
            let extent = this.getSource()?.getExtent();
            if (extent) {
                // const width = extent[2] - extent[0]
                // const height: number = extent[3] - extent[1]
                // if(width==0 || height==0){
                //     extent = buffer(extent, 2000)
                // }
                extent = buffer(extent, 2000)
                // console.log("extent", extent)
                extent && this.mapVM.zoomToExtent(extent);
            }
        } else {
            this.mapVM.showSnackbar("Please select feature before zoom to");
        }
    }
}

export default SelectionLayer;
