/*
 * Created with @iobroker/create-adapter v1.31.0
 */

//#region Imports, Variables and Global
import * as utils from "@iobroker/adapter-core";
import * as iobObjectHelper from "iobroker-object-helper";
import {GlobalHelper} from "./modules/global-helper";
import * as diaBing from "./modules/diaBing";
import * as diaLocal from "./modules/diaLocal";
import * as diaFS from "./modules/diaFS";

let Helper: GlobalHelper;
const MsgErrUnknown = "Unknown Error";
//#endregion

class Diashow extends utils.Adapter {

	//#region Basic Adapter Functions

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "diashow",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		try{
			// Init Helper
			Helper = new GlobalHelper(this);

			// Starting updatePictureStoreTimer action
			await this.updatePictureStoreTimer();

			// Starting updateCurrentPictureTimer action
			this.updateCurrentPictureTimer();
		}catch(err){
			Helper.ReportingError(err, MsgErrUnknown, "onReady");
		}
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			clearTimeout(this.tUpdateCurrentPictureTimeout);
			clearTimeout(this.tUpdatePictureStoreTimeout);
			callback();
		} catch (e) {
			callback();
		}
	}

	//#endregion

	//#region Timer and Action

	private tUpdatePictureStoreTimeout: any = null;
	private tUpdateCurrentPictureTimeout: any = null;

	private async updatePictureStoreTimer(): Promise<void>{
		let updatePictureStoreResult = false;
		Helper.ReportingInfo("Debug", "Adapter", "UpdatePictureStoreTimer occured")
		try{
			this.tUpdatePictureStoreTimeout && clearTimeout(this.tUpdatePictureStoreTimeout);
		}catch(err){
			Helper.ReportingError(err, MsgErrUnknown, "updatePictureStoreTimer", "Clear Timer");
		}
		try{
			switch(this.config.provider){
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
		}catch(err){
			Helper.ReportingError(err, MsgErrUnknown, "updatePictureStoreTimer", "Call Timer Action");
		}
		try{
			if (this.config.provider === 1 &&  updatePictureStoreResult){
				this.tUpdatePictureStoreTimeout = setTimeout(() => {
					this.updatePictureStoreTimer();
				}, (this.config.update_interval * 3600000)); // Update every hour if successfull
			}else if (this.config.provider === 1){
				this.tUpdatePictureStoreTimeout = setTimeout(() => {
					this.updatePictureStoreTimer();
				}, (this.config.update_interval * 60000)); // Update every minute if error
			}
		}catch(err){
			Helper.ReportingError(err, MsgErrUnknown, "updatePictureStoreTimer", "Set Timer");
		}
	}

	private async updateCurrentPictureTimer(): Promise<void>{
		let CurrentPicture = "";
		Helper.ReportingInfo("Debug", "Adapter", "updateCurrentPictureTimer occured")
		try{
			this.tUpdateCurrentPictureTimeout && clearTimeout(this.tUpdateCurrentPictureTimeout);
		}catch(err){
			Helper.ReportingError(err, MsgErrUnknown, "updateCurrentPictureTimer", "Clear Timer");
		}
		try{
			switch(this.config.provider){
				case 1:
					const CurrentPictureResultBing: diaBing.result = await diaBing.getPicture(Helper);
					if (CurrentPictureResultBing.url !== ""){
						CurrentPicture = CurrentPictureResultBing.url;
						Helper.ReportingInfo("Debug", "Bing", `Set picture to ${CurrentPicture}`)
					}
					break;
				case 2:
					const CurrentPictureResultLocal: diaLocal.result = await diaLocal.getPicture(Helper);
					if (CurrentPictureResultLocal.url !== ""){
						CurrentPicture = CurrentPictureResultLocal.url;
						Helper.ReportingInfo("Debug", "Local", `Set picture to ${CurrentPicture}`)
					}
					break;
				case 3:
					const CurrentPictureResultFS: diaFS.result = await diaFS.getPicture(Helper);
					if (CurrentPictureResultFS.picture !== ""){
						CurrentPicture = CurrentPictureResultFS.picture;
						Helper.ReportingInfo("Debug", "FileSystem", `Set picture to ${CurrentPictureResultFS.localPath}`)
					}
					break;
			}
			if (CurrentPicture !== ""){
				const iobObject = [iobObjectHelper.buildObject(this, {id: "picture", name: "picture", value: CurrentPicture, objectType: "state", role: "text", description: "Current picture"})];
				await iobObjectHelper.syncObjects(this, iobObject,{ removeUnused: true });
			}
		}catch(err){
			Helper.ReportingError(err, MsgErrUnknown, "updateCurrentPictureTimer", "Call Timer Action");
		}
		try{
			this.tUpdateCurrentPictureTimeout = setTimeout(() => {
				this.updateCurrentPictureTimer();
			}, (this.config.update_interval * 1000));
		}catch(err){
			Helper.ReportingError(err, MsgErrUnknown, "updateCurrentPictureTimer", "Set Timer");
		}
	}

}

if (module.parent) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Diashow(options);
} else {
	// otherwise start the instance directly
	(() => new Diashow())();
}