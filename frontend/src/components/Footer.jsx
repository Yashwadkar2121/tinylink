import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-white border-t mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <motion.div
          className="text-center text-gray-500 text-sm"
          whileHover={{ scale: 1.02 }}
        >
          <p>© 2024 TinyLink. Built with React + Vite + Node.js</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
