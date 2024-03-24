import OlParser from "geostyler-openlayers-parser";
import SldParser from "geostyler-sld-parser";
import LegendRenderer from "geostyler-legend/dist/LegendRenderer/LegendRenderer";
import olLegendImage from "ol-ext/legend/Image";

class SLDStyleParser {
  objMvtLayer = null;
  legendRenderer = null;

  constructor(objMvtLayer) {
    this.objMvtLayer = objMvtLayer;
  }

  convertSLDTextToOL(sldText, layer) {
    sldText = sldText.replaceAll("SvgParameter", "CssParameter");
    const olParser = new OlParser();
    const sldParser = new SldParser();
    (async () => {
      const geostylerStyle = await sldParser.readStyle(sldText);
      // console.log("sld style", geostylerStyle);
      const renderer = new LegendRenderer({
        // maxColumnWidth: 250,
        // maxColumnHeight: 300,
        overflow: "group",
        styles: [geostylerStyle.output],
        hideRect: true,
        iconSize: [20, 30],
        size: [300, 150], //w,h
      });
      layer.legend = { sType: "sld", graphic: renderer };
      this.legendRenderer = renderer;
      const olStyle = await olParser.writeStyle(geostylerStyle.output);
      layer.setStyle(olStyle.output);
      layer.getSource().refresh();
      let legendPanel = this.objMvtLayer.mapVM.legendPanel;
      legendPanel && this.getLegendAsImage(this.legendRenderer, legendPanel, layer);
    })();
  }

  getLegendAsImage(legendRenderer, legendPanel, layer) {
    let me = this;
    legendRenderer.renderAsImage("svg").then((svg_geoSTylerRendrer) => {
      // let parser = new DOMParser();
      let svg = me.convertSVGStringToSVG(svg_geoSTylerRendrer);
      legendPanel.addItem(
        new olLegendImage({
          title: layer.get("title"),
          // src: svg.toDataURL()
          img: svg,
        })
      );
      legendPanel.refresh();
    });
  }

  convertSVGStringToSVG(svg_geoSTylerRendrer) {
    const canvas = document.createElement("canvas");
    canvas.width = svg_geoSTylerRendrer.width.animVal.value;
    canvas.height = svg_geoSTylerRendrer.height.animVal.value;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svg_geoSTylerRendrer.outerHTML)));
    return img;
  }
}

export default SLDStyleParser;
