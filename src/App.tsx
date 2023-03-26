import * as React from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from 'ol/format/GeoJSON';
import MapView from "./ol-map/containers/MapView";
import {MapAPIs} from "./ol-map/utils/MapApi";
import IDW from 'ol-ext/source/IDW';
import ImageLayer from 'ol/layer/Image';
import {getVectorContext} from "ol/render";
import {Fill, Style} from "ol/style";
import ImageStyle from 'ol/style/Image.js';


const MapViewRef = React.createRef<MapView>();
const App = (props) => {
    const [aoi, setAOI] = React.useState(null);
    const [waterQualityData, setWaterQualityData] = React.useState(null);

    const getGWData = async () => {
        try {
            const mapApi = MapViewRef.current?.getMapVM().getApi();
            if (!aoi) {
                const boundary = await mapApi.get(MapAPIs.LBDC_AOI);
                setAOI(boundary)
            }
            if (!waterQualityData) {
                const geojson = await mapApi.get(MapAPIs.WATER_QUALITY_DATA);
                setWaterQualityData(geojson)
            }
            return {aoi, waterQualityData}
        } catch (error) {
            throw Error(error);
        }
    }
    const addInterpolationLayer = (qualityType: string) => {
        const layerTitle = `${qualityType} surface`
        MapViewRef.current?.getMapVM().removeOverlayLayer(layerTitle)
        if (waterQualityData && aoi) {
            const clipLayer = new VectorLayer({
                style: null,
                source: new VectorSource({
                    features: new GeoJSON({
                        featureProjection: 'EPSG:3857',
                        dataProjection: 'EPSG:4326'
                    }).readFeatures(aoi),
                }),
            });

            const maxvalue = waterQualityData && Math.max(...waterQualityData?.features.map(f => parseFloat(f.properties[qualityType])));
            const interpolationSource = new VectorSource({
                features: new GeoJSON({
                    featureProjection: 'EPSG:3857',
                    dataProjection: 'EPSG:4326'
                }).readFeatures(waterQualityData)
            });
            // console.log(interpolationSource.getExtent())
            const interpolationLayer = new ImageLayer({
                className: 'IDWImageLayer',
                source: new IDW({
                    source: interpolationSource,
                    weight: (feature) => parseFloat(feature.getProperties()[qualityType]) / maxvalue * 100
                }),
                opacity: 0.4,
                extent: clipLayer.getSource().getExtent()
            })


            const style = new Style({
                fill: new Fill({
                    color: 'black',
                }),
            });
            // interpolationLayer.on("precompose", function(e) {
            //     //@ts-ignore
            //     e.context.globalCompositeOperation = 'destination-in';
            // });
            // interpolationLayer.on('postcompose', function(e) {
            //     //@ts-ignore
            //     e.context.globalCompositeOperation = 'source-over';
            // });
            interpolationLayer.on('postrender', function (evt) {
                const ctx: any = evt.context
                const vectorContext = getVectorContext(evt);
                ctx.globalCompositeOperation = 'destination-in';

                clipLayer.getSource().forEachFeature(function (feature) {
                    vectorContext.drawFeature(feature, style);
                });
                ctx.globalCompositeOperation = 'source-over';
                // document.querySelector('canvas').style.filter="invert(99%)";
            });
            MapViewRef.current?.getMapVM().addOverlayLayer(interpolationLayer, layerTitle)
            // MapViewRef.current?.getMapVM().addOverlayLayer(clipLayer, "clip Layer")
            // MapViewRef.current?.getMapVM().getMap().addLayer(interpolatio/nLayer)
        }
    }

    React.useEffect(() => {
        getGWData().then((data) => {
            addInterpolationLayer("electric_conductivity");
        }).catch((e) => {
            console.error("error", e)
            MapViewRef.current?.getMapVM().getSnackbarRef().current?.show(`Failed to create the IDW surface...`)
        })
    }, [aoi, waterQualityData])

    return (
        <React.Fragment>
            <MapView ref={MapViewRef} uuid={props.uuid} isMap={props.isMap} isDesigner={props.isDesigner}/>
        </React.Fragment>
    )
}

export default App
