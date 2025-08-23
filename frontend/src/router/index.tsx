import App from "../App";
// import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Intro from "../pages/intro";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import ForgotPassword from "../components/auth/ForgotPassword";
import Home from "../pages/Home";
import Message from "../pages/Chats";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile";

import PublicRoute from "../utils/common/PublicRoute";
import ProtectedRoute from "../utils/common/ProtectedRoute";
import Search from "../pages/Search";
import Create from "../pages/Create";
import PostedJobs from "../pages/Profile/PostedJobs";
import Main from "../pages/Profile/Main";
import JobPoster from "../pages/JobPoster";
import PostedJobDashboard from "../pages/Profile/PostedJobDashboard";
import AssignedTasks from "../pages/Profile/AssignedTasks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <Error />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <Intro />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "reset",
        element: <ForgotPassword />,
      },
      {
        path: "explore",
        element: <Home />,
      },
      {
        path: "conversations",
        element: <Message />,
      },
      {
        path: "conversation/:id",
        element: <Chat />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Main /> },
          { path: "jobs", element: <PostedJobs /> },
          { path: "jobs/:id", element: <PostedJobDashboard /> },
          {
            path: "tasks",
            element: <AssignedTasks />,
          },
        ],
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "create",
        element: <Create />,
      },
      {
        path: `job/:id/:title`,
        element: <JobPoster />,
      },
    ],
  },
]);

export default router;
