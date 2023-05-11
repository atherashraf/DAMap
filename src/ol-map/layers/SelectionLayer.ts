import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import MapVM from "../models/MapVM";
import {Fill, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import {IGeoJSON} from "../TypeDeclaration";
import {Feature} from "ol";
import GeoJSON from "ol/format/GeoJSON";
import autoBind from "auto-bind";
import {WKT} from "ol/format";


class SelectionLayer {
    layer: VectorLayer<VectorSource> = null
    mapVM: MapVM
    constructor(mapVM: MapVM) {
        this.mapVM = mapVM
        autoBind(this);
    }
    createSelectionLayer(){
        const title = "sel_layer";
        this.layer = new VectorLayer({
            // @ts-ignore
            title: title,
            displayInLayerSwitcher: false,
            source: new VectorSource(),
            style: this.getSelectStyle,
            zIndex: 1000
        });

        this.mapVM.addOverlayLayer(this.layer, title, title)
    }
    clearSelection(){
        this.getSource().clear()
    }
    getSelectionLayer(): VectorLayer<VectorSource> {
        if (!this.layer) {
           this.createSelectionLayer()
        }
        return this.layer
    }
    getSource(): VectorSource{
        return this.getSelectionLayer().getSource()
    }

    addGeoJson2Selection(geojson: IGeoJSON, clearPreviousSelection:boolean=true){
        if(clearPreviousSelection){
            this.clearSelection();
        }
        const features = new GeoJSON({dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'}).readFeatures(geojson)
        this.getSource().addFeatures(features)
    }

    addWKT2Selection(wkt:string, clearPreviousSelection:boolean=true){
        if(clearPreviousSelection){
            this.clearSelection();
        }
        const features = new WKT().readFeatures(wkt)
        this.getSource().addFeatures(features)
    }

    getSelectStyle(feature) {
        let g_type = feature.getGeometry().getType();
        let selStyle;
        if (!g_type) g_type = feature.f;
        if (g_type.indexOf('Point') !== -1) {
            selStyle = new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({color: 'rgba(0, 0, 0, 0.33)'}),
                    stroke: new Stroke({
                        color: [0, 0, 0], width: 1.5
                    })
                })
                // image: new ol.style.Icon({
                //     anchor: [0.5, 0.5],
                //     opacity: 1,
                //     src: '/static/assets/img/icons/flashing_circle.gif'
                // })
            });
        } else if (g_type.indexOf('LineString') !== -1) {
            selStyle = new Style({
                stroke: new Stroke({
                    color: '#d17114',
                    width: 5
                }),
            });
        } else {
            selStyle = new Style({
                fill: new Fill({
                    color: 'rgba(209, 113, 20, 0)'
                }),
                stroke: new Stroke({
                    color: '#d17114',
                    width: 3
                })
            });
        }
        return selStyle;
    }

    zoomToSelection() {
        const extent = this.getSource().getExtent()
        this.mapVM.zoomToExtent(extent)
    }
}

export default SelectionLayer
