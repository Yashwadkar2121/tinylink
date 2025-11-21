import React, { useState, useEffect } from "react";
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
        <p className="text-gray-600 mt-2">
          Check the status of the TinyLink service
        </p>
      </div>

      {/* Health Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">Service Status</h2>
          <button
            onClick={checkHealth}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Checking..." : "Check Again"}
          </button>
        </div>

        {loading && !healthData && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              Checking health status...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
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
          </div>
        )}

        {healthData && (
          <div className="space-y-6">
            {/* Status Indicator */}
            <div
              className={`p-4 rounded-lg ${
                healthData.ok
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-3 w-3 rounded-full ${
                    healthData.ok ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
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
            </div>

            {/* Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Version</div>
                <div className="text-lg font-semibold text-gray-900">
                  {healthData.version || "N/A"}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Uptime</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatUptime(healthData.uptime)}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">
                  Last Checked
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {lastChecked ? lastChecked.toLocaleTimeString() : "N/A"}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                System Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(healthData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {lastChecked && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Last checked: {lastChecked.toLocaleString()}
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">About TinyLink</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Features</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• URL shortening with custom codes</li>
              <li>• Click tracking and analytics</li>
              <li>• Link management dashboard</li>
              <li>• Real-time health monitoring</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Technology Stack</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Frontend: React + Vite + Tailwind CSS</li>
              <li>• Backend: Node.js + Express.js</li>
              <li>• Database: PostgreSQL with Sequelize ORM</li>
              <li>• Deployment: Vercel + Railway/Render</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Health;
