import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Activity, Home, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/healthz", label: "Health", icon: Activity },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = ({ isMobile = false }) => (
    <>
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={isMobile ? "w-full" : ""}
          >
            <Link
              to={item.path}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
              className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
                isActive
                  ? "text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white"
              } ${isMobile ? "w-full justify-center" : ""}`}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl -z-10"
                  layoutId="activeNav"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                className={`w-4 h-4 ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span className="font-semibold">{item.label}</span>

              {!isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-200"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </>
  );

  return (
    <motion.header
      className="bg-gradient-to-r from-white to-blue-50 shadow-lg border-b border-blue-100 backdrop-blur-sm bg-white/95"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 group"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10"
                whileHover={{ opacity: 0.3 }}
              />
            </motion.div>
            <motion.span
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              TinyLink
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex space-x-1 bg-white/80 rounded-2xl p-1 shadow-inner border border-gray-200">
            <NavLinks />
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="sm:hidden p-2 rounded-lg bg-white/80 border border-gray-200 shadow-inner"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              className="sm:hidden bg-white/95 rounded-2xl p-2 shadow-lg border border-gray-200 mt-2 mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col space-y-1">
                <NavLinks isMobile={true} />
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
