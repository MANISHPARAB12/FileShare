
import { useCallback, useState } from "react";
// import {  } from "react-router-dom";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8956"
).replace(/\/+$/, "");

function formatFileSize(bytes = 0) {
  const size = Number(bytes) || 0;

  if (size < 1024) return `${size} B`;

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const Download = () => {
  

  const [shareCode, setShareCode] = useState("");
  const [activeCode, setActiveCode] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  // Find a shared file using its share code.
  const fetchSharedFile = useCallback(async (code) => {
    const normalizedCode = String(code || "").trim();

    if (!normalizedCode) {
      setError("Please enter a share code.");
      setFile(null);
      setActiveCode("");
      return;
    }

    setLoading(true);
    setError("");
    setFile(null);
    setActiveCode("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/files/share/${encodeURIComponent(
          normalizedCode
        )}`
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "File not found. Please check your share code."
        );
      }

      if (!data.file) {
        throw new Error("The server did not return file details.");
      }

      setFile(data.file);
      setActiveCode(normalizedCode);
    } catch (err) {
      setError(err.message || "Unable to find the shared file.");
    } finally {
      setLoading(false);
    }
  }, []);

  

  // Submit the manually entered share code.
  function handleSubmit(event) {
    event.preventDefault();

    if (loading || downloading) return;

    fetchSharedFile(shareCode);
  }

  // Download the selected shared file.
  async function handleDownload() {
    if (!file || !activeCode || downloading) return;

    setDownloading(true);
    setError("");

    let objectUrl;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/files/download/${encodeURIComponent(
          activeCode
        )}`
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(data.message || "Download failed.");
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("The downloaded file is empty.");
      }

      objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = file.originalName || "download";

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message || "Unable to download the file.");
    } finally {
      if (objectUrl) {
        window.setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 1000);
      }

      setDownloading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-12">
      <section className="mx-auto max-w-2xl rounded-2xl border border-purple-200 bg-white p-6 shadow-sm sm:p-10">
        {/* Header icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-9 w-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0L7 9m5-5 5 5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
            />
          </svg>
        </div>

        <h1 className="mt-5 text-center text-2xl font-bold text-gray-900">
          Download Shared File
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Enter the share code you received to find and download your file.
        </p>

        {/* Share code input */}
        <form onSubmit={handleSubmit} className="mt-8">
          <label
            htmlFor="shareCode"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Enter share code
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="shareCode"
              type="text"
              value={shareCode}
              onChange={(event) => {
                setShareCode(event.target.value);
                setError("");
              }}
              placeholder="Enter your share code"
              autoComplete="off"
              maxLength={64}
              required
              className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="submit"
              disabled={loading || downloading || !shareCode.trim()}
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Searching..." : "Find File"}
            </button>
          </div>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />

            <p className="mt-3 text-sm text-purple-600">
              Searching for your shared file...
            </p>
          </div>
        )}

        {/* Error message */}
        {!loading && error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p className="font-semibold">Unable to retrieve file</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* File details */}
        {!loading && !error && file && (
          <div className="mt-8 rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 3.75h8.25L19.5 9v11.25H6z M14 3.75V9h5.5 M9 13h7 M9 16.5h7"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="wrap-break-word font-semibold text-gray-900">
                  {file.originalName || "Shared file"}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Size: {formatFileSize(file.size)}
                </p>

                <p className="mt-1 wrap-break-word text-sm text-gray-500">
                  Type: {file.type || "Unknown"}
                </p>
              </div>
            </div>

            {/* Share code */}
            <div className="mt-5 rounded-lg bg-purple-50 p-3">
              <p className="text-xs text-gray-500">Share code</p>

              <p className="mt-1 break-all font-mono font-bold text-purple-700">
                {file.shareCode || activeCode}
              </p>
            </div>

            {/* Download button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Preparing download...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v12m0 0 5-5m-5 5-5-5M5 20h14"
                    />
                  </svg>
                  Download File
                </>
              )}
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Download;