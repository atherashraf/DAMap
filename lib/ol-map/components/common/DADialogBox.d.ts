import * as React from "react";
interface IProps {
}
interface DialogData {
    title?: string;
    content: JSX.Element;
    actions?: JSX.Element;
}
interface IState {
    open: boolean;
    title?: string;
    content: JSX.Element;
    actions?: JSX.Element;
}
declare class DADialogBox extends React.PureComponent<IProps, IState> {
    constructor(props: IProps);
    closeDialog(): void;
    openDialog(data: DialogData): void;
    updateContents(content: JSX.Element): void;
    render(): JSX.Element;
}
export default DADialogBox;
