import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import * as React from "react";
import MapVM from "../../ol-map/models/MapVM";
import {RefObject} from "react";
import JqxGrid from "jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid";
import {Tooltip} from "@mui/material";

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
    title: string
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
            buttons: [
                {
                    id: 'reloadButton',
                    title: 'Reload',
                    imgSrc: reloadBtn,
                    onClick: (event?: any) => {
                        // this.myGrid.current!.setOptions({source: this.myGrid.getAdapter()});
                        // alert("relaod...")
                        props.mapVM?.refreshMap()
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


    render() {
        const style: React.CSSProperties = {float: 'left', marginLeft: '5px'};
        const btnStyle = {
            width: 60,
            height: 25,

        }

        return (
            <div style={{overflow: 'hidden', position: 'relative', margin: '5px'}}>
                {this.state.buttons.map((btn) => (
                    <Tooltip title={btn.title} key={"tooltip"+ btn.id}>
                        <div className={"tooltip"} id={"div-" + btn.id} key={"div-" + btn.id} style={style}>

                            <JqxButton
                                onClick={btn.onClick}
                                key={"btn-" + btn.id}
                                width={btnStyle.width} height={btnStyle.height}
                                // value={btn.title}
                                imgSrc={btn.imgSrc}
                                imgPosition={'center'}
                                textPosition={'center'}
                                textImageRelation={'imageBeforeText'}
                            />
                        </div>

                    </Tooltip>
                ))}
            </div>
        )
    }

}

export default AttributeGridToolbar
