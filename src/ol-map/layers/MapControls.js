import * as React from "react";
import { inflateCoordinatesArray } from "ol/geom/flat/inflate";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";
import XYZ from "ol/source/XYZ";
import { MapAPIs } from "../utils/MapApi";
import { transform } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";

import "../static/css/SideDrawer.css";
import DAChart from "../components/common/DACharts";

class MapControls {
    mapVm = null;
    dialogRef = null;

    constructor(mVM) {
        this.mapVm = mVM;
        this.dialogRef = mVM.getDialogBoxRef();
    }

    setCurserDisplay(curserStyle) {
        // document.getElementById("da-map").style.cursor = curserStyle;
    }

    displayFeatureInfo(evt, mapVm, targetElem) {
        const me = this;
        me.addAccordionsToRightDraw(targetElem);
        let map = mapVm.map;
        let pixel = evt.pixel;
        let coord = evt.coordinate;
        const features = [];
        let projCode = map.getView().getProjection().getCode();
        if (projCode === "EPSG:3857") {
            coord = transform(evt.coordinate, "EPSG:3857", "EPSG:4326");
        }

        // Handle vector features
        map.forEachFeatureAtPixel(pixel, function (feature, lyr) {
            feature["layer_name"] = lyr.get("name");
            feature["layer_title"] = lyr.get("title");
            features.push(feature);
        });

        // Handle XYZ layer pixel value retrieval
        me.getRasterPixelValue(coord, mapVm, targetElem);

        if (features.length > 0) {
            me.processVectorFeatures(features, mapVm, targetElem);
        }
    }

    processVectorFeatures(features, mapVm, targetElem) {
        const me = this;
        let vectorSource = mapVm.selectionLayer.getOlLayer()?.getSource();
        vectorSource.clear();

        let feature = features[0];
        if (feature["layer_name"] === "weather_data") {
            feature = feature.getProperties().features[0];
        }
        let gType = feature.getGeometry().getType();
        if (gType === "Polygon" && feature.flatCoordinates_) {
            const inflatedCoordinates = inflateCoordinatesArray(
                feature.getFlatCoordinates(), // flat coordinates
                0, // offset
                feature.getEnds(), // geometry end indices
                2 // stride
            );
            const polygonFeature = new Feature(new Polygon(inflatedCoordinates));
            polygonFeature.setProperties(feature.getProperties());
            vectorSource.addFeatures([polygonFeature]);
        } else if (gType === "LineString" && feature.flatCoordinates_) {
            const inflatedCoordinates = inflateCoordinatesArray(
                feature.getFlatCoordinates(), // flat coordinates
                0, // offset
                feature.getEnds(), // geometry end indices
                2 // stride
            );
            const lineFeature = new Feature(new LineString(inflatedCoordinates[0]));
            lineFeature.setProperties(feature.getProperties());
            vectorSource.addFeatures([lineFeature]);
        }

        me.showJsonDataInHTMLTable(feature.getProperties(), "v", targetElem);
        if (feature.hasOwnProperty("layer_name")) {
            me.getFeatureDetailFromDB(feature, mapVm, targetElem);
        }
    }

    getFeatureDetailFromDB(feature, mapVm, targetElem) {
        try {
            const me = this;
            let row = feature.getProperties();
            const uuid = feature["layer_name"];
            const daLayer = mapVm.getDALayer(uuid);
            if (daLayer.layerInfo.format !== "WFS") {
                mapVm
                    .getApi()
                    .get(MapAPIs.DCH_FEATURE_DETAIL, {
                        uuid: feature["layer_name"],
                        col_name: "id",
                        col_val: row["id"],
                    })
                    .then((payload) => {
                        if (payload) {
                            payload["layer"] = feature["layer_title"];
                            me.showJsonDataInHTMLTable(payload, "v", targetElem);
                        } else {
                            me.showJsonDataInHTMLTable(row, "v", targetElem);
                        }
                    });
            }
        } catch (e) {
            console.error(e);
        }
    }

