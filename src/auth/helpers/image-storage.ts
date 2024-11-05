import {diskStorage} from 'multer';
import {v4 as uuidv4} from 'uuid';
import path = require('path');

const fs = require('fs');
//const FileType = require('file-type');

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const saveImageToStorage = {
    storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
            const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            callback(null, `${fileName}${extension}`)
        }
    })
}
