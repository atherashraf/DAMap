import OlParser from 'geostyler-openlayers-parser';
import SldParser from 'geostyler-sld-parser';
import LegendRenderer from "geostyler-legend/dist/LegendRenderer/LegendRenderer";

class SLDStyleParser {
    constructor(objMvtLayer) {
        let sldTest = objMvtLayer.style["style"]
        this.convertSLDTextToOL(sldTest, objMvtLayer.layer)
    }

    convertSLDTextToOL(sldText, layer) {
        const olParser = new OlParser();
        const sldParser = new SldParser();
        sldText = sldText.replaceAll("SvgParameter", "CssParameter");
        sldParser.readStyle(sldText)
            .then((geostylerStyle) => {
                const renderer = new LegendRenderer({
                    maxColumnWidth: 300,
                    maxColumnHeight: 300,
                    overflow: 'auto',
                    styles: [geostylerStyle.output],
                    size: [150, 50] //w,h
                });
                layer.legend = {sType: 'sld', graphic: renderer}
                // console.log(JSON.stringify(geostylerStyle.output));
                return olParser.writeStyle(geostylerStyle.output);
            })
            .then((olStyle) => {
                // Run your actions with the converted style here
                layer.setStyle(olStyle.output)
                layer.getSource().refresh()

            });
    }
}

export default SLDStyleParser;
