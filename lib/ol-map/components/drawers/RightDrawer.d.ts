import * as React from "react";
interface RightDrawerState {
    open: boolean;
    content: JSX.Element;
}
interface RightDrawerProps {
}
declare class RightDrawer extends React.PureComponent<RightDrawerProps, RightDrawerState> {
    constructor(props: RightDrawerProps);
    openDrawer(): void;
    toggleDrawer(): void;
    addContents(content: JSX.Element): void;
    render(): JSX.Element;
}
export default RightDrawer;
