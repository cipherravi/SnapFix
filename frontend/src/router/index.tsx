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
import ProfileMain from "../pages/Profile/Main";
import JobPoster from "../pages/JobPoster";
import PostedJobDashboard from "../pages/Profile/PostedJobDashboard";
import AssignedTasks from "../pages/Profile/AssignedTasks";
import AssignedTaskDashboard from "../pages/Profile/AssignedTaskDashboard";
import Addresses from "../pages/Profile/Addresses";
import CreateAddress from "../pages/Addresses/CreateAddress";
import Account from "../pages/Profile/Account";
import Kyc from "../pages/Profile/Kyc";
import AddressMain from "../pages/Addresses/Main";
import EditAddress from "../pages/Addresses/EditAddress";
import Admin from "../pages/Admin";
import Dashboard from "../pages/Admin/Dashboard";
import Main from "../pages/Admin/Main";

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
          { index: true, element: <ProfileMain /> },
          { path: "jobs", element: <PostedJobs /> },
          { path: "jobs/:id", element: <PostedJobDashboard /> },
          {
            path: "tasks",
            element: <AssignedTasks />,
          },
          {
            path: "tasks/:id",
            element: <AssignedTaskDashboard />,
          },
          {
            path: "addresses",
            element: <Addresses />,
            children: [
              { index: true, element: <AddressMain /> },
              {
                path: "edit/:id",
                element: <EditAddress />,
              },
              {
                path: "create",
                element: <CreateAddress />,
              },
            ],
          },

          {
            path: "account",
            element: <Account />,
          },
          {
            path: "kyc",
            element: <Kyc />,
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
      {
        path: "admin",
        element: <Admin />,
        children: [
          { index: true, element: <Main /> },
          { path: "dashboard", element: <Dashboard /> },
        ],
      },
    ],
  },
]);

export default router;
