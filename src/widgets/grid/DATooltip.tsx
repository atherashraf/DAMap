import JqxTooltip, {ITooltipProps} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxtooltip";
import * as React from "react";

interface IProps extends ITooltipProps{
    children: JSX.Element
}
class DATooltip extends React.PureComponent<IProps, {}> {
    render() {
        return(
            <React.Fragment>
                <JqxTooltip name={this.props.name} content={this.props.content}
                            width={this.props.width} height={this.props.height }/>
            </React.Fragment>
        )
    }
}
export default DATooltip
