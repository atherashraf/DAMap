import { IFeatureStyle, IGeomStyle, IRule } from "../../TypeDeclaration";
import { Fill, Stroke, Style, Text } from "ol/style";
import { getPointShapes } from "../../components/styling/vector/symbolizer/PointSymbolizer";
import { styles } from "./styles";
import { Feature } from "ol";
//@ts-ignore
import ol_legend_Legend from "ol-ext/legend/Legend";
import { toSize } from "ol/size";
import {unByKey} from "ol/Observable";
import {getVectorContext} from "ol/render";
import {easeOut} from "ol/easing";
import CircleStyle from "ol/style/Circle";
import MapVM from "../../models/MapVM";

class StylingUtils {
  static createOLStyle(
    geomType: string,
    style: IGeomStyle | undefined = undefined
  ) {
    // const geomType = feature.getGeometry().getType();
    let featureStyle: Style | undefined = undefined;
    if (style) {
      switch (geomType) {
        case "Point":
        case "MultiPoint":
          featureStyle = getPointShapes(style);
          break;
        case "Polygon":
        case "MultiPolygon":
          featureStyle = new Style({
            stroke: new Stroke({
              color: style.strokeColor,
              width: style.strokeWidth,
            }),
            fill: new Fill({
              color: style.fillColor, //"rgba(255, 255, 0, 0.1)"
            }),
          });
          break;
        case "MultiLineString":
        case "LineString":
          featureStyle = new Style({
            stroke: new Stroke({
              color: style.strokeColor,
              width: style.strokeWidth,
            }),
          });
          break;
      }
    } else {
      // @ts-ignore
      featureStyle = styles[geomType];
    }

    return featureStyle;
  }

  static vectorStyleFunction(
    feature: Feature,
    featureStyle: IFeatureStyle
  ): Style {
    // return styles[feature.getGeometry().getType()];
    let style: IGeomStyle;
    let rules: IRule[];
    let properties: any;
    const type = featureStyle?.type || "";
    switch (type) {
      case "single":
        //@ts-ignore
        style = featureStyle["style"]["default"];
        break;
      case "multiple":
        //@ts-ignore
        style = featureStyle["style"]["default"];
        //@ts-ignore
        rules = featureStyle.style.rules;
        properties = feature.getProperties();
        rules.forEach((rule: IRule) => {
          //@ts-ignore
          if (
            //@ts-ignore
            rule?.filter?.field in properties &&
            //@ts-ignore
            properties[rule?.filter?.field] === rule?.filter?.value
          ) {
            style = rule.style;
          }
        });

        break;
      case "density":
        // style = this.style["style"]["default"];
        //@ts-ignore
        rules = featureStyle?.style?.rules;
        properties = feature.getProperties();
        rules.forEach((rule: IRule) => {
          //@ts-ignore
          if (rule?.filter?.field in properties) {
            //@ts-ignore
            const x = properties[rule?.filter?.field];
            //@ts-ignore
            if (rule?.filter?.value[0] <= x && rule?.filter?.value[1] >= x) {
              style = rule.style;
            }
          }
        });
        break;
      case "sld":
        break;
      default:
        break;
    }
    //@ts-ignore
    return this.createOLStyle(feature?.getGeometry()?.getType(), style);
  }

  static addLegendGraphic(
    layer: any,
    featureStyle: IFeatureStyle,
    geomType: string
  ) {
    const styleType = featureStyle?.type || "single";

    // const iconSize = geomType.toLowerCase().includes("point") ? [50, 30] : [20, 10]
    const iconSize = [20, 10];
    switch (styleType) {
      case "single":
        const fStyle = this.createOLStyle(
          geomType,
          featureStyle?.style?.default
        );
        const img = ol_legend_Legend.getLegendImage({
          feature: undefined,
          margin: geomType === "Point" ? 5 : 0,
          // properties: undefined,
          size: toSize(iconSize),
          //@ts-ignore
          textStyle: undefined,
          //@ts-ignore
          title: "",
          //@ts-ignore
          style: fStyle,
          typeGeom: geomType,
          className: "",
        });
        layer.legend = { sType: "canvas", graphic: img };
        // this.mapVM.legendPanel.refresh()
        break;
      case "multiple":
      case "density":
        const rules = featureStyle.style.rules;
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = 200;
        //@ts-ignore
        canvas.height = iconSize[1] * rules?.length * 3;
        rules?.forEach((rule: IRule, index) => {
          const fStyle = this.createOLStyle(geomType, rule.style);
          const label = new Style({
            text: new Text({
              text: rule.title.toString(),
              textAlign: "left",
              offsetX: iconSize[0],
            }),
          });
          canvas = ol_legend_Legend.getLegendImage(
            {
              feature: undefined,
              margin: 5,
              // properties: undefined,
              size: toSize(iconSize),
              //@ts-ignore
              textStyle: undefined,
              title: "",
              //@ts-ignore
              style: [fStyle, label],
              typeGeom: geomType,
              className: "",
            },
            canvas,
            index * (iconSize[1] + 3)
          );
        });
        layer.legend = { sType: "canvas", graphic: canvas };
      // this.mapVM.legendPanel.refresh()
    }
  }
  static flash(feature, mapVM: MapVM) {
    const start = Date.now();
    const flashGeom = feature.getGeometry().clone();
    const baseLayer = mapVM.getBaseLayer()
    const listenerKey = baseLayer?.on('postrender', animate);
    const duration = 3000
    function animate(event) {
      const frameState = event.frameState;
      const elapsed = frameState.time - start;
      if (elapsed >= duration) {
        unByKey(listenerKey);
        return;
      }
      const vectorContext = getVectorContext(event);
      const elapsedRatio = elapsed / duration;
      // radius will be 5 at start and 30 at end.
      const radius = easeOut(elapsedRatio) * 25 + 5;
      const opacity = easeOut(1 - elapsedRatio);

      const style = new Style({
        image: new CircleStyle({
          radius: radius,
          stroke: new Stroke({
            color: 'rgba(255, 0, 0, ' + opacity + ')',
            width: 0.25 + opacity,
          }),
        }),
      });

      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);
      // tell OpenLayers to continue postrender animation
      mapVM.getMap().render();
    }
  }

}

export default StylingUtils;
