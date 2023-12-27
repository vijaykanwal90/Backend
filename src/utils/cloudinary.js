import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
// in this code we are upload the file using multer to the server and save there temporarily and then send it to the database (cloudinary)
// and then we delete that file from the server 
cloudinary.config({ 
    cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
    api_key: 'process.env.CLOUDINARY_API_KEY', 
    api_secret: 'process.env.CLOUDINARY_API_SECRET' 
  });

const uploadOnCloudinary = async (localFilePath) => {
try{    
    if(!localFilePath) return null
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath , {
        resource_type : "auto"
    })
    // file has been uploaded succesfully
    console.log("file is uplaoded on cloudinary" , response.url);
    // console.log();
    return response;
}
catch(error){
 fs.unlinkSync(localFilePath)   // remove the locally saved temporary file as the upload operation got failed
 return null;
}
}

export {uploadOnCloudinary} 