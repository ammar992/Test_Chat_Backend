import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from './ApiError.js';
import { getBase64 } from './helper.js';
import fs from 'fs';
import path from 'path';

// Set up your Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloud_name_api,
  api_key: process.env.api_key_cloud,
  api_secret: process.env.api_secret_cloud,
});

// Define your uploadOnCloudinary function
export const uploadOnCloudinary = async (files = []) => {
  if (files.length <= 0) return null;

  const secureUrls = [];
  const fileOrder = [];

  try {
    for (const file of files) {
      const filePath = path.join(file.destination, file.filename);
      const base64File = await getBase64(filePath);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          base64File,
          {
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            // Delete the file after successful upload
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Failed to delete file: ${filePath}`, err);
              } else {
                console.log(`Successfully deleted file: ${filePath}`);
              }
            });
            resolve(result);
          }
        );
      });

      fileOrder.push(file.filename); 
      secureUrls.push(result.secure_url);
    }

    // Rearrange the URLs based on the original file order
    const orderedUrls = files.map((file) => {
      const index = fileOrder.indexOf(file.filename);
      return secureUrls[index];
    });

    // Reverse the order of the URLs
    const reversedUrls = orderedUrls.reverse();

    return reversedUrls;
  } catch (error) {
    new ApiError(400, 'Failed to upload on cloudinary', error.message);
    console.log('Failed to upload to Cloudinary', error.message);
    throw error;
  }
};
