import path from "path";
import { Request } from 'express'
import multer, { diskStorage, FileFilterCallback, Multer, StorageEngine  } from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage: StorageEngine = diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
    callback(null, path.join('public/images'));
  },
  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    let extArr = file.originalname.split('.');
    let ext = extArr[extArr.length-1];
    callback(null, `img-${Date.now()}.${ext}`);
  }
});

const upload: Multer = multer({ 
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      callback(null, true);
    }else {
      return callback(new Error('Invalid mime type'));
    }
  } 
});

export default upload;