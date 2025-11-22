import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { linksAPI } from "../utils/api";

const Health = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await linksAPI.healthCheck();
      setHealthData(data);
      setLastChecked(new Date());
    } catch (err) {
      setError(err.message || "Failed to check health status");
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const formatUptime = (seconds) => {
    if (!seconds) return "N/A";

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (parts.length === 0) parts.push(`${Math.floor(seconds)}s`);

    return parts.join(" ");
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
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
      scale: 1.02,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
      },
    },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          System Health
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Check the status of the TinyLink service
        </p>
      </motion.div>

      {/* Health Status Card */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold">Service Status</h2>
          <motion.button
            onClick={checkHealth}
            disabled={loading}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
            className={`px-4 py-2 text-sm font-medium rounded-md w-full sm:w-auto transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border border-white border-t-transparent rounded-full mr-2"
                />
                Checking...
              </span>
            ) : (
              "Check Again"
            )}
          </motion.button>
        </div>

        {loading && !healthData && (
          <motion.div
            className="flex items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-8 w-8 border-b-2 border-blue-600"
            />
            <span className="ml-2 text-gray-600">
              Checking health status...
            </span>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-md p-4 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Connection Error
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {healthData && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Status Indicator */}
            <motion.div
              className={`p-4 rounded-lg ${
                healthData.ok
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center">
                <motion.div
                  className={`flex-shrink-0 h-3 w-3 rounded-full ${
                    healthData.ok ? "bg-green-400" : "bg-red-400"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                />
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${
                      healthData.ok ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    Service is {healthData.ok ? "Healthy" : "Unhealthy"}
                  </h3>
                  <p
                    className={`text-sm ${
                      healthData.ok ? "text-green-700" : "text-red-700"
                    } mt-1`}
                  >
                    {healthData.ok
                      ? "All systems are operational"
                      : "Service is experiencing issues"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Health Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Version", value: healthData.version || "N/A" },
                { label: "Uptime", value: formatUptime(healthData.uptime) },
                {
                  label: "Last Checked",
                  value: lastChecked ? lastChecked.toLocaleTimeString() : "N/A",
                },
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4"
                  variants={cardVariants}
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-sm font-medium text-gray-500">
                    {metric.label}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {metric.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Information */}
            <motion.div
              className="border-t pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                System Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(healthData, null, 2)}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}

        {lastChecked && (
          <motion.div
            className="mt-4 text-sm text-gray-500 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Last checked: {lastChecked.toLocaleString()}
          </motion.div>
        )}
      </motion.div>

      {/* System Information */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-4 sm:p-6"
        variants={itemVariants}
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          About TinyLink
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm">
          <motion.div variants={cardVariants} whileHover={{ y: -2 }}>
            <h3 className="font-medium text-gray-700 mb-2">Features</h3>
            <ul className="text-gray-600 space-y-1 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                URL shortening with custom codes
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Click tracking and analytics
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Link management dashboard
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Real-time health monitoring
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Responsive design
              </li>
            </ul>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -2 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-medium text-gray-700 mb-2">Technology Stack</h3>
            <ul className="text-gray-600 space-y-1 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Frontend: React + Vite + Tailwind CSS
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Backend: Node.js + Express.js
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Database: PostgreSQL with Sequelize ORM
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Deployment: Vercel + Railway/Render
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Health;
