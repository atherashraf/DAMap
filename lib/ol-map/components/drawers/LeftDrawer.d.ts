import * as React from "react";
interface LeftDrawerState {
    open: boolean;
    content: JSX.Element;
}
interface LeftDrawerProps {
    initState?: boolean;
}
declare class LeftDrawer extends React.PureComponent<LeftDrawerProps, LeftDrawerState> {
    constructor(props: LeftDrawerProps);
    openDrawer(): void;
    toggleDrawer(): void;
    addContents(content: JSX.Element): void;
    render(): JSX.Element;
}
export default LeftDrawer;
