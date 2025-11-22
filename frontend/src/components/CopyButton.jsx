import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

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
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 flex items-center gap-2 shadow-sm ${
        copied
          ? "bg-teal-100 text-teal-800 border-teal-300 shadow-teal-100"
          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:shadow-md hover:border-blue-300"
      } ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {copied ? (
          <Check size={14} className="text-teal-600" />
        ) : (
          <Copy size={14} className="text-gray-600" />
        )}
      </motion.div>
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
