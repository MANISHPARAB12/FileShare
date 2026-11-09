
const cron = require("node-cron");

const File = require("../models/File");

const {
  deleteFromCloudinary,
} = require("../services/cloudinaryService");

let cleanupRunning = false;

// Run every 10 seconds
cron.schedule("*/10 * * * * *", async () => {
  if (cleanupRunning) {
    return;
  }

  cleanupRunning = true;

  try {
    console.log("\nChecking MongoDB for expired files...");

    const expiredFiles = await File.find({
      expiresAt: { $lte: new Date() },
    }).limit(100);

    console.log("Expired files found:", expiredFiles.length);

    for (const file of expiredFiles) {
      try {
        console.log("Deleting:", file.fileName);
        console.log("Public ID:", file.publicId);

        const result = await deleteFromCloudinary(
          file.publicId,
          file.resourceType
        );

        console.log("Cloudinary response:", result.result);

        // Delete MongoDB record only after Cloudinary succeeds
        await File.deleteOne({
          _id: file._id,
        });

        console.log("MongoDB record deleted:", file.fileName);

      } catch (error) {
        console.error(
          "Deletion failed:",
          file.fileName,
          error.message
        );

        // Record remains in MongoDB for next retry
      }
    }

  } catch (error) {
    console.error("Cleanup scheduler error:", error.message);

  } finally {
    cleanupRunning = false;
  }
});

console.log("MongoDB-based cleanup scheduler started.");
