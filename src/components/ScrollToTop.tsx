import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router keeps the previous scroll position on navigation. Reset to the
// top whenever the route changes so moving between guides/sections starts at
// the top of the page, like a normal page load.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
