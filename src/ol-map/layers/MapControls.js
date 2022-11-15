import {inflateCoordinatesArray} from "ol/geom/flat/inflate";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";
import XYZ from 'ol/source/XYZ'
import {MapAPIs} from "../utils/MapApi";
import {transform} from 'ol/proj';

class MapControls {
    mapVm = null;
    dialogRef = null;

    constructor(mVM) {
        this.mapVm = mVM;
        this.dialogRef = mVM.getDialogBoxRef()

    }

    setCurserDisplay(curserStyle) {
        document.getElementById("da-map").style.cursor = curserStyle;
    }

    displayFeatureInfo(evt, mapVm, targetElem) {
        let me = this;
        let map = mapVm.map;
        let pixel = evt.pixel;
        let coord = evt.coordinate;
        const features = [];
        let projCode = map.getView().getProjection().getCode();
        if (projCode === 'EPSG:3857') {
            coord = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        }
        let rasterLayers = [];
        map.forEachLayerAtPixel(pixel, function (layer, pxl) {
            if (layer.getSource() instanceof XYZ)
                rasterLayers.push(layer);
        });
        if (rasterLayers.length > 0) {
            me.getPixelValueFromDB(coord, rasterLayers, mapVm, targetElem)
        }
        map.forEachFeatureAtPixel(pixel, function (feature, lyr) {
            feature['layer_name'] = lyr.get('name');
            features.push(feature);
        });
        if (features.length > 0) {
            let vectorSource = mapVm.getSelectionLayer().getSource();
            vectorSource.clear();
            let feature = features[0];
            let gType = feature.getGeometry().getType()
            if (gType === 'Polygon' && feature.flatCoordinates_) {
                const inflatedCoordinates = inflateCoordinatesArray(
                    feature.getFlatCoordinates(), // flat coordinates
                    0, // offset
                    feature.getEnds(), // geometry end indices
                    2, // stride
                )
                const polygonFeature = new Feature(new Polygon(inflatedCoordinates));
                polygonFeature.setProperties(feature.getProperties())
                vectorSource.addFeatures([polygonFeature]);
            } else if (gType === 'LineString' && feature.flatCoordinates_) {
                const inflatedCoordinates = inflateCoordinatesArray(
                    feature.getFlatCoordinates(), // flat coordinates
                    0, // offset
                    feature.getEnds(), // geometry end indices
                    2, // stride
                )
                const lineFeature = new Feature(new LineString(inflatedCoordinates[0]));
                lineFeature.setProperties(feature.getProperties())
                vectorSource.addFeatures([lineFeature]);
            }
            let row = '';
            for (let key in feature.getProperties()) {
                row = row + key + ":  " + feature.get(key) + " , "
            }
            // alert(row || '&nbsp');
            // me.getFeatureDetailFromDB(row, feature['layer_name'], mapVm);
            me.showJsonDataInHTMLTable(feature.getProperties(), targetElem);

        } else {
            // alert('&nbsp;');
        }
    };

    // getFeatureDetailFromDB(row, layer_name, mapVm) {
    //     mapVm.getApi().get(MapAPIs.DCH_FEATURE_DETAIL, {uuid: layer_name, col_name: '', col_val: ''})
    //         .then((payload) => {
    //             if (payload) {
    //                 console.log("Feature information", payload);
    //             } else {
    //
    //             }
    //         });
    //
    // }

    getPixelValueFromDB(coord, rasterLayers, mapVM, targetElem) {
        let me = this;
        let layer_name = rasterLayers[0].get('name');
        let layer_title = rasterLayers[0].get('title');
        mapVM.getApi().get(MapAPIs.DCH_LAYER_PIXEL_VALUE, {uuid: layer_name, long: coord[0], lat: coord[1]})
            .then((payload) => {
                if (payload) {
                    let obj = {'layer': layer_title, 'value': payload}
                    me.showJsonDataInHTMLTable(obj, targetElem);
                } else {

                }
            });
    }

    showJsonDataInHTMLTable(myObj, htmlElem) {
        let text = "<table style='color: black; width: 100%;padding: 5px'> <caption><h2>FEATURE DETAIL</h2></caption>"
        for (let key in myObj) {
            text += "<tr><td style='border: 1px solid black;font-weight: normal; padding: 2px'>" + key.toUpperCase() + "</td> <td style='border: 1px solid black'>" + myObj[key] + "</td></tr>";
        }
        text += "</table>"
        htmlElem.innerHTML = text;
    }
}

export default MapControls;
