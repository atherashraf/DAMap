import {inflateCoordinatesArray} from "ol/geom/flat/inflate";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";

class MapControls {
    mapVm = null;
    dialogRef = null;

    constructor(mVM) {
        this.mapVm = mVM;
        this.dialogRef = mVM.getDialogBoxRef()

    }

    setCurserDisplay(curserStyle) {
        document.getElementById("da-map").style.cursor = curserStyle;
    }

    displayFeatureInfo(pixel, mapVm) {
        let me = this;
        // let dialogRef = this.dialogRef;
        // dialogRef.current?.openDialog({
        //     title: "Create Color Ramp",
        //     content: "shakir",
        //     // actions: <React.Fragment>
        //     //     <Button key={"close-ramp"} onClick={dialogRef.current?.closeDialog}>Close </Button>
        //     // </React.Fragment>
        // })
        let map = mapVm.map;
        const features = [];
        map.forEachFeatureAtPixel(pixel, function (feature, lyr) {
            feature['layer_name'] = lyr.get('name');
            features.push(feature);
        });
        if (features.length > 0) {
            let vectorSource = mapVm.getSelectionLayer().getSource();
            vectorSource.clear();
            let feature = features[0];
            let gType = feature.getGeometry().getType()
            if (gType === 'Polygon' && feature.flatCoordinates_) {
                const inflatedCoordinates = inflateCoordinatesArray(
                    feature.getFlatCoordinates(), // flat coordinates
                    0, // offset
                    feature.getEnds(), // geometry end indices
                    2, // stride
                )
                const polygonFeature = new Feature(new Polygon(inflatedCoordinates));
                polygonFeature.setProperties(feature.getProperties())
                vectorSource.addFeatures([polygonFeature]);
            } else if (gType === 'LineString' && feature.flatCoordinates_) {
                const inflatedCoordinates = inflateCoordinatesArray(
                    feature.getFlatCoordinates(), // flat coordinates
                    0, // offset
                    feature.getEnds(), // geometry end indices
                    2, // stride
                )
                const lineFeature = new Feature(new LineString(inflatedCoordinates[0]));
                lineFeature.setProperties(feature.getProperties())
                vectorSource.addFeatures([lineFeature]);
            }
            let row = '';
            for (let key in feature.getProperties()) {
                row = row + key + ":  " + feature.get(key) + " , "
            }
            me.getFeatureDetailFromDB(row, feature['layer_name']);
            alert(row || '&nbsp');
        } else {
            alert('&nbsp;');
        }
    };

    getFeatureDetailFromDB(row, layer_name) {
        // let url = '/get_feature_detail/?fid=' + row.id + "&layer_name=" + layer_name;
        // $.ajax({
        //     url: url,
        //     type: "GET",
        //     cors: true,
        //     crossDomain: true,
        //     success: function (data) {
        //         data = JSON.parse(data);
        //     },
        //     error: function (xhr, status, error) {
        //         alert(error);
        //     },
        // });
    }
}

export default MapControls;
