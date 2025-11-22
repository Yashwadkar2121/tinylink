import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { linksAPI } from "../utils/api";

const Stats = () => {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const linkData = await linksAPI.getLinkStats(code);
      setLink(linkData);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch link statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      fetchLinkStats();
    }
  }, [code, refreshCount]);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getTimeSinceCreation = () => {
    if (!link?.createdAt) return "N/A";
    const created = new Date(link.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day";
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const getTimeSinceLastClick = () => {
    if (!link?.lastClicked) return "Never clicked";
    const lastClick = new Date(link.lastClicked);
    const now = new Date();
    const diffTime = Math.abs(now - lastClick);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
          ></motion.div>
          <motion.p
            className="mt-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading link statistics...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="text-center max-w-md w-full"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <motion.svg
              className="h-12 w-12 text-red-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </motion.svg>
            <motion.h3
              className="text-lg font-medium text-red-800 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Link Not Found
            </motion.h3>
            <motion.p
              className="text-red-700 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {error}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Back to Dashboard
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <motion.h2
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Link Not Found
          </motion.h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const shortUrl = `${window.location.origin}/${link.shortCode}`;

  return (
    <motion.div
      className="max-w-6xl mx-auto p-4 sm:p-6"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div
        className="bg-white rounded-lg shadow-md p-4 sm:p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
          variants={itemVariants}
        >
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Link Analytics
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Detailed statistics for your short link
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <motion.button
              onClick={handleRefresh}
              disabled={loading}
              variants={itemVariants}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border border-blue-600 border-t-transparent rounded-full mr-2"
                  />
                  Refreshing...
                </span>
              ) : (
                "Refresh Stats"
              )}
            </motion.button>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="order-1 sm:order-2"
            >
              <Link
                to="/"
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors w-full sm:w-auto"
              >
                ← Dashboard
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Short URL Card */}
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-blue-800">Short URL</h3>
              <p className="text-base sm:text-lg font-semibold text-blue-900 break-words">
                {shortUrl}
              </p>
            </div>
            <motion.button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
            >
              Copy URL
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8"
          variants={containerVariants}
        >
          {[
            {
              value: link.totalClicks || 0,
              label: "Total Clicks",
              gradient: "from-blue-50 to-blue-100",
              border: "border-blue-200",
              text: "text-blue-900",
              subText: "text-blue-700",
              description: link.totalClicks > 0 ? "Tracked in real-time" : null,
              valueSize: "text-2xl sm:text-3xl",
            },
            {
              value: link.shortCode,
              label: "Short Code",
              gradient: "from-green-50 to-green-100",
              border: "border-green-200",
              text: "text-green-900",
              subText: "text-green-700",
              valueSize: "text-lg sm:text-xl",
            },
            {
              value: link.lastClicked
                ? formatDate(link.lastClicked).split(",")[0]
                : "Never",
              label: "Last Clicked",
              gradient: "from-purple-50 to-purple-100",
              border: "border-purple-200",
              text: "text-purple-900",
              subText: "text-purple-700",
              description: link.lastClicked ? getTimeSinceLastClick() : null,
              valueSize: "text-sm sm:text-base",
            },
            {
              value: getTimeSinceCreation(),
              label: "Active For",
              gradient: "from-orange-50 to-orange-100",
              border: "border-orange-200",
              text: "text-orange-900",
              subText: "text-orange-700",
              description: `Since ${
                link.createdAt
                  ? formatDate(link.createdAt).split(",")[0]
                  : "N/A"
              }`,
              valueSize: "text-sm sm:text-base",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${stat.gradient} rounded-lg p-4 text-center border ${stat.border}`}
              variants={statCardVariants}
              whileHover="hover"
            >
              <div className={`font-bold ${stat.text} ${stat.valueSize} mb-2`}>
                {stat.value}
              </div>
              <div className={`text-sm font-medium ${stat.subText} mb-1`}>
                {stat.label}
              </div>
              {stat.description && (
                <motion.div
                  className={`text-xs ${stat.subText} mt-2`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {stat.description}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Destination URL */}
        <motion.div
          className="border border-gray-200 rounded-lg p-4 mb-6"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
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
            <motion.button
              onClick={() => navigator.clipboard.writeText(link.originalUrl)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
            >
              Copy URL
            </motion.button>
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm mb-6"
          variants={containerVariants}
        >
          <motion.div
            className="bg-gray-50 rounded-lg p-4"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <h4 className="font-medium text-gray-700 mb-3">
              Creation Information
            </h4>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm">Created:</span>
                <span className="font-medium text-xs sm:text-sm">
                  {formatDate(link.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm">Last Updated:</span>
                <span className="font-medium text-xs sm:text-sm">
                  {formatDate(link.updatedAt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm">Link ID:</span>
                <span className="font-medium text-xs truncate max-w-[120px] sm:max-w-[150px]">
                  {link.id}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-50 rounded-lg p-4"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <h4 className="font-medium text-gray-700 mb-3">Performance</h4>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm">Click Through Rate:</span>
                <span className="font-medium text-xs sm:text-sm">
                  {link.totalClicks > 0 ? "Active" : "No clicks yet"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm">Status:</span>
                <span
                  className={`font-medium text-xs sm:text-sm ${
                    link.totalClicks > 0 ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {link.totalClicks > 0 ? "Performing" : "Ready"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm">Last Activity:</span>
                <span className="font-medium text-xs sm:text-sm">
                  {getTimeSinceLastClick()}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Click Activity */}
        <motion.div className="mt-6 sm:mt-8" variants={itemVariants}>
          <h4 className="font-medium text-gray-700 mb-3">Click Activity</h4>
          <motion.div
            className={`rounded-lg p-4 sm:p-6 text-center ${
              link.totalClicks > 0
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50 border border-gray-200"
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <AnimatePresence mode="wait">
              {link.totalClicks === 0 ? (
                <motion.div
                  key="no-clicks"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg
                    className="h-8 sm:h-12 w-8 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </motion.svg>
                  <motion.p
                    className="text-gray-600 mb-2 text-sm sm:text-base"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    No clicks yet. Share your short link to start tracking!
                  </motion.p>
                  <motion.p
                    className="text-xs sm:text-sm text-gray-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    The click counter will update automatically when someone
                    uses your link.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="has-clicks"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg
                    className="h-8 sm:h-12 w-8 sm:w-12 text-green-400 mx-auto mb-3 sm:mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </motion.svg>
                  <motion.p
                    className="text-gray-700 mb-2 text-sm sm:text-base"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    This link has been clicked{" "}
                    <motion.span
                      className="font-bold text-green-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        delay: 0.4,
                      }}
                    >
                      {link.totalClicks}
                    </motion.span>{" "}
                    time{link.totalClicks === 1 ? "" : "s"}.
                  </motion.p>
                  {link.lastClicked && (
                    <motion.p
                      className="text-xs sm:text-sm text-gray-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Last clicked on {formatDate(link.lastClicked)}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Stats;
