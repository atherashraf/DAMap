import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import AbstractVectorLayer from "./AbstractVectorLayer";
import Api, {APIs} from "../../Api";
import {Feature} from "ol";
import {DAGeomStyle} from "../utils/TypeDeclaration";


/*****
 *  url format for MVT
 */

class MVTLayer extends AbstractVectorLayer {

    setLayer() {
        const me = this;
        const {title, uuid} = this.layerInfo || {};
        this.layer = new VectorTileLayer({
            //@ts-ignore
            name: uuid,
            title: title,
            visible: true,
            // declutter: true,
            // background: 'rgba(0,0,0,0.4)',
            source: this.getDataSource(),
            style: this.styleFunction.bind(me)
            // style: new Style({
            //     stroke: new Stroke({
            //         color: "yellow",
            //         width: 4
            //     }),
            //     fill: new Fill({
            //         color: "rgba(255, 255, 0, 0.8)"
            //     })
            // })
        });

    }

    setDataSource() {
        const url = Api.getURL(APIs.DCH_LAYER_MVT, {uuid: this.layerInfo.uuid})
        this.dataSource = new VectorTileSource({
            format: new MVT(),
            url: `${url}{z}/{x}/{y}`,
            tileLoadFunction: (tile, url) => {
                const z = tile.tileCoord[0];
                const zoomRange = this.layerInfo.zoomRange || [0, 30]
                if (zoomRange[0] <= z && z <= zoomRange[1]) {
                    //@ts-ignore
                    tile.setLoader((extent, resolution, projection) => {
                        fetch(url, {
                            headers: new Headers({
                                // "Authorization": "Bearer " + accessToken
                            })
                        }).then((response) => {
                            response.arrayBuffer().then((data) => {
                                //@ts-ignore
                                const format = tile.getFormat(); // ol/format/MVT configured as source format
                                const features = format.readFeatures(data, {
                                    extent: extent,
                                    featureProjection: projection
                                });
                                //@ts-ignore
                                tile.setFeatures(features);
                            });
                        });
                    });
                }
            }
        });
    }


    styleFunction(feature: Feature, resolution: number) {
        let style: DAGeomStyle;
        switch (this.style?.type) {
            case "single":
                style = this.style["style"]["default"];
                break;
            case "density":
                const properties = feature.getProperties();
                const colName = this.style["style"]["columnName"];
                const index = this.style["style"]["rules"].findIndex((rule) => rule.value === properties[colName]);
                style = this.style["style"]["rules"][index];
                break;
            default:
                break;
        }

        const olStyle = this.createOLStyle(feature, style);
        // console.log(feature, olStyle);
        return olStyle;
    }

    getFeatures() {
        // @ts-ignore
        this.layer.getFeatures().then(features => {
            // console.log("feature", features);
        });
        // console.log("features", features);
        // return features;
    }

}

export default MVTLayer;
