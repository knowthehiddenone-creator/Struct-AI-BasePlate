import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./pages/Landing";
import Design from "./pages/Design";
import Report from "./pages/Report";

function PageFade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageFade><Landing /></PageFade>} />
        <Route path="/design" element={<PageFade><Design /></PageFade>} />
        <Route path="/report" element={<PageFade><Report /></PageFade>} />
      </Routes>
    </BrowserRouter>
  );
}
