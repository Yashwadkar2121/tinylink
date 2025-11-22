import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  RefreshCw,
  Server,
  Clock,
  Code2,
  CheckCircle2,
  XCircle,
  Activity,
  Cpu,
  Calendar,
} from "lucide-react";
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

  const cardVariants = {
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

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto p-4 sm:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Header */}
      <motion.div className="mb-8 sm:mb-12" variants={itemVariants}>
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="p-3 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Activity className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              System Health
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Monitor the status and performance of TinyLink services
            </p>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Health Status Card */}
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8 mb-8"
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Service Status
              </h2>
              <p className="text-gray-600">Real-time health monitoring</p>
            </div>
          </div>
          <motion.button
            onClick={checkHealth}
            disabled={loading}
            whileHover={!loading ? { scale: 1.05, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
            className={`px-6 py-3 text-base font-semibold rounded-xl transition-all duration-200 flex items-center gap-3 ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : "bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Checking System...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Check Again
              </>
            )}
          </motion.button>
        </div>

        {loading && !healthData && (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"
            />
            <p className="text-gray-600 text-lg font-medium">
              Checking health status...
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Analyzing system components
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="p-2 bg-red-100 rounded-xl flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <XCircle className="w-6 h-6 text-red-600" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Connection Error
                </h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {healthData && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Enhanced Status Indicator */}
            <motion.div
              className={`p-6 rounded-2xl border-2 shadow-sm ${
                healthData.ok
                  ? "bg-gradient-to-r from-green-50 to-teal-50 border-green-200"
                  : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
              }`}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className={`p-3 rounded-xl ${
                    healthData.ok ? "bg-green-100" : "bg-red-100"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
                >
                  {healthData.ok ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                </motion.div>
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      healthData.ok ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    Service is {healthData.ok ? "Healthy" : "Unhealthy"}
                  </h3>
                  <p
                    className={`text-lg ${
                      healthData.ok ? "text-green-700" : "text-red-700"
                    } mt-1`}
                  >
                    {healthData.ok
                      ? "All systems are operational and running smoothly"
                      : "Service is experiencing issues and may be unavailable"}
                  </p>
                </div>
                {healthData.ok && (
                  <motion.div
                    className="ml-auto"
                    variants={pulseVariants}
                    animate="animate"
                  >
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Enhanced Health Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  label: "Version",
                  value: healthData.version || "N/A",
                  icon: Code2,
                  color: "blue",
                  description: "Current API version",
                },
                {
                  label: "Uptime",
                  value: formatUptime(healthData.uptime),
                  icon: Clock,
                  color: "teal",
                  description: "Service running time",
                },
                {
                  label: "Last Checked",
                  value: lastChecked ? lastChecked.toLocaleTimeString() : "N/A",
                  icon: Calendar,
                  color: "purple",
                  description: "Latest health check",
                },
              ].map((metric, index) => {
                const Icon = metric.icon;
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
                };
                const colors = colorMap[metric.color];

                return (
                  <motion.div
                    key={index}
                    className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 border-2 ${colors.border} shadow-sm`}
                    variants={cardVariants}
                    whileHover="hover"
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2 rounded-lg bg-white/50 border ${colors.border}`}
                      >
                        <Icon className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <div className="text-sm font-semibold text-gray-600">
                        {metric.label}
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${colors.text} mb-2`}>
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-500">
                      {metric.description}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Enhanced Additional Information */}
            <motion.div
              className="border-t border-gray-200 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold text-gray-800">
                  System Information
                </h4>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200 overflow-x-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {JSON.stringify(healthData, null, 2)}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}

        {lastChecked && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-sm text-gray-500 bg-white/80 p-3 rounded-xl border border-gray-200 inline-block">
              Last checked:{" "}
              <span className="font-semibold text-gray-700">
                {lastChecked.toLocaleString()}
              </span>
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced System Information */}
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl">
            <Server className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">About TinyLink</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-base">
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -2 }}
            className="bg-white/80 p-6 rounded-2xl border-2 border-gray-200"
          >
            <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Features
            </h3>
            <ul className="text-gray-700 space-y-3">
              {[
                "URL shortening with custom codes",
                "Real-time click tracking and analytics",
                "Link management dashboard",
                "Health monitoring and status checks",
                "Responsive design for all devices",
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-teal-500 rounded-full" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -2 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 p-6 rounded-2xl border-2 border-gray-200"
          >
            <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-teal-600" />
              Technology Stack
            </h3>
            <ul className="text-gray-700 space-y-3">
              {[
                "Frontend: React + Vite + Tailwind CSS",
                "Backend: Node.js + Express.js",
                "Database: PostgreSQL with Sequelize ORM",
                "Deployment: Vercel + Railway/Render",
                "Real-time: WebSocket connections",
              ].map((tech, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  {tech}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Health;
