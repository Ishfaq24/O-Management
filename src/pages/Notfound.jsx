import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Notfound= () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 text-gray-800 overflow-hidden relative">
      {/* Floating background shapes */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: [0, 15, 0], opacity: 1 }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-64 h-64 bg-green-400/40 rounded-full blur-3xl -top-20 -left-20"
      ></motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: [0, -15, 0], opacity: 1 }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        className="absolute w-72 h-72 bg-green-600/30 rounded-full blur-3xl bottom-0 right-0"
      ></motion.div>

      {/* 404 Text Animation */}
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="text-[10rem] font-extrabold text-green-700 drop-shadow-lg z-10"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-2xl md:text-3xl font-semibold text-green-900 mb-4 z-10"
      >
        Oops! Page not found
      </motion.h2>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-gray-700 mb-8 text-center max-w-md z-10"
      >
        The page you’re looking for doesn’t exist or has been moved. Don’t worry,
        let’s get you back on track!
      </motion.p>

      {/* Back Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="z-10"
      >
        <Link
          to="/"
          className="bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition-all duration-300"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
};

export default Notfound;
