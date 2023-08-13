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
import autoBind from "auto-bind";
import ol_legend_Legend from "ol-ext/legend/Legend";
import ol_legend_Item from "ol-ext/legend/Item";
import MapApi from "../utils/MapApi";

export interface IWeatherLayer {
    uuid: string
    title: string
    layer_name: string
    op: string
}

export const weatherLayers: IWeatherLayer[] = [
    {"uuid": "1", "title": "Clouds", "layer_name": "clouds_new", op: "CL"},
    {"uuid": "2", "title": "Precipitation", "layer_name": "precipitation_new", op: "PAR0"},
    {"uuid": "3", "title": "Wind Speed", "layer_name": "wind_new", op: "WND"},
    {"uuid": "4", "title": "Temperature", "layer_name": "temp_new", op: "TA2"},
    {"uuid": "5", "title": "Weather Data", "layer_name": "weather_data", op: null}
]

class WeatherLayers {
    mapVM: MapVM
    weatherLayersGroup = new Group({
        // @ts-ignore
        title: 'Weather Layers',
        identify: false,
        openInLayerSwitcher: true,
        layers: []
    });
    weatherLayers: any = null;
    // open_weather_map_key = 'e9c0f98767ed96cefc3dd01adf8aacf2'
    open_weather_map_key = process.env.REACT_APP_OPENWEATHER_KEY

    constructor(mapVM: MapVM) {
        this.mapVM = mapVM
        // this.map = mapVM.getMap()
        autoBind(this)
    }

    getOpenWeather2TileURL(layer_type): string {
        console.log(layer_type)
        let url = "http://maps.openweathermap.org/maps/2.0/weather/{op}/{z}/{x}/{y}?appid={API key}"
        url = url.replace(`{op}`, layer_type)
        url = url.replace(`{API key}`, this.open_weather_map_key)
        return url
    }

    getOpenWeatherTileURL(layer_type): string {
        let url = "https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={API key}"
        url = url.replace(`{layer}`, layer_type)
        url = url.replace(`{API key}`, this.open_weather_map_key)
        return url
    }

    addTileWeatherMap = function (selectedOption: IWeatherLayer) {
        let me = this;
        // let layer_title = selectedOption.title
        if (me.weatherLayers === null) {
            me.weatherLayers = [];
            me.mapVM.getMap().addLayer(me.weatherLayersGroup);
        }

        // const url = this.getOpenWeatherTileURL(selectedOption.layer_name);
        console.log(selectedOption)
        const url = this.getOpenWeather2TileURL(selectedOption.op)
        // console.log(url)
        let layer = new Tile({
            // @ts-ignore
            title: selectedOption.title,
            info: 'weather',
            name: selectedOption.layer_name,
            properties: {
                title: selectedOption.title,
                name: selectedOption.layer_name,
            },
            source: new XYZ({
                url: url,
                // @ts-ignore
                crossOrigion: 'anonymous'
            }),
            visible: true,
            opacity: 0.9
        });
        if (!me.weatherLayers[selectedOption.uuid]) {
            me.weatherLayers[selectedOption.uuid] = layer;
            let layers = me.weatherLayersGroup.getLayers();
            layers.insertAt(layers.getLength(), layer);
            // me.map.addLayer(me.weatherLayers[layer_name]);
        }
        this.addLegendGraphic(layer, selectedOption.layer_name, selectedOption.title)
    };
    addLegendGraphic = function (layer, layer_type: any, layer_name: any) {
        let me = this;
        let isLegendAdded = me.mapVM.isLegendItemExist(me.mapVM.legendPanel, layer_name)
        console.log("isLegendAdded", isLegendAdded)
        if (!isLegendAdded) {
            let legends = {
                "clouds_new": clouds_new,
                "precipitation_new": precipition_new,
                "wind_new": wind_new,
                "temp_new": temp_new
            };
            layer.legend = {
                sType: 'src',
                graphic: legends[layer_type],
                width: "100%",
                height: "30px"
            }
            // layer.set('legend', legends[layer_type])
            const img: ol_legend_Item = new olLegendImage({
                title: layer_name,
                src: legends[layer_type]
            })
            me.mapVM.legendPanel.addItem(img)
        }
    }
    // getLayerName = function (layer_type) {
    //     let data =
    //         {
    //             "clouds_new": "Clouds",
    //             "precipitation_new": "Precipitation",
    //             "wind_new": "Wind Speed",
    //             "temp_new": "Temperature",
    //             "weather_data": "Weather Data"
    //         };
    //     return data[layer_type]
    // }
    getWeatherData = function (layer_name) {
        let me = this;
        if (me.weatherLayers === null) {
            me.weatherLayers = [];
            me.mapVM.map.addLayer(me.weatherLayersGroup);
        }
        if (!me.weatherLayers[layer_name]) {
            const extent = me.mapVM.getExtent()
            console.log("extent", extent)
            let westLng = extent[0];
            let northLat = extent[3];
            let eastLng = extent[2];
            let southLat = extent[1];
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
                featureProjection: me.mapVM.getMap().getView().getProjection()
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
        me.mapVM.getMap().addLayer(me.weatherLayers[layer_name]);
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
