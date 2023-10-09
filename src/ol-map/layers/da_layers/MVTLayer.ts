import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import AbstractDALayer from "./AbstractDALayer";
import MapApi, { MapAPIs } from "../../utils/MapApi";
import TileGrid from "ol/tilegrid/TileGrid";
import { get as getProjection } from "ol/proj.js";
import { formatYmdDate } from "../../components/controls/TimeSliderControl";

/*****
 *  url format for MVT
 */

class MVTLayer extends AbstractDALayer {
  // constructor(info: ILayerInfo, mapVM: MapVM) {
  //     super(info, mapVM);
  //
  //
  //     console.log(this.resolutions)
  // }

  setLayer() {
    const me = this;
    const { title, uuid } = this.layerInfo || {};
    const declutter =
      "declutter" in this.layerInfo.layerSetting
        ? this.layerInfo.layerSetting["declutter"] === "true"
        : true;
    this.layer = new VectorTileLayer({
      //@ts-ignore
      name: uuid,
      title: title,
      show_progress: true,
      visible: true,
      source: this.getDataSource(),
      //@ts-ignore
      style: this?.vectorStyleFunction?.bind(me),
      declutter: declutter,
    });
    this.setSlDStyleAndLegendToLayer();
  }

  getDataSource(): VectorTileSource {
    // @ts-ignore
    return super.getDataSource();
  }

  tileUrlFunction(tileCoord: any) {
    let url = `${this.getDataURL()}{z}/{x}/{y}/?${this.urlParams}`;

    // const z = tileCoord[0] * 2 - 1;
    //     // tile.getImage().src = src + '&TIMESTAMP=' + Date.now();
    // const zoomRange = this.layerInfo.zoomRange || [0, 30]
    // console.log(z, zoomRange)
    // if (zoomRange[0] <= z && z <= zoomRange[1]) {
    let cols: string[] = [];
    if (
      this.style &&
      this.style.type !== "single" &&
      this.style.type !== "sld"
    ) {
      this.style?.style?.rules?.forEach((rule) => {
        const s = rule?.filter?.field;
        s && cols.push(s);
      });
      cols = cols.filter((v, i, a) => a.indexOf(v) === i);
      if (cols.length > 0) url = url + "cols=" + String(cols);
    }
    // Calculation of tile urls for zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
    return url
      .replace("{z}", String(tileCoord[0] * 2 - 1))
      .replace("{x}", String(tileCoord[1]))
      .replace("{y}", String(tileCoord[2]));
    // .replace(
    //     '{a-d}',
    //     'abcd'.substr(((tileCoord[1] << tileCoord[0]) + tileCoord[2]) % 4, 1)
    // );
    // }
  }

  getDataURL() {
    let apiURL;
    if (this.layerInfo.dataURL) {
      apiURL = this.layerInfo.dataURL;
      return MapApi.getURL(apiURL);
    } else {
      apiURL = MapAPIs.DCH_LAYER_MVT;
      return MapApi.getURL(apiURL, { uuid: this.layerInfo.uuid });
    }
  }

  setAdditionalUrlParams(params: string) {
    this.mapVM.getMapLoadingRef()?.current?.openIsLoading();
    let url = this.getDataURL();
    super.setAdditionalUrlParams(params);
    const source: VectorTileSource = this.layer.getSource();
    url = `${url}{z}/{x}/{y}/?${this.urlParams}&`;
    source.setUrl(url);
    // console.log(url)
    setTimeout(
      () => this.mapVM.getMapLoadingRef()?.current?.closeIsLoading(),
      500
    );
  }

