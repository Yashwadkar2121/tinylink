import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import CopyButton from "./CopyButton";

const LinkTable = ({ links, loading, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  // Filter and sort links
  const filteredAndSortedLinks = useMemo(() => {
    let validLinks = Array.isArray(links) ? links : [];

    let filtered = validLinks.filter((link) => {
      // Safely get values with fallbacks
      const shortCode = link?.shortCode || "";
      const originalUrl = link?.originalUrl || "";

      // Safely check if search term matches
      return (
        shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Sort links
    filtered.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      // Handle date fields safely
      if (sortField === "lastClicked") {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      // Handle number fields
      if (sortField === "totalClicks") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      // Handle undefined/null values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === "asc" ? -1 : 1;
      if (bValue == null) return sortDirection === "asc" ? 1 : -1;

      // Compare values
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

  // Safely check if links array is empty
  const isEmpty = !Array.isArray(links) || links.length === 0;

  if (loading && isEmpty) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading links...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Table Header with Search */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Links ({filteredAndSortedLinks.length})
          </h2>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredAndSortedLinks.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          {searchTerm ? "No links match your search." : "No links created yet."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("shortCode")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Short Code</span>
                    <span className="text-xs">{getSortIcon("shortCode")}</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original URL
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("totalClicks")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Clicks</span>
                    <span className="text-xs">
                      {getSortIcon("totalClicks")}
                    </span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("lastClicked")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Clicked</span>
                    <span className="text-xs">
                      {getSortIcon("lastClicked")}
                    </span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedLinks.map((link) => (
                <tr
                  key={link?.id || Math.random()}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {link?.shortCode || "N/A"}
                      </span>
                      <CopyButton
                        text={`${window.location.origin}/${
                          link?.shortCode || ""
                        }`}
                        className="text-xs"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className="text-sm text-gray-600 truncate max-w-xs"
                        title={link?.originalUrl || "No URL"}
                      >
                        {truncateUrl(link?.originalUrl, 60)}
                      </span>
                      <CopyButton
                        text={link?.originalUrl || ""}
                        className="text-xs"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-900 font-medium">
                        {link?.totalClicks ?? 0}
                      </span>
                      {link?.totalClicks > 0 && (
                        <span className="text-xs text-green-600 bg-green-50 px-1 rounded">
                          +{link.totalClicks}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {link?.lastClicked ? (
                      <span className="flex items-center space-x-1">
                        <span>{formatDate(link.lastClicked)}</span>
                        {new Date(link.lastClicked) >
                          new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                          <span className="text-xs text-green-600 bg-green-50 px-1 rounded">
                            New
                          </span>
                        )}
                      </span>
                    ) : (
                      "Never"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/code/${link?.shortCode || ""}`}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Stats
                      </Link>
                      <button
                        onClick={() => onDelete(link?.shortCode || "")}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LinkTable;
