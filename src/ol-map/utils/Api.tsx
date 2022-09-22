import {RefObject} from "react";
import DASnackbar from "../components/common/DASnackbar";

export const APIs = Object.freeze({
    API_OAUTH_LOGIN: "api/jwt/oauth/login/{type}/",
    API_REFRESH_TOKEN: "api/jwt/refresh/",
    API_LOGIN: "api/jwt/auth/login/",
    DCH_LAYER_INFO: "api/dch/layer_info/{uuid}/",
    DCH_LAYER_EXTENT: "api/dch/layer_extent/{uuid}/",
    // DCH_LAYER_MVT_ZXY: "api/dch/layer_mvt/{uuid}/{z}/{x}/{y}/",
    DCH_LAYER_MVT: "api/dch/layer_mvt/{uuid}",
    DCH_SAVE_STYLE: "api/dch/save_style/{uuid}",
    DCH_LAYER_FIELDS: "api/dch/layer_fields/{uuid}",
    DCH_LAYER_FIELD_DISTINCT_VALUE: "api/dch/layer_field_distinct_values/{uuid}/{field_name}/{field_type}/",
    DCH_MAP_INFO: "api/dch/get_map_info/{uuid}/",
});


export default class Api {
    private snackbarRef: RefObject<DASnackbar>;

    constructor(snackbarRef: RefObject<DASnackbar>) {
        this.snackbarRef = snackbarRef
    }

    static getURL(api: string, params: any = null) {
        const API_URL = process.env.REACT_APP_API_URL;
        let url = `${API_URL}/${api}`;
        url = url.slice(-1) !== "/" ? url + "/" : url;
        let getParamsCount = 0;
        for (const key in params) {
            if (url.includes(key)) {
                url = url.replace(`{${key}}`, params[key]);
            } else {
                if (getParamsCount == 0) {

                    url = `${url}?${key}=${params[key]}`
                } else {
                    url = `${url}&${key}=${params[key]}`
                }
                getParamsCount++
            }
        }
        console.log("url", url)
        return url;
    }

    async getAccessToken() {
        try {
            // const state = store.getState();
            // const refreshToken = state.auth.refreshToken;
            const refreshToken = false;
            if (refreshToken) {
                const url = Api.getURL(APIs.API_REFRESH_TOKEN);
                const response = await fetch(url, {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: new Headers({
                        "Content-Type": "application/json"
                    }),
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify({
                        refresh: refreshToken
                    })
                });
                const data = await response.json();
                // console.log("accessToken", data);
                return data.access;
            }
        } catch (e) {
            this.snackbarRef.current.show("Failed to contact to server. Please ask system administrator.");
        }
    }

