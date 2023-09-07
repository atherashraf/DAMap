import {Paper} from "@mui/material";
import * as React from "react"
import MapVM from "../../models/MapVM";
import "./LayerSwitcher.css";
import {Group} from "ol/layer";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import {useEffect} from "react";
import LayerMenu, {IContextMenu} from "./LayerMenu";

interface LayerSwitcherProps {
    mapVM: MapVM
}

const LayerSwitcherPaper = (props: LayerSwitcherProps) => {
    // const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [contextMenu, setContextMenu] = React.useState<IContextMenu | null>(null)
    const [menuLayer, setMenuLayer] = React.useState(null)
    const {mapVM} = props
    const [isLSAdded, setLSAdded] = React.useState(false);
    const legendSize = [60, 40]
    let mouseCoordinates = {x: 0, y: 0}
    const mouseMoveHandler = (event) => {
        mouseCoordinates = {
            x: event.clientX,
            y: event.clientY
        }

    }

    const addLayerSwitcher = (target: HTMLElement) => {
        let switcher = new LayerSwitcher({
            target: target,
            //tipLabel: 'Legend', // Optional label for button
            //groupSelectStyle: 'children',
            show_progress: true,
            extent: mapVM.mapExtent,
            trash: true,
            oninfo: function (l) {
                setMenuLayer(l)
                setContextMenu({mouseX: mouseCoordinates.x, mouseY: mouseCoordinates.y})
            }
        });
        // lswitcher.on('change', (e)=>{
        //     console.log(e)
        //     alert("changed");
        // })
        //@ts-ignore
        switcher.on('drawlist', function (e) {
            const layer: any = e.layer;
            if (layer && !(layer instanceof Group) && !(layer.get('baseLayer'))
                && layer.hasOwnProperty('legend') && layer?.legend['graphic'] !== 'undefined') {
                const li = document.createElement("li");
                e.li.appendChild(li);
                // const graphic = layer?.legend['graphic']
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
                    case "canvas":
                        // layer.legend['graphic'].render(e.li);
                        e.li.appendChild(layer?.legend['graphic']);
                        // const graphic = layer?.legend['graphic']
                        // if(Array.isArray(graphic)){
                        //     graphic.forEach((g)=>{
                        //         image = new Image();
                        //         image.src = g.toDataURL();
                        //         image.width = imageSize[0]
                        //         image.height = imageSize[1]
                        //         e.li.appendChild(image);
                        //         e.li.appendChild(document.createElement('br'))
                        //     })
                        // }else {
                        // image = new Image();
                        // image.src = graphic.toDataURL();
                        // image.width = imageSize[0]
                        // image.height = imageSize[1]
                        // e.li.appendChild(document.createElement('br'))
                        // e.li.appendChild(image);
                        // }
                        break;
                    default:
                        break;
                }
            }
            // document.getElementsByClassName('ol-layerswitcher-buttons')[0].append(e.li)
        })
        mapVM.getMap()?.addControl(switcher)
    }
    useEffect(() => {
        window.addEventListener('mousedown', mouseMoveHandler);
        if (!isLSAdded) {
            const elem = document.getElementById('div-layer-switcher') as HTMLElement
            elem.innerHTML = "";
            // mapVM.addLayerSwitcher(elem)
            addLayerSwitcher(elem)
            setLSAdded(true)
        }


    }, [])


    return (
        <React.Fragment>
            <Paper elevation={2} sx={{height: "100%", width: "100%", m: 0, p: 0}}>
                <div id={"div-layer-switcher"} style={{width: "auto", height: "auto"}}/>
            </Paper>
            <LayerMenu layer={menuLayer} contextMenu={contextMenu} mapVM={mapVM}/>
        </React.Fragment>
    )
}

export default LayerSwitcherPaper
