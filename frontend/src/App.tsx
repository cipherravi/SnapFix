import "./App.css";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import Splash from "./components/Splash";
import Tabs from "./components/Tabs";
import { ScrollToTop } from "./components/ScrollToTop";

import { useGetProfileQuery } from "./services/api/userApi";
import { useGetConversationsQuery } from "./services/api/conversationApi";

import { setUser } from "./features/user/userSlice";
import { setToken } from "./features/auth/authSlice";

import { loadToken } from "./utils/tokenDB";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

import { useSocket } from "./utils/context/SocketContext";
import { RootState } from "./app/store";
import { useNotificationQueue } from "./utils/context/NotificationQueueContext";
import NewMessageNotification from "./components/modals/NewMessageNotificationModal";
import { setConversations } from "./features/conversation/conversationSlice";
import { setUserCoords } from "./features/user/userSlice";

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
  // FETCH USER PROFILE AND CONVERSATIONS
  // ----------------------------------------------------------------------
  const { data: userData } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: conversationsData } = useGetConversationsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // ----------------------------------------------------------------------
  // SYNC RTK QUERY → REDUX SLICE
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (userData) dispatch(setUser(userData));
    if (conversationsData) dispatch(setConversations(conversationsData));
  }, [userData, conversationsData]);

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

  //-----------------------------------------------------------------------
  // Show new message modal
  const socket = useSocket();
  const conversations = useSelector(
    (s: RootState) => s.conversation.conversations
  );

  // NOTIFY NEW CONVERSATION CREATED AND ADD IT INTO CONVERSATION LIST
  //--------------------
  useEffect(() => {
    const handleCreatedConversation = async (data: any) => {
      console.log(data);
    };

    socket.on("conversationCreated", handleCreatedConversation);

    return () => {
      socket.off("conversationCreated", handleCreatedConversation);
    };
  }, [socket]);

  //--------------------

  const { pushNotification } = useNotificationQueue();

  const currentConversationId = location.pathname.startsWith("/conversation/")
    ? location.pathname.split("/conversation/")[1]
    : undefined;

  useEffect(() => {
    const handleReceiveMessage = async (msg: any) => {
      const { conversationId, text, senderId } = msg;

      const currentConversation = conversations.find(
        (conv) => conv.id === conversationId
      );
      // resolve sender details however you already do it
      const sender = currentConversation?.participant?.name ?? "Unknown";
      let profilePicUrl = currentConversation?.participant?.profilePic || "";

      pushNotification({
        senderId,
        sender,
        text,
        profilePicUrl,
        conversationId,
        currentConversationId,
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, conversations, currentConversationId]);

  //---------------------------------------------------------
  // FETCH USER LOCATION & SET IN USER SLICE

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            setUserCoords([position.coords.latitude, position.coords.longitude])
          );
        },
        (error) => {
          console.error("Failed to fetch coordinates", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  //---------------------------------------------------------

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------
  if (showSplash) {
    return <Splash fadeOut={fadeSplash} />;
  }

  //-----------------------------------------------------------------------

  return (
    <div className="min-h-svh w-full">
      <NewMessageNotification />
      <ScrollToTop />

      <Outlet />

      {shouldShowTabs && <Tabs />}

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
