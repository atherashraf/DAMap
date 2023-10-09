import AbstractDALayer from "./AbstractDALayer";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import MapApi, { MapAPIs } from "../../utils/MapApi";
import ol_legend_Item from "ol-ext/legend/Item";
//@ts-ignore
import olLegendImage from "ol-ext/legend/Image";

class RasterTileLayer extends AbstractDALayer {
  setLayer() {
    const { title, uuid } = this.layerInfo || {};
    // @ts-ignore
    this.layer = new TileLayer({
      //@ts-ignore
      name: uuid,
      title: title,
      visible: true,
      show_progress: true,
      source: this.getDataSource(),
      // style: this.styleFunction.bind(me),
      // declutter: true
    });
    this.addLegendGraphic(this.layer);
  }
  addLegendGraphic(layer: any) {
    const url = MapApi.getURL(MapAPIs.DCH_LEGEND_GRAPHIC, {
      uuid: this.layerInfo.uuid,
    });
    layer.legend = { sType: "src", graphic: url, width: "100%" };
    const img: ol_legend_Item = new olLegendImage({
      title: this.layerInfo.title,
      src: url,
    });
    this.mapVM.legendPanel.addItem(img);
  }

  setDataSource() {
    const url = MapApi.getURL(MapAPIs.DCH_LAYER_RASTER, {
      uuid: this.layerInfo.uuid,
    });
    this.dataSource = new XYZ({
      // url: 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?' +
      //     'apikey=873e70e2e69e4a36ae3f2c525f19425e'
      attributions: "Digital Arz Raster Tile Layer",
      url: `${url}{z}/{x}/{y}`,
      // tileLoadFunction: (imageTile, src) => {
      //     console.log("src", src)
      //     // imageTile.getImage().src = src;
      // }
    });
    return this.dataSource;
  }

  refreshLayer() {
    super.refreshLayer();
    // const source = this.getDataSource()
    // source.tileCache.expireCache({});
    // source.tileCache.clear();
    // source.setTileUrlFunction(source.getTileUrlFunction(), (new Date()).getTime().toLocaleString());
    // setTimeout(() => source.refresh(), 1000)
    // this.mapVM.refreshMap()
    // this.mapVM.getSnackbarRef().current?.show("Note: if Map is not refreshed. Please reload page or Zoom in to see changes", null, 15000)
  }
}

export default RasterTileLayer;
