// import "../Css/Upload.css"
export const Upload = () => {
  return (
    <div className="mx-10 mt-10 rounded-2xl p-5  lg:mx-auto lg:max-w-4xl lg:p-8 shadow-2xl">
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl  p-8 text-center transition hover:border-purple-600">

        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-20 text-purple-600">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
</svg>

        </div>

        <h1 className="text-2xl font-bold text-gray-900"> 
          Upload Your Files
        </h1>

        <p className="mt-2 text-sm text-black font-semibold">
          Select files to share them with anyone, anywhere.
        </p>

        <label
          htmlFor="file-upload"
          className="mt-6 cursor-pointer rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
        >
          Choose Files
        </label>

        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            console.log("Selected files:", e.target.files);
          }}
        />

        <p className="mt-4 text-xs text-black font-semibold">
          Select one or more files from your device.
        </p>
      </div>
    </div>
  );
};

// export default Upload;