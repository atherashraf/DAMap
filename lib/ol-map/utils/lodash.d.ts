declare class _ {
    static isEqual: (...objects: any) => any;
    static randomColor: () => string;
    static linearInterpolation: (x: number, p1: [number, number], p2: [number, number]) => number;
    static hex2rgba: (hex: string) => {
        r: number;
        g: number;
        b: number;
        a: number;
    };
}
export default _;
