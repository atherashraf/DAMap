import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import AbstractDALayer from "./AbstractDALayer";
import MapApi, {MapAPIs} from "../utils/MapApi";
import {intersects} from "ol/extent";


/*****
 *  url format for MVT
 */

class MVTLayer extends AbstractDALayer {
    setLayer() {
        const me = this;
        const {title, uuid} = this.layerInfo || {};
        const declutter = "declutter" in this.layerInfo.layerSetting ?
            this.layerInfo.layerSetting["declutter"] === "true" : true
        this.layer = new VectorTileLayer({
            //@ts-ignore
            name: uuid,
            title: title,
            show_progress: true,
            visible: true,
            source: this.getDataSource(),
            //@ts-ignore
            style: this?.vectorStyleFunction?.bind(me),
            declutter: declutter
        });
        this.setSlDStyleAndLegendToLayer()
    }


    getDataSource(): VectorTileSource {
        // @ts-ignore
        return super.getDataSource();
    }


    getDataURL() {
        let apiURL;
        if (this.layerInfo.dataURL) {
            apiURL = this.layerInfo.dataURL
            return MapApi.getURL(apiURL)
        } else {
            apiURL = MapAPIs.DCH_LAYER_MVT
            return MapApi.getURL(apiURL, {uuid: this.layerInfo.uuid})
        }
    }

    setAdditionalUrlParams(params: string) {
        this.mapVM.getMapLoadingRef()?.current?.openIsLoading();
        let url = this.getDataURL();
        super.setAdditionalUrlParams(params);
        const source: VectorTileSource = this.layer.getSource();
        url = `${url}{z}/{x}/{y}/?${this.urlParams}&`
        source.setUrl(url);
        // console.log(url)
        setTimeout(()=>this.mapVM.getMapLoadingRef()?.current?.closeIsLoading(),500);
    }

    refreshLayer(clearFeature: boolean = false) {
        // console.log("refreshing source and map")

        super.refreshLayer(clearFeature)
        const source = this.layer?.getSource();
        if (source) {
            if (clearFeature) source.clear()
            source.refresh()
        }

    }

    // setStyle(style: IFeatureStyle) {
    //     this.style = style;
    //     this.refreshLayer();
    // }

    setDataSource() {
        this.dataSource = new VectorTileSource({
            format: new MVT(),
            url: `${this.getDataURL()}{z}/{x}/{y}/?${this.urlParams}`,
            attributions: "Digital Arz MVT Layer",
            tileLoadFunction: (tile, url) => {
                const z = tile.tileCoord[0];
                const zoomRange = this.layerInfo.zoomRange || [0, 30]
                // console.log(z, zoomRange)
                if (zoomRange[0] <= z && z <= zoomRange[1]) {
                    let cols: string[] = []
                    if (this.style && this.style.type !== "single" && this.style.type !== "sld") {
                        this.style?.style?.rules?.forEach((rule) => {
                            const s = rule?.filter?.field
                            s && cols.push(s)
                        })
                        cols = cols.filter((v, i, a) => a.indexOf(v) === i);
                        if (cols.length > 0)
                            url = url + "cols=" + String(cols)
                    }
                    //@ts-ignore
                    tile.setLoader((extent, resolution, projection) => {
                        // console.log(this.layerInfo.extent3857, extent)
                        if (this.layerInfo.extent3857 && intersects(extent, this.layerInfo.extent3857)) {
                            url = url + "&resolution=" + resolution
                            // console.log("url", url);
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
                                    // console.log(url)
                                    // console.log(features)
                                    //@ts-ignore
                                    tile.setFeatures(features);
                                });
                            });
                        }
                    });
                }
            }
        });
    }


    getFeatures() {
        // @ts-ignore
        this.layer.getFeatures().then(() => {
            // console.log("feature", features);
        });
    }

}

export default MVTLayer;
