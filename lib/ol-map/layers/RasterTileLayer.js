import AbstractDALayer from "./AbstractDALayer";
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import MapApi, { MapAPIs } from "../utils/MapApi";
class RasterTileLayer extends AbstractDALayer {
    setLayer() {
        const me = this;
        const { title, uuid } = this.layerInfo || {};
        // @ts-ignore
        this.layer = new TileLayer({
            //@ts-ignore
            name: uuid,
            title: title,
            visible: true,
            source: this.getDataSource(),
            // style: this.styleFunction.bind(me),
            // declutter: true
        });
    }
    setDataSource() {
        const url = MapApi.getURL(MapAPIs.DCH_LAYER_RASTER, { uuid: this.layerInfo.uuid });
        this.dataSource = new XYZ({
            // url: 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?' +
            //     'apikey=873e70e2e69e4a36ae3f2c525f19425e'
            url: `${url}{z}/{x}/{y}`
        });
        return this.dataSource;
    }
}
export default RasterTileLayer;