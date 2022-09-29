import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import AbstractVectorLayer from "./AbstractVectorLayer";
import Api, {APIs} from "../utils/Api";
import {Feature} from "ol";
import {IGeomStyle, IRule} from "../TypeDeclaration";
import SLDStyleParser from "./SLDStyleParser";


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
                    let cols: string[] = []
                    // if(this.style&& this.style.type=="sld"){
                    //     console.log("in sld", this.style);
                    //
                    // }
                    if (this.style && this.style.type !== "single" && this.style.type !== "sld") {
                        this.style.style.rules.forEach((rule) => {
                            cols.push(rule.filter.field)
                        })
                        cols = cols.filter((v, i, a) => a.indexOf(v) === i);
                        if (cols.length > 0)
                            url = url + "?cols=" + String(cols)
                    }
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
                                console.log("features on loading...", features)
                            });
                        });
                    });
                }
            }
        });
    }


    styleFunction(feature: Feature, resolution: number) {
        let style: IGeomStyle;
        let rules: IRule[]
        let properties: any
        const type= this.style?.type || ""
        switch (type) {
            case "single":
                style = this.style["style"]["default"];
                break;
            case "multiple":
                style = this.style["style"]["default"];
                rules = this.style.style.rules
                properties = feature.getProperties();
                rules.forEach((rule: IRule) => {
                    if (rule.filter.field in properties && properties[rule.filter.field] == rule.filter.value) {
                        style = rule.style;
                    }
                });
                break;
            case "density":
                // style = this.style["style"]["default"];
                rules = this.style.style.rules
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
                if (!this.layer.hasOwnProperty('legend')) {
                    new SLDStyleParser(this)
                }
                break;
            default:
                break;
        }

        return this.createOLStyle(feature, style);

    }

    getFeatures() {
        // @ts-ignore
        this.layer.getFeatures().then(() => {
            // console.log("feature", features);
        });
    }

}

export default MVTLayer;
