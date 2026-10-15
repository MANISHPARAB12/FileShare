
import { useCallback, useRef, useState } from "react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8956"
).replace(/\/+$/, "");

function formatFileSize(bytes = 0) {
  const size = Number(bytes) || 0;

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;

  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const CODE_LENGTH = 6;

const Download = () => {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [file, setFile] = useState(null);
  const [activeCode, setActiveCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  const shareCode = code.join("");

  const fetchSharedFile = useCallback(async (value) => {
    const normalizedCode = value.trim();

    if (normalizedCode.length !== CODE_LENGTH) {
      setError("Please enter all 6 characters of your share code.");
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

  function handleCodeChange(index, value) {
    const characters = value
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, CODE_LENGTH);

    setError("");
    setFile(null);
    setActiveCode("");

    // Support pasting the complete 6-character code.
    if (characters.length > 1) {
      const nextCode = Array(CODE_LENGTH).fill("");

      for (let i = 0; i < characters.length; i++) {
        if (index + i < CODE_LENGTH) {
          nextCode[index + i] = characters[i];
        }
      }

      setCode(nextCode);

      const nextIndex = Math.min(
        index + characters.length,
        CODE_LENGTH - 1
      );

      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const nextCode = [...code];
    nextCode[index] = characters;
    setCode(nextCode);

    if (characters && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, event) {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (shareCode.length === CODE_LENGTH) {
        fetchSharedFile(shareCode);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (loading || downloading) return;

    if (shareCode.length !== CODE_LENGTH) {
      setError("Please enter all 6 characters of your share code.");
      inputRefs.current[code.findIndex((char) => !char)]?.focus();
      return;
    }

    fetchSharedFile(shareCode);
  }

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
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
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
          Enter the 6-character share code to find your file.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <label className="mb-3 block text-sm font-semibold text-gray-700">
            Enter share code
          </label>

          {/* Six-character code input */}
          <div
            className="flex justify-center gap-2 sm:gap-3"
            role="group"
            aria-label="Six-character share code"
          >
            {code.map((character, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete={index === 0 ? "off" : "new-password"}
                spellCheck={false}
                maxLength={6}
                value={character}
                aria-label={`Share code character ${index + 1}`}
                onChange={(event) =>
                  handleCodeChange(index, event.target.value)
                }
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={(event) => {
                  const pasted = event.clipboardData
                    .getData("text")
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .slice(0, CODE_LENGTH)
                    .toUpperCase();

                  if (pasted.length > 1) {
                    event.preventDefault();
                    handleCodeChange(index, pasted);
                  }
                }}
                className={`h-14 min-w-0 flex-1 max-w-14.5 rounded-xl border-2 text-center font-mono text-xl font-bold  text-gray-900 outline-none transition-all duration-200 sm:h-16 sm:text-2xl ${
                  character
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-white"
                } focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-100`}
              />
            ))}
          </div>

          <p className="mt-3 text-center text-xs text-gray-400">
            {shareCode.length} of {CODE_LENGTH} characters entered
          </p>

          <button
            type="submit"
            disabled={loading || downloading || shareCode.length !== CODE_LENGTH}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Searching...
              </>
            ) : (
              "Find File"
            )}
          </button>
        </form>

        {/* Loading state */}
        {loading && (
          <p className="mt-5 text-center text-sm text-purple-600">
            Searching for your shared file...
          </p>
        )}

        {/* Error message */}
        {!loading && error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
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

            <div className="mt-5 rounded-lg bg-purple-50 p-3">
              <p className="text-xs text-gray-500">Share code</p>
              <p className="mt-1 break-all font-mono font-bold text-purple-700">
                {file.shareCode || activeCode}
              </p>
            </div>

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