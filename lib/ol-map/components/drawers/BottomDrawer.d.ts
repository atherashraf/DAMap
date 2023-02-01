import * as React from "react";
interface BottomDrawerState {
    open: boolean;
    content: JSX.Element;
    container: HTMLElement | null;
}
interface BottomDrawerProps {
    initState: boolean;
    target: string;
}
declare class BottomDrawer extends React.PureComponent<BottomDrawerProps, BottomDrawerState> {
    constructor(props: BottomDrawerProps);
    openDrawer(): void;
    closeDrawer(): void;
    toggleDrawer(): void;
    addContents(content: JSX.Element): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
export default BottomDrawer;
