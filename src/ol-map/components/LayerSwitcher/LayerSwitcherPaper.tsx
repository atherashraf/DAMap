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
    const legendSize = [60, 40]
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
            //tipLabel: 'Legend', // Optional label for button
            //groupSelectStyle: 'children',
            show_progress: true,
            //selection: true,
            //@ts-ignore
            extent: true,
            trash: true,
            // oninfo: function (l) // alert(l.get("title")); }
        });
        //@ts-ignore
        lswitcher.on('drawlist', function (e) {
            const layer: any = e.layer;
            if (layer && !(layer instanceof Group) && !(layer.get('baseLayer'))
                && layer.hasOwnProperty('legend') && layer?.legend['graphic'] !== 'undefined') {
                const li = document.createElement("li");
                e.li.appendChild(li);


                const graphic = layer?.legend['graphic']
                const imageSize = [60, 40]
                let image = null;
                    switch (layer.legend['sType']) {
                    case "sld":
                        layer.legend['graphic'].render(e.li);
                        break
                    case "src":
                        image = new Image();
                        image.src = layer?.legend['graphic'];
                        image.style.width = layer.legend.width
                        if (image.style.height)
                            image.style.height = layer.legend.height
                        e.li.appendChild(document.createElement('br'))
                        e.li.appendChild(image);
                        break;
                    case "ol":
                        // e.li.appendChild(layer?.legend['graphic']);
                        image = new Image();
                        image.src = graphic.toDataURL();
                        image.width = imageSize[0]
                        image.height = imageSize[1]
                        // e.li.appendChild(document.createElement('br'))
                        e.li.appendChild(image);
                        break;
                    default:
                        break;
                }
            }
            // document.getElementsByClassName('ol-layerswitcher-buttons')[0].append(e.li)
        })
        mapVM.getMap()?.addControl(lswitcher)
    }

    return (
        <React.Fragment>
            <Paper elevation={2} sx={{height: "100%", m: 0, p: 0}}>
                <div id={"div-layer-switcher"} style={{width: "100%", height: "auto"}}/>
            </Paper>
        </React.Fragment>
    )
}

export default LayerSwitcherPaper
