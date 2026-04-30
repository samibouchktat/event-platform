import axiosClient from "./axiosClient";

export const getProviderPlanningBookings = async () => {
  const response = await axiosClient.get("/provider/planning/bookings");
  return response.data;
};

export const getProviderPlanningBookingsByDate = async (eventDate) => {
  const response = await axiosClient.get(
    `/provider/planning/bookings/date/${eventDate}`
  );

  return response.data;
};