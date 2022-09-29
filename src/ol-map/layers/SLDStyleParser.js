import OlParser from 'geostyler-openlayers-parser';
import SldParser from 'geostyler-sld-parser';
import LegendRenderer from "geostyler-legend/dist/LegendRenderer/LegendRenderer";

class SLDStyleParser {
    constructor(objMvtLayer) {
        let sldTest = objMvtLayer.style["style"]
        sldTest="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<StyledLayerDescriptor xmlns=\"http://www.opengis.net/sld\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:se=\"http://www.opengis.net/se\" version=\"1.1.0\" xsi:schemaLocation=\"http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd\">\n" +
            "  <NamedLayer>\n" +
            "    <se:Name>Division_Boundary</se:Name>\n" +
            "    <UserStyle>\n" +
            "      <se:Name>Division_Boundary</se:Name>\n" +
            "      <se:FeatureTypeStyle>\n" +
            "        <se:Rule>\n" +
            "          <se:Name>Single symbol</se:Name>\n" +
            "          <se:PolygonSymbolizer>\n" +
            "            <se:Fill>\n" +
            "              <se:SvgParameter name=\"fill\">#fff01b</se:SvgParameter>\n" +
            "            </se:Fill>\n" +
            "            <se:Stroke>\n" +
            "              <se:SvgParameter name=\"stroke\">#e31a1c</se:SvgParameter>\n" +
            "              <se:SvgParameter name=\"stroke-width\">4</se:SvgParameter>\n" +
            "              <se:SvgParameter name=\"stroke-linejoin\">bevel</se:SvgParameter>\n" +
            "              <se:SvgParameter name=\"stroke-dasharray\">1 2</se:SvgParameter>\n" +
            "            </se:Stroke>\n" +
            "          </se:PolygonSymbolizer>\n" +
            "        </se:Rule>\n" +
            "      </se:FeatureTypeStyle>\n" +
            "    </UserStyle>\n" +
            "  </NamedLayer>\n" +
            "</StyledLayerDescriptor>"
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
                // console.log(olStyle.output);
                layer.setStyle(olStyle.output)
                layer.getSource().refresh()

            });
    }
}

export default SLDStyleParser;