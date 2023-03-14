import { RefObject } from "react";
import DASnackbar from "../components/common/DASnackbar";
export declare const MapAPIs: Readonly<{
    API_OAUTH_LOGIN: "api/jwt/oauth/login/{type}/";
    API_REFRESH_TOKEN: "api/jwt/refresh/";
    API_LOGIN: "api/jwt/auth/login/";
    DCH_LAYER_INFO: "api/dch/layer_info/{uuid}/";
    DCH_LAYER_EXTENT: "api/dch/layer_extent/{uuid}/";
    DCH_LAYER_MVT: "api/dch/layer_mvt/{uuid}";
    DCH_LAYER_RASTER: "api/dch/raster_tile/{uuid}";
    DCH_SAVE_STYLE: "api/dch/save_style/{uuid}";
    DCH_LAYER_FIELDS: "api/dch/layer_fields/{uuid}";
    DCH_LAYER_ATTRIBUTES: "api/dch/layer_attributes/{uuid}";
    DCH_LAYER_FIELD_DISTINCT_VALUE: "api/dch/layer_field_distinct_values/{uuid}/{field_name}/{field_type}/";
    DCH_MAP_INFO: "api/dch/get_map_info/{uuid}/";
    DCH_LAYER_PIXEL_VALUE: "api/dch/get_pixel_value/{uuid}/{long}/{lat}/";
    DCH_FEATURE_DETAIL: "api/dch/get_feature_detail/{uuid}/{col_name}/{col_val}/";
    DCH_RASTER_AREA: "api/dch/get_raster_area/{uuid}/{geojson_str}";
    DCH_GET_ALL_LAYERS: "api/dch/get_all_layers/";
}>;
export default class MapApi {
    private snackbarRef;
    constructor(snackbarRef: RefObject<DASnackbar>);
    static getURL(api: string, params?: any): string;
    getAccessToken(): Promise<any>;
    get(apiKey: string, params?: any, isJSON?: boolean): Promise<any>;
    post(apiKey: string, data: any, params?: any, isJSON?: boolean): Promise<any>;
    apiResponse(response: any, isJSON?: boolean): Promise<any>;
}
