export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  SEARCH: "/search",
  PUBLIC_PACKS: "/packs",
  QUOTE_REQUEST: "/quote-request/:packId",

  CLIENT_DASHBOARD: "/client/dashboard",
  CLIENT_QUOTE_REQUESTS: "/client/quote-requests",
  CLIENT_QUOTE_REQUEST_DETAILS: "/client/quote-requests/:quoteRequestId",
  CLIENT_BOOKINGS: "/client/bookings",
  CLIENT_BOOKING_DETAILS: "/client/bookings/:bookingId",

  PROVIDER_DASHBOARD: "/provider/dashboard",
  PROVIDER_ONBOARDING: "/provider/onboarding",
  PROVIDER_PROFILE: "/provider/profile",
  PROVIDER_PACKS: "/provider/packs",
  PROVIDER_PACK_NEW: "/provider/packs/new",
  PROVIDER_PACK_EDIT: "/provider/packs/:packId/edit",
  PROVIDER_QUOTE_REQUESTS: "/provider/quote-requests",
  PROVIDER_QUOTE_REQUEST_DETAILS: "/provider/quote-requests/:quoteRequestId",
  PROVIDER_BOOKINGS: "/provider/bookings",
  PROVIDER_BOOKING_DETAILS: "/provider/bookings/:bookingId",
  PROVIDER_PLANNING: "/provider/planning",

  NOTIFICATIONS: "/notifications",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PROVIDERS: "/admin/providers",
  ADMIN_PROVIDER_DETAILS: "/admin/providers/:providerProfileId",
  ADMIN_USERS: "/admin/users",
  ADMIN_USER_DETAILS: "/admin/users/:userId",
  ADMIN_REPORTS: "/admin/reports",
  PUBLIC_PACK_DETAILS: "/packs/:packId",
  OAUTH2_SUCCESS: "/oauth2/success",
};