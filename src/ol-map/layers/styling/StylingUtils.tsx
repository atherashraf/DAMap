import {IFeatureStyle, IGeomStyle, IRule} from "../../TypeDeclaration";
import {Fill, Stroke, Style, Text} from "ol/style";
import {getPointShapes} from "../../components/styling/vector/symbolizer/PointSymbolizer";
import {styles} from "./styles";
import {Feature} from "ol";
import ol_legend_Legend from "ol-ext/legend/Legend";
import {toSize} from "ol/size";


class StylingUtils {
    static createOLStyle(geomType: string, style: IGeomStyle = null) {
        // const geomType = feature.getGeometry().getType();
        let featureStyle: Style
        if (style) {
            switch (geomType) {
                case "Point":
                case "MultiPoint":
                    featureStyle = getPointShapes(style)
                    break;
                case "Polygon":
                case"MultiPolygon":
                    featureStyle = new Style({
                        stroke: new Stroke({
                            color: style.strokeColor,
                            width: style.strokeWidth
                        }),
                        fill: new Fill({
                            color: style.fillColor   //"rgba(255, 255, 0, 0.1)"
                        })
                    });
                    break;
                case "MultiLineString":
                case "LineString":
                    featureStyle = new Style({
                        stroke: new Stroke({
                            color: style.strokeColor,
                            width: style.strokeWidth
                        })
                    });
                    break;
            }
        } else {
            // @ts-ignore
            featureStyle = styles[geomType];
        }

        return featureStyle

    }

    static vectorStyleFunction(feature: Feature, faatureStyle: IFeatureStyle): Style {
        // return styles[feature.getGeometry().getType()];
        let style: IGeomStyle;
        let rules: IRule[]
        let properties: any
        const type = faatureStyle?.type || ""
        switch (type) {
            case "single":
                style = faatureStyle["style"]["default"];
                break;
            case "multiple":
                style = faatureStyle["style"]["default"];
                rules = faatureStyle.style.rules
                properties = feature.getProperties();
                rules.forEach((rule: IRule) => {
                    if (rule.filter.field in properties && properties[rule.filter.field] == rule.filter.value) {
                        style = rule.style;
                    }
                });

                break;
            case "density":
                // style = this.style["style"]["default"];
                rules = faatureStyle.style.rules
                properties = feature.getProperties();
                rules.forEach((rule: IRule) => {
                    if (rule.filter.field in properties) {
                        const x = properties[rule.filter.field]
                        if (rule.filter.value[0] <= x && rule.filter.value[1] >= x) {
                            style = rule.style;
                        }
                    }
                });
                break;
            case "sld":
                // let layer = this.layer;
                // let prop = this.layer.getProperties()
                // if (prop.hasOwnProperty('sldStyle')) {
                //     let sldStyle = prop.sldStyle
                //
                //     // let k = new SLDStyleParser(this)
                //     // console.log(prop.sldStyle)
                // }
                break;
            default:
                break;
        }

        return this.createOLStyle(feature.getGeometry().getType(), style);
    }

    static addLegendGraphic(layer: any, featureStyle: IFeatureStyle, geomType: string) {
        const styleType = featureStyle?.type || "single";

        // const iconSize = geomType.toLowerCase().includes("point") ? [50, 30] : [20, 10]
        const iconSize = [20,10]
        switch (styleType) {
            case "single":
                const fStyle = this.createOLStyle(geomType, featureStyle?.style?.default);
                const img = ol_legend_Legend.getLegendImage({
                    feature: undefined,
                    margin: 0,
                    // properties: undefined,
                    size: toSize(iconSize),
                    textStyle: undefined,
                    title: "",
                    style: fStyle,
                    typeGeom: geomType,
                    className: ""
                });
                layer.legend = {sType: 'canvas', graphic: img}
                // this.mapVM.legendPanel.refresh()
                break;
            case "multiple":
            case "density":
                const rules = featureStyle.style.rules;
                let canvas: HTMLCanvasElement = document.createElement('canvas');
                canvas.width = 200;
                canvas.height = iconSize[1] * rules.length * 3;
                rules.forEach((rule: IRule, index) => {
                    const fStyle = this.createOLStyle(geomType, rule.style);
                    const label = new Style({
                        text: new Text({
                            text: rule.title.toString(),
                            textAlign: "left",
                            offsetX: iconSize[0]
                        })
                    })
                    canvas = ol_legend_Legend.getLegendImage({
                        feature: undefined,
                        margin: 5,
                        // properties: undefined,
                        size: toSize(iconSize),
                        textStyle: undefined,
                        title: "",
                        style: [fStyle, label],
                        typeGeom: geomType,
                        className: ""
                    }, canvas, index * (iconSize[1] + 3),);

                });
                layer.legend = {sType: 'canvas', graphic: canvas}
                // this.mapVM.legendPanel.refresh()
        }
    }
}

export default StylingUtils

