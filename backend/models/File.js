
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      enum: ["image", "video", "raw"],
      required: true,
    },

    shareCode: {
      type: String,
      required: true,
    },

    fileIndex: {
      type: Number,
      required: true,
    },

    size: {
      type: Number,
      default: 0,
    },

    type: {
      type: String,
      default: "application/octet-stream",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Each file index must be unique within its share code.
fileSchema.index(
  { shareCode: 1, fileIndex: 1 },
  { unique: true }
);

fileSchema.index({ expiresAt: 1 });

module.exports = mongoose.model("File", fileSchema);
