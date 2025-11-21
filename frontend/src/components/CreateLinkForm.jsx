import React, { useState } from "react";

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
    // Clear error when user starts typing
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

    // Validate URL
    if (!formData.originalUrl) {
      newErrors.originalUrl = "URL is required";
    } else if (!isValidUrl(formData.originalUrl)) {
      newErrors.originalUrl =
        "Please enter a valid URL (include http:// or https://)";
    }

    // Validate short code if provided
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Short Link</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
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
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.originalUrl ? "border-red-300" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.originalUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.originalUrl}</p>
          )}
        </div>

        <div>
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
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.shortCode ? "border-red-300" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.shortCode && (
            <p className="mt-1 text-sm text-red-600">{errors.shortCode}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Leave empty for auto-generated code. 1-8 characters: letters,
            numbers, hyphens, underscores.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {loading ? "Creating..." : "Create Short Link"}
        </button>
      </form>
    </div>
  );
};

export default CreateLinkForm;
