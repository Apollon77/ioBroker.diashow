/*
 * Created with @iobroker/create-adapter v1.31.0
 */

//#region Imports, Variables and Global
import * as utils from "@iobroker/adapter-core";
import {GlobalHelper} from "./modules/global-helper";
import * as diaBing from "./modules/diaBing";
import * as diaLocal from "./modules/diaLocal";
import * as diaFS from "./modules/diaFS";
import * as diaSyno from "./modules/diaSynology"

let Helper: GlobalHelper;
const MsgErrUnknown = "Unknown Error";

interface Picture{
	url: string;
	path: string;
	info1: string;
	info2: string;
	info3: string;
	date: Date | null ;
}
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
				case 4:
					updatePictureStoreResult = await diaSyno.updatePictureList(Helper);
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
			if (updatePictureStoreResult){
				// Starting updateCurrentPictureTimer action
				this.updateCurrentPictureTimer();
			}
		}catch(err){
			Helper.ReportingError(err, MsgErrUnknown, "updatePictureStoreTimer", "Set Timer");
		}
	}

	private async updateCurrentPictureTimer(): Promise<void>{
		let CurrentPictureResult: Picture | null = null;
		let Provider = "";
		Helper.ReportingInfo("Debug", "Adapter", "updateCurrentPictureTimer occured")
		try{
			this.tUpdateCurrentPictureTimeout && clearTimeout(this.tUpdateCurrentPictureTimeout);
		}catch(err){
			Helper.ReportingError(err, MsgErrUnknown, "updateCurrentPictureTimer", "Clear Timer");
		}
		try{
			switch(this.config.provider){
				case 1:
					CurrentPictureResult = await diaBing.getPicture(Helper);
					Provider = "Bing";
					break;
				case 2:
					CurrentPictureResult = await diaLocal.getPicture(Helper);
					Provider = "Local";
					break;
				case 3:
					CurrentPictureResult = await diaFS.getPicture(Helper);
					Provider = "FileSystem";
					break;
				case 4:
					CurrentPictureResult = await diaSyno.getPicture(Helper);
					Provider = "Synology";
					break;
			}
		}catch(err){
			Helper.ReportingError(err, MsgErrUnknown, "updateCurrentPictureTimer", "Call Timer Action");
		}
		try{
			if (CurrentPictureResult !== null){
				Helper.ReportingInfo("Debug", Provider, `Set picture to ${CurrentPictureResult.path}`)
				// Set picture
				await this.setObjectNotExistsAsync("picture", {
					type: "state",
					common: {
						name: "picture",
						type: "string",
						role: "text",
						read: true,
						write: false,
						desc: "Current picture"
					},
					native: {},
				});
				await this.setStateAsync("picture", { val: CurrentPictureResult.url, ack: true });
				// Set info1
				await this.setObjectNotExistsAsync("info1", {
					type: "state",
					common: {
						name: "info1",
						type: "string",
						role: "text",
						read: true,
						write: false,
						desc: "Info 1 for picture"
					},
					native: {},
				});
				await this.setStateAsync("info1", { val: CurrentPictureResult.info1, ack: true });
				// Set info2
				await this.setObjectNotExistsAsync("info2", {
					type: "state",
					common: {
						name: "info2",
						type: "string",
						role: "text",
						read: true,
						write: false,
						desc: "Info 2 for picture"
					},
					native: {},
				});
				await this.setStateAsync("info2", { val: CurrentPictureResult.info2, ack: true });
				// Set info3
				await this.setObjectNotExistsAsync("info3", {
					type: "state",
					common: {
						name: "info3",
						type: "string",
						role: "text",
						read: true,
						write: false,
						desc: "Info 3 for picture"
					},
					native: {},
				});
				await this.setStateAsync("info3", { val: CurrentPictureResult.info3, ack: true });
				// Set date
				await this.setObjectNotExistsAsync("date", {
					type: "state",
					common: {
						name: "date",
						type: "number",
						role: "date",
						read: true,
						write: false,
						desc: "Date of picture"
					},
					native: {},
				});
				await this.setStateAsync("date", { val: CurrentPictureResult.date?.getTime() || null , ack: true });
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