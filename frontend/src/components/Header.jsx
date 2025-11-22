import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { motion } from "framer-motion";
import { Link2, Activity, Home } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/healthz", label: "Health", icon: Activity },
  ];

  return (
    <motion.header
      className="bg-gradient-to-r from-white to-blue-50 shadow-lg border-b border-blue-100 backdrop-blur-sm bg-white/95"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10"
                whileHover={{ opacity: 0.3 }}
              />
            </motion.div>
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              TinyLink
            </motion.span>
          </Link>

          <nav className="flex space-x-1 bg-white/80 rounded-2xl p-1 shadow-inner border border-gray-200">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
                      isActive
                        ? "text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl -z-10"
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="font-semibold">{item.label}</span>
                    
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;