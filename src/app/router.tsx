import { createBrowserRouter, Navigate } from "react-router";
import { AppShell } from "../components/layout/AppShell";
import DashboardPage from "../pages/DashboardPage";
import LedgerPage from "../pages/LedgerPage";
import { RootRedirect } from "./RootRedirect";

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  {
    path: "/households/:householdId",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "ledger", element: <LedgerPage /> },
    ],
  },
  { path: "*", element: <RootRedirect /> },
]);
