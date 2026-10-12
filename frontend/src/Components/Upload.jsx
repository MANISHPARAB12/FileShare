
import { useState } from "react";

export const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
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

  return (
    <div className="mx-auto mt-10 max-w-3xl text-left">

      <div className="rounded-3xl border border-purple-200 bg-white p-3 shadow-xl shadow-purple-100/70 sm:p-5">

        <div className="rounded-2xl border-2 border-dashed border-purple-300 bg-gradient-to-b from-purple-50 to-white px-5 py-10 text-center transition duration-300 hover:border-purple-500 sm:px-10 sm:py-14">

          {/* Upload icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-100 text-purple-600 shadow-sm">
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

          <h2 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            Upload your files
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            Select documents, photos, videos, or other files
            from your device to get started.
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
            className="sr-only"
            onChange={handleFileChange}
          />

          <p className="mt-5 text-xs text-gray-400">
            Multiple files supported · Select files from your device
          </p>
        </div>

        {/* Selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-gray-900">
                Selected files ({selectedFiles.length})
              </h3>

              <button
                type="button"
                onClick={() => {
                  setSelectedFiles([]);
                  const input = document.getElementById("file-upload");
                  if (input) input.value = "";
                }}
                className="text-sm font-medium text-purple-600 hover:text-purple-800"
              >
                Clear all
              </button>
            </div>

            <ul className="space-y-3">
              {selectedFiles.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-6.75L4.5 10.5v9a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25ZM10.5 4.5v6H4.5"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {file.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm text-amber-700">
              Your files are selected, but they have not been uploaded yet.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Upload;
