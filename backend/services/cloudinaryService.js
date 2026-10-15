
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

function uploadBuffer(file, resourceType = "raw") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        public_id: file.originalname,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

module.exports = { uploadBuffer };
