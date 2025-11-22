import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CopyButton from "./CopyButton";

const LinkTable = ({ links, loading, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const filteredAndSortedLinks = useMemo(() => {
    let validLinks = Array.isArray(links) ? links : [];

    let filtered = validLinks.filter((link) => {
      const shortCode = link?.shortCode || "";
      const originalUrl = link?.originalUrl || "";
      return (
        shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    filtered.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      if (sortField === "lastClicked") {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      if (sortField === "totalClicks") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === "asc" ? -1 : 1;
      if (bValue == null) return sortDirection === "asc" ? 1 : -1;

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [links, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const truncateUrl = (url, maxLength = 50) => {
    if (!url) return "No URL";
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getShortUrl = (shortCode) => {
    if (window.location.hostname === "localhost") {
      return `http://localhost:5000/${shortCode}`;
    }
    return `${window.location.origin}/${shortCode}`;
  };

  const handleShortLinkClick = (shortCode, event) => {
    event.preventDefault();
    const shortUrl = getShortUrl(shortCode);
    window.open(shortUrl, "_blank", "noopener,noreferrer");
    console.log(`🔗 Opening: ${shortUrl}`);
  };

  const isEmpty = !Array.isArray(links) || links.length === 0;

  if (loading && isEmpty) {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex justify-center items-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></motion.div>
          <span className="ml-2 text-gray-600">Loading links...</span>
        </div>
      </motion.div>
    );
  }

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
      className="bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Table Header with Search */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <motion.h2
            className="text-lg font-semibold text-gray-900"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Your Links ({filteredAndSortedLinks.length})
          </motion.h2>
          <motion.div
            className="w-full sm:w-64"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </motion.div>
        </div>
      </div>

      {/* Table */}
      {filteredAndSortedLinks.length === 0 ? (
        <motion.div
          className="p-8 text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {searchTerm ? "No links match your search." : "No links created yet."}
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "shortCode",
                  "originalUrl",
                  "totalClicks",
                  "lastClicked",
                  "actions",
                ].map((field, index) => (
                  <motion.th
                    key={field}
                    className={`px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      field !== "actions"
                        ? "cursor-pointer hover:bg-gray-100"
                        : ""
                    }`}
                    onClick={() => field !== "actions" && handleSort(field)}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {field === "shortCode" && "Short Code"}
                        {field === "originalUrl" && "Original URL"}
                        {field === "totalClicks" && "Clicks"}
                        {field === "lastClicked" && "Last Clicked"}
                        {field === "actions" && "Actions"}
                      </span>
                      {field !== "actions" && (
                        <span className="text-xs">{getSortIcon(field)}</span>
                      )}
                    </div>
                  </motion.th>
                ))}
              </tr>
            </thead>
            <motion.tbody
              className="bg-white divide-y divide-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredAndSortedLinks.map((link, index) => (
                  <motion.tr
                    key={link?.id || Math.random()}
                    variants={itemVariants}
                    className="hover:bg-gray-50"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <motion.a
                          href={getShortUrl(link?.shortCode)}
                          onClick={(e) =>
                            handleShortLinkClick(link?.shortCode, e)
                          }
                          className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition-colors cursor-pointer"
                          title={`Click to test: ${getShortUrl(
                            link?.shortCode
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {link?.shortCode || "N/A"}
                        </motion.a>
                        <CopyButton
                          text={getShortUrl(link?.shortCode)}
                          className="text-xs"
                        />
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <a
                          href={link?.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 truncate max-w-[150px] sm:max-w-xs hover:text-gray-900 transition-colors"
                          title={link?.originalUrl || "No URL"}
                        >
                          {truncateUrl(
                            link?.originalUrl,
                            window.innerWidth < 640 ? 30 : 60
                          )}
                        </a>
                        <CopyButton
                          text={link?.originalUrl || ""}
                          className="text-xs"
                        />
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-900 font-medium">
                          {link?.totalClicks ?? 0}
                        </span>
                        {link?.totalClicks > 0 && (
                          <motion.span
                            className="text-xs text-green-600 bg-green-50 px-1 rounded"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            +{link.totalClicks}
                          </motion.span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {link?.lastClicked ? (
                        <span className="flex items-center space-x-1">
                          <span className="hidden sm:inline">
                            {formatDate(link.lastClicked)}
                          </span>
                          <span className="sm:hidden">
                            {new Date(link.lastClicked).toLocaleDateString()}
                          </span>
                          {new Date(link.lastClicked) >
                            new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                            <motion.span
                              className="text-xs text-green-600 bg-green-50 px-1 rounded"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              New
                            </motion.span>
                          )}
                        </span>
                      ) : (
                        "Never"
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            to={`/code/${link?.shortCode || ""}`}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            Stats
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            onClick={() => onDelete(link?.shortCode || "")}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </motion.div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>
      )}

      {/* Helper Info */}
      <motion.div
        className="p-4 border-t bg-blue-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center text-sm text-blue-700">
          <svg
            className="w-4 h-4 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs sm:text-sm">
            <strong>Tip:</strong> Click any short code to test the redirect and
            track clicks!
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LinkTable;
