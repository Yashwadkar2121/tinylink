import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Zap, AlertCircle, CheckCircle2 } from "lucide-react";

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
      transition={{ duration: 0.6, type: "spring" }}
      className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100"
    >
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <Link2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Create Short Link
          </h2>
          <p className="text-gray-600 text-sm">
            Transform long URLs into short, shareable links
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label
            htmlFor="originalUrl"
            className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-blue-500" />
            Destination URL *
          </label>
          <div className="relative">
            <input
              type="url"
              id="originalUrl"
              name="originalUrl"
              value={formData.originalUrl}
              onChange={handleChange}
              placeholder="https://example.com/very-long-url-path"
              className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none transition-all duration-200 text-sm sm:text-base ${
                errors.originalUrl
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            />
            {formData.originalUrl && !errors.originalUrl && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </motion.div>
            )}
          </div>
          <AnimatePresence>
            {errors.originalUrl && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
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
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Custom Short Code (optional)
          </label>
          <input
            type="text"
            id="shortCode"
            name="shortCode"
            value={formData.shortCode}
            onChange={handleChange}
            placeholder="my-custom-link"
            className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none transition-all duration-200 text-sm sm:text-base ${
              errors.shortCode
                ? "border-red-300 focus:border-red-500 bg-red-50"
                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          />
          <AnimatePresence>
            {errors.shortCode && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.shortCode}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
            💡 Leave empty for auto-generated code. 1-8 characters: letters,
            numbers, hyphens, underscores.
          </p>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className={`w-full py-4 px-6 border-2 border-transparent rounded-xl shadow-lg text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-blue-200 hover:shadow-xl"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Creating Magic Link...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Create Short Link
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateLinkForm;
