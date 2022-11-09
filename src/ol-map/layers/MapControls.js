import {inflateCoordinatesArray} from "ol/geom/flat/inflate";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";

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

    displayFeatureInfo(pixel, mapVm, targetElem) {
        let me = this;
        let map = mapVm.map;
        const features = [];
        // map.forEachLayerAtPixel(pixel, function (layer, pxl) {
        //     let height = (-10000 + ((pxl[0] * 256 * 256 + pxl[1] * 256 + pxl[2]) * 0.01));
        //     console.log(height);
        // }, undefined, function (layer) {
        //     return layer.getSource() == raster;
        // });
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
            me.getFeatureDetailFromDB(row, feature['layer_name']);
            me.showJsonDataInHTMLTable(feature.getProperties(), targetElem);

        } else {
            alert('&nbsp;');
        }
    };

    getFeatureDetailFromDB(row, layer_name) {
        // let url = '/get_feature_detail/?fid=' + row.id + "&layer_name=" + layer_name;
        // $.ajax({
        //     url: url,
        //     type: "GET",
        //     cors: true,
        //     crossDomain: true,
        //     success: function (data) {
        //         data = JSON.parse(data);
        //     },
        //     error: function (xhr, status, error) {
        //         alert(error);
        //     },
        // });
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
