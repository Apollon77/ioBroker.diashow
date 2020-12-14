"use strict";
/*
 * Created with @iobroker/create-adapter v1.31.0
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
//#region Imports, Variables and Global
const utils = __importStar(require("@iobroker/adapter-core"));
const iobObjectHelper = __importStar(require("iobroker-object-helper"));
const global_helper_1 = require("./modules/global-helper");
const diaBing = __importStar(require("./modules/diaBing"));
const diaLocal = __importStar(require("./modules/diaLocal"));
const diaFS = __importStar(require("./modules/diaFS"));
let Helper;
const MsgErrUnknown = "Unknown Error";
//#endregion
class Diashow extends utils.Adapter {
    //#region Basic Adapter Functions
    constructor(options = {}) {
        super({
            ...options,
            name: "diashow",
        });
        //#endregion
        //#region Timer and Action
        this.tUpdatePictureStoreTimeout = null;
        this.tUpdateCurrentPictureTimeout = null;
        this.on("ready", this.onReady.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        try {
            // Init Helper
            Helper = new global_helper_1.GlobalHelper(this);
            // Starting updatePictureStoreTimer action
            await this.updatePictureStoreTimer();
            // Starting updateCurrentPictureTimer action
            this.updateCurrentPictureTimer();
        }
        catch (err) {
            Helper.ReportingError(err, MsgErrUnknown, "onReady");
        }
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            clearTimeout(this.tUpdateCurrentPictureTimeout);
            clearTimeout(this.tUpdatePictureStoreTimeout);
            callback();
        }
        catch (e) {
            callback();
        }
    }
    async updatePictureStoreTimer() {
        let updatePictureStoreResult = false;
        Helper.ReportingInfo("Debug", "Adapter", "UpdatePictureStoreTimer occured");
        try {
            this.tUpdatePictureStoreTimeout && clearTimeout(this.tUpdatePictureStoreTimeout);
        }
        catch (err) {
            Helper.ReportingError(err, MsgErrUnknown, "updatePictureStoreTimer", "Clear Timer");
        }
        try {
            switch (this.config.provider) {
                case 1:
                    updatePictureStoreResult = await diaBing.updatePictureList(Helper);
                    break;
                case 2:
                    updatePictureStoreResult = await diaLocal.updatePictureList(Helper);
                    break;
                case 3:
                    updatePictureStoreResult = await diaFS.updatePictureList(Helper);
                    break;
            }
        }
        catch (err) {
            Helper.ReportingError(err, MsgErrUnknown, "updatePictureStoreTimer", "Call Timer Action");
        }
        try {
            if (this.config.provider === 1 && updatePictureStoreResult) {
                this.tUpdatePictureStoreTimeout = setTimeout(() => {
                    this.updatePictureStoreTimer();
                }, (this.config.update_interval * 3600000)); // Update every hour if successfull
            }
            else if (this.config.provider === 1) {
                this.tUpdatePictureStoreTimeout = setTimeout(() => {
                    this.updatePictureStoreTimer();
                }, (this.config.update_interval * 60000)); // Update every minute if error
            }
        }
        catch (err) {
            Helper.ReportingError(err, MsgErrUnknown, "updatePictureStoreTimer", "Set Timer");
        }
    }
    async updateCurrentPictureTimer() {
        let CurrentPicture = "";
        Helper.ReportingInfo("Debug", "Adapter", "updateCurrentPictureTimer occured");
        try {
            this.tUpdateCurrentPictureTimeout && clearTimeout(this.tUpdateCurrentPictureTimeout);
        }
        catch (err) {
            Helper.ReportingError(err, MsgErrUnknown, "updateCurrentPictureTimer", "Clear Timer");
        }
        try {
            switch (this.config.provider) {
                case 1:
                    const CurrentPictureResultBing = await diaBing.getPicture(Helper);
                    if (CurrentPictureResultBing.url !== "") {
                        CurrentPicture = CurrentPictureResultBing.url;
                        Helper.ReportingInfo("Debug", "Bing", `Set picture to ${CurrentPicture}`);
                    }
                    break;
                case 2:
                    const CurrentPictureResultLocal = await diaLocal.getPicture(Helper);
                    if (CurrentPictureResultLocal.url !== "") {
                        CurrentPicture = CurrentPictureResultLocal.url;
                        Helper.ReportingInfo("Debug", "Local", `Set picture to ${CurrentPicture}`);
                    }
                    break;
                case 3:
                    const CurrentPictureResultFS = await diaFS.getPicture(Helper);
                    if (CurrentPictureResultFS.picture !== "") {
                        CurrentPicture = CurrentPictureResultFS.picture;
                        Helper.ReportingInfo("Debug", "FileSystem", `Set picture to ${CurrentPictureResultFS.localPath}`);
                    }
                    break;
            }
            if (CurrentPicture !== "") {
                const iobObject = [iobObjectHelper.buildObject(this, { id: "picture", name: "picture", value: CurrentPicture, objectType: "state", role: "text", description: "Current picture" })];
                await iobObjectHelper.syncObjects(this, iobObject, { removeUnused: true });
            }
        }
        catch (err) {
            Helper.ReportingError(err, MsgErrUnknown, "updateCurrentPictureTimer", "Call Timer Action");
        }
        try {
            this.tUpdateCurrentPictureTimeout = setTimeout(() => {
                this.updateCurrentPictureTimer();
            }, (this.config.update_interval * 1000));
        }
        catch (err) {
            Helper.ReportingError(err, MsgErrUnknown, "updateCurrentPictureTimer", "Set Timer");
        }
    }
}
if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options) => new Diashow(options);
}
else {
    // otherwise start the instance directly
    (() => new Diashow())();
}
//# sourceMappingURL=main.js.map