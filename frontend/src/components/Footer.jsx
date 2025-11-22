import React from "react";
import { motion } from "framer-motion";
import { Heart, Code2, Coffee } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      className="bg-gradient-to-r from-gray-900 to-blue-900 border-t border-blue-700 mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center text-gray-300"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Code2 className="w-6 h-6 text-teal-400" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Heart className="w-5 h-5 text-red-400 fill-current" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, rotate: -360 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Coffee className="w-6 h-6 text-amber-400" />
            </motion.div>
          </div>
          <p className="text-sm mb-2 font-medium">
            © 2024 TinyLink - Making the web smaller, one link at a time
          </p>
          <p className="text-xs text-gray-400 opacity-75">
            Built with React + Vite + Node.js + ❤️
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
