import { GlobalHelper } from "./global-helper";
import * as fs from "fs";
import * as path from "path";
import * as imgsize from "image-size";

export interface result{
	picture: string;
	localPath: string;
	isError?: boolean;
	errorText?: string;
}

let CurrentImages: string[] = [];
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
			const PicContent = await fs.readFileSync(`${Helper.Adapter.config.fs_path}/${CurrentImage}`);
			const PicContentB64 = PicContent.toString("base64");
			return {picture: `data:image/jpeg;base64,${PicContentB64}`, localPath: `${Helper.Adapter.config.fs_path}/${CurrentImage}`, isError: false};
		}
		return {picture: "", localPath: "", isError: true};
	}catch(err){
		Helper.ReportingError(err, "Unknown Error", "Filesystem", "getPicture");
		return {picture: "", localPath: "", isError: true};
	}
}

export async function updatePictureList(Helper: GlobalHelper): Promise<boolean> {
	try{
		// Check if folder exists
		if (! await fs.existsSync(Helper.Adapter.config.fs_path)){
			Helper.Adapter.log.error(`Folder ${Helper.Adapter.config.fs_path} does not exist`);
			return false;
		}
		// Filter for JPEG or JPG files
		const CurrentFileList = await fs.readdirSync(Helper.Adapter.config.fs_path);
		CurrentImages = CurrentFileList.filter(function(file){
			if (path.extname(file).toLowerCase() === ".jpg" || path.extname(file).toLowerCase() === ".jpeg"){
				return file;
			}
		})
		// Checking orientation of pictures (landscape or portrait) if configured
		if (Helper.Adapter.config.fs_format !== 0){
			for (const ImageIndex in CurrentImages){
				const ImageSize = await imgsize.imageSize(`${Helper.Adapter.config.fs_path}/${CurrentImages[ImageIndex]}`);
				if (ImageSize.width && ImageSize.height){
					if (Helper.Adapter.config.fs_format === 1 && ImageSize.width < ImageSize.height){
						CurrentImages.splice(parseInt(ImageIndex), 1);
					}
					if (Helper.Adapter.config.fs_format === 2 && ImageSize.height < ImageSize.width){
						CurrentImages.splice(parseInt(ImageIndex), 1);
					}
				}
			}
		}
		// Images found ?
		if (!(CurrentImages.length > 0)){
			Helper.ReportingError(null, "No pictures found in folder", "Filesystem", "updatePictureList","", false);
			return false;
		}else{
			Helper.ReportingInfo("Info", "Filesystem", `${CurrentImages.length} pictures found in folder ${Helper.Adapter.config.fs_path}`, {JSON: JSON.stringify(CurrentImages.slice(0, 99))} );
			return true;
		}
	}catch(err) {
		Helper.ReportingError(err, "Unknown Error", "Filesystem", "updatePictureList");
		return false;
	}
}