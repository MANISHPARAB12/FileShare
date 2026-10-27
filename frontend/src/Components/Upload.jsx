import { useState } from "react";

import { QRCodeSVG } from "qrcode.react";

const MAX_FILES = 10;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8956"
).replace(/\/+$/, "");

function Upload() {
  const [files, setFiles] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [uploaded, setUploaded] = useState(null);

  const [dragActive, setDragActive] = useState(false);

  const [copiedItem, setCopiedItem] = useState("");

  // Add and validate selected files.

  function addFiles(selectedFiles) {
    setError("");
    setSuccess("");

    const selected = Array.from(selectedFiles || []);

    if (selected.length === 0) return;

    // Check EXE extensions before checking file size.
    const executableFile = selected.find((file) =>
      file.name.toLowerCase().endsWith(".exe")
    );

    if (executableFile) {
      setError(
        `${executableFile.name} is not uploadable. EXE files are not allowed.`
      );
      return;
    }

    if (files.length + selected.length > MAX_FILES) {
      setError(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    const validFiles = [];

    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} exceeds the 10 MB file size limit.`);
        return;
      }

      const duplicate = files.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
      );

      const duplicateInSelection = validFiles.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
      );

      if (!duplicate && !duplicateInSelection) {
        validFiles.push(file);
      }
    }

    setFiles((previous) => [...previous, ...validFiles]);
  }

  function handleFileChange(event) {
    if (event.target.files) {
      addFiles(event.target.files);
    }

    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();

    setDragActive(false);

    if (event.dataTransfer.files) {
      addFiles(event.dataTransfer.files);
    }
  }

  function removeFile(indexToRemove) {
    setFiles((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );
  }

  function formatFileSize(size) {
    if (size < 1024) return `${size} B`;

    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  // Copy URL or PIN and show confirmation.

  async function copyText(text, itemName = "Text") {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");

        textArea.value = text;

        textArea.style.position = "fixed";

        textArea.style.left = "-9999px";

        textArea.style.top = "0";

        document.body.appendChild(textArea);

        textArea.focus();

        textArea.select();

        const copied = document.execCommand("copy");

        textArea.remove();

        if (!copied) {
          throw new Error("Copy command failed.");
        }
      }

      setCopiedItem(itemName);

      setError("");

      window.setTimeout(() => {
        setCopiedItem((current) => (current === itemName ? "" : current));
      }, 2500);
    } catch (err) {
      console.error("Copy error:", err);

      setError(`Unable to copy ${itemName}. Please copy it manually.`);
    }
  }

  // Upload selected files to the backend.

  async function handleUpload() {
    if (files.length === 0) {
      setError("Please select at least one file.");

      return;
    }

    setUploading(true);

    setError("");

    setSuccess("");

    setUploaded(null);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        `${API_BASE_URL}/api/files/upload`,

        {
          method: "POST",

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.shareCode) {
        throw new Error(data.message || "File upload failed.");
      }

      // Build the URL for the current frontend.

      const shareUrl = new URL(
        "/download",

        window.location.origin
      );

      shareUrl.searchParams.set("pin", data.shareCode);

      setUploaded({
        ...data,

        shareUrl: shareUrl.toString(),
      });

      setFiles([]);

      setSuccess("Files uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);

      setError(err.message || "Unable to upload files.");
    } finally {
      setUploading(false);
    }
  }

  function handleNewUpload() {
    setFiles([]);

    setUploaded(null);

    setError("");

    setSuccess("");

    setCopiedItem("");
  }

  return (
    <div className="w-full px-20">
      {!uploaded && (
        <div>
          <div className="mb-8 text-center mt-5">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Share your files
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600 mt-5">
              Select your files or drag and drop them below to create a sharing
              link.
            </p>
          </div>

          {/* Drag and drop area */}

          <div
            onDragOver={(event) => {
              event.preventDefault();

              setDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();

              setDragActive(false);
            }}
            onDrop={handleDrop}
            className={`flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition ${
              dragActive
                ? "border-purple-600 bg-purple-100"
                : "border-purple-300 bg-purple-50/60 hover:border-purple-500"
            }`}
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />

                <path d="m17 8-5-5-5 5" />

                <path d="M5 21h14" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Drag & drop your files here
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Or select files from your computer.
            </p>

            <label className="mt-6 cursor-pointer rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-purple-700">
              Select Files
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <p className="mt-4 text-xs text-gray-500">
              Maximum 10 files · 10 MB per file
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          {files.length > 0 && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Selected files</h3>

                  <p className="text-sm text-gray-500">
                    {files.length} file(s)
                  </p>
                </div>

                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                  {files.length}/{MAX_FILES}
                </span>
              </div>

              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-800">
                        {file.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove ${file.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-4 font-bold text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading
                  ? "Uploading files..."
                  : `Upload ${files.length} file(s)`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Share panel */}

      {uploaded && (
        <div className="mt-4">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900">
              Your files are ready!
            </h2>

            <p className="mt-2 text-gray-600">
              Share the link or scan the QR code to access your files.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Instructions and sharing information */}

              <div className="p-6 sm:p-8 lg:p-10 ">
                <h3 className="text-2xl font-bold text-gray-900">
                  Share your files
                </h3>

                <p className="mt-2 text-gray-500">
                  Use the QR code or share URL to access your files.
                </p>

                <div className="mt-7 space-y-5">
                  {[
                    {
                      title: "Open FileShare",

                      description:
                        "Open FileShare on the device where you want to receive the files.",
                    },

                    {
                      title: "Scan this QR code",

                      description:
                        "Use your phone camera to scan the code displayed on the right.",
                    },

                    {
                      title: "Enter your PIN",

                      description:
                        "Enter the sharing PIN to access your files.",
                    },
                  ].map((step, index) => (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {step.title}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Share URL */}

                <div className="mt-8">
                  <label
                    htmlFor="share-url"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Share URL
                  </label>

                  <div className="flex min-w-0 gap-2">
                    <input
                      id="share-url"
                      type="text"
                      readOnly
                      value={uploaded.shareUrl}
                      className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-700 outline-none focus:border-purple-500"
                    />

                    <button
                      type="button"
                      onClick={() => copyText(uploaded.shareUrl, "Share URL")}
                      className="shrink-0 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700"
                    >
                      {copiedItem === "Share URL" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* PIN */}

                <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Sharing PIN
                      </p>

                      <p className="mt-1 break-all text-2xl font-extrabold tracking-[0.2em] text-purple-700">
                        {uploaded.shareCode}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyText(uploaded.shareCode, "PIN")}
                      className="rounded-xl border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
                    >
                      {copiedItem === "PIN" ? "PIN Copied!" : "Copy PIN"}
                    </button>
                  </div>
                </div>

                {/* Visible copy confirmation */}

                {copiedItem && (
                  <p
                    role="status"
                    className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                  >
                    <span className="mr-2">✓</span>

                    {copiedItem === "PIN"
                      ? "PIN copied successfully!"
                      : "Share URL copied successfully!"}
                  </p>
                )}

                {error && (
                  <p
                    role="alert"
                    className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600"
                  >
                    {error}
                  </p>
                )}
              </div>

              {/* QR code */}

              <div className="flex min-h-[420px] flex-col items-center justify-center bg-gray-50 p-6 sm:p-10">
                <h3 className="text-xl font-bold text-gray-900">
                  Scan to open FileShare
                </h3>

                <p className="mt-2 max-w-sm text-center text-sm leading-6 text-gray-500">
                  Point your phone camera at this QR code to open your FileShare
                  download page.
                </p>

                <div className="mt-7 rounded-3xl border border-gray-200 bg-white p-5 shadow-md">
                  <QRCodeSVG
                    value={uploaded.shareUrl}
                    size={230}
                    level="H"
                    includeMargin
                    bgColor="#ffffff"
                    fgColor="#111827"
                  />
                </div>

                <p className="mt-5 text-center text-xs text-gray-400">
                  FileShare secure sharing
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleNewUpload}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-purple-400 hover:text-purple-700"
            >
              Upload more files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
