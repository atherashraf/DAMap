export const AlertType = Object.freeze({
    none: "",
    info: "info",
    error: "error",
    warning: "warning",
    success: "success"
});

class CommonUtils {
    static showSnackbar(msg: string, type: typeof AlertType) {
        console.log("snackbar msg", msg)
    }
}

export default CommonUtils
