"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/esnext.string.replace-all.js");
var _geostylerOpenlayersParser = _interopRequireDefault(require("geostyler-openlayers-parser"));
var _geostylerSldParser = _interopRequireDefault(require("geostyler-sld-parser"));
var _LegendRenderer = _interopRequireDefault(require("geostyler-legend/dist/LegendRenderer/LegendRenderer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class SLDStyleParser {
  constructor(objMvtLayer) {
    let sldTest = objMvtLayer.style["style"];
    this.convertSLDTextToOL(sldTest, objMvtLayer.layer);
  }
  convertSLDTextToOL(sldText, layer) {
    const olParser = new _geostylerOpenlayersParser.default();
    const sldParser = new _geostylerSldParser.default();
    sldText = sldText.replaceAll("SvgParameter", "CssParameter");
    sldParser.readStyle(sldText).then(geostylerStyle => {
      const renderer = new _LegendRenderer.default({
        maxColumnWidth: 300,
        maxColumnHeight: 300,
        overflow: 'auto',
        styles: [geostylerStyle.output],
        size: [150, 50] //w,h
      });

      layer.legend = {
        sType: 'sld',
        graphic: renderer
      };
      // console.log(JSON.stringify(geostylerStyle.output));
      return olParser.writeStyle(geostylerStyle.output);
    }).then(olStyle => {
      // Run your actions with the converted style here
      layer.setStyle(olStyle.output);
      layer.getSource().refresh();
    });
  }
}
var _default = SLDStyleParser;
exports.default = _default;