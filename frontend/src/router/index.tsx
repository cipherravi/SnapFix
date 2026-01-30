import App from "../App";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "../utils/common/PublicRoute";
import ProtectedRoute from "../utils/common/ProtectedRoute";
import Error from "../pages/Error";
const Intro = lazy(() => import("../pages/intro"));

const Register = lazy(() => import("../components/auth/Register"));
const Login = lazy(() => import("../components/auth/Login"));
const ForgotPassword = lazy(() => import("../components/auth/ForgotPassword"));

const Explore = lazy(() => import("../pages/Explore"));
const Conversations = lazy(() => import("../pages/Conversations"));
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
const WalletSuccess = lazy(() => import("../pages/success/WalletSuccess"));
const Wallet = lazy(() => import("../pages/Profile/Wallet"));
const WalletTransaction = lazy(
  () => import("../pages/Profile/WalletTransaction")
);
import WalletShimmer from "../components/shimmer/WalletShimmer";
import JobsShimmer from "../components/shimmer/JobsShimmer";
import AccountShimmer from "../components/shimmer/AccountShimmer";
import ConversationsShimmer from "../components/shimmer/ConversationsShimmer";
import KycShimmer from "../components/shimmer/KycShimmer";
import CreateJobShimmer from "../components/shimmer/CreateJobShimmer";
import AddressShimmer from "../components/shimmer/AddressShimmer";
import CreateAddressShimmer from "../components/shimmer/CreateAddressShimmer";
import EditAddressShimmer from "../components/shimmer/EditAddressShimmer";
import JobPosterShimmer from "../components/shimmer/JobPosterShimmer";
import WalletTransactionShimmer from "../components/shimmer/WalletTransactionShimmer";
import About from "../pages/About";
import Contact from "../pages/Contact";
import PostedJobDashboardShimmer from "../components/shimmer/PostedJobDashboardShimmer";
import AssignedTaskDashboardShimmer from "../components/shimmer/AssignedTaskDashboardShimmer";
import BankAccounts from "../pages/Profile/BankAccounts";
import BankAccountsMain from "../pages/BankAccounts/Main";
import AddAccount from "../pages/BankAccounts/AddAccount";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
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
        element: <Explore />,
      },
      {
        path: "conversations",
        element: (
          <ProtectedRoute>
            <Suspense
              fallback={
                <div>
                  <ConversationsShimmer />
                </div>
              }
            >
              <Conversations />
            </Suspense>
          </ProtectedRoute>
        ),
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
              <Suspense fallback={<WalletShimmer />}>
                <Wallet />
              </Suspense>
            ),
          },
          {
            path: "jobs",
            element: (
              <Suspense fallback={<JobsShimmer />}>
                <PostedJobs />
              </Suspense>
            ),
          },
          {
            path: "jobs/:id",
            element: (
              <Suspense fallback={<PostedJobDashboardShimmer />}>
                <PostedJobDashboard />
              </Suspense>
            ),
          },
          {
            path: "tasks",
            element: (
              <Suspense fallback={<JobsShimmer />}>
                <AssignedTasks />
              </Suspense>
            ),
          },
          {
            path: "tasks/:id",

            element: (
              <Suspense fallback={<AssignedTaskDashboardShimmer />}>
                <AssignedTaskDashboard />
              </Suspense>
            ),
          },
          {
            path: "transactions",
            element: (
              <Suspense fallback={<WalletTransactionShimmer />}>
                <WalletTransaction />
              </Suspense>
            ),
          },
          {
            path: "bank-accounts",
            element: <BankAccounts />,
            children: [
              {
                index: true,
                element: <BankAccountsMain />,
              },
              {
                path: "add",
                element: <AddAccount />,
              },
            ],
          },
          {
            path: "addresses",
            element: (
              <Suspense fallback={<AddressShimmer />}>
                <Addresses />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <AddressMain />,
              },
              {
                path: "edit/:id",
                element: (
                  <Suspense fallback={<EditAddressShimmer />}>
                    <EditAddress />
                  </Suspense>
                ),
              },
              {
                path: "create",
                element: (
                  <Suspense fallback={<CreateAddressShimmer />}>
                    <CreateAddress />
                  </Suspense>
                ),
              },
            ],
          },

          {
            path: "account",
            element: (
              <Suspense fallback={<AccountShimmer />}>
                <Account />
              </Suspense>
            ),
          },
          {
            path: "kyc",
            element: (
              <Suspense fallback={<KycShimmer />}>
                <Kyc />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "create",
        element: (
          <Suspense fallback={<CreateJobShimmer />}>
            <Create />
          </Suspense>
        ),
      },
      {
        path: `jobs/:id/:title`,
        element: (
          <Suspense fallback={<JobPosterShimmer />}>
            <JobPoster />
          </Suspense>
        ),
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
      {
        path: "wallet-success",
        element: <WalletSuccess />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);

export default router;
