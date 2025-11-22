import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CopyButton from "./CopyButton";

const StatsCard = ({ link }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const getTimeSinceCreation = () => {
    const created = new Date(link.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day";
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const shortUrl = `${window.location.origin}/${link.shortCode}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-4 sm:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
        variants={itemVariants}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Link Statistics
        </h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
          >
            ← Back to Dashboard
          </Link>
        </motion.div>
      </motion.div>

      {/* Short URL Card */}
      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-blue-800">Short URL</h3>
            <p className="text-base sm:text-lg font-semibold text-blue-900 break-words">
              {shortUrl}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CopyButton text={shortUrl} />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6"
        variants={itemVariants}
      >
        {[
          { value: link.totalClicks, label: "Total Clicks", color: "gray" },
          { value: link.shortCode, label: "Short Code", color: "gray" },
          {
            value: link.lastClicked
              ? formatDate(link.lastClicked).split(",")[0]
              : "Never",
            label: "Last Clicked",
            color: "gray",
          },
          { value: getTimeSinceCreation(), label: "Active For", color: "gray" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div
              className={`text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words`}
            >
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Destination URL */}
      <motion.div
        className="border border-gray-200 rounded-lg p-4 mb-6"
        variants={itemVariants}
      >
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Destination URL
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <p
            className="text-gray-900 break-words flex-1 mr-0 sm:mr-4 text-sm sm:text-base"
            title={link.originalUrl}
          >
            {link.originalUrl}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CopyButton text={link.originalUrl} />
          </motion.div>
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm"
        variants={itemVariants}
      >
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">
            Creation Information
          </h4>
          <div className="space-y-1 text-gray-600 text-xs sm:text-sm">
            <p>Created: {formatDate(link.createdAt)}</p>
            <p>Last Updated: {formatDate(link.updatedAt)}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Link Information</h4>
          <div className="space-y-1 text-gray-600 text-xs sm:text-sm">
            <p>Short Code: {link.shortCode}</p>
            <p className="truncate">ID: {link.id}</p>
          </div>
        </div>
      </motion.div>

      {/* Click History */}
      <motion.div className="mt-6" variants={itemVariants}>
        <h4 className="font-medium text-gray-700 mb-3">Click Activity</h4>
        <motion.div
          className="bg-gray-50 rounded-lg p-4 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-gray-600 text-sm sm:text-base">
            {link.totalClicks === 0
              ? "No clicks yet. Share your short link to start tracking!"
              : `This link has been clicked ${link.totalClicks} time${
                  link.totalClicks === 1 ? "" : "s"
                }.`}
          </p>
          {link.lastClicked && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Last clicked on {formatDate(link.lastClicked)}
            </p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StatsCard;
