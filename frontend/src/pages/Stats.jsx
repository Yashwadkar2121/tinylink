import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  RefreshCw,
  BarChart3,
  Link2,
  ExternalLink,
  TrendingUp,
  Clock,
  Calendar,
  Eye,
  Zap,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { linksAPI } from "../utils/api";

const Stats = () => {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [copied, setCopied] = useState({ shortUrl: false, originalUrl: false });

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

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
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
    initial: { opacity: 0, y: 30, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -30, scale: 1.02 },
  };

  const pageTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    duration: 0.7,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
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
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"
          />
          <motion.p
            className="text-gray-600 text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading analytics...
          </motion.p>
          <motion.p
            className="text-gray-400 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Gathering your link statistics
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
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <BarChart3 className="w-8 h-8 text-red-600" />
            </motion.div>
            <motion.h3
              className="text-xl font-bold text-red-800 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Link Not Found
            </motion.h3>
            <motion.p
              className="text-red-700 mb-6"
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-4 h-4" />
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
              className="text-blue-600 hover:text-blue-800 font-medium text-lg"
            >
              Return to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const shortUrl = `${window.location.origin}/${link.shortCode}`;

  const stats = [
    {
      value: link.totalClicks || 0,
      label: "Total Clicks",
      icon: TrendingUp,
      color: "blue",
      description: "All-time engagement",
      valueSize: "text-3xl sm:text-4xl",
    },
    {
      value: link.shortCode,
      label: "Short Code",
      icon: Link2,
      color: "teal",
      description: "Your unique identifier",
      valueSize: "text-xl sm:text-2xl",
    },
    {
      value: link.lastClicked
        ? formatDate(link.lastClicked).split(",")[0]
        : "Never",
      label: "Last Clicked",
      icon: Clock,
      color: "purple",
      description: link.lastClicked
        ? getTimeSinceLastClick()
        : "No activity yet",
      valueSize: "text-lg sm:text-xl",
    },
    {
      value: getTimeSinceCreation(),
      label: "Active For",
      icon: Calendar,
      color: "orange",
      description: `Created ${new Date(link.createdAt).toLocaleDateString()}`,
      valueSize: "text-lg sm:text-xl",
    },
  ];

  const colorMap = {
    blue: {
      bg: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      text: "text-blue-900",
      icon: "text-blue-600",
    },
    teal: {
      bg: "from-teal-50 to-teal-100",
      border: "border-teal-200",
      text: "text-teal-900",
      icon: "text-teal-600",
    },
    purple: {
      bg: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      text: "text-purple-900",
      icon: "text-purple-600",
    },
    orange: {
      bg: "from-orange-50 to-orange-100",
      border: "border-orange-200",
      text: "text-orange-900",
      icon: "text-orange-600",
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto p-4 sm:p-6"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Header */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <BarChart3 className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Link Analytics
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Detailed performance insights for your short link
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <motion.button
              onClick={handleRefresh}
              disabled={loading}
              variants={itemVariants}
              whileHover={!loading ? { scale: 1.05, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              className="px-6 py-3 text-base font-semibold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 border-2 border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                  />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Refresh Stats
                </>
              )}
            </motion.button>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 sm:flex-none"
            >
              <Link
                to="/"
                className="inline-flex justify-center items-center gap-3 px-6 py-3 text-base font-semibold text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 border-2 border-gray-200 w-full sm:w-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Dashboard
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Short URL Card */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 mb-8 border-2 border-blue-200 shadow-sm"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <Link2 className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-800">
                  Short URL
                </h3>
              </div>
              <p className="text-2xl font-bold text-blue-900 break-words bg-white/80 p-4 rounded-xl border-2 border-blue-200">
                {shortUrl}
              </p>
            </div>
            <motion.button
              onClick={() => handleCopy(shortUrl, "shortUrl")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 text-base font-semibold bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 border-2 border-blue-200 flex items-center gap-3 min-w-[140px] justify-center"
            >
              {copied.shortUrl ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy URL
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = colorMap[stat.color];

            return (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 text-center border-2 ${colors.border} shadow-sm relative overflow-hidden`}
                variants={statCardVariants}
                whileHover="hover"
              >
                {/* Background Icon */}
                <div className="absolute top-2 right-2 opacity-10">
                  <Icon className="w-12 h-12" />
                </div>

                <div className="relative z-10">
                  <div
                    className={`p-3 rounded-xl bg-white/50 inline-flex mb-4 border-2 ${colors.border}`}
                  >
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <div
                    className={`font-bold ${colors.text} ${stat.valueSize} mb-3`}
                  >
                    {stat.value}
                  </div>
                  <div className={`text-lg font-semibold ${colors.text} mb-2`}>
                    {stat.label}
                  </div>
                  <motion.div
                    className={`text-sm ${colors.text}/70`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  >
                    {stat.description}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Destination URL */}
        <motion.div
          className="border-2 border-gray-200 rounded-2xl p-6 mb-8 bg-white shadow-sm"
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <ExternalLink className="w-6 h-6 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              Destination URL
            </h3>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <p
              className="text-gray-900 break-words flex-1 text-lg bg-gray-50 p-4 rounded-xl border-2 border-gray-200 font-medium"
              title={link.originalUrl}
            >
              {link.originalUrl}
            </p>
            <motion.button
              onClick={() => handleCopy(link.originalUrl, "originalUrl")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 text-base font-semibold bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200 flex items-center gap-3 min-w-[140px] justify-center"
            >
              {copied.originalUrl ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy URL
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Additional Information */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-base mb-8"
          variants={containerVariants}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200 shadow-sm"
            variants={itemVariants}
            whileHover={{ y: -2, scale: 1.01 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-800 text-lg">
                Creation Information
              </h4>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between items-center py-3 border-b border-gray-200/60">
                <span className="font-medium">Created:</span>
                <span className="font-semibold text-blue-700">
                  {formatDate(link.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200/60">
                <span className="font-medium">Last Updated:</span>
                <span className="font-semibold text-teal-700">
                  {formatDate(link.updatedAt)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-medium">Link ID:</span>
                <span className="font-mono text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg border">
                  {link.id}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-2xl p-6 border-2 border-gray-200 shadow-sm"
            variants={itemVariants}
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-teal-600" />
              <h4 className="font-semibold text-gray-800 text-lg">
                Performance
              </h4>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between items-center py-3 border-b border-gray-200/60">
                <span className="font-medium">Click Through Rate:</span>
                <span
                  className={`font-semibold ${
                    link.totalClicks > 0 ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {link.totalClicks > 0 ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    "No clicks yet"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200/60">
                <span className="font-medium">Status:</span>
                <span
                  className={`font-semibold ${
                    link.totalClicks > 0 ? "text-green-600" : "text-blue-600"
                  }`}
                >
                  {link.totalClicks > 0 ? "Performing" : "Ready"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-medium">Last Activity:</span>
                <span className="font-semibold text-purple-700">
                  {getTimeSinceLastClick()}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Click Activity */}
        <motion.div className="mt-8" variants={itemVariants}>
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-gray-600" />
            <h4 className="font-semibold text-gray-800 text-xl">
              Click Activity
            </h4>
          </div>
          <motion.div
            className={`rounded-2xl p-8 text-center border-2 shadow-sm ${
              link.totalClicks > 0
                ? "bg-gradient-to-br from-green-50 to-teal-50 border-green-200"
                : "bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200"
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <AnimatePresence mode="wait">
              {link.totalClicks === 0 ? (
                <motion.div
                  key="no-clicks"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center"
                  >
                    <Eye className="w-10 h-10 text-gray-400" />
                  </motion.div>
                  <motion.h3
                    className="text-2xl font-bold text-gray-700 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    No Clicks Yet
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 mb-6 text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Share your short link to start tracking engagement!
                  </motion.p>
                  <motion.p
                    className="text-sm text-gray-500 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    The click counter updates automatically. Share your link on
                    social media, emails, or anywhere you'd normally share a
                    URL.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="has-clicks"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-200 to-teal-300 rounded-3xl flex items-center justify-center"
                  >
                    <TrendingUp className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <motion.h3
                    className="text-3xl font-bold text-gray-800 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.span
                      className="text-green-600"
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
                    Click{link.totalClicks === 1 ? "" : "s"} Tracked!
                  </motion.h3>
                  <motion.p
                    className="text-gray-700 text-xl mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Your link is performing well and engaging users effectively.
                  </motion.p>
                  {link.lastClicked && (
                    <motion.p
                      className="text-base text-gray-600 bg-white/80 p-4 rounded-xl border border-green-200 inline-block"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
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
