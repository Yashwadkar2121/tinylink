import React from "react";
import { Link } from "react-router-dom";
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Link Statistics</h2>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Short URL Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <h3 className="text-sm font-medium text-blue-800">Short URL</h3>
            <p className="text-lg font-semibold text-blue-900">{shortUrl}</p>
          </div>
          <CopyButton text={shortUrl} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {link.totalClicks}
          </div>
          <div className="text-sm text-gray-600">Total Clicks</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-gray-900">
            {link.shortCode}
          </div>
          <div className="text-sm text-gray-600">Short Code</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm font-bold text-gray-900">
            {formatDate(link.lastClicked).split(",")[0]}
          </div>
          <div className="text-sm text-gray-600">Last Clicked</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-sm font-bold text-gray-900">
            {getTimeSinceCreation()}
          </div>
          <div className="text-sm text-gray-600">Active For</div>
        </div>
      </div>

      {/* Destination URL */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Destination URL
        </h3>
        <div className="flex items-center justify-between">
          <p
            className="text-gray-900 truncate flex-1 mr-4"
            title={link.originalUrl}
          >
            {link.originalUrl}
          </p>
          <CopyButton text={link.originalUrl} />
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            Creation Information
          </h4>
          <div className="space-y-1 text-gray-600">
            <p>Created: {formatDate(link.createdAt)}</p>
            <p>Last Updated: {formatDate(link.updatedAt)}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Link Information</h4>
          <div className="space-y-1 text-gray-600">
            <p>Short Code: {link.shortCode}</p>
            <p>ID: {link.id}</p>
          </div>
        </div>
      </div>

      {/* Click History Placeholder */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-3">Click Activity</h4>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-600">
            {link.totalClicks === 0
              ? "No clicks yet. Share your short link to start tracking!"
              : `This link has been clicked ${link.totalClicks} time${
                  link.totalClicks === 1 ? "" : "s"
                }.`}
          </p>
          {link.lastClicked && (
            <p className="text-sm text-gray-500 mt-1">
              Last clicked on {formatDate(link.lastClicked)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
