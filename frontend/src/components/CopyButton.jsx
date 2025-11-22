import React, { useState } from "react";
import { motion } from "framer-motion";

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
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
        copied
          ? "bg-green-100 text-green-800 border-green-300"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      } ${className}`}
    >
      <motion.span
        key={copied ? "copied" : "copy"}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {copied ? "Copied!" : "Copy"}
      </motion.span>
    </motion.button>
  );
};

export default CopyButton;
