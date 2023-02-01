import * as React from "react"
import MapVM from "../models/MapVM";

interface RasterAreaResultProps {
    mapVM: MapVM
}

const RasterAreaResult = (props: RasterAreaResultProps) => {
    const {mapVM} = props
    React.useEffect(() => {
        const elem = document.getElementById('div-area-result') as HTMLElement
        mapVM.drawPolygonForRasterArea(elem)
    }, [])
    return (
        <React.Fragment>
            <div id={"div-area-result"} style={{width: "100%", height: "auto"}}/>
        </React.Fragment>
    )
}

export default RasterAreaResult
