import MapVM from "../models/MapVM";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { BingMaps } from "ol/source";
import { Group } from "ol/layer";
import { ILayerSources, ILayerSourcesInfo } from "../TypeDeclaration";
import XYZ from "ol/source/XYZ";

export const baseLayerSources = {
  osm: { title: "Open Street Map", source: "osm" },
  googleTerrain: { title: "Google Physical", source: "google" },
  bingRoad: { title: "Bing Roads", source: "osm", imagerySet: "RoadOnDemand" },
  // bingAerial: {title: "Bing Aerial", source: "bing", visible: false, imagerySet: 'Aerial'},
  bingAerialLabel: {
    title: "Bing Aerial",
    source: "bing",
    visible: false,
    imagerySet: "AerialWithLabelsOnDemand",
  },
  bingDark: {
    title: "Bing Dark Canvas",
    source: "bing",
    imagerySet: "CanvasDark",
  },
  // bingSurvey: {title: "Bing Ordnance Survey", source: "bing", visible: false, imagerySet: 'OrdnanceSurvey'},
};

class BaseLayers {
  private mapVM: MapVM;
  //@ts-ignore
  private readonly layersSources: ILayerSources;
  // private selectedBaseLayer: any

  constructor(mapVM: MapVM) {
    this.mapVM = mapVM;
  }

  addBaseLayers(title = null) {
    const layers = [];
    //@ts-ignore
    title = !title ? "Google Physical" : title;
    for (let key in baseLayerSources) {
      //@ts-ignore
      layers.push(this.getLayer(key));
      //@ts-ignore
      if (baseLayerSources[key]?.title === title) {
        // console.log("base Layer", layers[])
        //@ts-ignore
        layers[layers.length - 1]?.setVisible(true)
        // this.mapVM.getMap().setBaseLayer(layers[layers.length - 1]);
      }

    }
    const gLayer = new Group({
      //@ts-ignore
      title: "Base Layers",
      openInLayerSwitcher: true,
      layers: layers,
    });
    this.mapVM.getMap().addLayer(gLayer);
  }

  getLayer(key: string): any {
    //@ts-ignore
    const info = baseLayerSources[key];
    let layer: any;
    switch (info?.source) {
      case "osm":
        layer = this.getOSMLLayer(info);
        break;
      case "bing":
        layer = this.getBingMapLayer(info);
        break;
      //@ts-ignore
      case "google":
        layer = this.getGoogleLayer(info);
    }
    return layer;
  }

  getGoogleLayer(info: ILayerSourcesInfo): TileLayer<any> {
    return new TileLayer({
      //@ts-ignore
      title: info.title,
      visible: false,
      // @ts-ignore
      baseLayer: true,
      source: new XYZ({
        attributions: "Google Layer",
        url: "http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}",
        wrapX: true,
      }),
    });
  }

  getOSMLLayer(info: ILayerSourcesInfo): TileLayer<OSM> {
    return new TileLayer({
      //@ts-ignore
      title: info.title,
      visible: false,
      // @ts-ignore
      baseLayer: true,
      source: new OSM({
        attributions: "OSM Layer",
        wrapX: false,
      }),
    });
  }

  getBingMapLayer(info: ILayerSourcesInfo): TileLayer<BingMaps> {
    return new TileLayer({
      //@ts-ignore
      title: info.title,
      visible: false,
      preload: Infinity,
      // @ts-ignore
      baseLayer: true,
      source: new BingMaps({
        //@ts-ignore
        key: process.env.REACT_APP_BING_KEY,
        //@ts-ignore
        imagerySet: info.imagerySet,
        // use maxZoom 19 to see stretched tiles instead of the BingMaps
        // "no photos at this zoom level" tiles
        maxZoom: 19,
      }),
    });
  }
}

export default BaseLayers;
