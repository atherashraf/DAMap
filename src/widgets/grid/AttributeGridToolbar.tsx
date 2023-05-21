import * as ReactDOM from "react-dom";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import * as React from "react";
// import DAGrid from "./grid";
import {createRoot} from 'react-dom/client';
import MapVM from "../../ol-map/models/MapVM";
import {RefObject} from "react";
import JqxGrid from "jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid";

import DATooltip from "./DATooltip";

const reloadBtn = require("../../static/img/refresh.png");


interface IProps {
    mapVM: MapVM
    daGrid: RefObject<JqxGrid>

}

interface IState {
    buttons: IToolbarButton[]
}

export interface IToolbarButton {
    id: string
    value: string
    onClick: (e?: Event) => void
    imgSrc: any
}

class AttributeGridToolbar extends React.PureComponent<IProps, IState> {
    // private myGrid: any  //React.RefObject<DAGrid>
    // private mapVM: MapVM
    // constructor(myGrid: any, mapVM: MapVM) {
    //     this.myGrid = myGrid;
    //     this.mapVM = mapVM;
    // }
    constructor(props) {
        super(props);
        this.state = {
            buttons: [{
                id: 'reloadButton',
                value: 'Reload',
                imgSrc: reloadBtn,
                onClick: (event?: any) => {
                    // this.myGrid.current!.setOptions({source: this.myGrid.getAdapter()});
                    alert("relaod...")
                }
            },
                //     {
                //     id: 'zoomButton',
                //     onClick: (event?: any) => {
                //         // this.myGrid.current!.setOptions({source: this.myGrid.getAdapter()});
                //         alert("zoom...")
                //     }
                // }
            ]
        }

    }

    // componentDidMount() {
    //     this.createButtons();
    // }

    addButton(newButton: IToolbarButton[]) {
        this.setState(() => ({buttons: [...this.state.buttons, ...newButton]}))
    }

    // componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
    //     if (prevState?.buttons?.length != this.state?.buttons?.length) {
    //         this.createButtons()
    //     }
    // }

    createButtons(): void {
        // this.state.buttons.forEach((btn: IToolbarButton) => {
        //     const reloadRenderer = createRoot(document.getElementById("div-" + btn.id))
        //     const btnProps = {
        //         width: 80,
        //         height: 25,
        //         imgPosition: 'center',
        //         textPosition: 'center'
        //     }
        //     reloadRenderer.render(
        //         <JqxButton
        //             onClick={btn.onClick}
        //             key={"btn-" + btn.id}
        //             width={btnProps.width} height={btnProps.height}
        //             value={btn.value} imgSrc={btn.imgSrc}
        //             //@ts-ignore
        //             imgPosition={btnProps.imgPosition} textPosition={btnProps.textPosition}
        //             textImageRelation={'imageBeforeText'}/>);
        // });

    }

    // clearBtnOnClick(): void {
    //     this.myGrid.current!.clearfilters();
    // }

    render() {
        const style: React.CSSProperties = {float: 'left', marginLeft: '5px'};
        const btnStyle = {
            width: 60,
            height: 25,

        }

        return (
            <div style={{overflow: 'hidden', position: 'relative', margin: '5px'}}>
                {this.state.buttons.map((btn) => (
                    <div id={"div-" + btn.id} key={"div-" + btn.id} style={style} >
                        <DATooltip content={btn.value} width={btnStyle.width}
                                    height={btnStyle.height}  name={"tooltip-"+btn.id} >
                            {/*<img height={btnStyle.height} src={btn.imgSrc} />*/}

                            <JqxButton
                                    onClick={btn.onClick}
                                    key={"btn-" + btn.id}
                                    width={btnStyle.width} height={btnStyle.height}
                                    // value={btn.value}
                                    imgSrc={btn.imgSrc}
                                    imgPosition={'center'}
                                    textPosition={'center'}
                                    textImageRelation={'imageBeforeText'}
                                />
                        </DATooltip>

                    </div>

                ))}
            </div>
        )
    }

}

export default AttributeGridToolbar
