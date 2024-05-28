


import fs from 'fs';
import path from 'path';

export const getBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      const base64Data = data.toString('base64');
      const mimeType = path.extname(filePath).substring(1); // Get the file extension
      resolve(`data:image/${mimeType};base64,${base64Data}`);
    });
  });
};
