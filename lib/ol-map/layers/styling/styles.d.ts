export function clusterStyle(features: any, selected?: boolean): Style;
export namespace styles {
    const Point: Style;
    const LineString: Style;
    const MultiLineString: Style;
    const MultiPoint: Style;
    const MultiPolygon: Style;
    const Polygon: Style;
    const LinearRing: Style;
    const GeometryCollection: Style;
    const Circle: Style;
}
export namespace selectionStyle {
    const Point_1: Style;
    export { Point_1 as Point };
    const MultiPoint_1: Style;
    export { MultiPoint_1 as MultiPoint };
    const LineString_1: Style;
    export { LineString_1 as LineString };
    const MultiLineString_1: Style;
    export { MultiLineString_1 as MultiLineString };
    const Polygon_1: Style;
    export { Polygon_1 as Polygon };
    const MultiPolygon_1: Style;
    export { MultiPolygon_1 as MultiPolygon };
    const GeometryCollection_1: Style;
    export { GeometryCollection_1 as GeometryCollection };
}
import { Style } from "ol/style";
