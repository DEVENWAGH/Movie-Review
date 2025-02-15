import { motion } from "motion/react";

export default function LoadingButton({ children, loading, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
      ) : children}
    </motion.button>
  );
}
