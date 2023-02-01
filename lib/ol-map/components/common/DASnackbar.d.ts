import * as React from 'react';
interface IProp {
}
interface IState {
    open: boolean;
    message: string;
    actions?: JSX.Element;
}
export default class DASnackbar extends React.PureComponent<IProp, IState> {
    constructor(props: IProp);
    setOpen(value: boolean): void;
    handleClose(event: React.SyntheticEvent | Event, reason?: string): void;
    show(message: string, actions?: JSX.Element): void;
    hide(): void;
    render(): JSX.Element;
}
export {};
