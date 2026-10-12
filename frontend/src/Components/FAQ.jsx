import { useState } from "react";

function FAQ() {
  // Store the number of the currently open question.
  // null means all questions are closed.
  const [openIndex, setOpenIndex] = useState(null);

  // All FAQ questions and answers
  const faqs = [
    {
      question: "What is FileShare?",
      answer:
        "FileShare is a file-sharing application that allows users to upload files and share them with other people through a sharing link.",
    },
    {
      question: "How do I upload files?",
      answer:
        "Open the Home page, click the Choose Files button, select one or more files from your device, and follow the upload instructions.",
    },
    {
      question: "How can I share files with someone?",
      answer:
        "After a successful upload, FileShare can provide a sharing link that you can copy and send to the recipient.",
    },
    {
      question: "Can I share files with someone on a different network?",
      answer:
        "Yes, if your application is deployed online or uses a publicly accessible file-sharing service. A local development server usually cannot be accessed directly by someone outside your network.",
    },
    {
      question: "How does QR code sharing work?",
      answer:
        "A QR code can contain your file-sharing link. The recipient scans the code with their phone to open the link. This feature must be implemented in the application.",
    },
    {
      question: "Can I protect my files with a PIN?",
      answer:
        "PIN protection can require a recipient to enter a PIN before accessing a shared file. This works only after PIN verification has been implemented on the server.",
    },
    {
      question: "Is there a file size limit?",
      answer:
        "The maximum file size depends on your application's upload configuration and storage provider. Check the upload page for the limit supported by your application.",
    },
    {
      question: "How do I download a shared file?",
      answer:
        "Open the sharing link and use the download option provided on the page, if the upload has completed successfully and the link is still valid.",
    },
    {
      question: "Are my files private and secure?",
      answer:
        "File privacy depends on how the application stores files and controls access. Use secure links, server-side access checks, and HTTPS to help protect shared files.",
    },
    {
      question: "How long are shared files available?",
      answer:
        "File availability depends on your storage settings. Files remain available according to the retention or expiration rules configured by the application.",
    },
    {
      question: "Can I share multiple files at once?",
      answer:
        "Yes. The upload input supports selecting multiple files. Whether they are uploaded and shared together depends on the upload functionality implemented in the application.",
    },
    {
      question: "What should I do if my sharing link doesn't work?",
      answer:
        "Check your internet connection, confirm that the link is correct, and make sure the file is still available. If the problem continues, contact the application support team.",
    },
  ];

  // Open a question or close it if it is already open
  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-3 font-semibold uppercase tracking-widest text-purple-600">
          Help Center
        </p>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>

        <p className="mt-4 text-base leading-7 text-gray-600">
          Have questions about FileShare? Find answers about uploading,
          sharing, downloading, and protecting your files.
        </p>
      </div>

      {/* FAQ dropdown list */}
      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-purple-300"
          >
            {/* Clickable question */}
            <button
              type="button"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            >
              <span className="font-semibold text-gray-800">
                {faq.question}
              </span>

              {/* Plus or minus icon */}
              <span className="shrink-0 text-2xl font-medium text-purple-600">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {/* Answer: visible only when the question is open */}
            {openIndex === index && (
              <div className="border-t border-gray-100 px-5 py-4">
                <p className="leading-7 text-gray-600">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact section */}
      <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-purple-100 px-6 py-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Still have questions?
        </h2>

        <p className="mt-2 text-gray-600">
          We are here to help you with your file-sharing experience.
        </p>

        <a
          href="mailto:support@example.com"
          className="mt-5 inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}

export default FAQ;
