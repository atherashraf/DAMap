import * as React from "react";

interface IState {
    isResizing: boolean
    lastDownY: any
}
interface IProps{
    newMousePos: Function

}
class BottomDrawerResizer extends React.PureComponent<IProps, IState>{
    constructor(props: IProps) {
        super(props);
        this.state = {
            isResizing: false,
            lastDownY: null,
        }
    }
    componentDidMount() {
        document.addEventListener('mousemove', e => this.handleMousemove(e));
        document.addEventListener('mouseup', e => this.handleMouseup());
    }
    handleMousedown(e: any) {
        this.setState({isResizing: true, lastDownY: e.clienYX});
    }

    handleMousemove = (e: any) => {
        // we don't want to do anything if we aren't resizing.
        if (!this.state.isResizing) {
            return;
        }
        this.props.newMousePos(e.clientY)
        // let newSize = document.body.offsetHeight - (e.clientY - document.body.offsetTop);
        // console.log("mouse Y", e.clientY)
        // let newSize = e.clientY
        // let minHeight = 100;
        // let maxHeight = 600;
        // if (newSize > minHeight && newSize < maxHeight) {
        //     // this.setState(() => ({paperHeight: offsetRight}))
        //     this.props.setDrawerSize(newSize)
        //
        // }
    }

    handleMouseup = () => {
        this.setState({isResizing: false});
    }
    render() {
        return (
            <React.Fragment>
                <div
                    id="bottom-drawer-resizer"
                    onMouseDown={event => {
                        this.handleMousedown(event);
                    }}
                    style={{
                        height: "2px",
                        width:"100%",
                        cursor: 'ns-resize',
                        padding: '4px 0 0',
                        borderTop: '1px solid #ddd',
                        position: 'relative',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        zIndex: '100',
                        backgroundColor: '#dadadb'
                        // backgroundColor: "black"
                    }}
                />
            </React.Fragment>
        );
    }
}
export default BottomDrawerResizer
