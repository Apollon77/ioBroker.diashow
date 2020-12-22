"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePictureList = exports.getPicturePrefetch = exports.getPicture = void 0;
const axios_1 = __importDefault(require("axios"));
const path = __importStar(require("path"));
// Connection State for internal use
let synoConnectionState = false;
// Axios instance with options
const synoConnection = axios_1.default.create();
let CurrentImages = [];
let CurrentImage;
let CurrentPicture;
async function getPicture(Helper) {
    try {
        if (!CurrentPicture) {
            await getPicturePrefetch(Helper);
        }
        const CurrentPictureResult = CurrentPicture;
        getPicturePrefetch(Helper);
        return CurrentPictureResult;
    }
    catch (err) {
        Helper.ReportingError(err, "Unknown Error", "Synology", "getPicture");
        return { picture: "", localPath: "", isError: true };
    }
}
exports.getPicture = getPicture;
async function getPicturePrefetch(Helper) {
    // Select Image from list
    try {
        if (CurrentImages.length !== 0) {
            if (!CurrentImage) {
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
        }
    }
    catch (err) {
        Helper.ReportingError(err, "Unknown Error", "Synology", "getPicturePrefetch/Select");
    }
    // Retrieve Image
    try {
        await loginSyno(Helper);
        const synURL = `http://${Helper.Adapter.config.syno_path}/photo/webapi/download.php?api=SYNO.PhotoStation.Download&method=getphoto&version=1&id=${CurrentImage.id}&download=true`;
        const synResult = await synoConnection.get(synURL, { responseType: "arraybuffer" });
        const PicContentB64 = synResult.data.toString("base64");
        CurrentPicture = { picture: `data:image/jpeg;base64,${PicContentB64}`, localPath: `${CurrentImage.id}`, isError: false };
    }
    catch (err) {
        Helper.ReportingError(err, "Unknown Error", "Synology", "getPicturePrefetch/Retrieve");
    }
}
exports.getPicturePrefetch = getPicturePrefetch;
async function updatePictureList(Helper) {
    await loginSyno(Helper);
    const CurrentImageList = [];
    if (synoConnectionState === true) {
        // Retrieve complete list of pictures
        try {
            let synEndOfFiles = false;
            let synOffset = 0;
            while (synEndOfFiles === false) {
                let synURL = `http://${Helper.Adapter.config.syno_path}/photo/webapi/photo.php?api=SYNO.PhotoStation.Photo&method=list&version=1&limit=500&type=photo&offset=${synOffset}`;
                switch (Helper.Adapter.config.syno_order) {
                    case 1:
                        //Filename
                        synURL = synURL + "&sort_by=filename";
                        break;
                    case 2:
                        //Createdate
                        synURL = synURL + "&sort_by=createdate";
                        break;
                    default:
                        //Takendate
                        synURL = synURL + "&sort_by=takendate";
                        break;
                }
                const synResult = await (synoConnection.get(synURL));
                if (synResult.data["success"] === true && Array.isArray(synResult.data["data"]["items"])) {
                    synResult.data["data"]["items"].forEach(element => {
                        CurrentImageList.push(element);
                    });
                    if (synResult.data["data"]["total"] === synResult.data["data"]["offset"]) {
                        synEndOfFiles = true;
                    }
                    else {
                        synOffset = synResult.data["data"]["offset"];
                    }
                }
                else {
                    Helper.ReportingError(null, "Error getting pictures from Synology", "Synology", "updatePictureList/List", JSON.stringify(synResult.data), false);
                    synEndOfFiles = true;
                    return false;
                }
            }
        }
        catch (err) {
            Helper.ReportingError(err, "Unknown Error", "Synology", "updatePictureList/List");
            return false;
        }
        // Filter pictures
        try {
            // Filter for JPEG or JPG files
            const CurrentImageListFilter1 = CurrentImageList.filter(function (file) {
                if (path.extname(file.info.name).toLowerCase() === ".jpg" || path.extname(file.info.name).toLowerCase() === ".jpeg") {
                    return file;
                }
            });
            // Filter for orientation
            if (Helper.Adapter.config.fs_format > 0) {
                CurrentImageListFilter1.filter(function (file) {
                    if ((Helper.Adapter.config.fs_format === 1 && file.info.resolutionx > file.info.resolutiony) === true) {
                        CurrentImages.push(file);
                    }
                    if ((Helper.Adapter.config.fs_format === 2 && file.info.resolutiony > file.info.resolutionx) === true) {
                        CurrentImages.push(file);
                    }
                });
            }
            else {
                CurrentImages = CurrentImageListFilter1;
            }
            // Random order ?
            if (Helper.Adapter.config.syno_order === 3) {
                // See https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
                let currentIndex = CurrentImages.length, temporaryValue, randomIndex;
                // While there remain elements to shuffle...
                while (0 !== currentIndex) {
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    // And swap it with the current element.
                    temporaryValue = CurrentImages[currentIndex];
                    CurrentImages[currentIndex] = CurrentImages[randomIndex];
                    CurrentImages[randomIndex] = temporaryValue;
                }
            }
        }
        catch (err) {
            Helper.ReportingError(err, "Unknown Error", "Synology", "updatePictureList/Filter");
            return false;
        }
        // Images found ?
        if (!(CurrentImages.length > 0)) {
            Helper.ReportingError(null, "No pictures found", "Synology", "updatePictureList", "", false);
            return false;
        }
        else {
            Helper.ReportingInfo("Info", "Synology", `${CurrentImages.length} pictures found`, { JSON: JSON.stringify(CurrentImages.slice(0, 99)) });
            return true;
        }
    }
    else {
        return false;
    }
}
exports.updatePictureList = updatePictureList;
async function loginSyno(Helper) {
    var _a;
    // Check parameters
    try {
        if (Helper.Adapter.config.syno_path === "" || Helper.Adapter.config.syno_path === null) {
            Helper.Adapter.log.error("No name or IP address of Synology PhotoStation configured");
            return false;
        }
        if (Helper.Adapter.config.syno_username === "" || Helper.Adapter.config.syno_username === null) {
            Helper.Adapter.log.error("No user name for Synology PhotoStation configured");
            return false;
        }
        if (Helper.Adapter.config.syno_userpass === "" || Helper.Adapter.config.syno_userpass === null) {
            Helper.Adapter.log.error("No user name for Synology PhotoStation configured");
            return false;
        }
    }
    catch (err) {
        Helper.ReportingError(err, "Unknown error", "Synology", "loginSyno/CheckParameters");
        synoConnectionState = false;
        return false;
    }
    // Run connection check
    if (await synoCheckConnection(Helper) === true) {
        return true;
    }
    else {
        // Run Login
        try {
            const synResult = await (synoConnection.get(`http://${Helper.Adapter.config.syno_path}/photo/webapi/auth.php?api=SYNO.PhotoStation.Auth&method=login&version=1&username=${Helper.Adapter.config.syno_username}&password=${Helper.Adapter.config.syno_userpass}`));
            if (synResult.data["data"]["username"] === Helper.Adapter.config.syno_username) {
                synoConnection.defaults.headers.Cookie = synResult.headers["set-cookie"][0];
                synoConnectionState = true;
                Helper.ReportingInfo("Debug", "Synology", "Synology Login successfull");
                return true;
            }
        }
        catch (err) {
            if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 403) {
                synoConnectionState = false;
                return false;
            }
            else if (err.isAxiosError === true) {
                Helper.Adapter.log.error("No connection to Synology PhotoStation, misconfigured name or IP address");
                synoConnectionState = false;
                return false;
            }
            else {
                Helper.ReportingError(err, "Unknown error", "Synology", "loginSyno/Login");
                synoConnectionState = false;
                return false;
            }
        }
    }
    return false;
}
async function synoCheckConnection(Helper) {
    var _a, _b;
    try {
        const synResult = await (synoConnection.get(`http://${Helper.Adapter.config.syno_path}/photo/webapi/auth.php?api=SYNO.PhotoStation.Auth&method=checkauth&version=1`));
        if (synResult.status === 200) {
            if (((_a = synResult.data.data) === null || _a === void 0 ? void 0 : _a.username) === Helper.Adapter.config.syno_username) {
                synoConnectionState = true;
                return true;
            }
            else {
                synoConnectionState = false;
            }
        }
        else {
            synoConnectionState = false;
        }
    }
    catch (err) {
        if (((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) === 403) {
            synoConnectionState = false;
            return false;
        }
        else if (err.isAxiosError === true) {
            Helper.Adapter.log.error("No connection to Synology PhotoStation, misconfigured name or IP address");
            synoConnectionState = false;
            return false;
        }
        else {
            Helper.ReportingError(err, "Unknown error", "Synology", "synoCheckConnection");
            synoConnectionState = false;
            return false;
        }
    }
    return false;
}
//# sourceMappingURL=diaSynology.js.map