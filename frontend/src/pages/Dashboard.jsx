import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, AlertCircle, Zap, BarChart3, Rocket } from "lucide-react";
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
    initial: { opacity: 0, x: -20, scale: 0.98 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 0, x: 20, scale: 1.02 },
  };

  const pageTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    duration: 0.6,
  };

  const headerVariants = {
    initial: { opacity: 0, y: -30 },
    in: { opacity: 1, y: 0 },
    transition: { duration: 0.7, type: "spring" },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-8"
    >
      {/* Enhanced Header */}
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 border border-blue-100 shadow-lg"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="p-3 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link2 className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Link Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Create, manage, and track your short links in real-time
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/80 p-4 rounded-xl border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Array.isArray(links) ? links.length : 0}
            </div>
            <div className="text-sm text-gray-600">Total Links</div>
          </div>
          <div className="bg-white/80 p-4 rounded-xl border border-teal-200 text-center">
            <div className="text-2xl font-bold text-teal-600">
              {Array.isArray(links)
                ? links.reduce((acc, link) => acc + (link.totalClicks || 0), 0)
                : 0}
            </div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Create Link Form */}
      <CreateLinkForm onSubmit={handleCreateLink} loading={loading} />

      {/* Enhanced Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg"
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="p-2 bg-red-100 rounded-xl flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AlertCircle className="w-6 h-6 text-red-600" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Try Again
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Links Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Links</h2>
        </div>
        <LinkTable
          links={links}
          loading={loading}
          onDelete={handleDeleteLink}
        />
      </motion.div>

      {/* Empty State Enhancement */}
      <AnimatePresence>
        {!loading && Array.isArray(links) && links.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl flex items-center justify-center"
            >
              <Rocket className="w-10 h-10 text-blue-600" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Create Your First Link?
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
              Start by creating your first short link above. It's quick, easy,
              and you'll get detailed analytics!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Zap className="w-5 h-5" />
              Create Your First Link
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
