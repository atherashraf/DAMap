import {AppBar, Paper} from "@mui/material";
import * as React from "react"
import MapVM from "../../models/MapVM";
import "./LayerSwitcher.css";
import {Group} from "ol/layer";
import VectorTileSource from "ol/source/VectorTile";
import Legend from "ol-ext/legend/Legend";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
// import Legend from "./legend/Legend"
// import '../static/css/custom_layerswitcher.css'

interface LayerSwitcherProps {
    mapVM: MapVM
}

const LayerSwitcherPaper = (props: LayerSwitcherProps) => {
    const {mapVM} = props
    const [isLSAdeed, setLSAded] = React.useState(false);
    React.useEffect(() => {
        if (!isLSAdeed) {
            const elem = document.getElementById('div-layer-switcher') as HTMLElement
            elem.innerHTML = "";
            // mapVM.addLayerSwitcher(elem)
            addLayerSwitcher(elem)
            setLSAded(true)
        }
    }, [])
    const addLayerSwitcher = (target: HTMLElement) => {
        let lswitcher = new LayerSwitcher({
            // target:$(".layerSwitcher").get(0),
            target: target,
            // displayInLayerSwitcher: function (l) { return false; },
            show_progress: true,
            extent: true,
            // trash: true,
            oninfo: function (l) { alert(l.get("title")); }
        });
        //@ts-ignore
        lswitcher.on('drawlist', function (e: any) {
            let layer = e.layer;
            if (!(layer instanceof Group) && !(layer.get('baseLayer'))) {
                if (layer.hasOwnProperty('legend')) {
                    //@ts-ignore
                    layer.legend['graphic'].render(e.li);
                } else {
                    //@ts-ignore
                    let features = [];
                    //@ts-ignore
                    if (layer.getSource() instanceof VectorTileSource) {
                        //@ts-ignore
                        let tileGrid = layer.getSource().getTileGrid();
                        //@ts-ignore
                        features = layer.getSource().getFeaturesInExtent(tileGrid.getExtent());
                    }
                    if (features && features.length > 0) {
                        let gType = features[0].getGeometry().getType()
                        //@ts-ignore
                        let img = Legend.getLegendImage({
                            /* given a style  and a geom type*/
                            //@ts-ignore
                            style: layer.getStyle(),
                            typeGeom: gType,
                            // size:[32,16],
                            // margin: 5,

                        });
                        // console.log("img",img)
                        // img.width = img.width/2
                        // img.height = image.height/2
                        e.li.appendChild(img)

                    }

                }
            }
            // document.getElementsByClassName('ol-layerswitcher-buttons')[0].append(e.li)
        })
        mapVM.getMap()?.addControl(lswitcher)
    }

    return (
        <React.Fragment>
            <Paper elevation={2} sx={{height: "100%", m: 0, p: 0}}>
                <AppBar position="static" sx={{height: "30px"}} color={"secondary"}/>

                <div id={"div-layer-switcher"} style={{width: "100%", height: "auto"}}/>
            </Paper>
        </React.Fragment>
    )
}

export default LayerSwitcherPaper
