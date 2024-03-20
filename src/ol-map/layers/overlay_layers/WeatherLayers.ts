import { Group, Tile, Vector } from "ol/layer";
import XYZ from "ol/source/XYZ";
import olLegendImage from "ol-ext/legend/Image";
import clouds_new from "../../static/img/legends/clouds_new.jpg";
import precipition_new from "../../static/img/legends/precipitation_new.jpg";
import temp_new from "../../static/img/legends/temp_new.jpg";
import wind_new from "../../static/img/legends/wind_new.jpg";
import GeoJSON from "ol/format/GeoJSON";
import { Cluster } from "ol/source";
import { Icon, Style } from "ol/style";
import VectorSource from "ol/source/Vector";
import MapVM from "../../models/MapVM";
import autoBind from "auto-bind";
import ol_legend_Item from "ol-ext/legend/Item";

export interface IWeatherLayer {
  uuid: string;
  title: string;
  layer_name: string;
  op: string;
}

export const weatherLayers: IWeatherLayer[] = [
  { uuid: "1", title: "Clouds", layer_name: "clouds_new", op: "CL" },
  {
    uuid: "2",
    title: "Precipitation",
    layer_name: "precipitation_new",
    op: "PAR0",
  },
  { uuid: "3", title: "Wind Speed", layer_name: "wind_new", op: "WND" },
  { uuid: "4", title: "Temperature", layer_name: "temp_new", op: "TA2" },
  { uuid: "5", title: "Weather Data", layer_name: "weather_data", op: "" },
];

class WeatherLayers {
  mapVM: MapVM;
  weatherLayersGroup = new Group({
    // @ts-ignore
    title: "Weather Layers",
    identify: false,
    openInLayerSwitcher: true,
    layers: [],
    zIndex: 1,
  });
  weatherLayers: any = null;
  // open_weather_map_key = 'e9c0f98767ed96cefc3dd01adf8aacf2'
  open_weather_map_key = process.env.REACT_APP_OPENWEATHER_KEY;

  constructor(mapVM: MapVM) {
    this.mapVM = mapVM;
    // this.map = mapVM.getMap()
    autoBind(this);
  }

  getOpenWeather2TileURL(layer_type: any): string {
    let url =
      "http://maps.openweathermap.org/maps/2.0/weather/{op}/{z}/{x}/{y}?appid={API key}";
    url = url.replace(`{op}`, layer_type);
    //@ts-ignore
    url = url.replace(`{API key}`, this.open_weather_map_key);
    return url;
  }

  getOpenWeatherTileURL(layer_type: any): string {
    let url =
      "https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={API key}";
    url = url.replace(`{layer}`, layer_type);
    //@ts-ignore
    url = url.replace(`{API key}`, this.open_weather_map_key);
    return url;
  }

  addTileWeatherMap = function (selectedOption: IWeatherLayer) {
    //@ts-ignore
    let me = this;
    // let layer_title = selectedOption.title
    if (me.weatherLayers === null) {
      me.weatherLayers = [];
      me.mapVM.getMap().addLayer(me.weatherLayersGroup);
    }

    //@ts-ignore
    const url = this.getOpenWeather2TileURL(selectedOption.op);
    // console.log(url)
    let layer = new Tile({
      // @ts-ignore
      title: selectedOption.title,
      info: "weather",
      name: selectedOption.layer_name,
      properties: {
        title: selectedOption.title,
        name: selectedOption.layer_name,
      },
      source: new XYZ({
        url: url,
        // @ts-ignore
        crossOrigion: "anonymous",
      }),
      visible: true,
      opacity: 0.9,
    });
    if (!me.weatherLayers[selectedOption.uuid]) {
      me.weatherLayers[selectedOption.uuid] = layer;
      let layers = me.weatherLayersGroup.getLayers();
      layers.insertAt(layers.getLength(), layer);
      // me.map.addLayer(me.weatherLayers[layer_name]);
    }
    //@ts-ignore
    this.addLegendGraphic(
      layer,
      selectedOption.layer_name,
      selectedOption.title
    );
  };

  addLegendGraphic = function (layer: any, layer_type: any, layer_name: any) {
    //@ts-ignore
    let me = this;
    if (me.mapVM.legendPanel) {
      let isLegendAdded = me.mapVM.isLegendItemExist(
        me.mapVM.legendPanel,
        layer_name
      );
      if (!isLegendAdded) {
        let legends = {
          clouds_new: clouds_new,
          precipitation_new: precipition_new,
          wind_new: wind_new,
          temp_new: temp_new,
        };
        layer.legend = {
          sType: "src",
          // @ts-ignore
          graphic: legends[layer_type],
          width: "100%",
          height: "30px",
        };
        // layer.set('legend', legends[layer_type])
        const img: ol_legend_Item = new olLegendImage({
          title: layer_name,
          // @ts-ignore
          src: legends[layer_type],
        });
        me.mapVM.legendPanel.addItem(img);
      }
    }
  };
  getWeatherData = function (layer_name: any) {
    //@ts-ignore
    let me = this;
    if (me.weatherLayers === null) {
      me.weatherLayers = [];
      me.mapVM.map.addLayer(me.weatherLayersGroup);
    }
    if (!me.weatherLayers[layer_name]) {
      const extent = me.mapVM.getExtent();
      console.log("extent", extent);
      let westLng = extent[0];
      let northLat = extent[3];
      let eastLng = extent[2];
      let southLat = extent[1];
      // let geojson = new GeoJSON();
      let requestURLString =
        "http://api.openweathermap.org/data/2.5/box/city?bbox=" +
        westLng +
        "," +
        northLat +
        "," + //left top
        eastLng +
        "," +
        southLat +
        ",10" + //right bottom
        "&cluster=yes&format=json" +
        "&APPID=" +
        me.open_weather_map_key;
      fetch(requestURLString)
        .then((res) => res.json())
        .then(
          (results) => {
            if (results.list.length > 0) {
              let features = [];
              for (let i = 0; i < results.list.length; i++) {
                //@ts-ignore
                features.push(me.convertWeatherJsonToGeoJson(results.list[i]));
              }
              let featuresGeoJson = {
                type: "FeatureCollection",
                features: features,
              };
              me.createWeatherClusterLayer(featuresGeoJson, layer_name);
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };
  createWeatherClusterLayer = function (geo_json: any, layer_name: any) {
    //@ts-ignore
    let me = this;
    let vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geo_json, {
        dataProjection: "EPSG:4326",
        featureProjection: me.mapVM.getMap().getView().getProjection(),
      }),
    });

    let clusterSource = new Cluster({
      // @ts-ignore
      source: vectorSource,
      distance: 60,
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
      style: me.getWeatherFeatureStyle,
    });
    me.weatherLayers[layer_name] = clusterLayer;
    me.mapVM.getMap().addLayer(me.weatherLayers[layer_name]);
    // me.createWeatherPopUp();
  };
  getWeatherFeatureStyle = function (feature: any) {
    let styleCache = {};
    let size = feature.get("features")[0];
    let urlIcon = size.get("icon");
    // @ts-ignore
    let style = styleCache[urlIcon];
    if (!style) {
      style = [
        new Style({
          image: new Icon({
            src: urlIcon,
          }),
        }),
      ];
      // @ts-ignore
      styleCache[size] = style;
    }
    return style;
  };
  convertWeatherJsonToGeoJson = function (weatherItem: any) {
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
        icon:
          "http://openweathermap.org/img/w/" +
          weatherItem.weather[0].icon +
          ".png",
        coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat],
      },
      geometry: {
        type: "Point",
        coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat],
      },
    };
    return feature;
  };
}

export default WeatherLayers;
