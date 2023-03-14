import { Column, Filter, Order, Row } from "../TypeDeclaration";
import * as React from "react";
interface EnhancedBodyProps {
    initData: Row[];
    page: number;
    rowsPerPage: number;
    columns: Column[];
    dense: boolean;
    order: Order;
    orderBy: string;
    selected: readonly number[];
    handleRowClick: Function;
    setRowCount: Function;
}
interface EnhancedBodyState {
    data: Row[];
    isFilterApplied: boolean;
}
declare class EnhancedBody extends React.PureComponent<EnhancedBodyProps, EnhancedBodyState> {
    constructor(props: EnhancedBodyProps);
    setData(data: Row[]): void;
    componentDidUpdate(prevProps: Readonly<EnhancedBodyProps>, prevState: Readonly<EnhancedBodyState>, snapshot?: any): void;
    isRowSelected(rowId: any): boolean;
    applyFilter(filters: Filter[], selectionType: string): void;
    clearFilter(): void;
    render(): JSX.Element;
}
export default EnhancedBody;
