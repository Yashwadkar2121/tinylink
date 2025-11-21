import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading link statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg
              className="h-12 w-12 text-red-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Link Not Found
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Link Not Found
          </h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const shortUrl = `${window.location.origin}/${link.shortCode}`;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Link Analytics</h1>
            <p className="text-gray-600 mt-1">
              Detailed statistics for your short link
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {loading ? "Refreshing..." : "Refresh Stats"}
            </button>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Short URL Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <h3 className="text-sm font-medium text-blue-800">Short URL</h3>
              <p className="text-lg font-semibold text-blue-900 break-all">
                {shortUrl}
              </p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Copy URL
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
            <div className="text-3xl font-bold text-blue-900">
              {link.totalClicks || 0}
            </div>
            <div className="text-sm font-medium text-blue-700">
              Total Clicks
            </div>
            {link.totalClicks > 0 && (
              <div className="text-xs text-blue-600 mt-1">
                Tracked in real-time
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
            <div className="text-xl font-bold text-green-900 break-all">
              {link.shortCode}
            </div>
            <div className="text-sm font-medium text-green-700">Short Code</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center border border-purple-200">
            <div className="text-sm font-bold text-purple-900">
              {link.lastClicked
                ? formatDate(link.lastClicked).split(",")[0]
                : "Never"}
            </div>
            <div className="text-sm font-medium text-purple-700">
              Last Clicked
            </div>
            {link.lastClicked && (
              <div className="text-xs text-purple-600 mt-1">
                {getTimeSinceLastClick()}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center border border-orange-200">
            <div className="text-sm font-bold text-orange-900">
              {getTimeSinceCreation()}
            </div>
            <div className="text-sm font-medium text-orange-700">
              Active For
            </div>
            <div className="text-xs text-orange-600 mt-1">
              Since{" "}
              {link.createdAt
                ? formatDate(link.createdAt).split(",")[0]
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Destination URL */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Destination URL
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <p
              className="text-gray-900 break-all flex-1 mr-4"
              title={link.originalUrl}
            >
              {link.originalUrl}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(link.originalUrl)}
              className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
            >
              Copy URL
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">
              Creation Information
            </h4>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="font-medium">
                  {formatDate(link.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="font-medium">
                  {formatDate(link.updatedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Link ID:</span>
                <span className="font-medium text-xs">{link.id}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Performance</h4>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Click Through Rate:</span>
                <span className="font-medium">
                  {link.totalClicks > 0 ? "Active" : "No clicks yet"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span
                  className={`font-medium ${
                    link.totalClicks > 0 ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {link.totalClicks > 0 ? "Performing" : "Ready"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Activity:</span>
                <span className="font-medium">{getTimeSinceLastClick()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Click Activity */}
        <div className="mt-8">
          <h4 className="font-medium text-gray-700 mb-3">Click Activity</h4>
          <div
            className={`rounded-lg p-6 text-center ${
              link.totalClicks > 0
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            {link.totalClicks === 0 ? (
              <div>
                <svg
                  className="h-12 w-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600 mb-2">
                  No clicks yet. Share your short link to start tracking!
                </p>
                <p className="text-sm text-gray-500">
                  The click counter will update automatically when someone uses
                  your link.
                </p>
              </div>
            ) : (
              <div>
                <svg
                  className="h-12 w-12 text-green-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-700 mb-2">
                  This link has been clicked{" "}
                  <span className="font-bold text-green-600">
                    {link.totalClicks}
                  </span>{" "}
                  time{link.totalClicks === 1 ? "" : "s"}.
                </p>
                {link.lastClicked && (
                  <p className="text-sm text-gray-600">
                    Last clicked on {formatDate(link.lastClicked)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
