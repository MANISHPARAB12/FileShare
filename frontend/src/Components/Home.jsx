
import  Upload  from "./Upload";

function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero and Upload Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-100 px-4 pb-20 pt-16 sm:pt-24">

        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">

          {/* Small Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-medium text-purple-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Your files, one simple place
          </span>

          {/* Main Heading */}
          <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Share Files.
            <span className="mt-2 block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Anywhere, Anytime.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Need to send a document, photo, or video?
            Choose your files and get started with FileShare.
          </p>

          {/* Upload Box */}
          <Upload />

          {/* Small Supporting Text */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Select multiple files
            </span>

            <span className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Simple interface
            </span>

            <span className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Easy to get started
            </span>
          </div>

        </div>
      </section>

      {/* Simple Bottom Call-to-Action */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 rounded-2xl border border-purple-100 bg-purple-50 p-7 text-center sm:flex-row sm:p-10 sm:text-left">

          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Ready to get started?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
              Select your files above to begin.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              document.getElementById("file-upload")?.click()
            }
            className="shrink-0 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-purple-700"
          >
            Choose Files ↑
          </button>

        </div>
      </section>

    </main>
  );
}

export default Home;
