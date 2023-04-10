import {Group, Tile, Vector} from "ol/layer";
import XYZ from "ol/source/XYZ";
// @ts-ignore
import olLegendImage from 'ol-ext/legend/Image';
// @ts-ignore
import clouds_new from "../static/img/legends/clouds_new.JPG"
// @ts-ignore
import precipition_new from "../static/img/legends/precipitation_new.JPG"
// @ts-ignore
import temp_new from "../static/img/legends/temp_new.JPG"
// @ts-ignore
import wind_new from '../static/img/legends/wind_new.JPG'
import GeoJSON from "ol/format/GeoJSON";
import {Cluster} from "ol/source";
import {Icon, Style} from "ol/style";
import VectorSource from "ol/source/Vector";
import MapVM from "../models/MapVM";

class WeatherLayers {
    mapVM: MapVM
    weatherLayersGroup = new Group({
        // @ts-ignore
        title: 'Weather Layers',
        identify: false,
        openInLayerSwitcher: true,
        layers: []
    });
    weatherLayers : any = null;
    open_weather_map_key = 'e9c0f98767ed96cefc3dd01adf8aacf2'

    constructor(mapVM: MapVM) {
        this.mapVM = mapVM
        // this.map = mapVM.getMap()
    }

    addTileWeatherMap = function (layer_type: string) {
        let me = this;
        let layer_name = me.getLayerName(layer_type)
        if (me.weatherLayers === null) {
            me.weatherLayers = [];
            me.map.addLayer(me.weatherLayersGroup);
        }
        let url = 'https://tile.openweathermap.org/map/' + layer_type + '/{z}/{x}/{y}.png?appid=e9c0f98767ed96cefc3dd01adf8aacf2'

        let layer = new Tile({
            // @ts-ignore
            title: layer_name,
            info: 'weather',
            name: layer_name,
            properties: {
                title: layer_name,
                name: layer_name,
            },
            source: new XYZ({
                url: url,
                // @ts-ignore
                crossOrigion: 'anonymous'
            }),
            visible: true,
            opacity: 0.9
        });
        if (!me.weatherLayers[layer_name]) {
            me.weatherLayers[layer_name] = layer;
            let layers = me.weatherLayersGroup.getLayers();
            layers.insertAt(layers.getLength(), layer);
            // me.map.addLayer(me.weatherLayers[layer_name]);
        }
        me.addLegendGraphic(layer_type, layer_name)
    };
    addLegendGraphic = function (layer_type, layer_name) {
        let me = this;
        let isLegendAdded = me.mapVM.isLegendItemExist(me.mapVM.legendPanel, layer_name)
        if (!isLegendAdded) {
            let legends = {
                "clouds_new": clouds_new,
                "precipitation_new": precipition_new,
                "wind_new": wind_new,
                "temp_new": temp_new
            };
            me.mapVM.legendPanel.addItem(new olLegendImage({
                title: layer_name,
                src: legends[layer_type]
            }))
        }
    }
    getLayerName = function (layer_type) {
        let data =
            {
                "clouds_new": "Clouds",
                "precipitation_new": "Precipitation",
                "wind_new": "Wind Speed",
                "temp_new": "Temperature",
                "weather_data": "Weather Data"
            };
        return data[layer_type]
    }
    getWeatherData = function (layer_name) {
        let me = this;
        if (me.weatherLayers === null) {
            me.weatherLayers = [];
            me.map.addLayer(me.weatherLayersGroup);
        }
        if (!me.weatherLayers[layer_name]) {
            let westLng = 70;
            let northLat = 30;
            let eastLng = 74;
            let southLat = 34;
            let geojson = new GeoJSON();
            let requestURLString = "http://api.openweathermap.org/data/2.5/box/city?bbox="
                + westLng + "," + northLat + "," //left top
                + eastLng + "," + southLat + ",10" //right bottom
                + "&cluster=yes&format=json"
                + "&APPID=" + me.open_weather_map_key;
            fetch(requestURLString)
                .then(res => res.json())
                .then(
                    (results) => {
                        if (results.list.length > 0) {
                            let features = [];
                            for (let i = 0; i < results.list.length; i++) {
                                features.push(me.convertWeatherJsonToGeoJson(results.list[i]));
                            }
                            let featuresGeoJson = {'type': 'FeatureCollection', 'features': features};
                            me.createWeatherClusterLayer(featuresGeoJson, layer_name);
                        }
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
    };
    createWeatherClusterLayer = function (geo_json, layer_name) {
        let me = this;
        let vectorSource = new VectorSource({
            features: (new GeoJSON()).readFeatures(geo_json, {
                dataProjection: 'EPSG:4326',
                featureProjection: me.map.getView().getProjection()
            }),
        });
        let clusterSource = new Cluster({
            source: vectorSource,
            distance: 60
        });

        let clusterLayer = new Vector({
            source: clusterSource,
            // @ts-ignore
            title: layer_name,
            info: false,
            properties: {
                title: layer_name,
                name: layer_name,
            },
            name: layer_name,
            style: me.getWeatherFeatureStyle
        });
        me.weatherLayers[layer_name] = clusterLayer;
        me.map.addLayer(me.weatherLayers[layer_name]);
        // me.createWeatherPopUp();
    };
    getWeatherFeatureStyle = function (feature, resolution) {
        let styleCache = {};
        let size = feature.get('features')[0];
        let urlIcon = size.get('icon');
        let style = styleCache[urlIcon];
        if (!style) {
            style = [new Style({
                image: new Icon({
                    src: urlIcon
                }),
            })];
            styleCache[size] = style;
        }
        return style;
    }
    convertWeatherJsonToGeoJson = function (weatherItem) {
        let feature = {
            type: "Feature",
            properties: {
                city: weatherItem.name,
                weather: weatherItem.weather[0].main,
                temperature: weatherItem.main.temp,
                min: weatherItem.main.temp_min,
                max: weatherItem.main.temp_max,
                humidity: weatherItem.main.humidity,
                pressure: weatherItem.main.pressure,
                windSpeed: weatherItem.wind.speed,
                windDegrees: weatherItem.wind.deg,
                windGust: weatherItem.wind.gust,
                icon: "http://openweathermap.org/img/w/"
                    + weatherItem.weather[0].icon + ".png",
                coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]

            },
            geometry: {
                type: "Point",
                coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
            }
        };
        return feature;
    }
}

export default WeatherLayers;
