import CommonUtils, {AlertType} from "./ol-map/utils/CommonUtils";

export const APIs = Object.freeze({
    API_OAUTH_LOGIN: "api/jwt/oauth/login/{type}/",
    API_REFRESH_TOKEN: "api/jwt/refresh/",
    API_LOGIN: "api/jwt/auth/login/",
    DCH_LAYER_INFO: "api/dch/layer_info/{uuid}/",
    DCH_LAYER_EXTENT: "dch/layer_extent/",
    DCH_LAYER_MVT_ZXY: "api/dch/layer_mvt/{uuid}/{z}/{x}/{y}/",
    DCH_LAYER_MVT: "api/dch/layer_mvt/{uuid}",
    DCH_SAVE_STYLE:"api/dch/save_style/{uuid}",
    DCH_LAYER_FIELDS: "api/dch/layer_fields/{uuid}",
    DCH_LAYER_FIELD_VALUE: "api/dch/layer_field_values/{uuid}/{field_name}/{field_type}/"
});


export default class Api {
    static getURL(api, params = null) {
        const port = process.env.port;
        const API_URL = process.env.REACT_APP_API_URL;
        let url = `${API_URL}/${api}`;
        for (const key in params)
            url = url.replace(`{${key}}`, params[key]);

        url = url.slice(-1) !== "/" ? url + "/" : url;
        console.log("url", url)
        return url;
    }

    static async getAccessToken() {
        // try {
        //   const state = store.getState();
        //   const refreshToken = state.auth.refreshToken;
        //   if (refreshToken) {
        //     const url = Api.getURL(APIs.API_REFRESH_TOKEN);
        //     const response = await fetch(url, {
        //       method: "POST",
        //       mode: "cors",
        //       cache: "no-cache",
        //       credentials: "same-origin",
        //       headers: new Headers({
        //         "Content-Type": "application/json"
        //       }),
        //       redirect: "follow", // manual, *follow, error
        //       referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //       body: JSON.stringify({
        //         refresh: refreshToken
        //       })
        //     });
        //     const data = await response.json();
        //     console.log("accessToken", data);
        //     return data.access;
        //   }
        // }catch (e){
        //   CommonUtils.showSnackbar("Failed to contact to server. Please ask system administrator.");
        // }
        return true;
    }

    static async get(apiKey, params = {}, isJSON = true) {
        try {
            const accessToken = await this.getAccessToken(); //state.user.accessToken

            // const state = store.getState();
            if (accessToken) {
                const headers = new Headers({
                    "Authorization": "Bearer " + accessToken
                });

                const url = Api.getURL(apiKey, params);
                const response = await fetch(url, {
                    method: "GET",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    // headers: headers
                });
                const res = await this.apiResponse(response, isJSON);
                return res.payload;
            }
        } catch (e) {
            CommonUtils.showSnackbar("Services are not available at this time.", AlertType.error);
            console.error(e);
        }
    }

    static async post(apiKey, data, params = null, isJSON = true) {
        try {
            // const state = store.getState();
            const accessToken = await this.getAccessToken(); //state.user.accessToken

            // const state = store.getState();
            if (accessToken) {
                const headers = new Headers({
                    // "Authorization": "Bearer " + accessToken,
                    "Content-Type": "application/json"
                });
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
            }
        } catch (e) {
            CommonUtils.showSnackbar("Services are not available at this time.", AlertType.error);
            console.error(e);
        }
    }

    static async oauth_authenticate(data) {

        const url = Api.getURL(APIs.API_OAUTH_LOGIN, {"type": "Google"});

        const headers = new Headers({
            // "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        });
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
        return await this.apiResponse(response, true);
    }

    static async authenticate(formData) {
        try {
            const headers = new Headers({
                "X-REQUESTED-WITH": "XMLHttpRequest"
            });
            const url = Api.getURL(APIs.API_LOGIN);
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: headers,
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: formData // body data type must match "Content-Type" header
            });
            return await this.apiResponse(response, true);
        } catch (e) {
            CommonUtils.showSnackbar("Failed to upload files", AlertType.error);
            console.error(e);
        }
    }

