
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Upload file buffer
function uploadBuffer(file, resourceType = "raw", publicId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        public_id: publicId,
        type: "upload",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(uploadStream);
  });
}

// Delete file from Cloudinary
async function deleteFromCloudinary(
  publicId,
  resourceType = "raw"
) {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    type: "upload",
    invalidate: true,
  });

  if (
    result.result !== "ok" &&
    result.result !== "not found"
  ) {
    throw new Error(
      `Cloudinary deletion failed: ${result.result}`
    );
  }

  return result;
}

module.exports = {
  uploadBuffer,
  deleteFromCloudinary,
};
