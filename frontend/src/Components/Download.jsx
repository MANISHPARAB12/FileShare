/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8956"
).replace(/\/+$/, "");

function cleanPin(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
}

// Supports query links, path-based links, and hash-based links.
function getPinFromUrl() {
  const currentUrl = new URL(window.location.href);

  // Example: /download?pin=A1B2C3
  // Example: /download?code=A1B2C3
  let urlPin =
    currentUrl.searchParams.get("pin") ||
    currentUrl.searchParams.get("code");

  // Example: /download/A1B2C3
  if (!urlPin) {
    const segments = currentUrl.pathname
      .split("/")
      .filter(Boolean);

    const lastSegment = segments.at(-1);

    if (lastSegment && /^[A-Za-z0-9]{6}$/.test(lastSegment)) {
      urlPin = lastSegment;
    }
  }

  // Example: /#/download?pin=A1B2C3
  if (!urlPin && currentUrl.hash.includes("?")) {
    const hashQuery = currentUrl.hash.split("?")[1];
    const hashParams = new URLSearchParams(hashQuery);

    urlPin =
      hashParams.get("pin") ||
      hashParams.get("code");
  }

  return urlPin ? cleanPin(urlPin) : "";
}

function formatFileSize(size) {
  const bytes = Number(size) || 0;

  if (bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function Download() {
  const [pin, setPin] = useState("");
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Look up files using the existing backend API.
  const findFiles = useCallback(async (code) => {
    const cleaned = cleanPin(code);

    if (cleaned.length !== 6) {
      setError("Please enter a valid 6-character PIN.");
      setBatch(null);
      return;
    }

    setPin(cleaned);
    setLoading(true);
    setError("");
    setSuccess("");
    setBatch(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/files/share/${encodeURIComponent(cleaned)}`
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `PIN lookup failed (${response.status}).`
        );
      }

      if (!Array.isArray(data.files)) {
        throw new Error(
          "The server response did not contain a file list."
        );
      }

      setBatch({
        ...data,
        shareCode: data.shareCode || cleaned,
      });

      setSuccess("PIN verified successfully.");
    } catch (err) {
      console.error("PIN lookup failed:", err);
      setError(err.message || "Unable to find files.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatically load the PIN when someone opens a shared link.
  useEffect(() => {
    const urlPin = getPinFromUrl();

    if (urlPin.length === 6) {
      setPin(urlPin);
      findFiles(urlPin);
    }
  }, [findFiles]);

  async function downloadFile(file, index) {
    if (!batch) return;

    setDownloadingIndex(index);
    setError("");
    setSuccess("");

    try {
      const code = batch.shareCode || pin;

      const downloadPath =
        file.downloadUrl ||
        `/api/files/download/${encodeURIComponent(code)}/${index}`;

      const downloadUrl = /^https?:\/\//i.test(downloadPath)
        ? downloadPath
        : `${API_BASE_URL}${
            downloadPath.startsWith("/") ? "" : "/"
          }${downloadPath}`;

      const response = await fetch(downloadUrl);

      if (!response.ok) {
        const responseText = await response.text();
        let message = `Download failed (${response.status}).`;

        try {
          const data = JSON.parse(responseText);
          if (data.message) message = data.message;
        } catch {
          if (responseText) {
            message += ` ${responseText.slice(0, 200)}`;
          }
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = file.originalName || `file-${index + 1}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 1000);

      setSuccess(
        `${file.originalName || "File"} download started.`
      );
    } catch (err) {
      console.error("Download error:", err);
      setError(err.message || "Unable to download this file.");
    } finally {
      setDownloadingIndex(null);
    }
  }

  return (
    <main className="min-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Receive your files
          </h1>

          <p className="mt-3 text-gray-600">
            Enter the sharing PIN to access your files.
          </p>
        </div>

        {/* PIN form */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            findFiles(pin);
          }}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8"
        >
          <label
            htmlFor="share-pin"
            className="mb-3 block text-sm font-bold text-gray-700"
          >
            Enter your 6-character PIN
          </label>

          <input
            id="share-pin"
            type="text"
            value={pin}
            onChange={(event) => {
              setPin(cleanPin(event.target.value));
              setError("");
              setSuccess("");
              setBatch(null);
            }}
            placeholder="A1B2C3"
            maxLength={6}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-5 text-center text-2xl font-extrabold uppercase tracking-[0.4em] text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
          />

          <p className="mt-3 text-center text-xs text-gray-500">
            Use letters A–Z and numbers 0–9.
          </p>

          <button
            type="submit"
            disabled={loading || pin.length !== 6}
            className="mt-6 w-full rounded-2xl bg-purple-600 px-5 py-4 font-bold text-white shadow-md transition hover:bg-purple-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Finding files..." : "Find my files"}
          </button>

          {error && (
            <p
              role="alert"
              className="mt-4 wrap-break-word rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="mt-4 wrap-break-word rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {success}
            </p>
          )}
        </form>

        {/* Files */}
        {batch && (
          <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your files are ready
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {batch.fileCount ?? batch.files.length} file(s) found
                </p>
              </div>

              <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                PIN verified
              </span>
            </div>

            <div className="space-y-3">
              {batch.files.map((file, index) => (
                <div
                  key={`${file.originalName || "file"}-${index}`}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="wrap-break-word font-semibold text-gray-800">
                        {file.originalName || `File ${index + 1}`}
                      </p>

                      {file.size != null && (
                        <p className="mt-1 text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={downloadingIndex !== null}
                    onClick={() => downloadFile(file, index)}
                    className="shrink-0 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {downloadingIndex === index
                      ? "Downloading..."
                      : "Download"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-purple-50 p-4 text-sm text-purple-700">
              <strong>Note:</strong> Files are downloaded individually.
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default Download;