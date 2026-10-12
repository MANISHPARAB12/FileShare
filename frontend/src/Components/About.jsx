import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-purple-100 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">

          <p className="inline-block rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700">
            About FileShare
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Sharing Files,
            <span className="block text-purple-600">
              Made Simple.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            FileShare helps you share files easily with friends,
            family, classmates, and colleagues. Upload your files,
            generate a shareable link, and connect with others
            without complicated steps.
          </p>

          <Link
            to="/"
            className="mt-8 inline-block rounded-xl bg-purple-600 px-7 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
          >
            Start Sharing
          </Link>

        </div>
      </section>

      {/* About Us Section */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">

          {/* Left Content */}
          <div>
            <p className="font-semibold uppercase tracking-widest text-purple-600">
              Who We Are
            </p>

            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              A simpler way to share your files.
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              FileShare is a file-sharing web application designed
              to make transferring files simple and convenient.
              Our goal is to help users share documents, images,
              videos, and other files through an easy-to-use
              interface.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Whether you are working on a project, sharing
              documents with colleagues, or sending photos to
              friends, FileShare aims to make the process quick
              and straightforward.
            </p>

          </div>

          {/* Right Content */}
          <div className="rounded-3xl border border-purple-100 bg-purple-50 p-6 sm:p-8">

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  📁
                </div>

                <h3 className="mt-4 font-bold text-gray-900">
                  Easy Uploads
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Select files from your device in just a few clicks.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  🔗
                </div>

                <h3 className="mt-4 font-bold text-gray-900">
                  Shareable Links
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Create links to share your files with others.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  📱
                </div>

                <h3 className="mt-4 font-bold text-gray-900">
                  QR Sharing
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Make shared links easy to open with a QR code.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  🔐
                </div>

                <h3 className="mt-4 font-bold text-gray-900">
                  PIN Protection
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Add a PIN to help restrict access to shared files.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <p className="font-semibold uppercase tracking-widest text-purple-600">
              How It Works
            </p>

            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Share files in three steps
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              No complicated process. Just upload, generate a link,
              and share it with the people who need your files.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-2xl font-bold text-white">
                01
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Upload Files
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Choose one or more files from your device to get started.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-2xl font-bold text-white">
                02
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Generate a Link
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Create a shareable link and use a PIN when protection is enabled.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-2xl font-bold text-white">
                03
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Share Anywhere
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Send your link through WhatsApp, email, or other platforms.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-purple-600 px-6 py-12 text-center shadow-xl shadow-purple-200 sm:px-12">

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to share your files?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-purple-100">
            Get started with FileShare and make your next file transfer
            simple and convenient.
          </p>

          <Link
            to="/"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3 font-semibold text-purple-700 transition hover:bg-purple-50"
          >
            Upload Your Files
          </Link>

        </div>
      </section>

    </div>
  );
};

export default About;
