import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Link2,
  ExternalLink,
  Calendar,
  Clock,
  TrendingUp,
  Eye,
  CheckCircle2,
  Zap,
  BarChart3,
  Copy,
  CalendarDays,
} from "lucide-react";
import CopyButton from "./CopyButton";

const StatsCard = ({ link }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const shortUrl = `${window.location.origin}/${link.shortCode}`;

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

  const stats = [
    {
      value: link.totalClicks,
      label: "Total Clicks",
      icon: TrendingUp,
      color: "blue",
      description: "All-time click count",
    },
    {
      value: link.shortCode,
      label: "Short Code",
      icon: Link2,
      color: "teal",
      description: "Your unique identifier",
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
    },
    {
      value: getTimeSinceCreation(),
      label: "Active For",
      icon: Calendar,
      color: "orange",
      description: `Created ${new Date(link.createdAt).toLocaleDateString()}`,
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
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Link Analytics
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Detailed performance insights for your short link
            </p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-blue-200 hover:border-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </motion.div>
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
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Short URL</h3>
            </div>
            <p className="text-xl font-bold text-blue-900 break-words bg-white/80 p-4 rounded-xl border border-blue-200">
              {shortUrl}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CopyButton text={shortUrl} className="text-base px-6 py-3" />
          </motion.div>
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
                  className={`p-3 rounded-xl bg-white/50 inline-flex mb-4 border ${colors.border}`}
                >
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className={`text-2xl font-bold ${colors.text} mb-2`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-semibold ${colors.text} mb-2`}>
                  {stat.label}
                </div>
                <motion.div
                  className={`text-xs ${colors.text}/70 mt-2`}
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
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Destination URL
          </h3>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <p
            className="text-gray-900 break-words flex-1 text-base bg-gray-50 p-4 rounded-xl border border-gray-200 font-medium"
            title={link.originalUrl}
          >
            {link.originalUrl}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CopyButton
              text={link.originalUrl}
              className="text-base px-6 py-3"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Additional Information */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm mb-8"
        variants={containerVariants}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200 shadow-sm"
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-800 text-lg">
              Creation Information
            </h4>
          </div>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
              <span className="font-medium">Created:</span>
              <span className="font-semibold text-blue-700">
                {formatDate(link.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
              <span className="font-medium">Last Updated:</span>
              <span className="font-semibold text-teal-700">
                {formatDate(link.updatedAt)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">Link ID:</span>
              <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border">
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
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-teal-600" />
            <h4 className="font-semibold text-gray-800 text-lg">Performance</h4>
          </div>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
              <span className="font-medium">Click Through Rate:</span>
              <span
                className={`font-semibold ${
                  link.totalClicks > 0 ? "text-green-600" : "text-gray-600"
                }`}
              >
                {link.totalClicks > 0 ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Active
                  </span>
                ) : (
                  "No clicks yet"
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
              <span className="font-medium">Status:</span>
              <span
                className={`font-semibold ${
                  link.totalClicks > 0 ? "text-green-600" : "text-blue-600"
                }`}
              >
                {link.totalClicks > 0 ? "Performing" : "Ready"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
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
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-gray-600" />
          <h4 className="font-semibold text-gray-800 text-lg">
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
          {link.totalClicks === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center"
              >
                <Eye className="w-8 h-8 text-gray-400" />
              </motion.div>
              <motion.h3
                className="text-xl font-bold text-gray-700 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                No Clicks Yet
              </motion.h3>
              <motion.p
                className="text-gray-600 mb-4 text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Share your short link to start tracking!
              </motion.p>
              <motion.p
                className="text-sm text-gray-500 max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                The click counter will update automatically when someone uses
                your link. Share it on social media, emails, or anywhere you'd
                normally share a link!
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-200 to-teal-300 rounded-2xl flex items-center justify-center"
              >
                <TrendingUp className="w-8 h-8 text-green-600" />
              </motion.div>
              <motion.h3
                className="text-2xl font-bold text-gray-800 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  className="text-green-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
                >
                  {link.totalClicks}
                </motion.span>{" "}
                Click{link.totalClicks === 1 ? "" : "s"} Tracked!
              </motion.h3>
              <motion.p
                className="text-gray-700 text-lg mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Your link is performing well and engaging users.
              </motion.p>
              {link.lastClicked && (
                <motion.p
                  className="text-sm text-gray-600 bg-white/80 p-3 rounded-xl border border-green-200 inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Last clicked on {formatDate(link.lastClicked)}
                </motion.p>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StatsCard;
