import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  Link2,
  ExternalLink,
  BarChart3,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
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
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
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
    if (sortField !== field)
      return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortDirection === "asc" ? (
      <ArrowUp size={14} className="text-blue-600" />
    ) : (
      <ArrowDown size={14} className="text-blue-600" />
    );
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
  };

  const isEmpty = !Array.isArray(links) || links.length === 0;

  if (loading && isEmpty) {
    return (
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"
          />
          <motion.p
            className="text-gray-600 text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading your links...
          </motion.p>
          <motion.p
            className="text-gray-400 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Preparing your URL magic
          </motion.p>
        </div>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const tableHeaderVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      {/* Enhanced Table Header with Search */}
      <div className="p-6 border-b border-blue-200 bg-white/80">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl shadow-lg">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Links</h2>
              <p className="text-gray-600 text-sm">
                {filteredAndSortedLinks.length} link
                {filteredAndSortedLinks.length !== 1 ? "s" : ""} created
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative w-full lg:w-80"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search links or URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/90 backdrop-blur-sm"
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Table */}
      {filteredAndSortedLinks.length === 0 ? (
        <motion.div
          className="p-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center"
            >
              <Filter className="w-8 h-8 text-gray-400" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No matching links found" : "No links created yet"}
            </h3>
            <p className="text-gray-600 text-sm">
              {searchTerm
                ? "Try adjusting your search terms to find what you're looking for."
                : "Create your first short link to get started!"}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/60">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50/50">
              <motion.tr
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { field: "shortCode", label: "Short Link", icon: Link2 },
                  {
                    field: "originalUrl",
                    label: "Destination",
                    icon: ExternalLink,
                  },
                  { field: "totalClicks", label: "Clicks", icon: TrendingUp },
                  { field: "lastClicked", label: "Last Clicked", icon: Clock },
                  { field: "actions", label: "Actions", icon: BarChart3 },
                ].map(({ field, label, icon: Icon }, index) => (
                  <motion.th
                    key={field}
                    className={`px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                      field !== "actions" ? "cursor-pointer group" : ""
                    }`}
                    onClick={() => field !== "actions" && handleSort(field)}
                    variants={tableHeaderVariants}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span>{label}</span>
                      {field !== "actions" && (
                        <motion.span
                          className="transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                        >
                          {getSortIcon(field)}
                        </motion.span>
                      )}
                    </div>
                  </motion.th>
                ))}
              </motion.tr>
            </thead>
            <motion.tbody
              className="bg-white divide-y divide-gray-200/40"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSortedLinks.map((link, index) => (
                  <motion.tr
                    key={link?.id || Math.random()}
                    variants={itemVariants}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      x: -50,
                      transition: { duration: 0.3 },
                    }}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(59, 130, 246, 0.03)",
                      transition: { duration: 0.2 },
                    }}
                    className="group border-b border-gray-100 hover:border-blue-200 transition-all duration-200"
                  >
                    {/* Short Code Column */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <motion.a
                          href={getShortUrl(link?.shortCode)}
                          onClick={(e) =>
                            handleShortLinkClick(link?.shortCode, e)
                          }
                          className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-2 rounded-xl hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 cursor-pointer group/link border border-blue-200 hover:border-blue-300 hover:shadow-md"
                          title={`Click to test: ${getShortUrl(
                            link?.shortCode
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link2 className="w-4 h-4" />
                          {link?.shortCode || "N/A"}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
                        </motion.a>
                        <CopyButton text={getShortUrl(link?.shortCode)} />
                      </div>
                    </td>

                    {/* Original URL Column */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3 max-w-md">
                        <a
                          href={link?.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-700 truncate hover:text-gray-900 transition-colors duration-200 flex-1 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 group/url"
                          title={link?.originalUrl || "No URL"}
                        >
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="truncate">
                              {truncateUrl(
                                link?.originalUrl,
                                window.innerWidth < 640 ? 25 : 45
                              )}
                            </span>
                          </div>
                        </a>
                        <CopyButton text={link?.originalUrl || ""} />
                      </div>
                    </td>

                    {/* Clicks Column */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <motion.span
                          className="text-sm font-bold text-gray-900 bg-gradient-to-r from-blue-50 to-teal-50 px-3 py-2 rounded-xl border border-blue-100"
                          whileHover={{ scale: 1.05 }}
                        >
                          {link?.totalClicks ?? 0}
                        </motion.span>
                        {link?.totalClicks > 0 && (
                          <motion.span
                            className="text-xs font-semibold text-teal-700 bg-teal-100 px-2 py-1 rounded-full border border-teal-200"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              delay: index * 0.1,
                            }}
                          >
                            +{link.totalClicks}
                          </motion.span>
                        )}
                      </div>
                    </td>

                    {/* Last Clicked Column */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${
                            link?.lastClicked
                              ? "text-gray-700"
                              : "text-gray-400"
                          } font-medium bg-gray-50 px-3 py-2 rounded-xl border border-gray-200`}
                        >
                          {link?.lastClicked ? (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="hidden sm:inline">
                                {formatDate(link.lastClicked)}
                              </span>
                              <span className="sm:hidden text-xs">
                                {new Date(
                                  link.lastClicked
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          ) : (
                            "Never clicked"
                          )}
                        </span>
                        {link?.lastClicked &&
                          new Date(link.lastClicked) >
                            new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                            <motion.span
                              className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full border border-green-200 flex items-center gap-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                              New
                            </motion.span>
                          )}
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            to={`/code/${link?.shortCode || ""}`}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200 text-sm font-medium"
                          >
                            <BarChart3 className="w-4 h-4" />
                            <span className="hidden sm:inline">Stats</span>
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            onClick={() => onDelete(link?.shortCode || "")}
                            className="flex items-center gap-2 text-red-600 hover:text-red-800 px-3 py-2 rounded-xl hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
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

      {/* Enhanced Helper Info */}
      <motion.div
        className="p-6 border-t border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-center gap-3 text-blue-700">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-2 bg-blue-100 rounded-xl"
          >
            <Eye className="w-4 h-4" />
          </motion.div>
          <div>
            <p className="text-sm font-medium">
              <strong>Pro Tip:</strong> Click any short code to test the
              redirect and track clicks in real-time!
            </p>
            <p className="text-xs text-blue-600/70 mt-1">
              Each click updates the statistics automatically
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LinkTable;
