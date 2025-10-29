import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Slide } from "./screens/Slide";
import Login from "./screens/Auth/Login";
import SignUp from "./screens/Auth/SignUp";
import AccountValidation from "./screens/AccountValidation";
import AdminDashboard from "./components/admin/AdminDashboard";
import ControllerDashboard from "./components/controller/ControllerDashboard";
import DriverDashboard from "./components/driver/DriverDashboard";
import PassengerDashboard from "./components/passenger/PassengerDashboard";
import OverviewPage from "./components/admin/pages/OverviewPage";
import UsersPage from "./components/admin/pages/UsersPage";
import TicketsPage from "./components/admin/pages/TicketsPage";
import RoutesPage from "./components/admin/pages/RoutesPage";
import GeolocationPage from "./components/admin/pages/GeolocationPage";
import IncidentsPage from "./components/admin/pages/IncidentsPage";
import NotificationsPage from "./components/admin/pages/NotificationsPage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Slide />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account-validation" element={<AccountValidation />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/controller" element={<ControllerDashboard />} />
        <Route path="/dashboard/driver" element={<DriverDashboard />} />
        <Route path="/dashboard/passenger" element={<PassengerDashboard />} />
        {/* Admin dashboard split pages */}
        <Route path="/admin/overview" element={<OverviewPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/tickets" element={<TicketsPage />} />
        <Route path="/admin/routes" element={<RoutesPage />} />
        <Route path="/admin/geolocation" element={<GeolocationPage />} />
        <Route path="/admin/incidents" element={<IncidentsPage />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
