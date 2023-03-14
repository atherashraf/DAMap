"use strict";

require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.symbol.description.js");
var React = _interopRequireWildcard(require("react"));
var _inflate = require("ol/geom/flat/inflate");
var _Feature = _interopRequireDefault(require("ol/Feature"));
var _Polygon = _interopRequireDefault(require("ol/geom/Polygon"));
var _LineString = _interopRequireDefault(require("ol/geom/LineString"));
var _XYZ = _interopRequireDefault(require("ol/source/XYZ"));
var _MapApi = require("../utils/MapApi");
var _proj = require("ol/proj");
var _GeoJSON = _interopRequireDefault(require("ol/format/GeoJSON"));
require("../static/css/SideDrawer.css");
var _DACharts = _interopRequireDefault(require("../components/common/DACharts"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class MapControls {
  constructor(mVM) {
    _defineProperty(this, "mapVm", null);
    _defineProperty(this, "dialogRef", null);
    this.mapVm = mVM;
    this.dialogRef = mVM.getDialogBoxRef();
  }
  setCurserDisplay(curserStyle) {
    // document.getElementById("da-map").style.cursor = curserStyle;
  }
  displayFeatureInfo(evt, mapVm, targetElem) {
    let me = this;
    me.addAccordionsToRightDraw(targetElem);
    let map = mapVm.map;
    let pixel = evt.pixel;
    let coord = evt.coordinate;
    const features = [];
    let projCode = map.getView().getProjection().getCode();
    if (projCode === 'EPSG:3857') {
      coord = (0, _proj.transform)(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    }
    map.forEachFeatureAtPixel(pixel, function (feature, lyr) {
      feature['layer_name'] = lyr.get('name');
      feature['layer_title'] = lyr.get('title');
      features.push(feature);
    });
    me.getRasterPixelValue(coord, mapVm, targetElem);
    if (features.length > 0) {
      let vectorSource = mapVm.getSelectionLayer().getSource();
      vectorSource.clear();
      let feature = features[0];
      let gType = feature.getGeometry().getType();
      if (gType === 'Polygon' && feature.flatCoordinates_) {
        const inflatedCoordinates = (0, _inflate.inflateCoordinatesArray)(feature.getFlatCoordinates(),
        // flat coordinates
        0,
        // offset
        feature.getEnds(),
        // geometry end indices
        2 // stride
        );

        const polygonFeature = new _Feature.default(new _Polygon.default(inflatedCoordinates));
        polygonFeature.setProperties(feature.getProperties());
        vectorSource.addFeatures([polygonFeature]);
      } else if (gType === 'LineString' && feature.flatCoordinates_) {
        const inflatedCoordinates = (0, _inflate.inflateCoordinatesArray)(feature.getFlatCoordinates(),
        // flat coordinates
        0,
        // offset
        feature.getEnds(),
        // geometry end indices
        2 // stride
        );

        const lineFeature = new _Feature.default(new _LineString.default(inflatedCoordinates[0]));
        lineFeature.setProperties(feature.getProperties());
        vectorSource.addFeatures([lineFeature]);
      }
      let row = '';
      for (let key in feature.getProperties()) {
        row = row + key + ":  " + feature.get(key) + " , ";
      }
      // alert(row || '&nbsp');
      me.showJsonDataInHTMLTable(feature.getProperties(), 'v', targetElem);
      me.getFeatureDetailFromDB(feature, mapVm, targetElem);
    } else {
      // alert('&nbsp;');
    }
  }
  getFeatureDetailFromDB(feature, mapVm, targetElem) {
    let me = this;
    let row = feature.getProperties();
    mapVm.getApi().get(_MapApi.MapAPIs.DCH_FEATURE_DETAIL, {
      uuid: feature['layer_name'],
      col_name: 'id',
      col_val: row['id']
    }).then(payload => {
      if (payload) {
        payload['layer'] = feature['layer_title'];
        me.showJsonDataInHTMLTable(payload, 'v', targetElem);
      } else {
        me.showJsonDataInHTMLTable(row, 'v', targetElem);
      }
    });
  }
  getRasterPixelValue(coord, mapVM, targetElem) {
    let me = this;
    Object.keys(mapVM.daLayers).forEach(key => {
      const lyr = mapVM.daLayers[key].layer;
      if (lyr.getSource() instanceof _XYZ.default) {
        let layer_name = lyr.get('name');
        let layer_title = lyr.get('title');
        mapVM.getApi().get(_MapApi.MapAPIs.DCH_LAYER_PIXEL_VALUE, {
          uuid: layer_name,
          long: coord[0],
          lat: coord[1]
        }).then(payload => {
          if (payload) {
            let obj = {
              'layer': layer_title,
              'value': payload
            };
            me.showJsonDataInHTMLTable(obj, 'raster', targetElem);
          }
        });
      }
    });
  }
  getRasterAreaFromDB(polygonJsonStr, rasterLayers, mapVM, targetElem) {
    let me = this;
    let layer_name = rasterLayers[0].get('name');
    mapVM.getApi().get(_MapApi.MapAPIs.DCH_RASTER_AREA, {
      uuid: layer_name,
      geojson_str: polygonJsonStr
    }).then(payload => {
      if (payload) {
        // payload = JSON.parse(payload);
        me.showAreaInRightDraw(payload, targetElem);
        // alert(payload)
        // let obj = {'layer': layer_title, 'value': payload}
        // me.showJsonDataInHTMLTable(obj, 'raster');
      } else {}
    });
  }
  showJsonDataInHTMLTable(myObj, lyrType, targetElem) {
    let table = "<table> ";
    for (let key in myObj) {
      table += "<tr><td>" + key.toUpperCase() + "</td> <td>" + myObj[key] + "</td></tr>";
    }
    table += "</table>";
    let acc = document.getElementsByClassName("accordion");
    let index = 1;
    if (lyrType === 'raster') {
      index = 0;
    }
    if (acc.length > 0) {
      acc[index].innerHTML = myObj['layer'];
      acc[index].nextElementSibling.innerHTML = table;
    } else {
      targetElem.innerHTML = table;
    }
  }
  addAccordionsToRightDraw(htmlElem) {
    let div = document.createElement("div");
    let accordian1 = "<button class=\"accordion\">Raster Layer</button>\n" + "<div class=\"panel\">No Raster Layer Clicked</div>";
    div.append(accordian1);
    let accordian2 = "<button class=\"accordion\"> Vector Layer</button>\n" + "<div class=\"panel\">For values clcik on feature, please</div>";
    div.append(accordian2);
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
  getRasterLayers(mapVM) {
    const rasterLayers = [];
    Object.keys(mapVM.daLayers).forEach(key => {
      const lyr = mapVM.daLayers[key].layer;
      if (lyr.getSource() instanceof _XYZ.default) {
        rasterLayers.push(lyr);
      }
    });
    return rasterLayers;
  }
  getRasterAreaFromPolygon(mapVM, targetElem, feature) {
    const me = this;
    const rasterLayers = me.getRasterLayers(mapVM);
    let writer = new _GeoJSON.default();
    let polygonJsonStr = writer.writeFeatures([feature]);
    console.log(polygonJsonStr);
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
      table += "<tr><td>" + obj['pixel'] + "</td> <td>" + obj['area'] + "</td></tr>";
    }
    table += "</table>";
    div.append(table);
    let footr = '<div class="footer_div"><button id="btnShowChart" type="button" class="myButton">Show Chart</button></div>';
    div.append(footr);
    targetElem.innerHTML = div.innerText;
    // targetElem.innerHTML = table;
    const data = arrData.map(row => ({
      name: row.pixel,
      y: row.area
    }));
    document.getElementById("btnShowChart").onclick = () => {
      me.mapVm.getDialogBoxRef().current.openDialog({
        "title": "Area Chart",
        "content": /*#__PURE__*/React.createElement("div", {
          style: {
            width: 600
          }
        }, /*#__PURE__*/React.createElement(_DACharts.default, {
          chartData: data
        })),
        "actions": /*#__PURE__*/React.createElement("p", null)
      });
    };
  }
}
var _default = MapControls;
exports.default = _default;