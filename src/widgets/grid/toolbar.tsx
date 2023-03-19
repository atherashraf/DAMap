import * as ReactDOM from "react-dom";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import * as React from "react";
import DAGrid from "./grid";
import {createRoot} from 'react-dom/client';
import MapVM from "../../ol-map/models/MapVM";

const reloadBtn = require("./img/refresh.png");
const zoomBtn = require("./img/search.png")

class GridToolbar {
    private myGrid: any  //React.RefObject<DAGrid>
    private mapVM: MapVM
    constructor(myGrid: any, mapVM: MapVM) {
        this.myGrid = myGrid;
        this.mapVM = mapVM;
    }

    createButtons(): void {
        const reloadRenderer = createRoot(document.getElementById('reloadButton'))
        const btnProps = {
            width: 80,
            height: 25,
            imgPosition: 'center',
            textPosition: 'center'
        }
        reloadRenderer.render(
            <JqxButton
                onClick={(event?: any) => {
                    // this.myGrid.current!.setOptions({source: this.myGrid.getAdapter()});
                    alert("relaod...")
                }}
                width={btnProps.width} height={btnProps.height}
                value={'Reload'} imgSrc={reloadBtn}
                //@ts-ignore
                imgPosition={btnProps.imgPosition} textPosition={btnProps.textPosition}
                textImageRelation={'imageBeforeText'}/>);
        const zoomRenderer = createRoot(document.getElementById('zoomButton'));
        zoomRenderer.render(
            <JqxButton
                onClick={() => {
                    alert("zoom...")
                }}
                width={btnProps.width} height={btnProps.height}
                value={'Zoom'} imgSrc={zoomBtn}
                //@ts-ignore
                imgPosition={btnProps.imgPosition} textPosition={btnProps.textPosition}
                textImageRelation={'imageBeforeText'}/>);

    }

    clearBtnOnClick(): void {
        this.myGrid.current!.clearfilters();
    }

    renderToolbar(toolbar: any) {
        const style: React.CSSProperties = {float: 'left', marginLeft: '5px'};
        const buttonsContainer = (
            <div style={{overflow: 'hidden', position: 'relative', margin: '5px'}}>
                <div id={'reloadButton'} style={style}/>
                <div id={"zoomButton"} style={style}/>
            </div>
        );
        const toolbarRenderer = createRoot(toolbar[0])
        toolbarRenderer.render(buttonsContainer);
    }

}

export default GridToolbar
