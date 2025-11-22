import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Link Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Create and manage your short links
        </p>
      </motion.div>

      {/* Create Link Form */}
      <CreateLinkForm onSubmit={handleCreateLink} loading={loading} />

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-md p-4"
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
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links Table */}
      <LinkTable links={links} loading={loading} onDelete={handleDeleteLink} />
    </motion.div>
  );
};

export default Dashboard;
