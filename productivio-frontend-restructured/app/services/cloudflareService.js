//Handles upload/download/delete logic using that client
//Stores the file and returns the object key

// app/services/cloudflareService.js

import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/r2Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//use AWS SDK v3 to send this file to Cloudflare R2 bucket
export const uploadFileToR2 = async ({ buffer, mimetype, key }) => {
  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  };

  await r2Client.send(new PutObjectCommand(uploadParams));
  return key;
};


// DELETE a file from Cloudflare R2
export const deleteFileFromR2 = async (key) => {
    const deleteParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    };
  
    await r2Client.send(new DeleteObjectCommand(deleteParams));
  };
  
  // GET a temporary signed download URL (valid for 1 hour)
  export const getSignedUrlForR2 = async (key) => {
    const getParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    };
  
    const command = new GetObjectCommand(getParams);
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 hour
    return signedUrl;
  };
