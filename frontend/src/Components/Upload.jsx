
import { useState } from "react";

export const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Allow selecting the same file again
    event.target.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="mx-auto mt-10 max-w-4xl px-4">
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-400 bg-purple-50/50 p-8 text-center transition hover:border-purple-600">
        {/* Upload icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-100 text-purple-600 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-12 w-12"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Upload Your Files
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Select files to share them with anyone, anywhere.
        </p>

        <label
          htmlFor="file-upload"
          className="mt-7 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-purple-200 transition duration-200 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-purple-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Choose Files
        </label>

        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <p className="mt-4 text-xs text-gray-400">
          Select one or more files from your device.
        </p>
      </div>

      {/* Selected files */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Selected Files
            </h2>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
              {selectedFiles.length} files
            </span>
          </div>

          <div className="space-y-3">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-800">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                  className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// export default Upload;
