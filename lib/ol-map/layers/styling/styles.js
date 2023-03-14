"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = exports.selectionStyle = exports.clusterStyle = void 0;
require("core-js/modules/es.regexp.to-string.js");
var _Circle = _interopRequireDefault(require("ol/style/Circle"));
var _style = require("ol/style");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const selectedStrokeColor = "#28e0ee";
const selectedFillColor = "#c4def6";
const image = new _Circle.default({
  radius: 7,
  fill: new _style.Fill({
    color: "#fff5aa"
  }),
  stroke: new _style.Stroke({
    color: "red",
    width: 2
  })
});
const clusterStyle = function clusterStyle(features) {
  let selected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const colors = {
    "5": [72, 244, 66, 1],
    "15": [209, 244, 66, 1],
    "30": [244, 241, 66, 1],
    "50": [244, 178, 65, 1],
    "100": [244, 91, 65, 1]
  };
  const color = colors[Object.keys(colors).find(key => features.length < Number(key)) || "100"];
  const strokeColor = selected ? "#000" : "#fff";
  const strokeWidth = selected ? 2 : 1;
  const radius = 17 + features.length / 400;
  const fontSize = 13 + features.length / 1000;
  const featureCount = features.length.toString();
  return new _style.Style({
    image: new _Circle.default({
      radius: radius,
      stroke: new _style.Stroke({
        color: strokeColor,
        width: strokeWidth
      }),
      fill: new _style.Fill({
        color: color
      })
    }),
    text: new _style.Text({
      text: featureCount,
      font: fontSize + "px sans-serif",
      fill: new _style.Fill({
        color: "#fff"
      }),
      stroke: new _style.Stroke({
        color: "rgb(0, 0, 0)",
        width: 3
      })
    })
  });
};
exports.clusterStyle = clusterStyle;
const styles = {
  "Point": new _style.Style({
    image: image
  }),
  "LineString": new _style.Style({
    stroke: new _style.Stroke({
      color: "blue",
      width: 1
    })
  }),
  "MultiLineString": new _style.Style({
    stroke: new _style.Stroke({
      color: "blue",
      width: 1
    })
  }),
  "MultiPoint": new _style.Style({
    image: image
  }),
  "MultiPolygon": new _style.Style({
    stroke: new _style.Stroke({
      color: "yellow",
      width: 1
    }),
    fill: new _style.Fill({
      color: "rgba(255, 255, 0, 0.3)"
    })
  }),
  "Polygon": new _style.Style({
    stroke: new _style.Stroke({
      color: "green",
      lineDash: [4],
      width: 3
    }),
    fill: new _style.Fill({
      color: "rgba(0, 255, 0,0.3)"
    })
  }),
  "LinearRing": new _style.Style({
    stroke: new _style.Stroke({
      color: "blue",
      lineDash: [4],
      width: 3
    })
  }),
  "GeometryCollection": new _style.Style({
    stroke: new _style.Stroke({
      color: "magenta",
      width: 2
    }),
    fill: new _style.Fill({
      color: "magenta"
    }),
    image: new _Circle.default({
      radius: 10,
      fill: null,
      stroke: new _style.Stroke({
        color: "magenta"
      })
    })
  }),
  "Circle": new _style.Style({
    stroke: new _style.Stroke({
      color: "red",
      width: 2
    }),
    fill: new _style.Fill({
      color: "rgba(255,0,0,0.2)"
    })
  })
};
exports.styles = styles;
const selectedImage = new _Circle.default({
  radius: 5,
  fill: new _style.Fill({
    color: "#D0C921"
  }),
  stroke: new _style.Stroke({
    color: "#b80000",
    width: 1
  })
});
const selectionStyle = {
  "Point": new _style.Style({
    image: selectedImage
  }),
  "MultiPoint": new _style.Style({
    image: selectedImage
  }),
  "LineString": new _style.Style({
    stroke: new _style.Stroke({
      color: selectedStrokeColor,
      width: 2
    })
  }),
  "MultiLineString": new _style.Style({
    stroke: new _style.Stroke({
      color: selectedStrokeColor,
      width: 2
    })
  }),
  "Polygon": new _style.Style({
    stroke: new _style.Stroke({
      color: selectedStrokeColor,
      // lineDash: [4],
      width: 3
    })
    // fill: new Fill({
    //   color: selectedFillColor
    // })
  }),

  "MultiPolygon": new _style.Style({
    stroke: new _style.Stroke({
      color: selectedStrokeColor,
      width: 3
    })
    // fill: new Fill({
    //   color: selectedFillColor
    // })
  }),

  "GeometryCollection": new _style.Style({
    stroke: new _style.Stroke({
      color: selectedStrokeColor,
      width: 2
    }),
    fill: new _style.Fill({
      color: selectedFillColor
    }),
    image: selectedImage
  })
};
exports.selectionStyle = selectionStyle;