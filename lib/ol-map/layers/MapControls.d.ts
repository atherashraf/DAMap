export default MapControls;
declare class MapControls {
    constructor(mVM: any);
    mapVm: any;
    dialogRef: any;
    setCurserDisplay(curserStyle: any): void;
    displayFeatureInfo(evt: any, mapVm: any, targetElem: any): void;
    getFeatureDetailFromDB(feature: any, mapVm: any, targetElem: any): void;
    getRasterPixelValue(coord: any, mapVM: any, targetElem: any): void;
    getRasterAreaFromDB(polygonJsonStr: any, rasterLayers: any, mapVM: any, targetElem: any): void;
    showJsonDataInHTMLTable(myObj: any, lyrType: any, targetElem: any): void;
    addAccordionsToRightDraw(htmlElem: any): void;
    getRasterLayers(mapVM: any): any[];
    getRasterAreaFromPolygon(mapVM: any, targetElem: any, feature: any): void;
    showAreaInRightDraw(arrData: any, targetElem: any): void;
}
