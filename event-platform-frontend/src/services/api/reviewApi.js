import axiosClient from "./axiosClient";

export const createBookingReview = async (bookingId, payload) => {
  const response = await axiosClient.post(
    `/client/bookings/${bookingId}/review`,
    payload
  );

  return response.data;
};

export const getPackReviews = async (packId) => {
  const response = await axiosClient.get(`/public/packs/${packId}/reviews`);
  return response.data;
};