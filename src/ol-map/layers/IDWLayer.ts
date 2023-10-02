//@ts-ignore
import IDWSource from "ol-ext/source/IDW";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import ImageLayer from "ol/layer/Image";
import VectorLayer from "ol/layer/Vector";
import { IGeoJSON, ILayerInfo } from "../TypeDeclaration";
import { getVectorContext } from "ol/render";
import { Fill, Style } from "ol/style";
import MapVM from "../models/MapVM";

class IDWLayer {
  //@ts-ignore
  clipLayer: VectorLayer<any>;
  //@ts-ignore
  vectorSource: VectorSource;
  //@ts-ignore
  interpolatedLayer: ImageLayer<any>;
  mapVM: MapVM;
  layerInfo: ILayerInfo;

  constructor(
    mapVM: MapVM,
    info: ILayerInfo,
    data: IGeoJSON,
    propertyName: string,
    aoi: IGeoJSON | undefined = undefined
  ) {
    this.mapVM = mapVM;
    this.layerInfo = info;
    if (aoi !== null) {
      this.createClipLayer(aoi);
    }
    this.createVectorSource(data);

    this.createLayer(propertyName);
  }

  getInterpolatedLayer() {
    return this.interpolatedLayer;
  }

  addIDWLayer() {
    if (!this.mapVM.isOverlayLayerExist(this.layerInfo.uuid)) {
      this.mapVM.addOverlayLayer(
        this.getInterpolatedLayer(),
        this.layerInfo.title,
        this.layerInfo.uuid
      );
    } else {
      this.mapVM
        .getSnackbarRef()
        .current?.show(
          `${this.layerInfo.title} layer already exist. Please remove it first`
        );
    }
  }

  updateIDWLayer(propertyName: string) {
    this.mapVM.removeOverlayLayer(this.layerInfo.uuid);
    this.createLayer(propertyName);
    this.maskLayer();
    this.addIDWLayer();
  }

  createVectorSource(data: IGeoJSON) {
    this.vectorSource = new VectorSource({
      features: new GeoJSON({
        featureProjection: "EPSG:3857",
        dataProjection: "EPSG:4326",
      }).readFeatures(data),
    });
  }

  createLayer(propertyName: string) {
    const features = this.vectorSource.getFeatures();
    const maxvalue =
      features &&
      Math.max(
        ...features.map((f) => parseFloat(f.getProperties()[propertyName]))
      );

    this.interpolatedLayer = new ImageLayer({
      // @ts-ignore
      name: this.layerInfo.uuid,
      title: this.layerInfo.title,
      className: "IDWImageLayer",
      source: new IDWSource({
        source: this.vectorSource,
        weight: (feature: any) =>
          (parseFloat(feature.getProperties()[propertyName]) / maxvalue) * 100,
      }),
      opacity: 0.4,
      extent: this.clipLayer?.getSource().getExtent(),
    });
    this.maskLayer();
  }

  createClipLayer(aoi: IGeoJSON | undefined) {
    this.clipLayer = new VectorLayer({
      style: null,
      source: new VectorSource({
        features: new GeoJSON({
          featureProjection: "EPSG:3857",
          dataProjection: "EPSG:4326",
        }).readFeatures(aoi),
      }),
    });
  }

  maskLayer() {
    const clipLayer = this.clipLayer;
    if (clipLayer) {
      this.interpolatedLayer.on("postrender", function (evt) {
        const ctx: any = evt.context;
        const vectorContext = getVectorContext(evt);
        ctx.globalCompositeOperation = "destination-in";

        clipLayer.getSource().forEachFeature((feature: any) => {
          vectorContext.drawFeature(
            feature,
            new Style({
              fill: new Fill({
                color: "black",
              }),
            })
          );
        });
        ctx.globalCompositeOperation = "source-over";
      });
    }
  }
}

export default IDWLayer;
