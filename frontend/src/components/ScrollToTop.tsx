import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top on specific paths
    if (!pathname.startsWith("/explore")) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
