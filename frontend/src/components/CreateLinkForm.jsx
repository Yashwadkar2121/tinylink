import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CreateLinkForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    originalUrl: "",
    shortCode: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.originalUrl) {
      newErrors.originalUrl = "URL is required";
    } else if (!isValidUrl(formData.originalUrl)) {
      newErrors.originalUrl =
        "Please enter a valid URL (include http:// or https://)";
    }

    if (
      formData.shortCode &&
      !/^[A-Za-z0-9_-]{1,8}$/.test(formData.shortCode)
    ) {
      newErrors.shortCode =
        "Short code must be 1-8 characters and contain only letters, numbers, hyphens, and underscores";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ originalUrl: "", shortCode: "" });
      setErrors({});
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md"
    >
      <motion.h2
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Create Short Link
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label
            htmlFor="originalUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Destination URL *
          </label>
          <input
            type="url"
            id="originalUrl"
            name="originalUrl"
            value={formData.originalUrl}
            onChange={handleChange}
            placeholder="https://example.com"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
              errors.originalUrl ? "border-red-300" : "border-gray-300"
            }`}
            disabled={loading}
          />
          <AnimatePresence>
            {errors.originalUrl && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.originalUrl}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label
            htmlFor="shortCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Custom Short Code (optional)
          </label>
          <input
            type="text"
            id="shortCode"
            name="shortCode"
            value={formData.shortCode}
            onChange={handleChange}
            placeholder="my-link"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
              errors.shortCode ? "border-red-300" : "border-gray-300"
            }`}
            disabled={loading}
          />
          <AnimatePresence>
            {errors.shortCode && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.shortCode}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="mt-1 text-xs text-gray-500">
            Leave empty for auto-generated code. 1-8 characters: letters,
            numbers, hyphens, underscores.
          </p>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? "Creating..." : "Create Short Link"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateLinkForm;
