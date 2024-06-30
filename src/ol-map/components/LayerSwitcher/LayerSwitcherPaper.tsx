import { Box, Paper } from "@mui/material";
import * as React from "react";
import MapVM from "../../models/MapVM";
import "./LayerSwitcher.css";
import { Group } from "ol/layer";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import { useEffect } from "react";
import ContextMenu, { IContextMenu } from "./ContextMenu";

interface LayerSwitcherProps {
  mapVM: MapVM;
}

const LayerSwitcherPaper = (props: LayerSwitcherProps) => {
  // const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [contextMenu, setContextMenu] = React.useState<IContextMenu>();
  const [menuLayer, setMenuLayer] = React.useState<any>();
  const { mapVM } = props;
  const [isLSAdded, setLSAdded] = React.useState(false);
  // const legendSize = [60, 40];
  const mouseCoordinatesRef = React.useRef({ x: 0, y: 0 });
  const mouseMoveHandler = React.useCallback((event: any) => {
    mouseCoordinatesRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  },[]);

  const addLayerSwitcher = React.useCallback((target: HTMLElement) => {
    let switcher = new LayerSwitcher({
      target: target,
      //tipLabel: 'Legend', // Optional label for button
      //groupSelectStyle: 'children',
      show_progress: true,
      extent: mapVM.mapExtent,
      trash: true,
      oninfo: function (l: any) {
        setMenuLayer(l);
        setContextMenu({
          mouseX: mouseCoordinatesRef?.current?.x,
          mouseY: mouseCoordinatesRef?.current?.y,
        });
      },
    });
    // lswitcher.on('change', (e)=>{
    //     console.log(e)
    //     alert("changed");
    // })
    // Listen to 'remove' event
    //@ts-ignore
    // switcher.on('remove', function (event) {
    //   const layer = event.layer;
    //   if (layer) {
    //     mapVM.getMap().removeLayer(layer);
    //     // Clean up resources
    //     // Here, you can nullify the layer or perform additional clean-up if needed
    //     layer.dispose ? layer.dispose() : null; // Example of disposing
    //     console.log('Layer removed from layer switcher', layer);
    //   }
    // });
    //@ts-ignore
    switcher.on("drawlist", function (e) {
      const layer: any = e.layer;
      if (
        layer &&
        !(layer instanceof Group) &&
        !layer.get("baseLayer") &&
        layer.hasOwnProperty("legend") &&
        layer?.legend["graphic"] !== "undefined"
      ) {
        const li = document.createElement("li");
        e?.li?.appendChild(li);
        const elem = document.getElementById("div-layer-switcher");
        // const padding = 10;
        let image;
        const divElem = document.createElement("div");
        divElem.style.padding = "10px";
        divElem.addEventListener("click", (e: any) => {
          const dialogRef = mapVM.getDialogBoxRef();
          dialogRef?.current?.openDialog({
            title: "Legend",
            content: (
              <React.Fragment>
                <Box sx={{ flexGrow: 1, p: 1 }}>
                  <img src={e.target.src} alt={""} />
                </Box>
              </React.Fragment>
            ),
          });
        });
        switch (layer.legend["sType"]) {
          case "sld":
            layer.legend["graphic"].render(e.li);
            break;
          case "src":
            image = new Image();
            image.src = layer?.legend["graphic"];
            image.style.width = layer.legend.width;
            if (image.style.height) image.style.height = layer.legend.height;
            // e.li.appendChild(document.createElement('br'))
            // e.li.appendChild(image);
            divElem.appendChild(image);
            e?.li?.appendChild(divElem);
            break;
          case "canvas":
            const graphic = layer?.legend["graphic"];
            const desireWidth = (elem?.clientWidth || 0) / 1.5;

            image = new Image();
            image.src = graphic.toDataURL();
            image.width =
              graphic.width < desireWidth ? graphic.width : desireWidth;
            divElem.appendChild(image);
            e.li?.appendChild(divElem);
            break;
          default:
            break;
        }
      }
      // document.getElementsByClassName('ol-layerswitcher-buttons')[0].append(e.li)
    });
    mapVM.getMap()?.addControl(switcher);
  }, [mapVM,mouseCoordinatesRef]);
  useEffect(() => {
    window.addEventListener("mousedown", mouseMoveHandler);
    if (!isLSAdded) {
      const elem = document.getElementById("div-layer-switcher") as HTMLElement;
      elem.innerHTML = "";
      // mapVM.addLayerSwitcher(elem)
      addLayerSwitcher(elem);
      setLSAdded(true);
    }
  }, [addLayerSwitcher, isLSAdded, mouseMoveHandler]);

  return (
    <React.Fragment>
      <Paper elevation={2} sx={{ height: "100%", width: "100%", m: 0, p: 0 }}>
        <div
          id={"div-layer-switcher"}
          style={{ width: "auto", height: "auto" }}
        />
      </Paper>
      <ContextMenu olLayer={menuLayer} contextMenu={contextMenu} mapVM={mapVM} />
    </React.Fragment>
  );
};

export default LayerSwitcherPaper;
