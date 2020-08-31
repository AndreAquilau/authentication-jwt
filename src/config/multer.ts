import multer from 'multer';
import crypto from 'crypto';
import { resolve, extname } from 'path';

export default {
  storage: multer.diskStorage({
    destination: (request, response, callback) => {
      callback(null, resolve(__dirname, '..', '..', 'uploads'));
    },
    filename: (request, file, callback: (err: any, filename?: any) => any) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
