import { GlobalHelper } from "./global-helper";

export interface result{
	url: string;
	localPath: string;
	isError?: boolean;
	errorText?: string;
}

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
			return {url: `/${Helper.Adapter.namespace}/${CurrentImage}`, localPath: CurrentImage, isError: false};
		}
		return {url: "", localPath: CurrentImage, isError: true};
	}catch(err){
		Helper.ReportingError(err, "Unknown Error", "Local", "getPicture");
		return {url: "", localPath: "", isError: true};
	}
}

export async function updatePictureList(Helper: GlobalHelper): Promise<boolean> {
	try{
		const CurrentImageList = await (Helper.Adapter.readDirAsync("vis.0", "/diashow"));
		if (!(CurrentImageList.length > 0)){
			Helper.ReportingError(null, "No pictures found in folder", "Local", "updatePictureList/List","", false);
			return false;
		} else {
			CurrentImageList.forEach(file =>{
				CurrentImages.push(`/vis.0/diashow/${file.file}`)
			})
		}
		Helper.ReportingInfo("Info", "Local", `${CurrentImageList.length} pictures found`, {JSON: JSON.stringify(CurrentImageList.slice(0, 99))} );
		return true;
	}catch(err) {
		Helper.ReportingError(err, "Unknown Error", "Local", "updatePictureList/List");
		return false;
	}
}