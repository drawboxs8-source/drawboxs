import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CoinsHistory from "./pages/CoinsHistory";
import Withdrawal from "./pages/Withdrawal";
import Pricing from "./pages/Pricing";
import PaymentUpload from "./pages/PaymentUpload";
import AdminDashboard from "./pages/AdminDashboard";
import Rewards from "./pages/Rewards";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Disclaimer from "./pages/Disclaimer";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password/:id/:token", Component: ResetPassword },
      { path: "dashboard", Component: Dashboard },
      { path: "coins-history", Component: CoinsHistory },
      { path: "rewards", Component: Rewards },
      { path: "withdrawal", Component: Withdrawal },
      { path: "pricing", Component: Pricing },
      { path: "payment-upload", Component: PaymentUpload },
      { path: "admin", Component: AdminDashboard },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-and-conditions", Component: TermsAndConditions },
      { path: "disclaimer", Component: Disclaimer },
    ],
  },
]);
