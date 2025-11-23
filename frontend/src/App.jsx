import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Health from "./pages/Health";

function App() {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02,
    },
  };

  const pageTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    duration: 0.4,
  };

  const backgroundVariants = {
    initial: {
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    },
    in: {
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    },
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      variants={backgroundVariants}
      initial="initial"
      animate="in"
      transition={{ duration: 1 }}
    >
      <Header />
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Dashboard />
                </motion.div>
              }
            />
            <Route
              path="/code/:code"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Stats />
                </motion.div>
              }
            />
            <Route
              path="/healthz"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Health />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </motion.div>
  );
}

export default App;