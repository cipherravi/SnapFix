import App from "../App";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "../utils/common/PublicRoute";
import ProtectedRoute from "../utils/common/ProtectedRoute";
const Intro = lazy(() => import("../pages/intro"));

const Register = lazy(() => import("../components/auth/Register"));
const Login = lazy(() => import("../components/auth/Login"));
const ForgotPassword = lazy(() => import("../components/auth/ForgotPassword"));

const Home = lazy(() => import("../pages/Home"));
const Message = lazy(() => import("../pages/Chats"));
const Chat = lazy(() => import("../pages/Chat"));
const Profile = lazy(() => import("../pages/Profile"));
const Search = lazy(() => import("../pages/Search"));
const Create = lazy(() => import("../pages/Create"));

const PostedJobs = lazy(() => import("../pages/Profile/PostedJobs"));
const ProfileMain = lazy(() => import("../pages/Profile/Main"));

const JobPoster = lazy(() => import("../pages/JobPoster"));
const PostedJobDashboard = lazy(
  () => import("../pages/Profile/PostedJobDashboard")
);
const AssignedTasks = lazy(() => import("../pages/Profile/AssignedTasks"));
const AssignedTaskDashboard = lazy(
  () => import("../pages/Profile/AssignedTaskDashboard")
);
const Addresses = lazy(() => import("../pages/Profile/Addresses"));
const CreateAddress = lazy(() => import("../pages/Addresses/CreateAddress"));
const Account = lazy(() => import("../pages/Profile/Account"));
const Kyc = lazy(() => import("../pages/Profile/Kyc"));
const AddressMain = lazy(() => import("../pages/Addresses/Main"));
const EditAddress = lazy(() => import("../pages/Addresses/EditAddress"));
const Admin = lazy(() => import("../pages/Admin"));
const Dashboard = lazy(() => import("../pages/Admin/Dashboard"));
const Main = lazy(() => import("../pages/Admin/Main"));
const Payment = lazy(() => import("../pages/Payment"));
const CODSuccess = lazy(() => import("../pages/success/CODSuccess"));
const Wallet = lazy(() => import("../pages/Profile/Wallet"));

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
          {
            path: "wallet",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Wallet />
              </Suspense>
            ),
          },
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
        path: `jobs/:id/:title`,
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
      {
        path: "payments/:id",
        element: <Payment />,
      },
      {
        path: "cod-success",
        element: <CODSuccess />,
      },
    ],
  },
]);

export default router;