    async get(apiKey: string, params: any = {}, isJSON: boolean = true) {
        const accessToken = await this.getAccessToken(); //state.user.accessToken``
        let headers;
        if (accessToken) {
            headers = new Headers({
                "Authorization": "Bearer " + accessToken
            });
        } else {
            headers = new Headers({
                // "Authorization": "Bearer " + accessToken
            });
        }

        const url = Api.getURL(apiKey, params);
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: headers
        });
        const res = await this.apiResponse(response, isJSON);

        return res && res.payload;
    }

    async post(apiKey: string, data: any, params: any = {}, isJSON = true) {
        try {
            const accessToken = await this.getAccessToken(); //state.user.accessToken
            let headers
            if (accessToken) {
                headers = new Headers({
                    "Authorization": "Bearer " + accessToken,
                    "Content-Type": "application/json"
                });
            } else {
                headers = new Headers({
                    "Content-Type": "application/json"
                });
            }
            const url = Api.getURL(apiKey, params);
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: headers,
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            });
            return await this.apiResponse(response, isJSON);

        } catch (e) {
            this.snackbarRef.current.show("Services are not available at this time.");
            console.error(e);
        }
    }

    // async oauth_authenticate(data:any) {
    //
    //     const url = Api.getURL(APIs.API_OAUTH_LOGIN, {"type": "Google"});
    //
    //     const headers = new Headers({
    //         // "Authorization": "Bearer " + accessToken,
    //         "Content-Type": "application/json"
    //     });
    //     const response = await fetch(url, {
    //         method: "POST",
    //         mode: "cors",
    //         cache: "no-cache",
    //         credentials: "same-origin",
    //         headers: headers,
    //         redirect: "follow", // manual, *follow, error
    //         referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //         body: JSON.stringify(data) // body data type must match "Content-Type" header
    //     });
    //     return await this.apiResponse(response, true);
    // }

    // static async authenticate(formData) {
    //     try {
    //         const headers = new Headers({
    //             "X-REQUESTED-WITH": "XMLHttpRequest"
    //         });
    //         const url = Api.getURL(APIs.API_LOGIN);
    //         const response = await fetch(url, {
    //             method: "POST",
    //             mode: "cors",
    //             cache: "no-cache",
    //             credentials: "same-origin",
    //             headers: headers,
    //             redirect: "follow", // manual, *follow, error
    //             referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //             body: formData // body data type must match "Content-Type" header
    //         });
    //         return await this.apiResponse(response, true);
    //     } catch (e) {
    //         CommonUtils.showSnackbar("Failed to authenticate user", AlertType.error);
    //         console.error(e);
    //     }
    // }

    // static async postFile(api_key, formData, params, isJSON = true) {
    //     const accessToken = await this.getAccessToken();
    //
    //     // let data = new FormData();
    //     // data.append("file", document.querySelector("#file-input").files[0]);
    //     let promise = new Promise(function (resolve, reject) {
    //         // executor (the producing code, "singer")
    //         let request = new XMLHttpRequest();
    //         const url = Api.getURL(api_key, params);
    //         request.open("POST", url);
    //         request.setRequestHeader("Authorization", "Bearer " + accessToken);
    //         // request.setRequestHeader("'Access-Control-Allow-Origin'", "*");
    //         // upload progress event
    //         request.upload.addEventListener("progress", function (e) {
    //             // upload progress as percentage
    //             // let percent_completed = (e.loaded / e.total)*100;
    //             // CommonUtils.updateProgress(percent_completed);
    //         });
    //
    //         // request finished event
    //         request.addEventListener("load", function (e) {
    //             // HTTP status message (200, 404 etc)
    //             console.log(request.status);
    //             // request.response holds response from the server
    //             if (request.status === 200) {
    //                 const response = JSON.parse(request.response);
    //                 resolve(response);
    //                 console.log(response);
    //             } else {
    //                 CommonUtils.showSnackbar("Upload Failed with errors", AlertType.error);
    //                 console.log("upload failed", request.response);
    //                 reject("Upload Failed");
    //             }
    //             // CommonUtils.hideProgress();
    //         });
    //         request.addEventListener("error", () => {
    //             CommonUtils.showSnackbar("Upload Failed", AlertType.error);
    //             console.log("upload failed", request.response);
    //             reject("Upload Failed");
    //             // CommonUtils.hideProgress();
    //         });
    //         // send POST request to server
    //         request.send(formData);
    //     });
    //     return promise;
    // }

    // static downloadFile(apiKey, fileName, params = null, isJSON = true) {
    //     try {
    //         this.getAccessToken().then((accessToken) => {
    //             if (accessToken) {
    //                 const headers = new Headers({
    //                     "Authorization": "Bearer " + accessToken
    //                 });
    //                 const url = Api.getURL(apiKey, params);
    //                 fetch(url, {
    //                     method: "GET",
    //                     mode: "cors",
    //                     credentials: "same-origin",
    //                     headers: headers
    //                 }).then((transfer) => {
    //                     return transfer.blob();                 // RETURN DATA TRANSFERED AS BLOB
    //                 }).then((bytes) => {
    //                     let elm = document.createElement("a");  // CREATE A LINK ELEMENT IN DOM
    //                     elm.href = URL.createObjectURL(bytes);  // SET LINK ELEMENTS CONTENTS
    //                     elm.setAttribute("download", fileName); // SET ELEMENT CREATED 'ATTRIBUTE' TO DOWNLOAD, FILENAME PARAM AUTOMATICALLY
    //                     elm.click();                             // TRIGGER ELEMENT TO DOWNLOAD
    //                 }).catch((error) => {
    //                     console.log(error);                     // OUTPUT ERRORS, SUCH AS CORS WHEN TESTING NON LOCALLY
    //                 });
    //             }
    //
    //         });
    //         // const state = store.getState();
    //
    //     } catch (e) {
    //         CommonUtils.showSnackbar("Services are not available at this time.", AlertType.error);
    //         console.error(e);
    //     }
    // }

    // static async postFile (api_key, formData, isJSON = true) {
    //   try {
    //     const accessToken = await this.getAccessToken();
    //     const headers = new Headers({
    //       "X-REQUESTED-WITH": "XMLHttpRequest",
    //       "Authorization": "Bearer " + accessToken
    //     });
    //     const url = Api.getURL(api_key);
    //     const response = await fetch(url, {
    //       method: "POST",
    //       mode: "cors",
    //       cache: "no-cache",
    //       credentials: "same-origin",
    //       headers: headers,
    //       redirect: "follow", // manual, *follow, error
    //       referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //       body: formData // body data type must match "Content-Type" header
    //     });
    //     return await this.apiResponsePayload(response, isJSON);
    //   } catch (e) {
    //     CommonUtils.showSnackbar("Failed to upload files", AlertType.error);
    //     console.error(e);
    //   }
    // }

    async apiResponse(response: any, isJSON: boolean = true) {
        if (response.ok)
            return isJSON ? await response.json() : await response.text();
        else if (response.status === 401)
            this.snackbarRef.current.show("You are unauthorized to submit this request. Please contact project office.");
        // store.dispatch(setAuthentication(false));
        else if (response.status === 400)
            this.snackbarRef.current.show("Bad Request. Please check your parameters...");
        else if (response.status === 204)
            this.snackbarRef.current.show("No related data or content found");
        else
            this.snackbarRef.current.show("Failed to post service. Please contact admin");
        return null;
    }

}
