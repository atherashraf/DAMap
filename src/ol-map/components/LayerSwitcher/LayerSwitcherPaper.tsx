import {AppBar, Paper} from "@mui/material";
import * as React from "react"
import MapVM from "../../models/MapVM";
import "./LayerSwitcher.css";
import {Group} from "ol/layer";
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
            target: target,
            tipLabel: 'Legend', // Optional label for button
            groupSelectStyle: 'children',
            // displayInLayerSwitcher: function (l) { return false; },
            show_progress: true,
            selection: true,
            extent: true,
            trash: true,
            // oninfo: function (l) // alert(l.get("title")); }
        });
        //@ts-ignore
        lswitcher.on('drawlist', function (e) {
            let layer = e.layer;
            if (!(layer instanceof Group) && !(layer.get('baseLayer'))) {
                if (layer.hasOwnProperty('legend') && layer.legend['sType'] === 'sld') {
                    layer.legend['graphic'].render(e.li);
                } else {
                    const li = document.createElement("li");
                    e.li.appendChild(li);
                    if (layer && layer.legend && layer?.legend['graphic'] !== 'undefined') {
                        e.li.appendChild(layer?.legend['graphic']);
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
