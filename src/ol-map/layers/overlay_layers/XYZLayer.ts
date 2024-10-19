import { Tile } from "ol/layer";
import XYZ from "ol/source/XYZ";
import MapVM from "../../models/MapVM";

export interface IXYZLayerInfo {
    title: string;
    url: string;
    uuid: string;
    visible?: boolean;
    opacity?: number;
    legendURL?: string;
}

class XYZLayer {
    mapVM: MapVM;
    layerInfo: IXYZLayerInfo;
    uuid: string;
    olLayer: Tile<XYZ>;

    constructor(info: IXYZLayerInfo, mapVM: MapVM) {
        this.mapVM = mapVM;
        this.layerInfo = info;
        this.uuid = info.uuid ? info.uuid : MapVM.generateUUID();
        this.olLayer = this.createLayer();
        this.setLegendImage();
    }

    createLayer(): Tile<XYZ> {
        const source = new XYZ({
            url: this.layerInfo.url,
            crossOrigin: "anonymous",
        });

        // Show loading indicator when the layer is created
        this.mapVM.getMapLoadingRef().current?.openIsLoading();

        // Listen for tile load events to manage loading indicator
        source.on('tileloadstart', () => {
            this.mapVM.getMapLoadingRef().current?.openIsLoading();
        });

        source.on('tileloadend', () => {
            this.mapVM.getMapLoadingRef().current?.closeIsLoading();
        });

        source.on('tileloaderror', () => {
            this.mapVM.getMapLoadingRef().current?.closeIsLoading();
        });

        return new Tile({
            // @ts-ignore
            title: this.layerInfo.title,
            info: "weather",
            name: this.uuid,
            source: source,
            visible: this.layerInfo.visible ? this.layerInfo.visible : true,
            opacity: this.layerInfo.opacity ? this.layerInfo.opacity : 1,
        });
    }

    setLegendImage() {
        if (this.olLayer && this.layerInfo.legendURL) {
            //@ts-ignore
            this.olLayer.legend = { sType: "src", graphic: this.layerInfo.legendURL, width: "200px", height: "25px" };
        }
    }

    updateSourceURL(newURL: string) {
        if (this.olLayer) {
            const source = this.olLayer.getSource();
            if (source) {
                // Show loading indicator when the URL is updated
                this.mapVM.getMapLoadingRef().current?.openIsLoading();

                // Listen for tile load events to close the loading indicator
                source.on('tileloadstart', () => {
                    this.mapVM.getMapLoadingRef().current?.openIsLoading();
                });

                source.on('tileloadend', () => {
                    this.mapVM.getMapLoadingRef().current?.closeIsLoading();
                });

                source.on('tileloaderror', () => {
                    this.mapVM.getMapLoadingRef().current?.closeIsLoading();
                });

                // Update the URL
                source.setUrl(newURL);

                // Clear cached tiles and reload
                source.refresh();
            }
        }
    }
}

export default XYZLayer;
