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
import StationsPage from "./components/admin/pages/StationsPage";
import TicketsPage from "./components/admin/pages/TicketsPage";
import RoutesPage from "./components/admin/pages/RoutesPage";
import GeolocationPage from "./components/admin/pages/GeolocationPage";
import IncidentsPage from "./components/admin/pages/IncidentsPage";
import NotificationsPage from "./components/admin/pages/NotificationsPage";

import PassengerTicketsPage from "./components/passenger/pages/TicketsPage";
import PassengerSubscriptionPage from "./components/passenger/pages/SubscriptionPage";
import PassengerTripsPage from "./components/passenger/pages/TripsPage";
import PassengerProfilePage from "./components/passenger/pages/ProfilePage";
import PassengerNotificationsPage from "./components/passenger/pages/NotificationsPage";
import PassengerBuyTicketPage from "./components/passenger/pages/BuyTicketPage";

import DriverMyTripsPage from "./components/driver/pages/MyTripsPage";
import DriverGeolocationPage from "./components/driver/pages/GeolocationPage";
import DriverIncidentsPage from "./components/driver/pages/IncidentsPage";
import DriverPlanningPage from "./components/driver/pages/PlanningPage";
import DriverProfilePage from "./components/driver/pages/ProfilePage";

import ControllerValidateTicketsPage from "./components/controller/pages/ValidateTicketsPage";
import ControllerReportsPage from "./components/controller/pages/ReportsPage";
import ControllerProfilePage from "./components/controller/pages/ProfilePage";
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" />
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
  <Route path="/admin/stations" element={<StationsPage />} />
  <Route path="/admin/tickets" element={<TicketsPage />} />
  <Route path="/admin/routes" element={<RoutesPage />} />
  <Route path="/admin/geolocation" element={<GeolocationPage />} />
  <Route path="/admin/incidents" element={<IncidentsPage />} />
  <Route path="/admin/notifications" element={<NotificationsPage />} />

  {/* Passenger dashboard split pages */}
  <Route path="/passenger/tickets" element={<PassengerTicketsPage />} />
  <Route path="/passenger/subscription" element={<PassengerSubscriptionPage />} />
  <Route path="/passenger/trips" element={<PassengerTripsPage />} />
  <Route path="/passenger/profile" element={<PassengerProfilePage />} />
  <Route path="/passenger/notifications" element={<PassengerNotificationsPage />} />
  <Route path="/passenger/buy-ticket" element={<PassengerBuyTicketPage />} />

  {/* Driver dashboard split pages */}
  <Route path="/driver/trips" element={<DriverMyTripsPage />} />
  <Route path="/driver/geolocation" element={<DriverGeolocationPage />} />
  <Route path="/driver/incidents" element={<DriverIncidentsPage />} />
  <Route path="/driver/planning" element={<DriverPlanningPage />} />
  <Route path="/driver/profile" element={<DriverProfilePage />} />

  {/* Controller dashboard split pages */}
  <Route path="/controller/validate" element={<ControllerValidateTicketsPage />} />
  <Route path="/controller/reports" element={<ControllerReportsPage />} />
  <Route path="/controller/profile" element={<ControllerProfilePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
