
import { useState } from "react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8956"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/files/upload`;

const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files || []));
    setUploadedFiles([]);
    setError("");
    setMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      setError("Please select at least one file.");
      return;
    }

    if (selectedFiles.length > 10) {
      setError("You can upload a maximum of 10 files.");
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (oversizedFile) {
      setError(`${oversizedFile.name} exceeds the 10 MB limit.`);
      return;
    }

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    setUploading(true);
    setError("");
    setMessage("");
    setUploadedFiles([]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Upload failed (${response.status}).`);
      }

      if (!Array.isArray(data.files) || data.files.length === 0) {
        console.error("Unexpected upload response:", data);
        throw new Error("The server did not return uploaded file details.");
      }

      const filesWithShareLinks = data.files.map((file, index) => ({
        ...file,
        id: file.id || `${file.shareCode || file.originalName}-${index}`,
        originalName:
          file.originalName || file.originalname || file.name || "Unnamed file",
        size: Number(file.size) || 0,
        shareUrl: file.shareCode
          ? `${window.location.origin}/share/${encodeURIComponent(file.shareCode)}`
          : file.shareUrl,
      }));

      setUploadedFiles(filesWithShareLinks);
      setSelectedFiles([]);
      setMessage(data.message || "Files uploaded successfully.");

      const input = document.getElementById("file-upload");
      if (input) input.value = "";
    } catch (err) {
      console.error("Upload error:", err);

      setError(
        err instanceof TypeError
          ? "Cannot connect to the backend. Check the backend server and API URL."
          : err.message || "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const copyShareLink = async (shareUrl) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setError("");
      setMessage("Share link copied successfully!");
    } catch {
      setError("Could not copy the link. Please copy it manually.");
    }
  };

  return (
    <main className="mx-auto mt-10 max-w-3xl px-4">
      <section className="rounded-2xl border-2 border-dashed border-purple-300 bg-white p-6 shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-9 w-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
        </div>

        <h2 className="mt-5 text-center text-xl font-bold text-gray-900">
          Upload your files
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Select files and generate shareable links.
        </p>

        <input
          id="file-upload"
          type="file"
          multiple
          className="sr-only"
          onChange={handleFileChange}
          disabled={uploading}
        />

        <label
          htmlFor="file-upload"
          className="mt-6 inline-flex cursor-pointer items-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
        >
          Choose Files
        </label>

        <p className="mt-3 text-xs text-gray-500">
          Maximum 10 files per upload, 10 MB per file.
        </p>

        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="font-semibold text-gray-800">
              Selected files ({selectedFiles.length})
            </p>

            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
              >
                <span className="min-w-0 break-all text-sm text-gray-800">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || selectedFiles.length === 0}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading && (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {uploading ? "Uploading..." : "Upload to Cloud"}
        </button>

        {error && (
          <p role="alert" className="mt-4 break-words text-sm text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="mt-4 break-words text-sm text-green-700">
            {message}
          </p>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Your share links
            </h3>

            {uploadedFiles.map((file) => (
              <article
                key={file.id}
                className="rounded-xl border border-purple-200 bg-purple-50 p-4"
              >
                <p className="break-all font-semibold text-gray-900">
                  {file.originalName}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>

                <p className="mt-3 text-sm text-gray-600">
                  Share code:{" "}
                  <span className="font-mono font-bold text-purple-700">
                    {file.shareCode || "Unavailable"}
                  </span>
                </p>

                {file.shareUrl && (
                  <>
                    <p className="mt-3 break-all text-sm text-gray-700">
                      {file.shareUrl}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => copyShareLink(file.shareUrl)}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                      >
                        Copy Share Link
                      </button>

                      <a
                        href={file.shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-purple-300 bg-white px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                      >
                        Open Share Page
                      </a>

                      <a
                        href={`${API_BASE_URL}/api/files/download/${encodeURIComponent(file.shareCode)}`}
                        className="rounded-lg border border-purple-300 bg-white px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                      >
                        Download
                      </a>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Upload;