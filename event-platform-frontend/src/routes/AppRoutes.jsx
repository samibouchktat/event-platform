import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROLES } from "../constants/roles";
import { ROUTES } from "../constants/routes";

import PublicLayout from "../components/layout/PublicLayout";
import ClientLayout from "../components/layout/ClientLayout";
import ProviderLayout from "../components/layout/ProviderLayout";
import AdminLayout from "../components/layout/AdminLayout";


import SearchPage from "../pages/public/SearchPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import ClientDashboardPage from "../pages/client/ClientDashboardPage";
import ProviderDashboardPage from "../pages/provider/ProviderDashboardPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

import ProviderOnboardingPage from "../pages/provider/ProviderOnboardingPage";
import ProviderProfilePage from "../pages/provider/ProviderProfilePage";

import ProviderPacksPage from "../pages/provider/ProviderPacksPage";
import ProviderPackFormPage from "../pages/provider/ProviderPackFormPage";
import QuoteRequestPage from "../pages/public/QuoteRequestPage";

import ProviderQuoteRequestsPage from "../pages/provider/ProviderQuoteRequestsPage";
import ProviderQuoteRequestDetailsPage from "../pages/provider/ProviderQuoteRequestDetailsPage";
import ProviderBookingsPage from "../pages/provider/ProviderBookingsPage";
import ProviderBookingDetailsPage from "../pages/provider/ProviderBookingDetailsPage";

import ClientQuoteRequestsPage from "../pages/client/ClientQuoteRequestsPage";
import ClientQuoteRequestDetailsPage from "../pages/client/ClientQuoteRequestDetailsPage";

import ClientBookingsPage from "../pages/client/ClientBookingsPage";
import ClientBookingDetailsPage from "../pages/client/ClientBookingDetailsPage";
import ProviderPlanningPage from "../pages/provider/ProviderPlanningPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";

import AdminProvidersPage from "../pages/admin/AdminProvidersPage";
import AdminProviderDetailsPage from "../pages/admin/AdminProviderDetailsPage";

import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminUserDetailsPage from "../pages/admin/AdminUserDetailsPage";


import AdminReportsPage from "../pages/admin/AdminReportsPage";

import HomePage from "../pages/HomePage";
import PublicPackDetailsPage from "../pages/public/PublicPackDetailsPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path={ROUTES.SEARCH} element={<SearchPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={[ROLES.CLIENT]} />}>
            <Route element={<ClientLayout />}>
              <Route
                path={ROUTES.CLIENT_DASHBOARD}
                element={<ClientDashboardPage />}
              />
            </Route>
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={[ROLES.PROVIDER]} />}>
            <Route element={<ProviderLayout />}>
              <Route
                path={ROUTES.PROVIDER_DASHBOARD}
                element={<ProviderDashboardPage />}
              />
            </Route>
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route element={<AdminLayout />}>
              <Route
                path={ROUTES.ADMIN_DASHBOARD}
                element={<AdminDashboardPage />}
              />
            </Route>
          </Route>
        </Route>
        <Route element={<RoleBasedRoute allowedRoles={[ROLES.PROVIDER]} />}>
        <Route element={<ProviderLayout />}>
            <Route
            path={ROUTES.PROVIDER_DASHBOARD}
            element={<ProviderDashboardPage />}
            />
            <Route
            path={ROUTES.PROVIDER_ONBOARDING}
            element={<ProviderOnboardingPage />}
            />
            <Route
            path={ROUTES.PROVIDER_PROFILE}
            element={<ProviderProfilePage />}
            />
        </Route>
        </Route>
        <Route element={<RoleBasedRoute allowedRoles={[ROLES.PROVIDER]} />}>
        <Route element={<ProviderLayout />}>
            <Route
            path={ROUTES.PROVIDER_DASHBOARD}
            element={<ProviderDashboardPage />}
            />

            <Route
            path={ROUTES.PROVIDER_ONBOARDING}
            element={<ProviderOnboardingPage />}
            />

            <Route
            path={ROUTES.PROVIDER_PROFILE}
            element={<ProviderProfilePage />}
            />

            <Route
            path={ROUTES.PROVIDER_PACKS}
            element={<ProviderPacksPage />}
            />

            <Route
            path={ROUTES.PROVIDER_PACK_NEW}
            element={<ProviderPackFormPage />}
            />

            <Route
            path={ROUTES.PROVIDER_PACK_EDIT}
            element={<ProviderPackFormPage />}
            />
        </Route>
        </Route>
        <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.SEARCH} element={<SearchPage />} />
            <Route path={ROUTES.QUOTE_REQUEST} element={<QuoteRequestPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>
        <Route
            path={ROUTES.PROVIDER_QUOTE_REQUESTS}
            element={<ProviderQuoteRequestsPage />}
            />

            <Route
            path={ROUTES.PROVIDER_QUOTE_REQUEST_DETAILS}
            element={<ProviderQuoteRequestDetailsPage />}
            />
            <Route
                path={ROUTES.PROVIDER_BOOKINGS}
                element={<ProviderBookingsPage />}
                />

                <Route
                path={ROUTES.PROVIDER_BOOKING_DETAILS}
                element={<ProviderBookingDetailsPage />}
                />
                <Route
                path={ROUTES.CLIENT_QUOTE_REQUESTS}
                element={<ClientQuoteRequestsPage />}
                />

                <Route
                path={ROUTES.CLIENT_QUOTE_REQUEST_DETAILS}
                element={<ClientQuoteRequestDetailsPage />}
                />
                <Route
                  path={ROUTES.CLIENT_BOOKINGS}
                  element={<ClientBookingsPage />}
                />

                <Route
                  path={ROUTES.CLIENT_BOOKING_DETAILS}
                  element={<ClientBookingDetailsPage />}
                />
                <Route
                  path={ROUTES.PROVIDER_PLANNING}
                  element={<ProviderPlanningPage />}
                />
                <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
                <Route element={<RoleBasedRoute allowedRoles={[ROLES.ADMIN]} />}>
                  <Route element={<AdminLayout />}>
                    <Route
                      path={ROUTES.ADMIN_DASHBOARD}
                      element={<AdminDashboardPage />}
                    />
                  </Route>
                </Route>
                <Route
                path={ROUTES.ADMIN_PROVIDERS}
                element={<AdminProvidersPage />}
              />

              <Route
                path={ROUTES.ADMIN_PROVIDER_DETAILS}
                element={<AdminProviderDetailsPage />}
              />
              <Route
                path={ROUTES.ADMIN_USERS}
                element={<AdminUsersPage />}
              />

              <Route
                path={ROUTES.ADMIN_USER_DETAILS}
                element={<AdminUserDetailsPage />}
              />
              <Route
                path={ROUTES.ADMIN_REPORTS}
                element={<AdminReportsPage />}
              />
              <Route path={ROUTES.PUBLIC_PACKS} element={<SearchPage />} />

              <Route path={ROUTES.PUBLIC_PACK_DETAILS} element={<PublicPackDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;