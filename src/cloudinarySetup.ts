import { config, uploader } from 'cloudinary';
import {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from './constants';

const cloudinaryConfig = (req: any, res: any, next: any) => {
  config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  next();
};

export { cloudinaryConfig, uploader };
