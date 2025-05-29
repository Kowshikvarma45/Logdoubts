import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Alert = ({ msg }: { msg: string }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 left-5 z-50 flex items-center gap-3 p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg rounded-lg w-80"
        >
          <span className="text-lg">⚠️</span>
          <span className="flex-1">{msg}</span>
          <button onClick={() => setVisible(false)} className="text-white">
            ✖
          </button>
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-white rounded"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
