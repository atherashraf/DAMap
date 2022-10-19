import * as React from "react"
import {IControlProps} from "../../TypeDeclaration";


const LOISelector = (props: IControlProps) => {
    const [layerIds, setLayerIds] = React.useState<string[]>([])
    window.addEventListener('VectorLayerAdded', () => {
        const k = Object.keys(props.mapVM.daLayer)
        setLayerIds(k)
        props.mapVM.setLayerOfInterest(k[0])
    })
    return (
        <React.Fragment>
            <select style={{
                backgroundColor: "transparent",
                border: "2px solid #000",
                width: "200px"
            }} onChange={(e) =>
                props.mapVM.setLayerOfInterest(e.target.value as string)}>
                {layerIds.map(
                    (layerId) => {
                        const layer = props.mapVM.getDALayer(layerId)
                        return <option value={layerId}>{layer.getLayerTitle()}</option>
                    })}
            </select>
        </React.Fragment>
    )
}

export default LOISelector
