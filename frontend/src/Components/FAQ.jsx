import { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  // FileShare FAQs
  const faqs = [
    {
      question: "Do I need an account to use FileShare?",
      answer:
        "No, you don't need to create an account to use FileShare if guest access is enabled. You can upload your files and share them with others using a sharing link or a 6-character code.",
    },
    {
      question: "How do I share a file?",
      answer:
        "Upload the file you want to share. Once the upload is complete, FileShare will provide a sharing link and, if supported, a 6-character code. Copy the link and send it to anyone, or share the code so they can access your file through FileShare.",
    },
    {
      question: "How long are files stored?",
      answer:
        "Your files remain available according to FileShare's storage policy. If an expiration time is displayed, check it before sharing your file. Download important files before they expire or become unavailable.",
    },
    {
      question: "What file types are supported?",
      answer:
        "FileShare can support common file formats such as images, PDF documents, videos, and ZIP archives, depending on its upload restrictions. If your file cannot be uploaded, check its format and size before trying again.",
    },
    {
      question: "Is my data secure?",
      answer:
        "FileShare is designed to make file sharing convenient. For your privacy, share your links and access codes only with people you trust. The actual protection of your files depends on the security measures implemented by the application.",
    },
    {
      question: "What is the maximum file size?",
      answer:
        "The maximum file size depends on FileShare's upload settings and storage provider. Check the upload page for the supported limit. If your file is too large, try compressing it or splitting it into smaller files.",
    },
    {
      question: "Can I delete a file?",
      answer:
        "If FileShare provides a delete option, you can remove your uploaded file when you no longer want to share it. If deletion is not available, the file may remain accessible until it expires according to the configured storage policy.",
    },
  ];

  // Open or close an FAQ
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-3 font-semibold uppercase tracking-widest text-purple-600">
          FileShare FAQs
        </p>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>

        <p className="mt-4 text-base leading-7 text-gray-600">
          Find answers to common questions about uploading, sharing,
          downloading, and managing your files with FileShare.
        </p>
      </div>

      {/* FAQ dropdown list */}
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.question}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-purple-300"
          >
            {/* Clickable question */}
            <button
              type="button"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-purple-50 sm:px-6"
            >
              <span className="font-semibold text-gray-800">
                {index + 1}. {faq.question}
              </span>

              {/* Dropdown icon */}
              <span className="shrink-0 text-xl font-medium text-purple-600">
                {openIndex === index ? "⌃" : "⌄"}
              </span>
            </button>

            {/* Answer */}
            {openIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="border-t border-gray-100 px-5 py-4 sm:px-6"
              >
                <p className="text-sm leading-7 text-gray-600 sm:text-base">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact section */}
      <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-purple-100 px-6 py-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Still have questions?
        </h2>

        <p className="mt-2 text-gray-600">
          Need help sharing your files? We're here to help.
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
