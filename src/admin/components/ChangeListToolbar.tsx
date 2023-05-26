import * as ReactDOM from "react-dom";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import * as React from "react";
import MapVM from "../../ol-map/models/MapVM";
import {RefObject} from "react";
import JqxGrid from "jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid";
import DATooltip from "../../widgets/grid/DATooltip";
import ChangeList from "./ChangeList";


export interface IToolbarButton {
    id: string
    value: string
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
        const reloadButtonIcon = require("../../static/img/refresh.png");
        const editButtonIcon = require("../../static/img/pencil-icon.png");
        const saveButtonIcon = require("../../static/img/Save-as-icon.png");
        const buttons: IToolbarButton[] = [
            //     {
            //
            //     id: 'reloadButton',
            //     value: 'Reload',
            //     imgSrc: reloadButtonIcon,
            //     onClick: (event?: any) => {
            //         // this.props.daGrid.current!.setOptions({source: this.props.parent.getAdapter()});
            //         // alert("relaod...")
            //         this.props.parent.updateSource()
            //     }
            // },
            {
                id: "edit-button",
                value: "Edit",
                imgSrc: editButtonIcon,
                onClick: () => {
                    // alert("working...")
                    this.props.parent.startEditing();
                }

            }]
        return buttons;
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
        console.log(this.state.buttons);
        return (
            <div style={{overflow: 'hidden', position: 'relative', margin: '5px'}}>
                {this.state.buttons.map((btn) => (
                    <div id={"div-" + btn.id} key={"div-" + btn.id} style={style}>
                        {/*<DATooltip content={btn.value} width={btnStyle.width}*/}
                        {/*           height={btnStyle.height}  name={"tooltip-"+btn.id} >*/}
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
                        {/*</DATooltip>*/}
                    </div>

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
