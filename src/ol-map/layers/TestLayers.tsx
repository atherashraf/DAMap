import OverlayVectorLayer, {IOverLayVectorInfo} from "./overlay_layers/OverlayVectorLayer";
import MapVM from "../models/MapVM";
import MapApi, {MapAPIs} from "../utils/MapApi";
import {IXYZLayerInfo} from "./overlay_layers/XYZLayer";


class TestLayers {
    static addFloodLayer(mapVM: MapVM) {
        if (mapVM) {
            // const floodLayerData = require("../layers/overlay_layers/test_data/flood_layer.json")
            const floodLayerData: any = {
                "payload": {
                    "type": "FeatureCollection",
                    "features": []
                }
            }
            const info: IOverLayVectorInfo = {
                uuid: MapVM.generateUUID(),
                title: "flood layer",
                style: {
                    type: "single",
                    style: {
                        default: {
                            strokeColor: "#111160",
                            strokeWidth: 2,
                            fillColor: "#2e2e9422"
                        }
                    }
                }
            }
            const floodLayer = new OverlayVectorLayer(info, mapVM)
            floodLayer.addGeojsonFeature(floodLayerData.payload)
        }
    }

    static addGEETemperatureLayer(mapVM: MapVM) {
        mapVM.getApi().get(MapAPIs.DCH_GEE_LAYER, {layer_type: "temperature"}).then((payload) => {
            console.log("payload", payload)
            const layerInfo: IXYZLayerInfo = {
                uuid: mapVM.getMapUUID(),
                title: "GEE Temperature",
                url: payload,
                legendURL: MapApi.getURL(MapAPIs.DCH_GEE_LAYER_LEGEND, {layer_type: "temperature"})
            }
            mapVM.addGEELayer(layerInfo)
        })
    }

    static addSettlementLayer(mapVM: MapVM) {
        // const mapVM = mapViewRef.current?.getMapVM()
        if (mapVM) {
            // const geojson = require("../layers/overlay_layers/test_data/flood_layer.json")
            const geojson: any = {
                "payload": {
                    "type": "FeatureCollection",
                    "features": []
                }
            }
            const url = MapApi.getURL("/api/ff/get_affected_population/")
            // const url= "http://127.0.0.1:8887/api/ff/get_affected_population/";
            mapVM.getApi().postFetch(url, geojson.payload, true).then((payload: any) => {
                const info: IOverLayVectorInfo = {
                    uuid: MapVM.generateUUID(),
                    title: "settlement layer",
                    geomType: "Point",
                    style: {
                        type: "single",
                        style: {
                            default: {
                                "pointSize": 15,
                                "pointShape": "circle",
                                "strokeColor": "#000000",
                                "strokeWidth": 3,
                                "fillColor": "#d78544"
                            }
                        }
                    }
                }
                const settlementLayer = new OverlayVectorLayer(info, mapVM)
                // console.log(floodLayerData)
                settlementLayer.addGeojsonFeature(payload)
                mapVM.setLayerOfInterest(info.uuid);
                setTimeout(() => mapVM?.openAttributeTable(), 1000);

                // console.log(settlementLayer.toGeoJson())
            });
        }
    }
}

export default TestLayers
