import * as React from "react";
import MapView from "../ol-map/containers/MapView";
import {MapAPIs} from "../ol-map/utils/MapApi";
import IDWLayer from "../ol-map/layers/IDWLayer";
import MapVM from "../ol-map/models/MapVM";


const MapViewRef = React.createRef<MapView>();
interface IProps{
    uuid: string
    isMap: boolean
    isDesigner: boolean
}
const WaterQualitySurfaceTest = (props: IProps) => {
    const [aoi, setAOI] = React.useState(null);
    const [waterQualityData, setWaterQualityData] = React.useState(null);
    const [idwUUID, setIDWUUID] = React.useState(MapVM.generateUUID())
    const [idwLayer, setIDWLayer] = React.useState<IDWLayer | null>(null)

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
            // return {aoi, waterQualityData}
        } catch (error) {
            throw Error(error);
        }
    }

    const title = 'Water Quality Surface'

    React.useEffect(() => {
        getGWData().then(() => {
            if (aoi && waterQualityData) {
                const mapVM = MapViewRef.current?.getMapVM();
                const info = {uuid: idwUUID, title}
                if (!mapVM.isOverlayLayerExist(idwUUID)) {
                    const layer = new IDWLayer(mapVM, info, waterQualityData, "electric_conductivity", aoi)
                    setIDWLayer(layer)
                    layer.addIDWLayer()
                } else {
                    // console.log("udating layer");
                    idwLayer.updateIDWLayer('residual_sodium_carbonate')
                }
            }
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

export default WaterQualitySurfaceTest
