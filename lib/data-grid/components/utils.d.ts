import { Order } from "../TypeDeclaration";
export declare const descendingComparator: <T>(a: T, b: T, orderBy: keyof T) => 1 | -1 | 0;
declare function getComparator<Key extends keyof any>(order: Order, orderBy: Key): (a: {
    [key in Key]: number | string;
}, b: {
    [key in Key]: number | string;
}) => number;
export default getComparator;
export declare const stableSort: <T>(array: readonly T[], comparator: (a: T, b: T) => number) => T[];