  refreshLayer() {
    super.refreshLayer();
    // const source = this.layer?.getSource();
    // if (source) {
    //     if (clearFeature) source.clear()
    //     source.refresh()
    //     this.mapVM.getMap().updateSize();
    //     console.log("refreshing source and map")
    //     const extent = this.mapVM.getCurrentExtent()
    //     const coordinates = [
    //         [extent[0], extent[1]],
    //         [extent[2], extent[1]],
    //         [extent[0], extent[3]],
    //         [extent[2], extent[3]],
    //     ];
    //     coordinates.forEach((x) => {
    //         resolutions.forEach((resolution) => {
    //             const tileKeys = source
    //                 .getTileGrid()
    //                 .getTileCoordForCoordAndResolution(x, resolution);
    //             const key = tileKeys[0] + "/" + tileKeys[1] + "/" + tileKeys[2];
    //
    //             if (source.tileCache.containsKey(key)) {
    //                 const imageTile = source.tileCache.get(key);
    //                 source.tileCache.remove(key);
    //                 imageTile.setState(TileState.ERROR);
    //                 imageTile.load();
    //             }
    //         });
    //     });
    // }
  }

  // setStyle(style: IFeatureStyle) {
  //     this.style = style;
  //     this.refreshLayer();
  // }

  setResolutions() {
    // Calculation of resolutions that match zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
    for (let i = 0; i <= 8; ++i) {
      this.resolutions.push(156543.03392804097 / Math.pow(2, i * 2));
    }
  }

  setDataSource() {
    if (this.resolutions.length === 0) {
      this.setResolutions();
    }

    this.dataSource = new VectorTileSource({
      format: new MVT(),
      // url: `${this.getDataURL()}{z}/{x}/{y}/?${this.urlParams}`,
      attributions: "Digital Arz MVT Layer",
      tileGrid: new TileGrid({
        extent: getProjection("EPSG:3857")?.getExtent() || [
          -Math.PI * 6378137,
          -Math.PI * 6378137,
          Math.PI * 6378137,
          Math.PI * 6378137,
        ],
        resolutions: this.resolutions,
        tileSize: 512,
      }),
      tileUrlFunction: this.tileUrlFunction,
      // tileLoadFunction: (tile, url) => {
      //     const z = tile.tileCoord[0];
      //     // tile.getImage().src = src + '&TIMESTAMP=' + Date.now();
      //     const zoomRange = this.layerInfo.zoomRange || [0, 30]
      //     console.log(z, zoomRange)
      //     if (zoomRange[0] <= z && z <= zoomRange[1]) {
      //         // console.log(url)
      //         let cols: string[] = []
      //         if (this.style && this.style.type !== "single" && this.style.type !== "sld") {
      //             this.style?.style?.rules?.forEach((rule) => {
      //                 const s = rule?.filter?.field
      //                 s && cols.push(s)
      //             })
      //             cols = cols.filter((v, i, a) => a.indexOf(v) === i);
      //             if (cols.length > 0)
      //                 url = url + "cols=" + String(cols)
      //         }
      //         //@ts-ignore
      //         tile.setLoader((extent, resolution, projection) => {
      //             // console.log(this.layerInfo.extent3857, extent)
      //             if (this.layerInfo.extent3857 && intersects(extent, this.layerInfo.extent3857)) {
      //                 url = url + "&resolution=" + resolution+ '&TIMESTAMP=' + Date.now();
      //                 console.log("url", url);
      //                 fetch(url, {
      //                     headers: new Headers({
      //                         // "Authorization": "Bearer " + accessToken
      //                     })
      //                 }).then((response) => {
      //                     response.arrayBuffer().then((data) => {
      //                         //@ts-ignore
      //                         const format = tile.getFormat(); // ol/format/MVT configured as source format
      //                         const features = format.readFeatures(data, {
      //                             extent: extent,
      //                             featureProjection: projection
      //                         });
      //                         // console.log(url)
      //                         // console.log(features)
      //                         //@ts-ignore
      //                         tile.setFeatures(features);
      //                     });
      //                 });
      //             }
      //         });
      //     }
      // }
    });
  }

  getFeatures() {
    // @ts-ignore
    this.layer.getFeatures().then(() => {
      // console.log("feature", features);
    });
  }
  updateTemporalData(date: Date) {
    const params = "date=" + formatYmdDate(date);
    this.setAdditionalUrlParams(params);
    this.refreshLayer();
  }
}

export default MVTLayer;
