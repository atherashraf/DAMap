import * as React from "react";
import { IBaseMapProps, IRule } from "../../../TypeDeclaration";
interface IProps extends IBaseMapProps {
    styleList: IRule[];
    updateStyleItem: Function;
    maxHeight?: number;
    title?: string;
}
interface IState {
}
export default class LegendGrid extends React.PureComponent<IProps, IState> {
    render(): JSX.Element;
}
export {};
