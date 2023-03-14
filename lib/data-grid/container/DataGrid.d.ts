import * as React from "react";
import { Column, Row } from "../TypeDeclaration";
import EnhancedBody from "../components/Body";
export declare const enhancedTableBodyRef: React.RefObject<EnhancedBody>;
interface DataGridProps {
    columns: Column[];
    data: Row[];
    title: string;
    tableHeight: number;
    tableWidth: number | 'auto';
}
declare const DADataGrid: (props: DataGridProps) => JSX.Element;
export default DADataGrid;
