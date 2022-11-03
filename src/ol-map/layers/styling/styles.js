import CircleStyle from "ol/style/Circle";
import {Fill, Stroke, Style, Text} from "ol/style";

const selectedStrokeColor = "#28e0ee";
const selectedFillColor =  "#c4def6";
const image = new CircleStyle({
    radius: 7,
    fill: new Fill({color: "#fff5aa"}),
    stroke: new Stroke({color: "red", width: 2})
});
export const clusterStyle = (features, selected = false) => {
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
    return new Style({
        image: new CircleStyle({
            radius: radius,
            stroke: new Stroke({
                color: strokeColor,
                width: strokeWidth
            }),
            fill: new Fill({color: color})
        }),
        text: new Text({
            text: featureCount,
            font: fontSize + "px sans-serif",
            fill: new Fill({
                color: "#fff"
            }),
            stroke: new Stroke({
                color: "rgb(0, 0, 0)",
                width: 3
            })
        })
    });
};
export const styles = {
    "Point": new Style({
        image: image
    }),
    "LineString": new Style({
        stroke: new Stroke({
            color: "blue",
            width: 1
        })
    }),
    "MultiLineString": new Style({
        stroke: new Stroke({
            color: "blue",
            width: 1
        })
    }),
    "MultiPoint": new Style({
        image: image
    }),
    "MultiPolygon": new Style({
        stroke: new Stroke({
            color: "yellow",
            width: 1
        }),
        fill: new Fill({
            color: "rgba(255, 255, 0, 0.3)"
        })
    }),
    "Polygon": new Style({
        stroke: new Stroke({
            color: "green",
            lineDash: [4],
            width: 3
        }),
        fill: new Fill({
            color: "rgba(0, 255, 0,0.3)"
        })
    }),
    "LinearRing": new Style({
        stroke: new Stroke({
            color: "blue",
            lineDash: [4],
            width: 3
        }),
    }),
    "GeometryCollection": new Style({
        stroke: new Stroke({
            color: "magenta",
            width: 2
        }),
        fill: new Fill({
            color: "magenta"
        }),
        image: new CircleStyle({
            radius: 10,
            fill: null,
            stroke: new Stroke({
                color: "magenta"
            })
        })
    }),
    "Circle": new Style({
        stroke: new Stroke({
            color: "red",
            width: 2
        }),
        fill: new Fill({
            color: "rgba(255,0,0,0.2)"
        })
    })
};

const selectedImage = new CircleStyle({
    radius: 5,
    fill: new Fill({color: "#D0C921"}),
    stroke: new Stroke({color: "#b80000", width: 1})
});

export const selectionStyle = {
    "Point": new Style({
        image: selectedImage
    }),
    "MultiPoint": new Style({
        image: selectedImage
    }),
    "LineString": new Style({
        stroke: new Stroke({
            color: selectedStrokeColor,
            width: 2
        })
    }),
    "MultiLineString": new Style({
        stroke: new Stroke({
            color: selectedStrokeColor,
            width: 2
        })
    }),
    "Polygon": new Style({
        stroke: new Stroke({
            color: selectedStrokeColor,
            // lineDash: [4],
            width: 3
        })
        // fill: new Fill({
        //   color: selectedFillColor
        // })
    }),
    "MultiPolygon": new Style({
        stroke: new Stroke({
            color: selectedStrokeColor,
            width: 3
        })
        // fill: new Fill({
        //   color: selectedFillColor
        // })
    }),

    "GeometryCollection": new Style({
        stroke: new Stroke({
            color: selectedStrokeColor,
            width: 2
        }),
        fill: new Fill({
            color: selectedFillColor
        }),
        image: selectedImage
    })
};
