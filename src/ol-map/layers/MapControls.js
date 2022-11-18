import {inflateCoordinatesArray} from "ol/geom/flat/inflate";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";
import XYZ from 'ol/source/XYZ'
import {MapAPIs} from "../utils/MapApi";
import {transform} from 'ol/proj';
import "../static/css/SideDrawer.css";

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
        me.addAccordiansToRightDraw(targetElem);
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
            feature['layer_title'] = lyr.get('title');
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
            me.showJsonDataInHTMLTable(feature.getProperties(), 'v');
            me.getFeatureDetailFromDB(feature, mapVm, targetElem);
        } else {
            // alert('&nbsp;');
        }
    };

    getFeatureDetailFromDB(feature, mapVm, targetElem) {
        let me = this;
        let row = feature.getProperties()
        mapVm.getApi().get(MapAPIs.DCH_FEATURE_DETAIL, {
            uuid: feature['layer_name'],
            col_name: 'id',
            col_val: row['id']
        }).then((payload) => {
            if (payload) {
                payload['layer'] = feature['layer_title'];
                me.showJsonDataInHTMLTable(payload, 'v');
            } else {
                me.showJsonDataInHTMLTable(row, 'v');
            }
        });

    }

    getPixelValueFromDB(coord, rasterLayers, mapVM, targetElem) {
        let me = this;
        let layer_name = rasterLayers[0].get('name');
        let layer_title = rasterLayers[0].get('title');
        mapVM.getApi().get(MapAPIs.DCH_LAYER_PIXEL_VALUE, {uuid: layer_name, long: coord[0], lat: coord[1]})
            .then((payload) => {
                if (payload) {
                    let obj = {'layer': layer_title, 'value': payload}
                    me.showJsonDataInHTMLTable(obj, 'raster');
                } else {

                }
            });
    }

    showJsonDataInHTMLTable(myObj, lyrType) {
        let table = "<table> "
        for (let key in myObj) {
            table += "<tr><td>" + key.toUpperCase() + "</td> <td>" + myObj[key] + "</td></tr>";
        }
        table += "</table>"
        let acc = document.getElementsByClassName("accordion");
        let index = 1;
        if (lyrType === 'raster') {
            index = 0
        }
        acc[index].innerHTML = myObj['layer']
        acc[index].nextElementSibling.innerHTML = table
    }

    addAccordiansToRightDraw(htmlElem) {
        let div = document.createElement("div");
        let accordian1 = "<button class=\"accordion\">Raster Layer</button>\n" +
            "<div class=\"panel\">No Raster Layer Clicked</div>";
        div.append(accordian1)
        let accordian2 = "<button class=\"accordion\"> Vector Layer</button>\n" +
            "<div class=\"panel\">For values clcik on feature, please</div>";
        div.append(accordian2)
        // div.append(accordian)
        htmlElem.innerHTML = div.innerText;
        var acc = document.getElementsByClassName("accordion");
        var i;
        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                /* Toggle between adding and removing the "active" class,
                to highlight the button that controls the panel */
                this.classList.toggle("active");
                /* Toggle between hiding and showing the active panel */
                var panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });
        }
    }
}

export default MapControls;
