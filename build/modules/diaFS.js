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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePictureList = exports.getPicture = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const imgsize = __importStar(require("image-size"));
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
            const PicContent = await fs.readFileSync(CurrentImage);
            const PicContentB64 = PicContent.toString("base64");
            return { picture: `data:image/jpeg;base64,${PicContentB64}`, localPath: `${Helper.Adapter.config.fs_path}/${CurrentImage}`, isError: false };
        }
        return { picture: "", localPath: "", isError: true };
    }
    catch (err) {
        Helper.ReportingError(err, "Unknown Error", "Filesystem", "getPicture");
        return { picture: "", localPath: "", isError: true };
    }
}
exports.getPicture = getPicture;
async function updatePictureList(Helper) {
    try {
        // Check if folder exists
        if (!await fs.existsSync(Helper.Adapter.config.fs_path)) {
            Helper.Adapter.log.error(`Folder ${Helper.Adapter.config.fs_path} does not exist`);
            return false;
        }
        // Filter for JPEG or JPG files
        const CurrentFileList = await getAllFiles(Helper.Adapter.config.fs_path);
        Helper.ReportingInfo("Info", "Filesystem", `${CurrentFileList.length} total files found in folder ${Helper.Adapter.config.fs_path}`, { JSON: JSON.stringify(CurrentFileList.slice(0, 99)) });
        const CurrentImageList = CurrentFileList.filter(function (file) {
            if (path.extname(file).toLowerCase() === ".jpg" || path.extname(file).toLowerCase() === ".jpeg" || path.extname(file).toLowerCase() === ".png") {
                return file;
            }
        });
        // Checking orientation of pictures (landscape or portrait) if configured
        if (Helper.Adapter.config.fs_format !== 0) {
            for (const ImageIndex in CurrentImageList) {
                const ImageSize = await imgsize.imageSize(CurrentImageList[ImageIndex]);
                if (ImageSize.width && ImageSize.height) {
                    if ((Helper.Adapter.config.fs_format === 1 && ImageSize.width > ImageSize.height) === true) {
                        CurrentImages.push(CurrentImageList[ImageIndex]);
                    }
                    if ((Helper.Adapter.config.fs_format === 2 && ImageSize.height > ImageSize.width) === true) {
                        CurrentImages.push(CurrentImageList[ImageIndex]);
                    }
                }
            }
        }
        // Images found ?
        if (!(CurrentImages.length > 0)) {
            Helper.ReportingError(null, "No pictures found in folder", "Filesystem", "updatePictureList", "", false);
            return false;
        }
        else {
            Helper.ReportingInfo("Info", "Filesystem", `${CurrentImages.length} pictures found in folder ${Helper.Adapter.config.fs_path}`, { JSON: JSON.stringify(CurrentImages.slice(0, 99)) });
            return true;
        }
    }
    catch (err) {
        Helper.ReportingError(err, "Unknown Error", "Filesystem", "updatePictureList");
        return false;
    }
}
exports.updatePictureList = updatePictureList;
async function getAllFiles(dirPath, _arrayOfFiles = []) {
    const files = await fs.readdirSync(dirPath);
    _arrayOfFiles = _arrayOfFiles || [];
    files.forEach(async function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            _arrayOfFiles = await getAllFiles(dirPath + "/" + file, _arrayOfFiles);
        }
        else {
            _arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });
    return _arrayOfFiles;
}
//# sourceMappingURL=diaFS.js.map