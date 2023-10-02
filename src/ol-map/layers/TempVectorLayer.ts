import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import MapVM from "../models/MapVM";
import autoBind from "auto-bind";
import { Style } from "ol/style";
import { IFeatureStyle, IGeoJSON } from "../TypeDeclaration";
import { Feature } from "ol";
import StylingUtils from "./styling/StylingUtils";
import GeoJSON from "ol/format/GeoJSON";
import { WKT } from "ol/format";

class TempVectorLayer {
  //@ts-ignore
  layer: VectorLayer<VectorSource>;
  mapVM: MapVM;
  //@ts-ignore
  title: string;
  uuid: string;
  style: IFeatureStyle;
  //@ts-ignore
  constructor(mapVM: MapVM, title: string, style: IFeatureStyle) {
    this.mapVM = mapVM;
    this.style = style;
    this.uuid = mapVM.getMapUUID();
    autoBind(this);
    this.createLayer();
  }
  createLayer() {
    // const title = title;
    this.layer = new VectorLayer({
      // @ts-ignore
      title: this.title,
      displayInLayerSwitcher: false,
      source: new VectorSource(),
      //@ts-ignore
      style: this.vectorStyleFunction,
      zIndex: 1000,
    });
    this.mapVM.addOverlayLayer(this.layer, this.title, this.uuid);
  }
  addGeojsonFeature(geojson: IGeoJSON, clearPreviousSelection: boolean = true) {
    if (clearPreviousSelection) {
      this.clearSelection();
    }
    const features = new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    }).readFeatures(geojson);
    this.getSource().addFeatures(features);
  }

  addWKTFeature(wkt: string, clearPreviousSelection: boolean = true) {
    if (clearPreviousSelection) {
      this.clearSelection();
    }
    const features = new WKT().readFeatures(wkt);
    this.getSource().addFeatures(features);
  }
  vectorStyleFunction(feature: Feature): Style {
    return StylingUtils.vectorStyleFunction(feature, this.style);
  }
  zoomToFeatures() {
    if (this.getSource().getFeatures().length > 0) {
      const extent = this.getSource().getExtent();
      this.mapVM.zoomToExtent(extent);
    } else {
      this.mapVM.showSnackbar("Please select feature before zoom to");
    }
  }
  clearSelection() {
    this.getSource().clear();
  }
  getSource(): VectorSource {
    //@ts-ignore
    return this.getOlLayer().getSource();
  }
  getOlLayer(): VectorLayer<VectorSource> {
    return this.layer;
  }
}

export default TempVectorLayer;
