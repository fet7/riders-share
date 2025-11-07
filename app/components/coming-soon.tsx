import { motion } from "framer-motion";
import { useLocation } from "react-router";

export default function ComingSoonPage() {
  const location = useLocation();
  const routeName =
    location.pathname === "/" ? "home" : location.pathname.replace(/^\//, "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="text-3xl sm:text-5xl font-bold tracking-wide text-center"
      >
        <div className="text-teal-300">
          {routeName.charAt(0).toUpperCase() + routeName.slice(1)}
        </div>{" "}
        Page <br />
        <br /> Coming Soon
      </motion.h1>
    </div>
  );
}
