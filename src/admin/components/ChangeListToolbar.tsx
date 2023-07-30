import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import * as React from "react";
import {RefObject} from "react";
import JqxGrid from "jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid";
import ChangeList from "./ChangeList";
import {Tooltip} from "@mui/material";


export interface IToolbarButton {
    id: string
    title: string
    onClick: (e?: Event) => void
    imgSrc: any
}

interface IProps {
    // mapVM: MapVM
    daGrid: RefObject<JqxGrid>
    parent: ChangeList
    buttons: IToolbarButton[]
}

interface IState {
    buttons: IToolbarButton[]

}


class ChangeListToolbar extends React.PureComponent<IProps, IState> {

    constructor(props) {
        super(props);
        this.state = {
            buttons: [...this.getBasicButtons(), ...this.props.buttons]
        }

    }

    getBasicButtons(): IToolbarButton[] {
        const editButtonIcon = require("../../static/img/pencil-icon.png");
        const buttons: IToolbarButton[] = [
            {
                id: "edit-button",
                title: "Edit",
                imgSrc: editButtonIcon,
                onClick: () => {
                    // alert("working...")
                    this.props.parent.startEditing();
                }

            }]
        return buttons;
    }


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
                    <Tooltip title={btn.title} key={"tooltip" + btn.id}>
                        <div id={"div-" + btn.id} key={"div-" + btn.id} style={style}>
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
                        </div>
                    </Tooltip>

                ))}
            </div>
        )
    }

}

export default ChangeListToolbar


// import * as ReactDOM from "react-dom";
// import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
// import * as React from "react";
// import {createRoot} from 'react-dom/client';
// import MapVM from "../../ol-map/models/MapVM";
//
// const reloadBtn = require("../../static/img/refresh.png");
// const zoomBtn = require("../../static/img/search.png")
//
//
// class ChangeListToolbar {
//     private grid: any  //React.RefObject<DAGrid>
//     private mapVM: MapVM
//     constructor(myGrid: any) {
//         this.grid = myGrid;
//
//     }
//
//     createButtons(): void {
//         const reloadRenderer = createRoot(document.getElementById('reloadButton'))
//         const btnProps = {
//             width: 80,
//             height: 25,
//             imgPosition: 'center',
//             textPosition: 'center'
//         }
//         reloadRenderer.render(
//             <JqxButton
//                 onClick={(event?: any) => {
//                     // this.myGrid.current!.setOptions({source: this.myGrid.getAdapter()});
//                     alert("relaod...")
//                 }}
//                 width={btnProps.width} height={btnProps.height}
//                 value={'Reload'} imgSrc={reloadBtn}
//                 //@ts-ignore
//                 imgPosition={btnProps.imgPosition} textPosition={btnProps.textPosition}
//                 textImageRelation={'imageBeforeText'}/>);
//         const zoomRenderer = createRoot(document.getElementById('zoomButton'));
//         zoomRenderer.render(
//             <JqxButton
//                 onClick={() => {
//                     alert("zoom...")
//                 }}
//                 width={btnProps.width} height={btnProps.height}
//                 value={'Zoom'} imgSrc={zoomBtn}
//                 //@ts-ignore
//                 imgPosition={btnProps.imgPosition} textPosition={btnProps.textPosition}
//                 textImageRelation={'imageBeforeText'}/>);
//
//     }
//
//     clearBtnOnClick(): void {
//         this.grid.current!.clearfilters();
//     }
//     setButtonContainers(){
//
//     }
//     renderToolbar(toolbar: any) {
//         console.log("toolbar", toolbar)
//         const style: React.CSSProperties = {float: 'left', marginLeft: '5px'};
//         const buttonsContainer = (
//             <div style={{overflow: 'hidden', position: 'relative', margin: '5px'}}>
//                 <div id={'reloadButton'} style={style}/>
//                 <div id={"zoomButton"} style={style}/>
//             </div>
//         );
//         const toolbarRenderer = createRoot(toolbar[0])
//         toolbarRenderer.render(buttonsContainer);
//     }
//
// }
//
// export default ChangeListToolbar
