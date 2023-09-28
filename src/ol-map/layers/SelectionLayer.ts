import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import MapVM from "../models/MapVM";
import {Fill, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import {IGeoJSON} from "../TypeDeclaration";
import GeoJSON from "ol/format/GeoJSON";
import autoBind from "auto-bind";
import {WKT} from "ol/format";


class SelectionLayer {
    //@ts-ignore
    layer: VectorLayer<VectorSource>
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
        this.getSource()?.clear()
    }
    getOlLayer(): VectorLayer<VectorSource> {
        if (!this.layer) {
           this.createSelectionLayer()
        }
        return this.layer
    }
    getSource(): VectorSource | undefined{
        return this?.getOlLayer()?.getSource() || undefined
    }

    addGeoJson2Selection(geojson: IGeoJSON, clearPreviousSelection:boolean=true){
        if(clearPreviousSelection){
            this.clearSelection();
        }
        const features = new GeoJSON({dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'}).readFeatures(geojson)
        this.getSource()?.addFeatures(features)
    }

    addWKT2Selection(wkt:string, clearPreviousSelection:boolean=true){
        if(clearPreviousSelection){
            this.clearSelection();
        }
        const features = new WKT().readFeatures(wkt)
        this.getSource()?.addFeatures(features)
    }

    getSelectStyle(feature: any) {
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
        //@ts-ignore
        if(this.getSource()?.getFeatures()?.length>0) {
            const extent = this.getSource()?.getExtent()
            extent && this.mapVM.zoomToExtent(extent)
        }else{
            this.mapVM.showSnackbar("Please select feature before zoom to")
        }
    }
}

export default SelectionLayer
