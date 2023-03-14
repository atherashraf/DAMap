/// <reference types="react" />
interface IProps {
    dense: boolean;
    page: number;
    rowCount: number;
    rowsPerPage: number;
    handleChangeDense: Function;
    handleChangePage: Function;
    handleChangeRowsPerPage: Function;
}
export declare const GridFooter: (props: IProps) => JSX.Element;
export {};
