import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-borderLight shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path
                d="M9 21h14M9 21l3-9h8l3 9M12 21v2M20 21v2M16 12V8"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[17px] font-bold text-textPrimary">
            <span className="text-primary">StructAI</span> BasePlate
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className={`px-3 py-2 rounded-btn transition-colors duration-150 ${
              location.pathname === "/" ? "text-primary bg-primaryLight" : "text-textSecondary hover:bg-surfaceGray"
            }`}
          >
            Home
          </Link>
          <Link
            to="/design"
            className={`px-3 py-2 rounded-btn transition-colors duration-150 ${
              location.pathname.startsWith("/design") ? "text-primary bg-primaryLight" : "text-textSecondary hover:bg-surfaceGray"
            }`}
          >
            Design Tool
          </Link>
          <Link
            to="/report"
            className={`px-3 py-2 rounded-btn transition-colors duration-150 ${
              location.pathname.startsWith("/report") ? "text-primary bg-primaryLight" : "text-textSecondary hover:bg-surfaceGray"
            }`}
          >
            Report
          </Link>
        </nav>
        <Link
          to="/design"
          className="px-4 py-2 rounded-btn bg-primary text-white text-sm font-medium hover:bg-primaryDark transition-all duration-150 hover:-translate-y-[1px] shadow-sm"
        >
          Start New Design
        </Link>
      </div>
    </header>
  );
}