    getRasterPixelValue(coord, mapVM, targetElem) {
        let me = this;
        Object.keys(mapVM.xyzLayer).forEach((key) => {
            const olLayer = mapVM.xyzLayer[key].olLayer;
            if (olLayer.getSource() instanceof XYZ) {
                let layer_name = olLayer.get("name");
                let layer_title = olLayer.get("title");
                mapVM
                    .getApi()
                    .get(MapAPIs.DCH_LAYER_PIXEL_VALUE, {
                        uuid: layer_name,
                        long: coord[0],
                        lat: coord[1],
                    })
                    .then((payload) => {
                        if (payload) {
                            let obj = { layer: layer_title, value: payload };
                            me.showJsonDataInHTMLTable(obj, "raster", targetElem);
                        }
                    });
            }
        });
    }

    getRasterAreaFromDB(polygonJsonStr, rasterLayers, mapVM, targetElem) {
        let me = this;
        let layer_name = rasterLayers[0].get("name");
        mapVM
            .getApi()
            .get(MapAPIs.DCH_RASTER_AREA, {
                uuid: layer_name,
                geojson_str: polygonJsonStr,
            })
            .then((payload) => {
                if (payload) {
                    me.showAreaInRightDraw(payload, targetElem);
                }
            });
    }

    showJsonDataInHTMLTable(myObj, lyrType, targetElem) {
        let table = "<table> ";
        for (let key in myObj) {
            table +=
                "<tr><td>" +
                key.toUpperCase() +
                "</td> <td>" +
                myObj[key] +
                "</td></tr>";
        }
        table += "</table>";
        let acc = document.getElementsByClassName("accordion");
        let index = 1;
        if (lyrType === "raster") {
            index = 0;
        }
        if (acc.length > 0) {
            acc[index].innerHTML = myObj["layer"];
            acc[index].nextElementSibling.innerHTML = table;
        } else {
            targetElem.innerHTML = table;
        }
    }

    addAccordionsToRightDraw(htmlElem) {
        let div = document.createElement("div");
        let accordian1 =
            '<button class="accordion">Raster Layer</button>\n' +
            '<div class="panel">No Raster Layer Clicked</div>';
        let accordian2 =
            '<button class="accordion"> Vector Layer</button>\n' +
            '<div class="panel">For values clcik on feature, please</div>';
        div.append(accordian1);
        div.append(accordian2);
        htmlElem.innerHTML = div.innerText;
        var acc = document.getElementsByClassName("accordion");
        var i;
        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });
        }
    }

    getRasterLayers(mapVM) {
        const rasterLayers = [];
        Object.keys(mapVM.xyzLayer).forEach((key) => {
            const olLayer = mapVM.xyzLayer[key].olLayer;
            if (olLayer.getSource() instanceof XYZ) {
                rasterLayers.push(olLayer);
            }
        });
        return rasterLayers;
    }

    getRasterAreaFromPolygon(mapVM, targetElem, feature) {
        const me = this;
        const rasterLayers = me.getRasterLayers(mapVM);
        let writer = new GeoJSON();
        let polygonJsonStr = writer.writeFeatures([feature]);
        if (rasterLayers.length > 0) {
            me.getRasterAreaFromDB(polygonJsonStr, rasterLayers, mapVM, targetElem);
        }
    }

    showAreaInRightDraw(arrData, targetElem) {
        let me = this;
        let div = document.createElement("div");
        let table = "<table><tr><th>Class</th><th>Area (m^2)</th></tr> ";
        for (let i = 0; i < arrData.length; i++) {
            let obj = arrData[i];
            table +=
                "<tr><td>" + obj["pixel"] + "</td> <td>" + obj["area"] + "</td></tr>";
        }
        table += "</table>";
        div.append(table);
        let footr =
            '<div class="footer_div"><button id="btnShowChart" type="button" class="myButton">Show Chart</button></div>';
        div.append(footr);
        targetElem.innerHTML = div.innerText;
        const data = arrData.map((row) => ({
            name: row.pixel,
            y: row.area,
        }));
        document.getElementById("btnShowChart").onclick = () => {
            me.mapVm.getDialogBoxRef().current.openDialog({
                title: "Area Chart",
                content: (
                    <div style={{ width: 600 }}>
                        <DAChart chartData={data} />
                    </div>
                ),
                actions: <p />,
            });
        };
    }
}

export default MapControls;
