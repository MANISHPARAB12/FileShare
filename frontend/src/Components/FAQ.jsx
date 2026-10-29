
import { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  // Frequently asked questions for FileShare users.
  const faqs = [
    {
      question: "Do I need an account to use FileShare?",
      answer:
        "No account is required. You can upload your files and share them with others using the sharing link, PIN, or QR code provided after a successful upload.",
    },
    {
      question: "How do I upload and share files?",
      answer:
        "Select the files you want to share and click the Upload button. Once your files have been uploaded successfully, FileShare provides a sharing PIN, a link, and a QR code. Share any of these with your recipient so they can access the files.",
    },
    {
      question: "How does QR-code sharing work?",
      answer:
        "After uploading your files, scan the displayed QR code using your phone's camera or a QR-code scanner. It opens the FileShare sharing page, making it easy to access your shared files.",
    },
    {
      question: "What is the sharing PIN?",
      answer:
        "The sharing PIN is a six-character code associated with your uploaded files. Enter it on the Download page to find the files you want to access.",
    },
    {
      question: "How many files can I upload at once?",
      answer:
        "You can upload up to 10 files in a single batch, with a maximum file size of 10 MB per file. Make sure each file meets these limits before uploading.",
    },
    {
      question: "How do I download shared files?",
      answer:
        "Open the Download page and enter the sharing PIN provided by the sender. Once the shared files appear, click the download button beside the file you want to save to your device.",
    },
    {
      question: "Which file types can I upload?",
      answer:
        "FileShare supports a variety of common file types, including documents, images, videos, and archives. Uploads are subject to the application's file-size limits and the storage provider's supported formats.",
    },
    {
      question: "Where are my uploaded files stored?",
      answer:
        "Your uploaded files are stored using Cloudinary, our cloud storage provider. FileShare makes it easy to access and share your files through the available sharing options.",
    },
    {
      question: "How long do shared files remain available?",
      answer:
        "Shared-file availability depends on the availability of the sharing service and the stored file information. If a shared file or link becomes unavailable, the sender may need to upload the file again and share a new link or PIN.",
    },
    {
      question: "Can I share files with someone on another network?",
      answer:
        "Yes! On FileShare you can share files with people using different devices or networks. Simply send them the sharing link or PIN, or let them scan the QR code.",
    },
    {
      question: "Are my files secure?",
      answer:
        "FileShare uses cloud storage and sharing links to make file sharing convenient. Only share your links and PINs with intended recipients. Do not upload sensitive information unless you are comfortable with the application's configured storage and security protections.",
    },
    {
      question: "What should I do if my PIN does not work?",
      answer:
        "First, check that you entered the correct six-character PIN. Make sure you are using the correct sharing details provided by the sender. If the files still cannot be found, ask the sender to upload them again and provide a new PIN.",
    },
  ];

  // Open or close an FAQ item.
  const toggleFAQ = (index) => {
    setOpenIndex((previousIndex) =>
      previousIndex === index ? null : index
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Page Heading */}
      <section className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
        <span className="mb-3 inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-purple-700">
          FileShare Help Center
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Frequently Asked Questions
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
          Find answers to common questions about uploading,
          sharing, and downloading files with FileShare.
        </p>
      </section>

      {/* FAQ Dropdown List */}
      <section
        className="mx-auto max-w-3xl"
        aria-label="Frequently asked questions"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Common Questions
          </h2>

          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
            {faqs.length} questions
          </span>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;

            return (
              <article
                key={faq.question}
                className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-colors duration-300 ${
                  isOpen
                    ? "border-purple-300 shadow-md"
                    : "border-gray-200 hover:border-purple-200"
                }`}
              >
                {/* Clickable Question */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="flex w-full items-center justify-between gap-4 px-4 py-5 text-left transition-colors duration-300 hover:bg-purple-50/70 sm:px-6"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    {/* Question Number */}
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors duration-300 ${
                        isOpen
                          ? "bg-purple-600 text-white"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {index + 1}
                    </span>

                    {/* Question Text */}
                    <span
                      className={`pt-0.5 font-semibold leading-6 transition-colors duration-300 ${
                        isOpen
                          ? "text-purple-700"
                          : "text-gray-800"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </span>

                  {/* Animated Expand/Collapse Chevron */}
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      isOpen
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className={`h-5 w-5 transform transition-transform duration-300 ease-in-out ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 9 6 6 6-6"
                      />
                    </svg>
                  </span>
                </button>

                {/* Answer */}
                {isOpen && (
                  <div
                    id={answerId}
                    className="border-t border-gray-100 bg-white px-4 py-5 sm:px-6"
                  >
                    <p className="pl-0 text-sm leading-7 text-gray-600 sm:pl-10 sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Bottom Help Section */}
      <section className="mx-auto mt-12 max-w-3xl sm:mt-16">
        <div className="relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 px-6 py-9 text-center sm:px-10 sm:py-10">
          {/* Decorative Circle */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-purple-300/30 blur-2xl" />

          <div className="relative">
            {/* Help Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3m.09 4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Still have questions?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
              Explore the questions above to learn more about
              FileShare and make the most of your file-sharing experience.
            </p>

            <button
              type="button"
              onClick={() => {
                setOpenIndex(null);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-md transition-colors duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Browse FAQs
              <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FAQ;
