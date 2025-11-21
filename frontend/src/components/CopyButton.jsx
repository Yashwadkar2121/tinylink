import React, { useState } from "react";

const CopyButton = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
        copied
          ? "bg-green-100 text-green-800 border-green-300"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      } ${className}`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

export default CopyButton;
