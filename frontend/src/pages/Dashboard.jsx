import React from "react";
import { useLinks } from "../hooks/useLinks";
import CreateLinkForm from "../components/CreateLinkForm";
import LinkTable from "../components/LinkTable";

const Dashboard = () => {
  const { links, loading, error, createLink, deleteLink } = useLinks();

  const handleCreateLink = async (linkData) => {
    await createLink(linkData);
  };

  const handleDeleteLink = async (code) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      await deleteLink(code);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Link Dashboard</h1>
        <p className="text-gray-600 mt-2">Create and manage your short links</p>
      </div>

      {/* Create Link Form */}
      <CreateLinkForm onSubmit={handleCreateLink} loading={loading} />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
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
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Links Table */}
      <LinkTable links={links} loading={loading} onDelete={handleDeleteLink} />
    </div>
  );
};

export default Dashboard;