    static async postFile(api_key, formData, params, isJSON = true) {
        const accessToken = await this.getAccessToken();

        // let data = new FormData();
        // data.append("file", document.querySelector("#file-input").files[0]);
        let promise = new Promise(function (resolve, reject) {
            // executor (the producing code, "singer")
            let request = new XMLHttpRequest();
            const url = Api.getURL(api_key, params);
            request.open("POST", url);
            request.setRequestHeader("Authorization", "Bearer " + accessToken);
            // request.setRequestHeader("'Access-Control-Allow-Origin'", "*");
            // upload progress event
            request.upload.addEventListener("progress", function (e) {
                // upload progress as percentage
                // let percent_completed = (e.loaded / e.total)*100;
                // CommonUtils.updateProgress(percent_completed);
            });

            // request finished event
            request.addEventListener("load", function (e) {
                // HTTP status message (200, 404 etc)
                console.log(request.status);
                // request.response holds response from the server
                if (request.status === 200) {
                    const response = JSON.parse(request.response);
                    resolve(response);
                    console.log(response);
                } else {
                    CommonUtils.showSnackbar("Upload Failed with errors", AlertType.error);
                    console.log("upload failed", request.response);
                    reject("Upload Failed");
                }
                // CommonUtils.hideProgress();
            });
            request.addEventListener("error", () => {
                CommonUtils.showSnackbar("Upload Failed", AlertType.error);
                console.log("upload failed", request.response);
                reject("Upload Failed");
                CommonUtils.hideProgress();
            });
            // send POST request to server
            request.send(formData);
        });
        return promise;
    }

    static downloadFile(apiKey, fileName, params = null, isJSON = true) {
        try {
            this.getAccessToken().then((accessToken) => {
                if (accessToken) {
                    const headers = new Headers({
                        "Authorization": "Bearer " + accessToken
                    });
                    const url = Api.getURL(apiKey, params);
                    fetch(url, {
                        method: "GET",
                        mode: "cors",
                        credentials: "same-origin",
                        headers: headers
                    }).then((transfer) => {
                        return transfer.blob();                 // RETURN DATA TRANSFERED AS BLOB
                    }).then((bytes) => {
                        let elm = document.createElement("a");  // CREATE A LINK ELEMENT IN DOM
                        elm.href = URL.createObjectURL(bytes);  // SET LINK ELEMENTS CONTENTS
                        elm.setAttribute("download", fileName); // SET ELEMENT CREATED 'ATTRIBUTE' TO DOWNLOAD, FILENAME PARAM AUTOMATICALLY
                        elm.click();                             // TRIGGER ELEMENT TO DOWNLOAD
                    }).catch((error) => {
                        console.log(error);                     // OUTPUT ERRORS, SUCH AS CORS WHEN TESTING NON LOCALLY
                    });
                }

            });
            // const state = store.getState();

        } catch (e) {
            CommonUtils.showSnackbar("Services are not available at this time.", AlertType.error);
            console.error(e);
        }
    }

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

    static async apiResponse(response, isJSON = true) {
        // console.log("res", response);
        if (response.ok)
            return isJSON ? await response.json() : await response.text();
        else if (response.status === 401)
            CommonUtils.showSnackbar("You are unauthorized to submit this request. Please contact project office.", AlertType.error);
        // store.dispatch(setAuthentication(false));
        else if (response.status === 400)
            CommonUtils.showSnackbar("Bad Request. Please check your parameters...");
        else if (response.status === 204)
            CommonUtils.showSnackbar("No related data or content found", AlertType.error);
        else
            CommonUtils.showSnackbar("Failed to post service. Please contact admin", AlertType.error);
        return null;
    }

}

