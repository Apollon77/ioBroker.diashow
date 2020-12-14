"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePictureList = exports.getPicture = void 0;
const axios_1 = __importDefault(require("axios"));
const BingUrl = "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10&mkt=de-DE";
const CurrentImages = [];
let CurrentImage = "";
async function getPicture(Helper) {
    try {
        if (CurrentImages.length === 0) {
            await updatePictureList(Helper);
        }
        if (CurrentImages.length !== 0) {
            if (CurrentImage === "") {
                CurrentImage = CurrentImages[0];
            }
            else {
                if (CurrentImages.indexOf(CurrentImage) === CurrentImages.length - 1) {
                    CurrentImage = CurrentImages[0];
                }
                else {
                    CurrentImage = CurrentImages[CurrentImages.indexOf(CurrentImage) + 1];
                }
            }
            return { url: `/${Helper.Adapter.namespace}/${CurrentImage}`, localPath: CurrentImage, isError: false };
        }
        return { url: "", localPath: CurrentImage, isError: true };
    }
    catch (err) {
        Helper.ReportingError(err, "Unknown Error", "Bing", "getPicture");
        return { url: "", localPath: "", isError: true };
    }
}
exports.getPicture = getPicture;
async function updatePictureList(Helper) {
    const CurrentImagesBing = [];
    // Getting List from Bing.com
    try {
        const WebResult = await axios_1.default.get(BingUrl);
        Helper.ReportingInfo("Debug", "Bing", "Picture list received", { JSON: JSON.stringify(WebResult.data) });
        (WebResult.data).images.forEach(Image => {
            CurrentImagesBing.push("https://bing.com" + Image.url);
        });
    }
    catch (err) {
        Helper.ReportingError(err, "Unknown Error", "Bing", "updatePictureList/List");
        return false;
    }
    // Saving list to files
    try {
        for (const CountElement in CurrentImagesBing) {
            const currentWebCall = await axios_1.default.get(CurrentImagesBing[CountElement], { responseType: "arraybuffer" });
            await Helper.Adapter.writeFileAsync(Helper.Adapter.namespace, `bing/${CountElement}.jpg`, currentWebCall.data);
            CurrentImages.push(`bing/${CountElement}.jpg`);
        }
        Helper.ReportingInfo("Info", "Bing", `${CurrentImages.length} pictures downloaded from Bing`, { JSON: JSON.stringify(CurrentImages.slice(0, 10)) });
        return true;
    }
    catch (err) {
        Helper.ReportingError(err, "Unknown Error", "Bing", "updatePictureList/Download");
        return false;
    }
}
exports.updatePictureList = updatePictureList;
//# sourceMappingURL=diaBing.js.map