import axiosClient from "./axiosClient";

export const getClientBookings = async () => {
  const response = await axiosClient.get("/client/bookings");
  return response.data;
};

export const getClientBookingById = async (bookingId) => {
  const response = await axiosClient.get(`/client/bookings/${bookingId}`);
  return response.data;
};