import axios from "axios";
/*
import {
	AxiosResponse,
	AxiosError,
} from "axios";
*/
import { GlobalHelper } from "./global-helper"

export interface result{
	url: string;
	localPath: string;
	isError?: boolean;
}

interface BingPictureListImage{
	url: string,
	any: string|boolean|number
}

interface BingPictureList{
	images: BingPictureListImage[],
	any: any
}

const BingUrl = "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10&mkt=de-DE";
const CurrentImages: string[] = [];
let CurrentImage = "";

export async function getPicture(Helper: GlobalHelper): Promise<result> {
	try{
		if (CurrentImages.length === 0){
			await updatePictureList(Helper);
		}
		if (CurrentImages.length !== 0){
			if (CurrentImage === ""){
				CurrentImage = CurrentImages[0];
			} else {
				if (CurrentImages.indexOf(CurrentImage) === CurrentImages.length - 1){
					CurrentImage = CurrentImages[0];
				} else {
					CurrentImage = CurrentImages[CurrentImages.indexOf(CurrentImage) + 1];
				}
			}
			return {url: CurrentImage, localPath: CurrentImage, isError: false};
		}
		return {url: "", localPath: CurrentImage, isError: true};
	}catch (err){
		Helper.ReportingError(err, "Unknown Error", "Bing", "getPicture");
		return {url: "", localPath: "", isError: true};
	}
}

export async function updatePictureList(Helper: GlobalHelper): Promise<boolean> {
	const CurrentImagesBing: string[] = [] ;
	// Getting List from Bing.com
	try{
		const WebResult = await axios.get(BingUrl);
		Helper.ReportingInfo("Debug", "Bing", "Picture list received", { JSON: JSON.stringify(WebResult.data) });
		((WebResult.data) as BingPictureList).images.forEach(Image =>{
			CurrentImagesBing.push("https://bing.com" + Image.url)
		});
	} catch (err) {
		Helper.ReportingError(err, "Unknown Error", "Bing", "updatePictureList/List");
		return false;
	}
	// Saving list to files
	try{
		for (const CountElement in CurrentImagesBing){
			const currentWebCall = await axios.get(CurrentImagesBing[CountElement],{responseType: "arraybuffer"});
			await Helper.Adapter.writeFileAsync(Helper.Adapter.namespace, `bing/${CountElement}.jpg`, currentWebCall.data)
			CurrentImages.push(`bing/${CountElement}.jpg`);
		}
		Helper.ReportingInfo("Info", "Bing", `${CurrentImages.length} pictures downloaded from Bing`, {JSON: JSON.stringify(CurrentImages.slice(0, 10))} );
		return true;
	} catch (err){
		Helper.ReportingError(err, "Unknown Error", "Bing", "updatePictureList/Download");
		return false;
	}
}