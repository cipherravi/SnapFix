import "./App.css";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import Splash from "./components/Splash";
import Tabs from "./components/Tabs";
import { ScrollToTop } from "./components/ScrollToTop";

import { useGetProfileQuery } from "./services/api/userApi";

import { setUser } from "./features/user/userSlice";
import { setToken } from "./features/auth/authSlice";

import { loadToken } from "./utils/tokenDB";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const isAuthenticated = useSelector((s: any) => s.auth.isAuthenticated);

  // ----------------------------------------------------------------------
  // SPLASH SCREEN STATE
  // ----------------------------------------------------------------------
  const [showSplash, setShowSplash] = useState(false);
  const [fadeSplash, setFadeSplash] = useState(false);

  // ----------------------------------------------------------------------
  // AUTH TOKEN LOAD (ONLY ONCE - on page load)
  // ----------------------------------------------------------------------
  useEffect(() => {
    const loadStoredToken = async () => {
      const token = await loadToken();
      if (token) dispatch(setToken(token));
    };

    loadStoredToken();
  }, []);

  // ----------------------------------------------------------------------
  // FETCH USER PROFILE
  // ----------------------------------------------------------------------
  const { data: userData } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  // ----------------------------------------------------------------------
  // SYNC RTK QUERY → REDUX SLICE
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (userData) dispatch(setUser(userData));
  }, [userData]);

  // ----------------------------------------------------------------------
  // VERGEL ANALYTICS & INSIGHTS INIT (on mount)
  // ----------------------------------------------------------------------
  useEffect(() => {
    inject();
    injectSpeedInsights();
  }, []);

  // ----------------------------------------------------------------------
  // SPLASH SCREEN LOGIC
  // Show splash only on first visit of the session
  // ----------------------------------------------------------------------
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (!hasVisited) {
      setShowSplash(true);
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  // Handle fade + removal
  useEffect(() => {
    if (!showSplash) return;

    const fadeTimer = setTimeout(() => setFadeSplash(true), 2000);
    const hideTimer = setTimeout(() => setShowSplash(false), 2100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [showSplash]);

  // ----------------------------------------------------------------------
  // CONDITIONAL TABS
  // ----------------------------------------------------------------------
  const tabsVisibleRoutes = [
    "/explore",
    "/profile",
    "/create",
    "/search",
    "/conversations",
  ];

  const shouldShowTabs = tabsVisibleRoutes.includes(location.pathname);

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------
  if (showSplash) {
    return <Splash fadeOut={fadeSplash} />;
  }

  return (
    <div className="min-h-svh w-full">
      <ScrollToTop />

      <Outlet />

      {shouldShowTabs && <Tabs />}

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
