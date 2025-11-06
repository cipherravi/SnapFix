import "./App.css";
import { useEffect, useState } from "react";
import Splash from "./components/Splash";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Tabs from "./components/Tabs";
import { ScrollToTop } from "./components/ScrollToTop";

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [fadeSplash, setFadeSplash] = useState(false);

  const location = useLocation();

  //Show Tabs on few pages
  const showTabsOn = [
    "/explore",
    "/profile",
    "/create",
    "/search",
    "/conversations",
  ];
  const shouldShowTabs = showTabsOn.includes(location.pathname);

  // Step 1: Show splash on first visit only
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (!hasVisited) {
      setShowSplash(true);
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  // Step 2: Once splash is shown, trigger fade and remove
  useEffect(() => {
    if (showSplash) {
      const fadeTimer = setTimeout(() => {
        setFadeSplash(true);
      }, 2000);

      const removeTimer = setTimeout(() => {
        setShowSplash(false);
      }, 2100);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [showSplash]);

  return showSplash ? (
    <Splash fadeOut={fadeSplash} />
  ) : (
    <div className="h-dvh w-full">
      <ScrollToTop />
      <Outlet />

      {shouldShowTabs && <Tabs />}

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
